'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Database, MessageSquare, Clock, Settings, Menu, X, LogOut, Plus } from 'lucide-react'
import ConnectPostgresModal from './ConnectPostgresModal'

interface DataSourceContextType {
  activeSource: string // 'demo' or custom connection UUID
  setActiveSource: (source: string) => void
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined)

export function useDataSource() {
  const context = useContext(DataSourceContext)
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider')
  }
  return context
}

export function DashboardShell({
  user,
  children,
}: {
  user: any
  children: React.ReactNode
}) {
  const router = useRouter()
  const [activeSource, setActiveSource] = useState<string>('demo')
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isConnectOpen, setIsConnectOpen] = useState(false)
  const [connections, setConnections] = useState<any[]>([])
  
  const supabase = createClient()

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/connections/list')
      const data = await res.json()
      if (Array.isArray(data)) {
        setConnections(data)
      }
    } catch (err) {
      console.error('Failed to fetch saved connections:', err)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (err) {
      console.error('Error signing out:', err)
      window.location.href = '/login'
    }
  }

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Top section: Wordmark & Logo */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F96167]" />
            <span className="font-serif font-bold text-[#1E2761] text-[15px] tracking-[0.12em] leading-none">
              DECYRA
            </span>
          </div>
          <div className="text-[9px] text-[#5A6478] tracking-[0.15em] uppercase mt-2 font-semibold">
            AI DATA INTELLIGENCE
          </div>
        </div>
        {/* Mobile close button inside the sidebar */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1 text-[#5A6478] hover:text-[#1E2761] transition-colors rounded-lg hover:bg-[#F4F6FB]"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-[#E5E9F2] my-5" />

      {/* DATA SOURCES Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="text-[10px] font-bold text-[#5A6478] uppercase tracking-[0.1em] mb-3">
          DATA SOURCES
        </div>

        <div className="flex flex-col gap-1">
          {/* Demo Database */}
          <button
            onClick={() => setActiveSource('demo')}
            className={`w-full h-10 flex items-center justify-between rounded-lg transition-all text-left cursor-pointer ${
              activeSource === 'demo'
                ? 'bg-[#F4F6FB] border-l-3 border-[#F96167] pl-[9px] pr-3 text-[#1E2761] font-semibold'
                : 'pl-3 pr-3 text-[#1E2761] hover:bg-[#F4F6FB]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className={`w-4 h-4 ${activeSource === 'demo' ? 'text-[#F96167]' : 'text-[#5A6478]'}`} />
              <span className="text-sm font-medium">Demo Database</span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Active</span>
            </div>
          </button>

          {/* Dynamic User Connections */}
          {connections.map((conn) => {
            const isActive = activeSource === conn.id
            return (
              <button
                key={conn.id}
                onClick={() => setActiveSource(conn.id)}
                className={`w-full h-10 flex items-center justify-between rounded-lg transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#F4F6FB] border-l-3 border-[#F96167] pl-[9px] pr-3 text-[#1E2761] font-semibold'
                    : 'pl-3 pr-3 text-[#1E2761] hover:bg-[#F4F6FB]'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                  <Database className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#F96167]' : 'text-[#5A6478]'}`} />
                  <span className="text-sm font-medium truncate" title={conn.name}>{conn.name}</span>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-green-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>Active</span>
                  </div>
                )}
              </button>
            )
          })}

          {/* PostgreSQL Connect Button */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 text-[#1E2761] hover:bg-[#F4F6FB]">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm font-medium">PostgreSQL</span>
            </div>
            <button
              onClick={() => setIsConnectOpen(true)}
              className="text-[11px] text-[#F96167] hover:underline font-semibold cursor-pointer"
            >
              Connect
            </button>
          </div>

          {/* Snowflake Connect (placeholder) */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 text-[#1E2761] hover:bg-[#F4F6FB]">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm font-medium">Snowflake</span>
            </div>
            <button
              onClick={() => setIsConnectOpen(true)}
              className="text-[11px] text-[#F96167] hover:underline font-semibold cursor-pointer"
            >
              Connect
            </button>
          </div>

          {/* MySQL */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm text-[#5A6478]">MySQL</span>
            </div>
            <span className="bg-[#FDE2E3] text-[#F96167] text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">
              SOON
            </span>
          </div>

          {/* BigQuery */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm text-[#5A6478]">BigQuery</span>
            </div>
            <span className="bg-[#FDE2E3] text-[#F96167] text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">
              SOON
            </span>
          </div>
        </div>

        <button 
          onClick={() => setIsConnectOpen(true)}
          className="text-[13px] text-[#5A6478] hover:text-[#1E2761] transition-colors pl-3 pt-4 flex items-center gap-1 font-medium hover:underline text-left cursor-pointer"
        >
          <Plus size={14} /> Add connection
        </button>

        <div className="w-full h-[1px] bg-[#E5E9F2] my-5" />

        {/* NAVIGATION Section */}
        <div className="text-[10px] font-bold text-[#5A6478] uppercase tracking-[0.1em] mb-3">
          NAVIGATION
        </div>

        <div className="flex flex-col gap-1">
          {/* Ask */}
          <div className="w-full h-10 flex items-center rounded-lg bg-[#F4F6FB] border-l-3 border-[#F96167] pl-[9px] pr-3 text-[#1E2761] font-semibold">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-[#F96167]" />
              <span className="text-sm">Ask</span>
            </div>
          </div>

          {/* History */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm text-[#5A6478]">History</span>
            </div>
            <span className="bg-[#FDE2E3] text-[#F96167] text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">
              SOON
            </span>
          </div>

          {/* Settings */}
          <div className="w-full h-10 flex items-center justify-between rounded-lg pl-3 pr-3 opacity-60">
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-[#5A6478]" />
              <span className="text-sm text-[#5A6478]">Settings</span>
            </div>
            <span className="bg-[#FDE2E3] text-[#F96167] text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">
              SOON
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Sign out */}
      <div className="mt-auto pt-4 border-t border-[#E5E9F2]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#1E2761] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {initial}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[#5A6478] truncate font-medium max-w-[140px]" title={user?.email}>
                {user?.email || 'user@decyra.ai'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full h-9 flex items-center gap-2 text-xs text-[#5A6478] hover:text-[#F96167] transition-all rounded-lg hover:bg-red-50/50 px-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="font-semibold">Sign out</span>
        </button>
      </div>
    </div>
  )

  return (
    <DataSourceContext.Provider value={{ activeSource, setActiveSource }}>
      <div className="w-screen h-screen flex overflow-hidden bg-[#FAFBFC] font-sans">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-[260px] h-full shrink-0 bg-white border-r border-[#E5E9F2] p-6">
          {sidebarContent}
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-xs z-40 transition-opacity duration-300"
            />
            {/* Slide-out drawer */}
            <aside className="md:hidden fixed top-0 bottom-0 left-0 w-[260px] h-full bg-white z-50 shadow-2xl p-6 transition-transform duration-300 animate-in slide-in-from-left">
              {sidebarContent}
            </aside>
          </>
        )}

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* MOBILE TOP BAR (visible below md: 768px) */}
          <header className="md:hidden w-full h-12 bg-white border-b border-[#E5E9F2] px-4 flex items-center justify-between shrink-0 z-30">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1 text-[#5A6478] hover:text-[#1E2761] transition-colors rounded-lg hover:bg-[#F4F6FB]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Wordmark centered */}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F96167]" />
              <span className="font-serif font-bold text-[#1E2761] text-xs tracking-[0.1em] mt-[1px]">
                DECYRA
              </span>
            </div>

            {/* User Initial avatar on right */}
            <div className="w-7 h-7 rounded-full bg-[#1E2761] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {initial}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-grow overflow-y-auto p-6 md:p-10">
            {children}
          </main>
        </div>
      </div>

      <ConnectPostgresModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
        onSaveSuccess={() => {
          fetchConnections()
        }}
      />
    </DataSourceContext.Provider>
  )
}
