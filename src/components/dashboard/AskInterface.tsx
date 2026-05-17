'use client'

import React, { useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AskInterface({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
        body: JSON.stringify({ question })
      })

      const json = await res.json()

      if (res.ok) {
        setResult(json)
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

  const isNumeric = (val: any) => {
    if (typeof val === 'number') return true
    if (typeof val === 'string') return /^[\d,.-]+$/.test(val)
    return false
  }

  const formatNumber = (val: any) => {
    if (!isNumeric(val)) return val
    const num = Number(typeof val === 'string' ? val.replace(/,/g, '') : val)
    if (isNaN(num)) return val
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="w-full max-w-[900px] mx-auto py-8 px-4 flex flex-col items-center">
      <div className="text-center mb-8">
        <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-4">ASK</div>
        <h1 className="text-[32px] font-serif text-[#1E2761] mb-2 leading-tight">Ask Decyra anything about your data</h1>
        <p className="text-[#5A6478] text-[16px]">Type a question. Get the SQL, the answer, and an explanation.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setQuestion(chip)}
            className="text-sm px-4 py-2 border border-[#E2E8F0] text-[#1E2761] rounded-full hover:bg-slate-50 transition-colors"
          >
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
        <div className="w-full flex flex-col gap-8">
          {/* SQL Section */}
          <section>
            <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest mb-3">GENERATED SQL</div>
            <div className="bg-[#F4F6FB] border-l-[3px] border-l-[#F96167] p-4 rounded-lg overflow-x-auto">
              <pre className="font-mono text-sm text-[#1E2761] whitespace-pre-wrap">{result.sql}</pre>
            </div>
          </section>

          {/* Results Section */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-[12px] font-bold text-[#1E2761] uppercase tracking-widest">RESULTS</div>
              <div className="text-xs text-[#5A6478] bg-slate-100 px-2 py-1 rounded-full">{result.rowCount} rows</div>
            </div>
            
            {result.rowCount === 0 ? (
              <p className="text-[#5A6478] text-sm italic">No results found.</p>
            ) : (
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                {result.rowCount > 10 && (
                  <div className="bg-slate-50 px-4 py-2 border-b border-[#E2E8F0] text-xs text-[#5A6478]">
                    Showing first 10 of {result.rowCount} rows
                  </div>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        {Object.keys(result.rows[0]).map((key) => (
                          <TableHead key={key} className="text-[#1E2761] font-semibold">{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.rows.slice(0, 10).map((row: any, i: number) => (
                        <TableRow key={i}>
                          {Object.values(row).map((val: any, j: number) => (
                            <TableCell key={j} className="text-[#334155]">
                              {formatNumber(val)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </section>

          {/* Explanation Section */}
          <section>
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
