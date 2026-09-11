"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Zap, 
  Layers, 
  DollarSign, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Lock,
  Boxes
} from "lucide-react";

export default function InvestorThesisGraphic() {
  const [activeCycle, setActiveCycle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCycle((prev) => (prev + 1) % 4);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#1A1F36] rounded-3xl p-6 sm:p-10 border border-[#2B3577] shadow-2xl relative overflow-hidden text-white my-8">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#1E2761]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#F96167]/20 blur-3xl pointer-events-none" />

      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#F96167] animate-pulse" />
            Live Unit Economics &amp; Execution Architecture
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif">
            Zero-ETL Federation vs. Legacy Data Stack
          </h3>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Active Vector Node
          </div>
          <span className="text-white/30">|</span>
          <div className="text-xs font-mono text-[#BAC5DE]">
            Query Latency: <span className="text-white font-bold">12.4ms</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-8 items-stretch relative z-10">
        
        {/* Left: The Legacy Problem (Red/Gray Tint) */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl border-l border-b border-rose-500/30">
            Legacy Stack ($180k/yr)
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">The Old Way</div>
            <h4 className="text-lg font-bold mb-4 font-serif text-white/90">Brittle ETL &amp; Warehouse Tax</h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE] flex items-center justify-between">
                <span>Fivetran Syncs</span>
                <span className="text-rose-400 font-bold">$4,500/mo</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE] flex items-center justify-between">
                <span>dbt Cloud + Airflow</span>
                <span className="text-rose-400 font-bold">$3,200/mo</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE] flex items-center justify-between">
                <span>2 FTE Data Engineers</span>
                <span className="text-rose-400 font-bold">$25,000/mo</span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE] flex items-center justify-between">
                <span>Sync Latency Lag</span>
                <span className="text-amber-400 font-bold">4 to 24 Hours</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-rose-300/80 flex items-center gap-2">
            <span className="text-base">⚠️</span> High churn, bloated bills, months of engineering backlog.
          </div>
        </div>

        {/* Center: Decyra In-Memory Vector Engine (Highlighted Core) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-[#1E2761]/90 to-[#2B3577]/80 border-2 border-[#F96167]/60 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative">
          <div className="absolute top-0 right-0 px-3 py-1 bg-[#F96167] text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl shadow-xs">
            Decyra Moat
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Vectorized Pushdown Core
            </div>
            <h4 className="text-lg font-bold mb-4 font-serif">Instant Zero-ETL Federation</h4>

            {/* Live Cycling Execution Stage */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/15 mb-4">
              <div className="text-[10px] uppercase font-bold text-[#BAC5DE] mb-1">Active Pipeline Stage:</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {activeCycle === 0 && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Pushdown SQL Filters Dispatched
                  </>
                )}
                {activeCycle === 1 && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                    Parallel Execution Across DBs
                  </>
                )}
                {activeCycle === 2 && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F96167] animate-pulse" />
                    In-Memory DuckDB Vector Join (11ms)
                  </>
                )}
                {activeCycle === 3 && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Virtual Golden Record Emitted
                  </>
                )}
              </div>
            </div>

            {/* Architecture Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <div className="text-lg font-bold text-emerald-400">&gt; 85%</div>
                <div className="text-[10px] text-[#BAC5DE]">Gross Margin</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <div className="text-lg font-bold text-cyan-400">&lt; $0.001</div>
                <div className="text-[10px] text-[#BAC5DE]">Cost Per Query</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <div className="text-lg font-bold text-white">0 Rows</div>
                <div className="text-[10px] text-[#BAC5DE]">Data Stored</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                <div className="text-lg font-bold text-emerald-400">100%</div>
                <div className="text-[10px] text-[#BAC5DE]">Read-Only AST</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 text-xs text-white/90 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
            Cloud-neutral execution. Zero client lock-in.
          </div>
        </div>

        {/* Right: The Enterprise Output & Expansion */}
        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider rounded-bl-xl border-l border-b border-emerald-500/30">
            Enterprise Value
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">The Business Outcome</div>
            <h4 className="text-lg font-bold mb-4 font-serif text-white/90">Autonomous Decision Velocity</h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE]">
                <div className="text-white font-bold mb-0.5">Instant Cross-System Answers</div>
                <div className="text-[11px] text-[#BAC5DE]">PostgreSQL app data + Snowflake financials joined on the fly.</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE]">
                <div className="text-white font-bold mb-0.5">Viral Internal Expansion</div>
                <div className="text-[11px] text-[#BAC5DE]">Executives share interactive data reports; seats expand organically.</div>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[#BAC5DE]">
                <div className="text-white font-bold mb-0.5">Enterprise Upgrades</div>
                <div className="text-[11px] text-[#BAC5DE]">Conversion to private VPC clusters with custom SOC2 SLAs.</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            Fastest path to enterprise contract expansion.
          </div>
        </div>
      </div>

      {/* Bottom Visual Data Flow Strip */}
      <div className="bg-black/30 rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-[#BAC5DE]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>PostgreSQL (App)</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#F96167]" />
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          <span>Snowflake (Warehouse)</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#F96167]" />
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#F96167]" />
          <span className="text-white font-bold">Decyra In-Memory Vector RAM</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-[#F96167]" />
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Unified Golden Record (12ms)</span>
        </div>
      </div>
    </div>
  );
}
