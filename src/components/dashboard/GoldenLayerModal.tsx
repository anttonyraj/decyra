'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  Layers, 
  Database, 
  Snowflake, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  GitFork 
} from 'lucide-react'

interface GoldenLayerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GoldenLayerModal({ isOpen, onClose }: GoldenLayerModalProps) {
  const [requested, setRequested] = useState(false)

  const handleRequestAccess = () => {
    setRequested(true)
    setTimeout(() => {
      // Keep feedback visible for user
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden bg-white border border-[#E5E9F2] shadow-2xl rounded-2xl">
        {/* Modal Banner Header */}
        <div className="relative bg-gradient-to-r from-[#1E2761] to-[#2B3577] text-white p-6 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#F96167]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F96167] text-white">
              <Sparkles className="w-3 h-3" /> In Progress
            </span>
            <span className="text-xs text-white/70">Planned Q4 Release</span>
          </div>

          <DialogTitle className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            Virtual Golden Layer & Cross-DB Marts
          </DialogTitle>
          <DialogDescription className="text-white/80 text-sm mt-1 leading-relaxed">
            Query and join disparate databases on the fly without writing ETL pipelines or managing warehouses.
          </DialogDescription>
        </div>

        <div className="p-6 space-y-6">
          {/* Architecture Visual Diagram */}
          <div className="bg-[#FAFBFC] border border-[#E5E9F2] rounded-xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-3 text-center">
              How Decyra Multi-DB Federation Works
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white border border-[#E5E9F2] rounded-lg p-2.5 shadow-2xs flex flex-col items-center justify-center">
                <Database className="w-4 h-4 text-[#1E2761] mb-1" />
                <span className="font-semibold text-[#1E2761]">PostgreSQL</span>
                <span className="text-[10px] text-[#5A6478]">CRM & Users</span>
              </div>

              <div className="bg-white border border-[#E5E9F2] rounded-lg p-2.5 shadow-2xs flex flex-col items-center justify-center">
                <Snowflake className="w-4 h-4 text-[#00A1FF] mb-1" />
                <span className="font-semibold text-[#1E2761]">Snowflake</span>
                <span className="text-[10px] text-[#5A6478]">Invoices & Rev</span>
              </div>

              <div className="bg-white border border-[#E5E9F2] rounded-lg p-2.5 shadow-2xs flex flex-col items-center justify-center">
                <Database className="w-4 h-4 text-[#4285F4] mb-1" />
                <span className="font-semibold text-[#1E2761]">BigQuery</span>
                <span className="text-[10px] text-[#5A6478]">Web Events</span>
              </div>
            </div>

            {/* Central Convergence */}
            <div className="flex justify-center my-2 text-[#F96167]">
              <div className="flex items-center gap-1 text-[11px] font-semibold bg-[#FDE2E3] px-3 py-1 rounded-full text-[#F96167]">
                <Zap className="w-3.5 h-3.5" /> Pushdown Predicates
              </div>
            </div>

            {/* Unified In-Memory Engine */}
            <div className="bg-gradient-to-r from-[#EBF3FE] to-[#F4F7FC] border border-[#D0E1FD] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#1E2761]">
                <Layers className="w-4 h-4 text-[#F96167]" />
                Decyra In-Memory Vector Engine
              </div>
              <div className="text-[11px] text-[#5A6478] mt-0.5">
                Subqueries execute concurrently; joined in RAM in milliseconds. Zero server data storage.
              </div>
            </div>

            {/* Output Result */}
            <div className="mt-2 text-center text-xs font-medium text-[#1E2761]">
              ➔ Unified Golden Table & Executive Insights
            </div>
          </div>

          {/* Value Props List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-[#FDE2E3] flex items-center justify-center shrink-0 mt-0.5">
                <GitFork className="w-3.5 h-3.5 text-[#F96167]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E2761]">Zero ETL Pipeline Overhead</div>
                <div className="text-[11px] text-[#5A6478] leading-relaxed">
                  Ask questions like <em>&quot;Compare active signups in Postgres with their Q3 revenue in Snowflake&quot;</em> without waiting months for data engineers to build pipelines.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-[#E8F0FE] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E2761]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E2761]">Enterprise-Grade Privacy (Zero Storage)</div>
                <div className="text-[11px] text-[#5A6478] leading-relaxed">
                  Data is never persisted or stored in Decyra. Joins occur ephemerally in-memory and are cleared immediately after the query.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E9F2] p-4 bg-[#FAFBFC] flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs text-[#5A6478] cursor-pointer"
          >
            Close
          </Button>

          <Button
            type="button"
            onClick={handleRequestAccess}
            disabled={requested}
            className={`text-xs font-semibold cursor-pointer ${
              requested 
                ? 'bg-emerald-600 hover:bg-emerald-600 text-white' 
                : 'bg-[#F96167] hover:bg-[#e8535a] text-white'
            }`}
          >
            {requested ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> You&apos;re on the Early Access List!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Request Early Beta Access <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
