"use client";

import React, { useState, useEffect } from "react";
import { Database, Snowflake, FileSpreadsheet, Layers, Zap, Check, Sparkles, Activity, ShieldCheck } from "lucide-react";

export default function GoldenLayerGraphic() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activePhase, setActivePhase] = useState(0); // 0: Pushdown, 1: Streaming, 2: In-Memory Join, 3: Golden Result

  const scenarios = [
    {
      title: "Customer 360 Golden Mart",
      question: "Compare active PostgreSQL signups with Q3 billing in Snowflake and clickstream in BigQuery",
      pgTable: "users (CRM)",
      pgRows: "240 rows",
      sfTable: "billing_invoices (DW)",
      sfRows: "240 rows",
      bqTable: "clickstream (Events)",
      bqRows: "240 rows",
      joinKey: "users.id = billing.user_id = events.user_id",
      resultHeadline: "240 Enterprise accounts joined in 14ms",
      resultStat: "$3.42M ARR • 94.2% Health Score",
      dataRows: [
        { name: "Acme Corp", segment: "Mid-Market", rev: "$128,000", score: "96%" },
        { name: "Globex Inc", segment: "Enterprise", rev: "$340,000", score: "92%" },
        { name: "Stark Tech", segment: "Growth", rev: "$94,500", score: "98%" },
      ],
    },
    {
      title: "RevOps Target vs Actuals",
      question: "Cross-reference uploaded Excel quota targets with live closed-won revenue in Snowflake",
      pgTable: "rep_roster (Postgres)",
      pgRows: "45 reps",
      sfTable: "closed_won (Snowflake)",
      sfRows: "45 reps",
      bqTable: "quota_plan.xlsx (Upload)",
      bqRows: "45 reps",
      joinKey: "rep_roster.email = closed_won.rep_email = quota.rep",
      resultHeadline: "45 Sales Reps evaluated in 8ms",
      resultStat: "112% Quota Attainment • 6 President Club",
      dataRows: [
        { name: "Sarah Jenkins", segment: "Americas Enterprise", rev: "$1,450,000", score: "128%" },
        { name: "David Chen", segment: "EMEA Commercial", rev: "$980,000", score: "115%" },
        { name: "Elena Rostova", segment: "APAC Growth", rev: "$670,000", score: "108%" },
      ],
    },
  ];

  // Auto-progress animation phases: 0 -> 1 -> 2 -> 3
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, [activeScenario]);

  const current = scenarios[activeScenario];

  const phaseLabels = [
    "Step 1: AI Pushdown Query Decomposition",
    "Step 2: Concurrent Sub-query Execution",
    "Step 3: In-Memory Vectorized Join (12ms)",
    "Step 4: Unified Golden Record Rendered",
  ];

  return (
    <div className="w-full bg-white border border-[#E5E9F2] rounded-2xl shadow-[0_8px_30px_rgba(30,39,97,0.06)] p-6 max-[640px]:p-4 overflow-hidden relative">
      <style>{`
        @keyframes beamFlow {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes orbTravel {
          0% { transform: translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(249, 97, 103, 0.2), 0 0 30px rgba(30, 39, 97, 0.1); }
          50% { box-shadow: 0 0 25px rgba(249, 97, 103, 0.4), 0 0 50px rgba(30, 39, 97, 0.2); }
        }
        .stream-line {
          stroke-dasharray: 6 6;
          animation: beamFlow 1.2s linear infinite;
        }
        .core-spin {
          animation: spinSlow 12s linear infinite;
        }
        .pulse-core {
          animation: pulseGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Radial ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#1E2761]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#F96167]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E9F2] pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EBF3FE] border border-[#C7D7F7] flex items-center justify-center shadow-2xs">
            <Layers className="w-5 h-5 text-[#1E2761]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1E2761] uppercase tracking-wider">
                Concept Demo
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FDE2E3] text-[#F96167] text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                <Activity className="w-2.5 h-2.5 animate-pulse" />
                Live Animation
              </span>
            </div>
            <div className="text-sm font-bold text-[#1E2761]" style={{ fontFamily: "Georgia, serif" }}>
              {current.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-xl border border-[#E5E9F2]">
          {scenarios.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => {
                setActiveScenario(idx);
                setActivePhase(0);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeScenario === idx
                  ? "bg-white text-[#1E2761] shadow-xs font-bold"
                  : "text-[#5A6478] hover:text-[#1E2761]"
              }`}
            >
              Scenario {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* User Question Bar */}
      <div className="mb-6 bg-[#FAFBFC] border border-[#E5E9F2] rounded-xl p-3.5 flex items-start gap-3 shadow-2xs relative z-10">
        <div className="w-6 h-6 rounded-md bg-[#1E2761] flex items-center justify-center text-white shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F96167]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6478] mb-0.5">
            Natural Language Question
          </div>
          <div className="text-xs font-medium text-[#1E2761] truncate">
            &quot;{current.question}&quot;
          </div>
        </div>
        <div className="text-[10px] font-semibold text-[#F96167] bg-[#FDE2E3] px-2 py-0.5 rounded shrink-0">
          Auto Multi-Join
        </div>
      </div>

      {/* Active Phase Pipeline Indicator */}
      <div className="mb-6 bg-white border border-[#C7D7F7] rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs relative z-10">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1E2761]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{phaseLabels[activePhase]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((p) => (
            <div
              key={p}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activePhase === p ? "w-6 bg-[#F96167]" : "w-2 bg-[#E5E9F2]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* The 3-Tier Visual Flow Canvas */}
      <div className="grid grid-cols-12 max-[1024px]:grid-cols-1 gap-4 items-center relative z-10">
        {/* LEFT COLUMN: 3 Disparate Databases */}
        <div className="col-span-4 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-1 flex items-center justify-between">
            <span>1. Disparate Databases</span>
            <span className="text-[9px] text-[#1E2761] bg-[#EBF3FE] px-1.5 py-0.5 rounded font-semibold">Pushdown</span>
          </div>

          {/* Database 1: Postgres */}
          <div className={`p-3 rounded-xl border transition-all duration-300 shadow-2xs flex items-center gap-3 ${
            activePhase >= 0 ? "border-[#1E2761] bg-[#F8FAFD]" : "border-[#E5E9F2] bg-white"
          }`}>
            <div className="w-9 h-9 rounded-lg bg-[#EBF3FE] flex items-center justify-center shrink-0 border border-[#D0E1FD]">
              <Database className="w-4 h-4 text-[#1E2761]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.pgTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Filtered: {current.pgRows}
              </div>
            </div>
          </div>

          {/* Database 2: Snowflake */}
          <div className={`p-3 rounded-xl border transition-all duration-300 shadow-2xs flex items-center gap-3 ${
            activePhase >= 1 ? "border-[#00A1FF] bg-[#F0F9FF]" : "border-[#E5E9F2] bg-white"
          }`}>
            <div className="w-9 h-9 rounded-lg bg-[#E0F3FE] flex items-center justify-center shrink-0 border border-[#BAE6FD]">
              <Snowflake className="w-4 h-4 text-[#00A1FF]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.sfTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Aggregated: {current.sfRows}
              </div>
            </div>
          </div>

          {/* Database 3: BigQuery / Files */}
          <div className={`p-3 rounded-xl border transition-all duration-300 shadow-2xs flex items-center gap-3 ${
            activePhase >= 1 ? "border-[#F96167] bg-[#FEF2F2]" : "border-[#E5E9F2] bg-white"
          }`}>
            <div className="w-9 h-9 rounded-lg bg-[#FDE2E3] flex items-center justify-center shrink-0 border border-[#FECDD3]">
              <FileSpreadsheet className="w-4 h-4 text-[#F96167]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.bqTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Selected: {current.bqRows}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Decyra In-Memory Join Core */}
        <div className="col-span-4 flex flex-col items-center justify-center p-2 relative">
          <div className={`w-full relative border-2 rounded-2xl p-5 text-center transition-all duration-500 ${
            activePhase === 2
              ? "border-[#F96167] bg-gradient-to-b from-[#FFF5F5] to-[#F4F8FE] pulse-core scale-[1.02]"
              : "border-[#C7D7F7] bg-gradient-to-b from-[#F4F8FE] to-[#EBF3FE]"
          }`}>
            {/* Spinning Aura Indicator */}
            <div className="absolute top-2 right-2">
              <div className="w-5 h-5 rounded-full border border-dashed border-[#F96167] core-spin" />
            </div>

            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#F96167] text-white px-3 py-0.5 rounded-full mb-3 shadow-xs">
              <Zap className="w-3 h-3 animate-bounce" />
              Decyra In-Memory Vector Core
            </div>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-md border border-[#C7D7F7] flex items-center justify-center mb-2.5 relative">
              <Layers className="w-7 h-7 text-[#1E2761]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F96167] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F96167]"></span>
              </span>
            </div>

            <div className="text-xs font-bold text-[#1E2761]">
              Ephemeral Memory Join
            </div>
            <div className="text-[10px] text-[#5A6478] mt-1 font-mono bg-white/90 rounded-md p-1.5 border border-[#D0E1FD] shadow-2xs leading-tight">
              ON {current.joinKey}
            </div>

            <div className="mt-3 text-[10px] text-emerald-700 font-semibold flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-md border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero server disk storage • 100% Private</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Unified Golden Record */}
        <div className="col-span-4 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-1 flex items-center justify-between">
            <span>2. Unified Golden Record</span>
            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Joined &lt; 15ms</span>
          </div>

          <div className={`border rounded-xl bg-white p-4 shadow-sm space-y-3 transition-all duration-300 ${
            activePhase === 3 ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-[#C7D7F7]"
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E2761]">
                {current.resultHeadline}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="bg-[#FAFBFC] rounded-lg p-2.5 border border-[#E5E9F2]">
              <div className="text-[9.5px] text-[#5A6478] uppercase font-semibold">Executive KPI Aggregate</div>
              <div className="text-xs font-bold text-[#1E2761]">{current.resultStat}</div>
            </div>

            {/* Live Data Rows */}
            <div className="space-y-1.5 text-[10.5px]">
              {current.dataRows.map((row) => (
                <div key={row.name} className="flex items-center justify-between bg-stone-50 px-2 py-1 rounded-md text-stone-700 font-mono">
                  <div className="truncate">
                    <span className="font-semibold text-[#1E2761]">{row.name}</span>
                    <span className="text-[9px] text-[#5A6478] ml-1.5">({row.segment})</span>
                  </div>
                  <div className="font-bold text-emerald-600 shrink-0 ml-2">
                    {row.rev}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[9px] text-center text-[#5A6478] italic pt-1 border-t border-[#E5E9F2] flex items-center justify-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Real-time joined SQL • Ready to export</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
