'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Copy, Search, MessageSquare, Download, Check, Sparkles, CornerDownRight, RotateCcw, FileSpreadsheet, ArrowRight, UploadCloud, BarChart3, PieChart as PieIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDataSource } from './DashboardShell'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function AskInterface() {
  const { 
    activeSource, 
    prefilledQuestion, 
    setPrefilledQuestion, 
    connections,
    activeUploadedFile,
    openUploadModal
  } = useDataSource()
  
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [followUpQuestion, setFollowUpQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tableCopied, setTableCopied] = useState(false)
  const [downloadingChart, setDownloadingChart] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'donut'>('bar')
  const [mounted, setMounted] = useState(false)

  // Multi-turn conversation thread tracking
  const [conversationThread, setConversationThread] = useState<Array<{
    question: string
    sql: string
    intent?: string
    narration: string
    rowCount: number
  }>>([])

  // Branded loader text transition state
  const [loadingText, setLoadingText] = useState("Analyzing your question...")

  // Trigger animations only on new results
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-run if question was passed from History / Favorites
  useEffect(() => {
    if (prefilledQuestion) {
      const q = prefilledQuestion
      setQuestion(q)
      setPrefilledQuestion('')
      executeQuery(q)
    }
  }, [prefilledQuestion])

  // Timer effect for branded loading state messages
  useEffect(() => {
    if (!loading) {
      setLoadingText("Analyzing your question...")
      return
    }

    const timer1 = setTimeout(() => {
      setLoadingText(activeUploadedFile ? "Generating in-memory SQL..." : "Generating SQL...")
    }, 2500)

    const timer2 = setTimeout(() => {
      setLoadingText(activeUploadedFile ? "Querying spreadsheet records..." : "Running query...")
    }, 5000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [loading, activeUploadedFile])

  // Suggest chips based on whether an uploaded file is active or database
  const getChips = () => {
    if (activeUploadedFile) {
      const cols = activeUploadedFile.columns || []
      const numCol = cols.find(c => /amount|revenue|total|price|cost|sales|value|qty|quantity/i.test(c)) || cols[1] || 'value'
      const catCol = cols.find(c => /dept|department|region|category|status|name|account|type/i.test(c)) || cols[0] || 'category'

      return [
        `Show the first 10 rows from ${activeUploadedFile.tableName}`,
        `What is the total count of records?`,
        `Break down total ${numCol} by ${catCol}`,
        `Which 5 records have the highest ${numCol}?`
      ]
    }

    return [
      'Show me top 10 customers by total revenue',
      'Which sales reps are below 80% of quota this quarter?',
      'How many orders did we have last month by region?',
      'Which products have the highest average order value?'
    ]
  }

  const chips = getChips()

  const followUpChips = [
    'Now filter that to only enterprise accounts',
    'Break that down month-by-month',
    'Show only the top 5 results',
    'Sort from lowest to highest',
    'What is the average and total sum?'
  ]

  const saveQueryToHistory = (q: string, sql: string, intent: string, rowCount: number, sourceName: string) => {
    const historyEntry = {
      id: 'local_' + Date.now(),
      question: q,
      sql,
      intent,
      row_count: rowCount,
      is_favorite: false,
      connection_id: activeSource,
      connection_name: sourceName,
      created_at: new Date().toISOString()
    }

    try {
      const stored = localStorage.getItem('decyra_query_history')
      const arr = stored ? JSON.parse(stored) : []
      arr.unshift(historyEntry)
      localStorage.setItem('decyra_query_history', JSON.stringify(arr.slice(0, 100)))
    } catch (e) {}

    fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q,
        sql,
        intent,
        rowCount,
        connectionId: activeSource,
        connectionName: sourceName
      })
    }).catch(err => console.warn('Failed to save to remote history:', err))
  }

  const executeQuery = async (customQ?: string, isFollowUp: boolean = false) => {
    const qToRun = (customQ || (isFollowUp ? followUpQuestion : question)).trim()
    if (!qToRun || loading) return

    setLoading(true)
    setError(null)
    if (!isFollowUp) {
      setResult(null)
      setConversationThread([])
    }

    const previousQuestion = isFollowUp ? (result?.question || question) : undefined
    const previousSql = isFollowUp ? result?.sql : undefined
    const previousIntent = isFollowUp ? result?.intent : undefined

    try {
      if (activeUploadedFile) {
        // Querying structured uploaded file (CSV, JSON, XML, Excel) via AlaSQL on server
        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: qToRun,
            isUploadedFile: true,
            customSchema: activeUploadedFile.schemaText,
            tableName: activeUploadedFile.tableName,
            fileRows: activeUploadedFile.rows,
            previousQuestion,
            previousSql,
            previousIntent,
          })
        })

        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || 'Failed to generate query for file.')
        }

        const fullResult = {
          ...json,
          question: qToRun,
          isFollowUp,
          previousQuestion
        }

        setResult(fullResult)
        setAnimationKey(prev => prev + 1)
        if (isFollowUp) {
          setFollowUpQuestion('')
        }

        setConversationThread(prev => [
          ...prev,
          {
            question: qToRun,
            sql: json.sql,
            intent: json.intent,
            narration: json.narration,
            rowCount: json.rowCount || 0
          }
        ])

        saveQueryToHistory(qToRun, json.sql, json.intent, json.rowCount || 0, activeUploadedFile.name)

      } else {
        // Querying Demo Database or Postgres/Snowflake Connection
        const activeConn = connections?.find((c: any) => c.id === activeSource)
        const activeSourceName = activeSource === 'demo' ? 'Demo Database' : activeConn ? activeConn.name : 'Custom Database'

        const res = await fetch('/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: qToRun,
            dataSource: activeSource,
            connectionId: activeSource,
            previousQuestion,
            previousSql,
            previousIntent,
          })
        })

        const json = await res.json()

        if (res.ok) {
          const fullResult = {
            ...json,
            question: qToRun,
            isFollowUp,
            previousQuestion
          }
          setResult(fullResult)
          setAnimationKey(prev => prev + 1)
          if (isFollowUp) {
            setFollowUpQuestion('')
          }

          setConversationThread(prev => [
            ...prev,
            {
              question: qToRun,
              sql: json.sql,
              intent: json.intent,
              narration: json.narration,
              rowCount: json.rowCount || 0
            }
          ])

          saveQueryToHistory(qToRun, json.sql, json.intent, json.rowCount || 0, activeSourceName)
        } else {
          if (res.status === 401) {
            router.push('/login')
            return
          }
          
          const errStr = (json.error || '').toLowerCase()
          if (errStr.includes('select') || errStr.includes('forbidden')) {
            setError('I can only answer read-only questions about your data.')
          } else if (json.error === 'AI returned malformed response') {
            setError('I had trouble understanding that question. Try rephrasing it as a question about your data.')
          } else {
            setError(json.error || 'Something went wrong. Please try again.')
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => executeQuery()

  const handleFollowUpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!followUpQuestion.trim() || loading) return
    executeQuery(followUpQuestion, true)
  }

  const handleClear = () => {
    setQuestion('')
    setFollowUpQuestion('')
    setResult(null)
    setError(null)
    setConversationThread([])
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCSV = () => {
    if (!result || !result.rows || result.rows.length === 0) return
    const headers = Object.keys(result.rows[0])
    const csvContent = [
      headers.join(','),
      ...result.rows.map((row: any) =>
        headers
          .map((key) => {
            const val = row[key]
            if (val === null || val === undefined) return '""'
            const escaped = String(val).replace(/"/g, '""')
            return `"${escaped}"`
          })
          .join(',')
      ),
    ].join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `decyra_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyTable = () => {
    if (!result || !result.rows || result.rows.length === 0) return
    const headers = Object.keys(result.rows[0])
    // Tab-separated values for instant paste into Excel / Google Sheets
    const tsvContent = [
      headers.join('\t'),
      ...result.rows.map((row: any) =>
        headers.map((key) => String(row[key] ?? '')).join('\t')
      ),
    ].join('\n')

    navigator.clipboard.writeText(tsvContent)
    setTableCopied(true)
    setTimeout(() => setTableCopied(false), 2000)
  }

  const handleDownloadChart = () => {
    setDownloadingChart(true)
    try {
      const svgEl = document.querySelector('.recharts-wrapper svg') as SVGElement
      if (!svgEl) {
        setDownloadingChart(false)
        return
      }

      const svgData = new XMLSerializer().serializeToString(svgEl)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const blobUrl = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        const bbox = svgEl.getBoundingClientRect()
        const width = bbox.width || 700
        const height = bbox.height || 320
        const scale = 2 // 2x resolution for crisp high-dpi PNG

        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.scale(scale, scale)
          // Solid white background for clean presentation
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          const pngUrl = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = pngUrl
          a.download = `decyra_chart_${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        URL.revokeObjectURL(blobUrl)
        setDownloadingChart(false)
      }
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl)
        setDownloadingChart(false)
      }
      img.src = blobUrl
    } catch (e) {
      console.error('Failed to export chart:', e)
      setDownloadingChart(false)
    }
  }

  const CHART_COLORS = ['#F96167', '#1E2761', '#2A9D8F', '#E76F51', '#457B9D', '#F4A261', '#6C5CE7', '#00B894', '#E84393']

  const isNumeric = (val: any): boolean => {
    if (typeof val === 'number') return !isNaN(val)
    if (typeof val === 'string') {
      const clean = val.replace(/[$,€£%\s,]/g, '').trim()
      return /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/.test(clean) && clean !== ''
    }
    return false
  }

  const cleanNum = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val
    if (typeof val === 'string') {
      const clean = val.replace(/[$,€£%\s,]/g, '').trim()
      const n = parseFloat(clean)
      return isNaN(n) ? 0 : n
    }
    return 0
  }

  const formatNumber = (val: any) => {
    if (val === null || val === undefined) return ''
    if (!isNumeric(val)) return String(val)
    const num = cleanNum(val)
    
    if (num % 1 === 0) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  const getColumnStats = (rows: any[]) => {
    if (!rows || rows.length === 0) return { numericCols: new Set<string>() }
    const numericCols = new Set<string>()
    const firstRow = rows[0]
    for (const key of Object.keys(firstRow)) {
      const allNumeric = rows.every(row => {
        const val = row[key]
        return val === null || val === undefined || isNumeric(val)
      })
      if (allNumeric) {
        numericCols.add(key)
      }
    }
    return { numericCols }
  }

  const columnStats = result ? getColumnStats(result.rows) : { numericCols: new Set<string>() }

  interface ChartConfigResult {
    categoryKey: string
    numericKey: string
    title: string
    chartData: any[]
    isFrequency?: boolean
  }

  const getChartConfig = (rows: any[]): ChartConfigResult | null => {
    if (!rows || rows.length === 0) return null
    const firstRow = rows[0]
    if (!firstRow) return null
    const keys = Object.keys(firstRow)
    if (keys.length === 0) return null

    // 1. Classify columns
    const numericCols: string[] = []
    const categoryCols: string[] = []

    keys.forEach(key => {
      const numericCount = rows.filter(r => isNumeric(r[key])).length
      if (numericCount >= Math.ceil(rows.length * 0.6)) {
        numericCols.push(key)
      } else {
        categoryCols.push(key)
      }
    })

    // Case A: Categorical column + Numeric column
    if (numericCols.length > 0 && categoryCols.length > 0) {
      const catKey = categoryCols[0]
      const numKey = numericCols[0]
      const chartData = rows.slice(0, 30).map(r => ({
        ...r,
        [catKey]: String(r[catKey] ?? 'Unknown'),
        [numKey]: cleanNum(r[numKey])
      }))
      return {
        categoryKey: catKey,
        numericKey: numKey,
        chartData,
        title: `${numKey.replace(/_/g, ' ')} by ${catKey.replace(/_/g, ' ')}`,
        isFrequency: false
      }
    }

    // Case B: Only numeric columns (e.g. metrics summary)
    if (numericCols.length > 0 && categoryCols.length === 0) {
      if (rows.length === 1) {
        const chartData = numericCols.map(col => ({
          metric: col.replace(/_/g, ' '),
          value: cleanNum(rows[0][col])
        }))
        return {
          categoryKey: 'metric',
          numericKey: 'value',
          chartData,
          title: 'Metrics Overview',
          isFrequency: false
        }
      } else {
        const numKey = numericCols[0]
        const chartData = rows.slice(0, 30).map((r, i) => ({
          ...r,
          record: `Item ${i + 1}`,
          [numKey]: cleanNum(r[numKey])
        }))
        return {
          categoryKey: 'record',
          numericKey: numKey,
          chartData,
          title: `${numKey.replace(/_/g, ' ')} across records`,
          isFrequency: false
        }
      }
    }

    // Case C: Pure Text / Categorical columns (like Packing List items/statuses)
    if (categoryCols.length > 0) {
      // Find the best column to group: preference for status, type, category, or column with small distinct set
      let chosenCol = categoryCols[0]
      let bestDistinctCount = 999999

      for (const col of categoryCols) {
        const uniqueVals = new Set(rows.map(r => String(r[col] ?? '').trim()).filter(Boolean))
        if (uniqueVals.size >= 1 && uniqueVals.size <= 25 && uniqueVals.size < bestDistinctCount) {
          chosenCol = col
          bestDistinctCount = uniqueVals.size
        }
      }

      const frequencyMap: Record<string, number> = {}
      rows.forEach(r => {
        const val = String(r[chosenCol] ?? '').trim()
        if (val) {
          frequencyMap[val] = (frequencyMap[val] || 0) + 1
        }
      })

      const entries = Object.entries(frequencyMap)
      if (entries.length > 0) {
        const chartData = entries
          .map(([name, count]) => ({
            category: name,
            count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 15)

        const cleanColName = chosenCol.replace(/^__empty_?/, 'column_').replace(/_/g, ' ')
        return {
          categoryKey: 'category',
          numericKey: 'count',
          chartData,
          title: `Distribution of ${cleanColName} (${rows.length} ${rows.length === 1 ? 'record' : 'records'})`,
          isFrequency: true
        }
      }
    }

    return null
  }

  const chartConfig = result ? getChartConfig(result.rows) : null

  const hasLongLabels = (chartConfig && chartConfig.chartData)
    ? chartConfig.chartData.some((row: any) => String(row[chartConfig.categoryKey] || '').length > 6)
    : false

  const showEmptyState = !question.trim() && !loading && !result && !error

  return (
    <div className={`w-full max-w-[900px] mx-auto py-4 px-4 flex flex-col ${showEmptyState ? 'h-[75vh] justify-center items-center' : 'items-center'}`}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .recharts-bar-rectangle {
          fill-opacity: 0.85;
          transition: fill-opacity 0.15s ease;
        }
        .recharts-bar-rectangle:hover {
          fill-opacity: 1 !important;
        }
      `}</style>

      {showEmptyState ? (
        /* ── Centered Empty State ── */
        <div className="w-full max-w-[640px] flex flex-col items-center text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-white border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 shrink-0">
            {activeUploadedFile ? (
              <FileSpreadsheet size={30} className="text-[#F96167]" />
            ) : (
              <MessageSquare size={32} className="text-[#B0B8CC]" />
            )}
          </div>
          
          <h1 
            className="text-[28px] font-bold text-[#1E2761] mb-2 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {activeUploadedFile ? `Query ${activeUploadedFile.name}` : 'Ask Decyra anything'}
          </h1>

          {activeUploadedFile ? (
            <div className="flex items-center gap-2 text-xs text-[#5A6478] mb-6 bg-white border border-[#E5E9F2] px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>In-memory Data Source: <strong>{activeUploadedFile.rowCount.toLocaleString()}</strong> rows</span>
              <span>•</span>
              <span><strong>{activeUploadedFile.columns.length}</strong> columns</span>
              <span>•</span>
              <span className="uppercase font-mono text-[10px] font-semibold text-[#F96167]">{activeUploadedFile.fileType}</span>
            </div>
          ) : (
            <p className="text-[#5A6478] text-sm mb-8 font-medium">
              Select a question below or type your own to query your data.
            </p>
          )}

          {/* Form Input area */}
          <div className="w-full relative mb-8">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={activeUploadedFile ? `Ask any question about ${activeUploadedFile.name}...` : "Ask anything about your data..."}
              rows={3}
              className="w-full text-base resize-none focus-visible:ring-[#F96167] bg-white shadow-sm pr-12 rounded-xl"
            />
            <div className="mt-4 flex items-center justify-start gap-4">
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !question.trim()}
                className="bg-[#F96167] hover:bg-[#e0565b] text-white rounded-[8px] px-6 h-10 font-semibold cursor-pointer"
              >
                Ask Decyra
              </Button>
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(chip)}
                className="flex items-center gap-1.5 text-xs px-3.5 py-2 border border-[#E5E9F2] text-[#1E2761] rounded-full bg-white hover:bg-[#F4F6FB] hover:scale-[1.02] active:bg-[#E8EDF7] transition-all duration-150 cursor-pointer shadow-xs font-semibold"
              >
                <Search size={12} className="text-[#5A6478]" />
                {chip}
              </button>
            ))}
          </div>

          {!activeUploadedFile && (
            <button
              onClick={openUploadModal}
              className="mt-7 flex items-center gap-2 text-xs font-semibold text-[#5A6478] hover:text-[#F96167] transition-colors cursor-pointer group"
            >
              <UploadCloud size={15} className="text-[#F96167] group-hover:scale-110 transition-transform" />
              <span>Or <u>Upload a File (CSV, JSON, XML, Excel)</u> to query without a database</span>
            </button>
          )}
        </div>
      ) : (
        /* ── Standard Top-Aligned Query Layout ── */
        <div className="w-full flex flex-col items-center">
          
          {/* Header section (smaller when active) */}
          <div className="text-center mb-6">
            <div className="text-[10px] font-bold text-[#1E2761] uppercase tracking-widest mb-2">ASK</div>
            <h1 className="text-xl font-serif font-bold text-[#1E2761]">
              {activeUploadedFile ? `Querying ${activeUploadedFile.name}` : 'Querying active source'}
            </h1>
            {activeUploadedFile && (
              <p className="text-xs text-[#5A6478] mt-1 font-mono">
                {activeUploadedFile.rowCount.toLocaleString()} rows • {activeUploadedFile.columns.length} columns • In-memory SQL
              </p>
            )}
          </div>

          {/* Top Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(chip)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-[#E5E9F2] text-[#1E2761] rounded-full bg-white hover:bg-[#F4F6FB] hover:scale-[1.01] active:bg-[#E8EDF7] transition-all duration-150 cursor-pointer shadow-xs font-semibold"
              >
                <Search size={12} className="text-[#5A6478]" />
                {chip}
              </button>
            ))}
          </div>

          {/* Textarea Input area */}
          <div className="w-full mb-8 relative">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows={3}
              className="w-full text-base resize-none focus-visible:ring-[#F96167]"
            />
            <div className="mt-4 flex items-center justify-start gap-4">
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !question.trim()}
                className="bg-[#F96167] hover:bg-[#e0565b] text-white rounded-[6px] px-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asking...
                  </>
                ) : (
                  'Ask Decyra'
                )}
              </Button>
              <button onClick={handleClear} className="text-[#5A6478] text-sm hover:text-[#1E2761] underline-offset-4 hover:underline">
                Clear
              </button>
            </div>
          </div>

          {/* Loading Animation Area */}
          {loading && (
            <div className="w-full py-16 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] animate-fade-in-up">
              <div className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F96167] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#F96167]"></span>
              </div>
              <p className="text-sm font-semibold text-[#1E2761] tracking-wide animate-pulse">
                {loadingText}
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="w-full">
              <Card className="bg-[#fef2f2] border-0 border-l-[3px] border-l-red-600 rounded-xl p-4 shadow-sm">
                <p className="text-red-800 text-sm">{error}</p>
              </Card>
              <div className="mt-4">
                <Button variant="outline" onClick={handleClear} className="text-[#1E2761]">
                  Try a different question
                </Button>
              </div>
            </div>
          )}

          {result && !loading && (
            <div key={animationKey} className="w-full flex flex-col gap-8">
              
              {/* Follow-up Context Pill */}
              {result.isFollowUp && result.previousQuestion && (
                <div className="flex items-center justify-between bg-white border border-[#E5E9F2] rounded-xl px-4 py-2.5 shadow-2xs animate-fade-in-up">
                  <div className="flex items-center gap-2 text-xs text-[#5A6478] overflow-hidden">
                    <Sparkles size={14} className="text-[#F96167] shrink-0" />
                    <span className="shrink-0 font-medium">Refined follow-up to:</span>
                    <span className="font-semibold text-[#1E2761] italic truncate">"{result.previousQuestion}"</span>
                  </div>
                  <button
                    onClick={handleClear}
                    className="text-xs text-[#5A6478] hover:text-[#F96167] flex items-center gap-1 font-medium transition-colors cursor-pointer shrink-0 ml-3"
                  >
                    <RotateCcw size={12} />
                    <span>New Question</span>
                  </button>
                </div>
              )}

              {/* SQL Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-3">GENERATED SQL</div>
                <div className="relative group bg-[#F4F6FB] border-l-[3px] border-l-[#F96167] p-4 rounded-lg">
                  <pre className="font-mono text-sm text-[#1E2761] whitespace-pre-wrap pr-12">{result.sql}</pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-1.5 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1 text-[11px] font-medium shadow-sm cursor-pointer"
                    title="Copy SQL to clipboard"
                  >
                    {copied ? (
                      <span className="text-[#34A853] px-1 font-semibold">Copied!</span>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </section>

              {/* Results Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">RESULTS</div>
                    <span className="text-xs text-[#5A6478] font-medium bg-[#FAFBFC] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full">
                      {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}
                    </span>
                  </div>
                  {result.rowCount > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyTable}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer"
                        title="Copy formatted table for Excel or Google Sheets"
                      >
                        {tableCopied ? (
                          <>
                            <Check size={13} className="text-[#34A853]" />
                            <span className="text-[#34A853] font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Table</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer"
                        title="Download results as a CSV spreadsheet"
                      >
                        <Download size={13} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {result.rowCount === 0 ? (
                  <p className="text-[#5A6478] text-sm italic">No results found.</p>
                ) : (
                  <div className="bg-white rounded-xl border border-[#E5E9F2] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden w-full">
                    {result.rowCount > 10 && (
                      <div className="bg-[#FAFBFC] px-4 py-2 border-b border-[#E5E9F2] text-xs text-[#5A6478]">
                        Showing first 10 of {result.rowCount} rows
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-[#1E2761] hover:bg-[#1E2761]">
                          <TableRow className="hover:bg-transparent">
                            {Object.keys(result.rows[0]).map((key) => {
                              const isColNumeric = columnStats.numericCols.has(key)
                              return (
                                <TableHead 
                                  key={key} 
                                  className={`text-white text-[11px] font-bold uppercase tracking-[0.05em] px-[12px] py-[10px] ${
                                    isColNumeric ? 'text-right' : 'text-left'
                                  }`}
                                >
                                  {key}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.rows.slice(0, 10).map((row: any, i: number) => (
                            <TableRow key={i} className="border-b border-[#E5E9F2] odd:bg-white even:bg-[#FAFBFC] hover:bg-slate-50/50 transition-colors">
                              {Object.entries(row).map(([key, val]: [string, any], j: number) => {
                                const isColNumeric = columnStats.numericCols.has(key)
                                return (
                                  <TableCell 
                                    key={j} 
                                    className={`px-[12px] py-[10px] text-[#334155] text-sm ${
                                      isColNumeric ? 'text-right' : 'text-left'
                                    }`}
                                  >
                                    {formatNumber(val)}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </section>

              {/* Visualization Section */}
              {mounted && chartConfig && (
                <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">
                        VISUALIZATION
                      </div>
                      <span className="text-[11px] text-[#5A6478] bg-[#FAFBFC] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full font-medium capitalize">
                        {chartConfig.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Chart Type Toggle: Bar vs Donut */}
                      <div className="flex items-center bg-[#F4F6FB] p-0.5 rounded-lg border border-[#E5E9F2]">
                        <button
                          onClick={() => setSelectedChartType('bar')}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                            selectedChartType === 'bar'
                              ? 'bg-white text-[#1E2761] shadow-2xs font-semibold'
                              : 'text-[#5A6478] hover:text-[#1E2761]'
                          }`}
                          title="Bar Chart View"
                        >
                          <BarChart3 size={13} />
                          <span>Bar</span>
                        </button>
                        <button
                          onClick={() => setSelectedChartType('donut')}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md transition-all cursor-pointer font-medium ${
                            selectedChartType === 'donut'
                              ? 'bg-white text-[#1E2761] shadow-2xs font-semibold'
                              : 'text-[#5A6478] hover:text-[#1E2761]'
                          }`}
                          title="Donut / Pie Chart View"
                        >
                          <PieIcon size={13} />
                          <span>Donut</span>
                        </button>
                      </div>

                      <button
                        onClick={handleDownloadChart}
                        disabled={downloadingChart}
                        className="px-2.5 py-1 rounded-md border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all duration-150 flex items-center gap-1.5 text-xs font-medium shadow-sm cursor-pointer disabled:opacity-50"
                        title="Download chart as high-resolution PNG image"
                      >
                        {downloadingChart ? (
                          <>
                            <Loader2 size={13} className="animate-spin text-[#F96167]" />
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download size={13} />
                            <span>Download Chart (PNG)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#E5E9F2] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] w-full">
                    <ResponsiveContainer width="100%" height={320}>
                      {selectedChartType === 'bar' ? (
                        <BarChart data={chartConfig.chartData} margin={{ top: 10, right: 10, left: 10, bottom: hasLongLabels ? 30 : 10 }}>
                          <CartesianGrid vertical={false} stroke="#F4F6FB" strokeDasharray="3 3" />
                          <XAxis 
                            dataKey={chartConfig.categoryKey}
                            fontSize={11}
                            stroke="#5A6478"
                            tickLine={false}
                            {...(hasLongLabels ? {
                              angle: -35,
                              textAnchor: 'end',
                              height: 60
                            } : {
                              angle: 0,
                              textAnchor: 'middle',
                              height: 30
                            })}
                          />
                          <YAxis 
                            fontSize={11}
                            stroke="#5A6478"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => Number(val).toLocaleString()}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderColor: '#E5E9F2', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(30,39,97,0.08)',
                              fontSize: '12px'
                            }} 
                            formatter={(val) => [Number(val).toLocaleString(), chartConfig.numericKey.replace(/_/g, ' ')]}
                            labelStyle={{ fontWeight: 'bold', color: '#1E2761' }}
                          />
                          <Bar 
                            dataKey={chartConfig.numericKey} 
                            fill="#F96167" 
                            radius={[4, 4, 0, 0]}
                          >
                            {chartConfig.chartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderColor: '#E5E9F2', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(30,39,97,0.08)',
                              fontSize: '12px'
                            }} 
                            formatter={(val, name) => [Number(val).toLocaleString(), String(name)]}
                          />
                          <Pie
                            data={chartConfig.chartData}
                            dataKey={chartConfig.numericKey}
                            nameKey={chartConfig.categoryKey}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={105}
                            paddingAngle={3}
                          >
                            {chartConfig.chartData.map((_, index) => (
                              <Cell key={`donut-cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

              {/* Explanation Section */}
              <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-3">EXPLANATION</div>
                <Card className="bg-[#FDE2E3] border-0 border-l-[3px] border-l-[#F96167] rounded-xl p-4 shadow-sm">
                  <p className="text-[#1E2761] text-[15px] leading-relaxed">
                    <span className="font-bold text-[#F96167]">Insight: </span>
                    {result.narration}
                  </p>
                </Card>
              </section>

              {/* Conversational Multi-Turn ("Chat with your Data") Follow-Up Section */}
              <section className="animate-fade-in-up bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#FDE2E3] flex items-center justify-center text-[#F96167]">
                      <Sparkles size={14} />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#1E2761]">
                      Chat with your Data (Ask a follow-up)
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-[#5A6478] bg-[#F4F6FB] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full">
                    Preserves SQL Context
                  </span>
                </div>
                <p className="text-xs text-[#5A6478] mb-4">
                  Ask questions that build upon your current result. The AI adapts the previous query instead of starting over.
                </p>

                {/* Quick Follow-up Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {followUpChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setFollowUpQuestion(chip)
                        executeQuery(chip, true)
                      }}
                      disabled={loading}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#E5E9F2] bg-[#FAFBFC] text-[#1E2761] hover:border-[#F96167] hover:text-[#F96167] hover:bg-white transition-all cursor-pointer shadow-2xs font-medium disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CornerDownRight size={11} className="text-[#F96167]" />
                      <span>{chip}</span>
                    </button>
                  ))}
                </div>

                {/* Follow-up Question Form */}
                <form onSubmit={handleFollowUpSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    placeholder="e.g. Now filter that to only enterprise accounts, or break that down month-by-month..."
                    className="flex-1 h-11 px-4 text-sm bg-[#FAFBFC] border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:border-[#F96167] focus:bg-white focus:ring-2 focus:ring-[#F96167]/20 shadow-2xs text-[#1E2761] placeholder:text-[#94A3B8]"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={loading || !followUpQuestion.trim()}
                      className="h-11 px-5 bg-[#F96167] hover:bg-[#e0565b] text-white rounded-xl font-semibold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Refining...</span>
                        </>
                      ) : (
                        <>
                          <span>Ask Follow-up</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="h-11 px-3 text-xs font-semibold text-[#5A6478] hover:text-[#1E2761] transition-colors rounded-xl hover:bg-[#F4F6FB] cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </form>

                {/* Conversation Thread History Counter */}
                {conversationThread.length > 1 && (
                  <div className="mt-4 pt-3 border-t border-[#E5E9F2] flex items-center justify-between text-xs text-[#5A6478]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F96167]" />
                      <span>Active thread: <strong>{conversationThread.length} queries</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[#F96167] hover:underline font-semibold cursor-pointer"
                    >
                      Start fresh question
                    </button>
                  </div>
                )}
              </section>

            </div>
          )}
        </div>
      )}
    </div>
  )
}
