'use client'

import React, { useState } from 'react'
import { User, Database, ShieldCheck, Zap, Sparkles, LogOut, Trash2, Check, ExternalLink, HardDrive, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useDataSource } from './DashboardShell'

export default function SettingsView({ user }: { user: any }) {
  const router = useRouter()
  const { connections, refreshConnections, setActiveSource, activeSource } = useDataSource()
  const [copiedKey, setCopiedKey] = useState(false)
  const [clearingCache, setClearingCache] = useState(false)
  const [cacheCleared, setCacheCleared] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      window.location.href = '/login'
    }
  }

  const handleClearCache = () => {
    setClearingCache(true)
    try {
      localStorage.removeItem('decyra_query_history')
      sessionStorage.clear()
      setCacheCleared(true)
      setTimeout(() => setCacheCleared(false), 2500)
    } catch (e) {}
    setClearingCache(false)
  }

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <div className="w-full max-w-[850px] mx-auto py-2">
      {/* Header */}
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold text-[#1E2761] tracking-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Settings & Account
        </h1>
        <p className="text-sm text-[#5A6478] mt-1">
          Manage your account profile, connected databases, and subscription preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Account Profile Card */}
        <div className="bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#F96167]" />
            <h2 className="text-sm font-bold text-[#1E2761] uppercase tracking-wider">Account Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1E2761] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {initial}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1E2761]">{user?.email || 'user@decyra.systems'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} className="text-emerald-600" />
                    Verified User
                  </span>
                  <span className="text-xs text-[#5A6478]">Google OAuth</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#F96167] hover:bg-red-50/50 hover:border-red-200 transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign out</span>
            </button>
          </div>
        </div>

        {/* 2. Connected Databases Card */}
        <div className="bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#F96167]" />
              <h2 className="text-sm font-bold text-[#1E2761] uppercase tracking-wider">Connected Databases</h2>
            </div>
            <button
              onClick={() => refreshConnections && refreshConnections()}
              className="p-1.5 text-[#5A6478] hover:text-[#1E2761] rounded-lg hover:bg-[#F4F6FB] transition-colors cursor-pointer"
              title="Refresh connections"
            >
              <RefreshCw size={13} />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Demo Database row */}
            <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${activeSource === 'demo' ? 'border-[#F96167] bg-[#FEF7F7]/60' : 'border-[#E5E9F2] bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4F6FB] flex items-center justify-center text-[#1E2761]">
                  <Database size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E2761]">Demo Database (PostgreSQL)</p>
                  <p className="text-[11px] text-[#5A6478]">Read-only sample revops and business data</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activeSource === 'demo' ? (
                  <span className="text-[11px] font-semibold text-[#F96167] bg-[#FDE2E3] px-2.5 py-0.5 rounded-full">
                    Active Source
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveSource('demo')}
                    className="text-xs font-semibold text-[#1E2761] hover:text-[#F96167] hover:underline cursor-pointer"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>

            {/* Custom User Connections */}
            {connections && connections.map((conn: any) => {
              const isSelected = activeSource === conn.id
              return (
                <div key={conn.id} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${isSelected ? 'border-[#F96167] bg-[#FEF7F7]/60' : 'border-[#E5E9F2] bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F4F6FB] flex items-center justify-center text-[#1E2761]">
                      <Database size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E2761]">{conn.name}</p>
                      <p className="text-[11px] text-[#5A6478]">
                        {conn.connection_type === 'snowflake' ? `Snowflake • ${conn.database_name}` : `Postgres • ${conn.host}:${conn.port || 5432}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="text-[11px] font-semibold text-[#F96167] bg-[#FDE2E3] px-2.5 py-0.5 rounded-full">
                        Active Source
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveSource(conn.id)}
                        className="text-xs font-semibold text-[#1E2761] hover:text-[#F96167] hover:underline cursor-pointer"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3. Subscription & Usage Card */}
        <div className="bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#F96167]" />
            <h2 className="text-sm font-bold text-[#1E2761] uppercase tracking-wider">Subscription & AI Features</h2>
          </div>

          <div className="bg-gradient-to-r from-[#1E2761] to-[#2D3A8C] rounded-xl p-5 text-white mb-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full mb-1">
                  Active Plan
                </span>
                <h3 className="text-lg font-bold text-white">Decyra Pro Beta</h3>
                <p className="text-xs text-[#E5E9F2] mt-0.5">Early Access — Unlimited AI SQL Generation</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold">$0</span>
                <span className="text-xs text-[#CBD5E1]"> / month (Beta)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#E5E9F2]">
              <div className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-400" />
                <span>Gemini 2.5 Flash Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-400" />
                <span>PostgreSQL & Snowflake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-400" />
                <span>High-Res PNG & CSV Export</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Cache & Data Controls */}
        <div className="bg-white rounded-2xl border border-[#E5E9F2] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-[#5A6478]" />
            <h2 className="text-sm font-bold text-[#1E2761] uppercase tracking-wider">Local Cache & Diagnostics</h2>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-xs font-semibold text-[#1E2761]">Clear Local Workspace Cache</p>
              <p className="text-[11px] text-[#5A6478]">Resets offline cached history and interface states.</p>
            </div>

            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="px-3 py-1.5 rounded-lg border border-[#E5E9F2] bg-white text-[#5A6478] hover:text-[#1E2761] hover:border-[#1E2761] transition-all text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50"
            >
              {cacheCleared ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <Check size={12} /> Cleared!
                </span>
              ) : (
                'Clear Cache'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
