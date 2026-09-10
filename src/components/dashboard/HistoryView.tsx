'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Star, Play, Copy, Check, Trash2, Search, Clock, Database, ArrowRight, Sparkles, Filter } from 'lucide-react'
import { useDataSource } from './DashboardShell'

interface HistoryItem {
  id: string
  question: string
  sql: string
  intent?: string
  row_count: number
  is_favorite: boolean
  connection_id?: string
  connection_name?: string
  created_at: string
}

export default function HistoryView() {
  const { runHistoryQuery } = useDataSource()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'all' | 'favorites'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      // 1. Fetch remote from Supabase API
      const res = await fetch('/api/history')
      const data = await res.json()
      let remoteItems: HistoryItem[] = Array.isArray(data?.history) ? data.history : []

      // 2. Merge with local storage fallback
      let localItems: HistoryItem[] = []
      try {
        const saved = localStorage.getItem('decyra_query_history')
        if (saved) localItems = JSON.parse(saved)
      } catch (e) {}

      // Combine and deduplicate by question + created_at
      const map = new Map<string, HistoryItem>()
      remoteItems.forEach(item => map.set(item.id || item.question + item.created_at, item))
      localItems.forEach(item => {
        const key = item.id || item.question + item.created_at
        if (!map.has(key)) map.set(key, item)
      })

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setHistory(merged)
    } catch (err) {
      console.error('Failed to load history:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const toggleFavorite = async (item: HistoryItem) => {
    const nextVal = !item.is_favorite
    // Optimistic UI update
    setHistory(prev =>
      prev.map(q => (q.id === item.id || (q.question === item.question && q.created_at === item.created_at) ? { ...q, is_favorite: nextVal } : q))
    )

    // Save to local storage
    try {
      const updated = history.map(q => q.id === item.id ? { ...q, is_favorite: nextVal } : q)
      localStorage.setItem('decyra_query_history', JSON.stringify(updated))
    } catch (e) {}

    // Send to API if item has UUID from database
    if (item.id && !item.id.startsWith('local_')) {
      try {
        await fetch('/api/history', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, isFavorite: nextVal })
        })
      } catch (err) {
        console.error('Failed to update favorite status:', err)
      }
    }
  }

  const deleteItem = async (item: HistoryItem) => {
    setHistory(prev => prev.filter(q => q.id !== item.id))
    try {
      const updated = history.filter(q => q.id !== item.id)
      localStorage.setItem('decyra_query_history', JSON.stringify(updated))
    } catch (e) {}

    if (item.id && !item.id.startsWith('local_')) {
      try {
        await fetch(`/api/history?id=${item.id}`, { method: 'DELETE' })
      } catch (err) {
        console.error('Failed to delete query history item:', err)
      }
    }
  }

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear your query history?')) return
    setHistory([])
    try {
      localStorage.removeItem('decyra_query_history')
    } catch (e) {}
    try {
      await fetch('/api/history?id=all', { method: 'DELETE' })
    } catch (err) {}
  }

  const handleCopy = (id: string, sql: string) => {
    navigator.clipboard.writeText(sql)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatRelativeTime = (iso: string) => {
    if (!iso) return 'Recent'
    const diff = (Date.now() - new Date(iso).getTime()) / 1000
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      if (filterTab === 'favorites' && !item.is_favorite) return false
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.question.toLowerCase().includes(q) ||
        (item.intent && item.intent.toLowerCase().includes(q)) ||
        item.sql.toLowerCase().includes(q) ||
        (item.connection_name && item.connection_name.toLowerCase().includes(q))
      )
    })
  }, [history, filterTab, searchQuery])

  const favoriteCount = useMemo(() => history.filter(q => q.is_favorite).length, [history])

  return (
    <div className="w-full max-w-[900px] mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 
            className="text-2xl font-bold text-[#1E2761] tracking-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Query History & Favorites
          </h1>
          <p className="text-sm text-[#5A6478] mt-1">
            Access past questions, starred business queries, and generated SQL.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="self-start sm:self-auto text-xs text-[#5A6478] hover:text-[#F96167] transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-[#E5E9F2] bg-white hover:bg-red-50/40 shadow-sm cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#F4F6FB] p-1 rounded-xl border border-[#E5E9F2] w-fit">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-white text-[#1E2761] shadow-sm'
                : 'text-[#5A6478] hover:text-[#1E2761]'
            }`}
          >
            All Queries ({history.length})
          </button>
          <button
            onClick={() => setFilterTab('favorites')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterTab === 'favorites'
                ? 'bg-white text-[#F96167] shadow-sm'
                : 'text-[#5A6478] hover:text-[#1E2761]'
            }`}
          >
            <Star size={12} className={filterTab === 'favorites' ? 'fill-[#F96167] text-[#F96167]' : ''} />
            <span>Favorites ({favoriteCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B8CC]" />
          <input
            type="text"
            placeholder="Search questions or SQL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E5E9F2] rounded-lg text-[#1E2761] placeholder:text-[#B0B8CC] outline-none focus:border-[#1E2761] focus:ring-1 focus:ring-[#1E2761] transition-all"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-[#E5E9F2] p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-2 border-[#F96167] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#5A6478]">Loading query history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E9F2] p-12 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#F4F6FB] flex items-center justify-center mx-auto mb-4 text-[#B0B8CC]">
            {filterTab === 'favorites' ? <Star size={24} /> : <Clock size={24} />}
          </div>
          <h3 className="text-base font-bold text-[#1E2761] mb-1">
            {filterTab === 'favorites' ? 'No starred queries yet' : 'No queries found'}
          </h3>
          <p className="text-xs text-[#5A6478] max-w-sm mx-auto mb-6">
            {filterTab === 'favorites'
              ? 'Click the star icon next to any query to pin it here for 1-click re-runs.'
              : searchQuery
              ? 'No history matches your search filter.'
              : 'Ask your data a question on the Ask tab and it will automatically be saved here.'}
          </p>
          {filterTab === 'favorites' && (
            <button
              onClick={() => setFilterTab('all')}
              className="text-xs font-semibold text-[#1E2761] hover:underline"
            >
              View all queries
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id || item.question + item.created_at}
              className="bg-white rounded-xl border border-[#E5E9F2] p-4.5 shadow-[0_1px_3px_rgba(30,39,97,0.04)] hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Star Toggle */}
                  <button
                    onClick={() => toggleFavorite(item)}
                    className="mt-0.5 text-[#B0B8CC] hover:text-[#F96167] transition-colors cursor-pointer shrink-0"
                    title={item.is_favorite ? 'Remove from favorites' : 'Star this query'}
                  >
                    <Star
                      size={17}
                      className={item.is_favorite ? 'fill-[#F96167] text-[#F96167]' : ''}
                    />
                  </button>

                  <div className="min-w-0">
                    {/* Question Title */}
                    <h3 className="text-sm font-semibold text-[#1E2761] leading-snug break-words">
                      {item.question}
                    </h3>

                    {/* Metadata strip */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F4F6FB] text-[#1E2761] px-2 py-0.5 rounded-md border border-[#E5E9F2]">
                        <Database size={11} className="text-[#5A6478]" />
                        {item.connection_name || 'Demo Database'}
                      </span>
                      <span className="text-[11px] text-[#5A6478] bg-[#FAFBFC] px-2 py-0.5 rounded-md border border-[#E5E9F2]">
                        {item.row_count} {item.row_count === 1 ? 'row' : 'rows'}
                      </span>
                      <span className="text-[11px] text-[#5A6478]">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => runHistoryQuery(item.question)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F96167] text-white hover:bg-[#e8535a] transition-all text-xs font-semibold flex items-center gap-1 shadow-sm cursor-pointer"
                    title="Run this question again"
                  >
                    <Play size={11} className="fill-white" />
                    <span>Run</span>
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="p-1.5 text-[#B0B8CC] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete from history"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* SQL Code Block */}
              {item.sql && (
                <div className="mt-3 relative bg-[#1E2761] rounded-lg p-3 overflow-hidden">
                  <pre className="font-mono text-xs text-[#E5E9F2] overflow-x-auto whitespace-pre-wrap pr-16 leading-relaxed">
                    {item.sql}
                  </pre>
                  <button
                    onClick={() => handleCopy(item.id, item.sql)}
                    className="absolute top-2.5 right-2.5 p-1 rounded bg-[#2A3575] text-[#E5E9F2] hover:bg-[#3B4896] transition-colors text-[10px] font-medium flex items-center gap-1 cursor-pointer"
                    title="Copy SQL"
                  >
                    {copiedId === item.id ? (
                      <span className="text-[#34A853] flex items-center gap-0.5">
                        <Check size={11} /> Copied
                      </span>
                    ) : (
                      <Copy size={11} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
