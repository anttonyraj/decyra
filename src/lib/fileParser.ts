import * as XLSX from 'xlsx'

export interface ParsedFileResult {
  id: string
  name: string
  tableName: string
  rowCount: number
  columns: string[]
  rows: any[]
  schemaText: string
  fileType: string
}

function cleanColumnName(col: string): string {
  return col
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase() || 'col'
}

function inferType(values: any[]): 'NUMERIC' | 'DATE' | 'TEXT' {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 30)
  if (sample.length === 0) return 'TEXT'

  const allNumbers = sample.every(v => {
    const s = String(v).replace(/,/g, '').trim()
    return !isNaN(Number(s)) && s !== ''
  })
  if (allNumbers) return 'NUMERIC'

  const allDates = sample.every(v => {
    const s = String(v).trim()
    if (s.length < 4) return false
    const d = Date.parse(s)
    return !isNaN(d)
  })
  if (allDates) return 'DATE'

  return 'TEXT'
}

export async function parseUploadedFile(file: File): Promise<ParsedFileResult> {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const tableName = cleanColumnName(file.name.replace(/\.[^/.]+$/, ''))
  let rows: any[] = []

  if (extension === 'csv' || extension === 'tsv' || extension === 'txt') {
    const text = await file.text()
    const delimiter = extension === 'tsv' ? '\t' : ','
    const parsed = parseCSVText(text, delimiter)
    rows = parsed
  } else if (extension === 'json') {
    const text = await file.text()
    const json = JSON.parse(text)
    if (Array.isArray(json)) {
      rows = json
    } else if (typeof json === 'object' && json !== null) {
      // Look for first array property (e.g. { data: [...] }, { records: [...] })
      const firstArrayKey = Object.keys(json).find(k => Array.isArray(json[k]))
      if (firstArrayKey) {
        rows = json[firstArrayKey]
      } else {
        rows = [json]
      }
    }
  } else if (extension === 'xml') {
    const text = await file.text()
    rows = parseXMLText(text)
  } else if (extension === 'xlsx' || extension === 'xls') {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    rows = XLSX.utils.sheet_to_json(worksheet)
  } else {
    throw new Error(`Unsupported file format: .${extension}`)
  }

  if (!rows || rows.length === 0) {
    throw new Error('The file contains no readable data rows.')
  }

  // Normalize row keys to clean identifiers
  const rawColumns = Object.keys(rows[0] || {})
  const columnMapping: Record<string, string> = {}
  rawColumns.forEach(raw => {
    columnMapping[raw] = cleanColumnName(raw)
  })

  const normalizedRows = rows.map(r => {
    const cleaned: Record<string, any> = {}
    Object.keys(r).forEach(k => {
      cleaned[columnMapping[k] || cleanColumnName(k)] = r[k]
    })
    return cleaned
  })

  const columns = Object.keys(normalizedRows[0] || {})
  
  // Infer column types
  const columnTypes: Record<string, string> = {}
  columns.forEach(col => {
    const values = normalizedRows.map(r => r[col])
    columnTypes[col] = inferType(values)
  })

  // Build schema description for Gemini SQL generation
  const schemaLines = [
    `TABLE ${tableName}`,
    ...columns.map(c => `  ${c} (${columnTypes[c]})`),
    '',
    `Sample Rows (first ${Math.min(3, normalizedRows.length)}):`,
    JSON.stringify(normalizedRows.slice(0, 3), null, 2)
  ]

  return {
    id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    tableName,
    rowCount: normalizedRows.length,
    columns,
    rows: normalizedRows,
    schemaText: schemaLines.join('\n'),
    fileType: extension.toUpperCase()
  }
}

function parseCSVText(text: string, delimiter: string = ','): any[] {
  const lines = text.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0)
  if (lines.length < 2) return []

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(cur.trim())
        cur = ''
      } else {
        cur += char
      }
    }
    result.push(cur.trim())
    return result
  }

  const headers = parseLine(lines[0])
  const rows: any[] = []

  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i])
    if (vals.length === 0 || (vals.length === 1 && !vals[0])) continue
    const row: Record<string, any> = {}
    headers.forEach((h, idx) => {
      let v = vals[idx] ?? ''
      // Convert to number if numeric
      if (v !== '' && !isNaN(Number(v))) {
        v = Number(v) as any
      }
      row[h] = v
    })
    rows.push(row)
  }

  return rows
}

function parseXMLText(text: string): any[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/xml')
  const root = doc.documentElement

  // Find all child elements that have children or attributes
  const children = Array.from(root.children)
  if (children.length === 0) return []

  // Check if root children represent records (e.g. <item>, <row>, <record>)
  const rows: any[] = []
  children.forEach(node => {
    const row: Record<string, any> = {}
    // Collect attributes
    Array.from(node.attributes).forEach(attr => {
      row[attr.name] = attr.value
    })
    // Collect child tags
    Array.from(node.children).forEach(child => {
      let val: any = child.textContent?.trim() || ''
      if (val !== '' && !isNaN(Number(val))) {
        val = Number(val)
      }
      row[child.tagName] = val
    })
    if (Object.keys(row).length > 0) {
      rows.push(row)
    }
  })

  return rows
}
