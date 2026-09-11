'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Globe, Check, AlertCircle, Sparkles, Plus, Trash2, Code2 } from 'lucide-react'
import { generateSchemaFromRows, UploadedFileRecord } from '@/lib/fileParser'

interface ConnectApiModalProps {
  isOpen: boolean
  onClose: () => void
  onApiAdded: (record: UploadedFileRecord) => void
}

interface HeaderRow {
  key: string
  value: string
}

// Sample presets for popular enterprise APIs
const SAMPLE_PRESETS = [
  {
    name: 'Sample Public API (E-Commerce Products)',
    url: 'https://dummyjson.com/products',
    rootPath: 'products',
  },
  {
    name: 'Sample Financial Quotes (Crypto / Forex)',
    url: 'https://api.coincap.io/v2/assets',
    rootPath: 'data',
  },
  {
    name: 'Sample User Demographics',
    url: 'https://jsonplaceholder.typicode.com/users',
    rootPath: '',
  }
]

export default function ConnectApiModal({
  isOpen,
  onClose,
  onApiAdded,
}: ConnectApiModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [rootPath, setRootPath] = useState('')
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { key: '', value: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewRows, setPreviewRows] = useState<Record<string, any>[] | null>(null)
  const [previewCols, setPreviewCols] = useState<string[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }])
  }

  const handleRemoveHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const handleHeaderChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers]
    updated[index][field] = val
    setHeaders(updated)
  }

  const applyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setName(preset.name.split(' (')[0])
    setUrl(preset.url)
    setRootPath(preset.rootPath)
    setError(null)
    setPreviewRows(null)
  }

  // Extract array of objects from JSON response
  const extractArray = (data: any, path: string): Record<string, any>[] => {
    if (!data) return []

    let target = data
    if (path.trim()) {
      const parts = path.trim().split('.')
      for (const p of parts) {
        if (target && typeof target === 'object' && p in target) {
          target = target[p]
        }
      }
    }

    // If target is array, return it
    if (Array.isArray(target)) {
      return target
    }

    // If target is object, find the first array property
    if (target && typeof target === 'object') {
      for (const key of Object.keys(target)) {
        if (Array.isArray(target[key]) && target[key].length > 0) {
          return target[key]
        }
      }
      // Single object: return as 1-row array
      return [target]
    }

    return []
  }

  // Flatten nested objects (e.g. { customer: { id: 123 } } -> { customer_id: 123 })
  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {}
    if (!obj || typeof obj !== 'object') return flattened

    for (const key of Object.keys(obj)) {
      const val = obj[key]
      const fullKey = prefix ? `${prefix}_${key}` : key
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        Object.assign(flattened, flattenObject(val, fullKey))
      } else {
        flattened[fullKey] = val
      }
    }
    return flattened
  }

  const handleTestAndFetch = async () => {
    if (!url.trim()) {
      setError('Please provide a valid API endpoint URL.')
      return
    }

    setLoading(true)
    setError(null)
    setPreviewRows(null)

    try {
      const headerObj: Record<string, string> = {}
      for (const h of headers) {
        if (h.key.trim() && h.value.trim()) {
          headerObj[h.key.trim()] = h.value.trim()
        }
      }

      const res = await fetch('/api/proxy-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          method,
          headers: headerObj,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}: Failed to fetch API endpoint.`)
      }

      const rawArray = extractArray(json.data, rootPath)

      if (!rawArray || rawArray.length === 0) {
        throw new Error('API returned successfully, but no records or array could be found in the response. If your data is nested, specify the JSON Root Path.')
      }

      // Flatten each object in the array
      const flatRows = rawArray.map(r => flattenObject(r))
      const cols = Object.keys(flatRows[0] || {})

      setPreviewRows(flatRows.slice(0, 5))
      setPreviewCols(cols.slice(0, 8)) // preview first 8 cols
      setTotalCount(flatRows.length)

      if (!name.trim()) {
        try {
          const parsedUrl = new URL(url.trim())
          const pathname = parsedUrl.pathname.split('/').filter(Boolean).pop() || 'api_data'
          setName(pathname.replace(/[^a-zA-Z0-9_]/g, '_'))
        } catch {
          setName('api_data')
        }
      }
    } catch (err: any) {
      console.error('API Test Error:', err)
      setError(err.message || 'Failed to connect to API.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveApi = async () => {
    if (!previewRows || previewRows.length === 0) {
      setError('Please test the API and fetch data before saving.')
      return
    }

    setLoading(true)
    try {
      // Re-fetch or generate full dataset
      const headerObj: Record<string, string> = {}
      for (const h of headers) {
        if (h.key.trim() && h.value.trim()) {
          headerObj[h.key.trim()] = h.value.trim()
        }
      }

      const res = await fetch('/api/proxy-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          method,
          headers: headerObj,
        }),
      })

      const json = await res.json()
      const rawArray = extractArray(json.data, rootPath)
      const flatRows = rawArray.map(r => flattenObject(r))

      const safeTableName = (name.trim() || 'api_data')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .replace(/^_+|_+$/g, '')

      const schemaText = generateSchemaFromRows(safeTableName, flatRows)
      const cols = Object.keys(flatRows[0] || {})

      const fileRecord: UploadedFileRecord = {
        id: 'api_' + Date.now(),
        name: name.trim() || 'REST API Data',
        tableName: safeTableName,
        fileType: 'API',
        rowCount: flatRows.length,
        columns: cols,
        schemaText,
        rows: flatRows,
        uploadedAt: new Date().toISOString(),
      }

      onApiAdded(fileRecord)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save API source.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Globe className="w-4 h-4" />
            </div>
            <DialogTitle className="text-xl font-bold font-serif text-[#1E2761]">
              Connect REST API / Webhook
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#5A6478]">
            Ingest live JSON data from any public or private REST API endpoint directly into Decyra's in-browser memory engine.
          </DialogDescription>
        </DialogHeader>

        {/* Quick Presets */}
        <div className="mt-4 p-3 bg-[#F4F6FB] border border-[#E5E9F2] rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2761] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F96167]" />
            <span>Try a Quick Sample API:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-[#E5E9F2] px-3 py-1.5 rounded-lg text-[#1E2761] font-medium transition-all cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Form */}
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8">
              <label className="text-xs font-bold text-[#1E2761] uppercase tracking-wider block mb-1.5">
                Endpoint URL <span className="text-[#F96167]">*</span>
              </label>
              <Input
                placeholder="https://api.stripe.com/v1/charges or https://mycompany.com/api/data"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="col-span-4">
              <label className="text-xs font-bold text-[#1E2761] uppercase tracking-wider block mb-1.5">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full h-9 rounded-md border border-[#E5E9F2] bg-white px-3 text-xs font-semibold text-[#1E2761] focus:outline-none focus:ring-2 focus:ring-[#1E2761]"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7">
              <label className="text-xs font-bold text-[#1E2761] uppercase tracking-wider block mb-1.5">
                Data Source Name
              </label>
              <Input
                placeholder="e.g. Stripe Charges, Shopify Products"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="col-span-5">
              <label className="text-xs font-bold text-[#1E2761] uppercase tracking-wider block mb-1.5">
                JSON Root Path <span className="text-[10px] text-[#5A6478] font-normal lowercase">(optional)</span>
              </label>
              <Input
                placeholder="e.g. data or items"
                value={rootPath}
                onChange={(e) => setRootPath(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          {/* HTTP Headers */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#1E2761] uppercase tracking-wider">
                Headers &amp; Authentication <span className="text-[10px] text-[#5A6478] font-normal lowercase">(API Keys, Bearer tokens)</span>
              </label>
              <button
                type="button"
                onClick={handleAddHeader}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Header</span>
              </button>
            </div>

            <div className="space-y-2">
              {headers.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Header (e.g. Authorization or X-API-Key)"
                    value={h.key}
                    onChange={(e) => handleHeaderChange(i, 'key', e.target.value)}
                    className="font-mono text-xs flex-1"
                  />
                  <Input
                    placeholder="Value (e.g. Bearer sk_live_...)"
                    value={h.value}
                    onChange={(e) => handleHeaderChange(i, 'value', e.target.value)}
                    className="font-mono text-xs flex-1"
                  />
                  {headers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHeader(i)}
                      className="p-1 text-[#5A6478] hover:text-rose-600 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Test Action Button */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleTestAndFetch}
              disabled={loading || !url.trim()}
              className="w-full bg-[#1E2761] hover:bg-[#151b43] text-white text-xs font-bold h-10 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting &amp; Fetching JSON Payload...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Test Connection &amp; Preview API Data</span>
                </div>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Preview Results */}
          {previewRows && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">
                    Connection Successful! {totalCount.toLocaleString()} records detected
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  {previewCols.length} Columns Inferred
                </span>
              </div>

              {/* Mini Table Preview */}
              <div className="overflow-x-auto border border-emerald-200 rounded-lg bg-white">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-[#F4F6FB] border-b border-emerald-200 text-[#1E2761] font-bold">
                    <tr>
                      {previewCols.map((c) => (
                        <th key={c} className="px-2.5 py-1.5 truncate max-w-[120px]">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        {previewCols.map((c) => (
                          <td key={c} className="px-2.5 py-1.5 truncate max-w-[120px] text-[#5A6478] font-mono text-[10px]">
                            {row[c] !== undefined && row[c] !== null ? String(row[c]) : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-[#5A6478]">
                  Ready to query in browser RAM with ANSI SQL.
                </p>
                <Button
                  type="button"
                  onClick={handleSaveApi}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 px-5 shadow-sm cursor-pointer"
                >
                  {loading ? 'Ingesting...' : 'Ingest & Query in Decyra →'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
