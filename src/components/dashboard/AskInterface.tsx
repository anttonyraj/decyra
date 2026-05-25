'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Copy, Search } from 'lucide-react'
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
} from 'recharts'

type Stage = 'idle' | 'loading' | 'sent';

export default function AskInterface() {
  const { activeSource } = useDataSource()
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Trigger animations only on new results
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const chips = [
    'Show me top 10 customers by total revenue',
    'Which sales reps are below 80% of quota this quarter?',
    'How many orders did we have last month by region?',
    'Which products have the highest average order value?'
  ]

  const handleSubmit = async () => {
    if (!question.trim() || loading) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          dataSource: activeSource,
          connectionId: activeSource
        })
      })

      const json = await res.json()

      if (res.ok) {
        setResult(json)
        setAnimationKey(prev => prev + 1)
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
          setError('Something went wrong. Please try again.')
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQuestion('')
    setResult(null)
    setError(null)
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isNumeric = (val: any) => {
    if (typeof val === 'number') return true
    if (typeof val === 'string') return /^[\d,.-]+$/.test(val)
    return false
  }

  const formatNumber = (val: any) => {
    if (val === null || val === undefined) return ''
    if (!isNumeric(val)) return String(val)
    const num = Number(typeof val === 'string' ? val.replace(/,/g, '') : val)
    if (isNaN(num)) return String(val)
    
    if (num % 1 === 0) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    } else {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  // Helper to determine which columns are numeric for right-alignment and charting
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

  // Chart configuration auto-detector
  const getChartConfig = (rows: any[]) => {
    if (!rows || rows.length < 2) return null
    const firstRow = rows[0]
    const keys = Object.keys(firstRow)
    
    let numericKey: string | null = null
    let categoryKey: string | null = null

    // Find first numeric column
    for (const key of keys) {
      const isNum = rows.every(row => {
        const val = row[key]
        return val === null || val === undefined || isNumeric(val)
      })
      if (isNum && !numericKey) {
        numericKey = key
      } else if (!isNum && !categoryKey) {
        categoryKey = key
      }
    }

    // Fallback if we have numeric but no category key
    if (numericKey && !categoryKey) {
      categoryKey = keys.find(k => k !== numericKey) || null
    }

    if (!numericKey || !categoryKey) return null

    return { categoryKey, numericKey }
  }

  const chartConfig = result ? getChartConfig(result.rows) : null
  const chartData = (result && chartConfig) ? result.rows.map((row: any) => ({
    ...row,
    [chartConfig.categoryKey]: String(row[chartConfig.categoryKey] || ''),
    [chartConfig.numericKey]: Number(String(row[chartConfig.numericKey] || '0').replace(/,/g, ''))
  })) : []

  const hasLongLabels = (result && chartConfig)
    ? result.rows.some((row: any) => String(row[chartConfig.categoryKey] || '').length > 6)
    : false

  return (
    <div className="w-full max-w-[900px] mx-auto py-4 px-4 flex flex-col items-center">
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

      <div className="text-center mb-8">
        <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-4">ASK</div>
        <h1 className="text-[32px] font-serif text-[#1E2761] mb-2 leading-tight">Ask Decyra anything about your data</h1>
        <p className="text-[#5A6478] text-[16px]">
          Querying <span className="font-semibold text-[#1E2761]">{activeSource === 'demo' ? 'Demo Database' : activeSource === 'postgres' ? 'PostgreSQL' : activeSource === 'snowflake' ? 'Snowflake' : activeSource.toUpperCase()}</span>. Get the SQL, the answer, and an explanation.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setQuestion(chip)}
            className="flex items-center gap-1.5 text-sm px-4 py-2 border border-[#E5E9F2] text-[#1E2761] rounded-full bg-white hover:bg-[#F4F6FB] hover:scale-[1.02] active:bg-[#E8EDF7] transition-all duration-150 cursor-pointer shadow-sm font-medium"
          >
            <Search size={14} className="text-[#5A6478]" />
            {chip}
          </button>
        ))}
      </div>

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

      {loading && (
        <div className="w-full space-y-4">
          <Skeleton className="h-[100px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[80px] w-full rounded-xl" />
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
            <div className="flex items-center gap-2 mb-3">
              <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">RESULTS</div>
              <span className="text-xs text-[#5A6478] font-medium bg-[#FAFBFC] border border-[#E5E9F2] px-2.5 py-0.5 rounded-full">
                {result.rowCount} {result.rowCount === 1 ? 'row' : 'rows'}
              </span>
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
              <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-3">VISUALIZATION</div>
              <div className="bg-white rounded-xl border border-[#E5E9F2] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: hasLongLabels ? 25 : 5 }}>
                    <CartesianGrid vertical={false} stroke="#F4F6FB" strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={chartConfig.categoryKey}
                      fontSize={11}
                      stroke="#5A6478"
                      tickLine={false}
                      {...(hasLongLabels ? {
                        angle: -45,
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
                      formatter={(val) => [Number(val).toLocaleString(), chartConfig.numericKey]}
                      labelStyle={{ fontWeight: 'bold', color: '#1E2761' }}
                    />
                    <Bar 
                      dataKey={chartConfig.numericKey} 
                      fill="#F96167" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
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

        </div>
      )}
    </div>
  )
}
