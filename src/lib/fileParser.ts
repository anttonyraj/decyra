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
  uploadedAt?: string
}

export type UploadedFileRecord = ParsedFileResult

export function generateSchemaFromRows(tableName: string, rows: Record<string, any>[]): string {
  if (!rows || rows.length === 0) return `TABLE ${tableName}\n  (empty)`
  const columns = Object.keys(rows[0] || {})
  const columnTypes: Record<string, string> = {}
  columns.forEach(col => {
    const values = rows.map(r => r[col])
    columnTypes[col] = inferType(values)
  })
  return [
    `TABLE ${tableName}`,
    ...columns.map(c => `  ${c} (${columnTypes[c]})`),
    '',
    `Sample Rows (first ${Math.min(3, rows.length)}):`,
    JSON.stringify(rows.slice(0, 3), null, 2)
  ].join('\n')
}

function cleanColumnName(col: string, fallbackIdx?: number): string {
  let name = String(col || '').trim()
  if (/^__empty/i.test(name) || !name) {
    const numMatch = name.match(/\d+/)
    return numMatch ? `column_${numMatch[0]}` : (fallbackIdx !== undefined ? `column_${fallbackIdx + 1}` : 'column')
  }
  return name
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase() || (fallbackIdx !== undefined ? `column_${fallbackIdx + 1}` : 'col')
}

function inferType(values: any[]): 'NUMERIC' | 'DATE' | 'TEXT' {
  const sample = values.filter(v => v !== null && v !== undefined && v !== '').slice(0, 30)
  if (sample.length === 0) return 'TEXT'

  const allNumbers = sample.every(v => {
    const s = String(v).replace(/[$,€£%\s,]/g, '').trim()
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
    
    // Intelligent header detection for Excel
    const rawMatrix = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][]
    
    if (rawMatrix && rawMatrix.length > 0) {
      let bestHeaderIdx = 0
      let maxNonEmpty = 0
      for (let i = 0; i < Math.min(5, rawMatrix.length); i++) {
        const textCount = (rawMatrix[i] || []).filter(c => typeof c === 'string' && c.trim().length > 0).length
        if (textCount > maxNonEmpty) {
          maxNonEmpty = textCount
          bestHeaderIdx = i
        }
      }

      if (bestHeaderIdx > 0 && maxNonEmpty >= 2) {
        const headers = (rawMatrix[bestHeaderIdx] || []).map((h, i) => cleanColumnName(String(h || ''), i))
        rows = []
        for (let i = bestHeaderIdx + 1; i < rawMatrix.length; i++) {
          const rowData = rawMatrix[i] || []
          if (rowData.every(c => c === '' || c === null || c === undefined)) continue
          const obj: Record<string, any> = {}
          headers.forEach((h, colIdx) => {
            obj[h] = rowData[colIdx] ?? ''
          })
          rows.push(obj)
        }
      } else {
        rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
      }
    } else {
      rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
    }
  } else if (extension === 'parquet') {
    const buffer = await file.arrayBuffer()
    const { parquetReadObjects } = await import('hyparquet')
    const parquetRows = await parquetReadObjects({ file: buffer })
    rows = (parquetRows as any[]) || []
  } else {
    throw new Error(`Unsupported file format: .${extension}`)
  }

  if (!rows || rows.length === 0) {
    throw new Error('The file contains no readable data rows.')
  }

  // Normalize row keys to clean identifiers
  const rawColumns = Object.keys(rows[0] || {})
  const columnMapping: Record<string, string> = {}
  rawColumns.forEach((raw, idx) => {
    columnMapping[raw] = cleanColumnName(raw, idx)
  })

  const normalizedRows = rows.map(r => {
    const cleaned: Record<string, any> = {}
    Object.keys(r).forEach((k, idx) => {
      cleaned[columnMapping[k] || cleanColumnName(k, idx)] = r[k]
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
