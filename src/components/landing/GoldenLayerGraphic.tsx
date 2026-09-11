"use client";

import React, { useState, useEffect } from "react";
import { Database, Snowflake, FileSpreadsheet, Layers, Zap, Check, ArrowRight, Sparkles } from "lucide-react";

export default function GoldenLayerGraphic() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);

  const scenarios = [
    {
      title: "Customer 360 Golden Mart",
      question: "Compare active PostgreSQL signups with Q3 billing in Snowflake and clickstream in BigQuery",
      pgTable: "users (CRM)",
      pgFilter: "status = 'active' (240 rows)",
      sfTable: "billing_invoices (DW)",
      sfFilter: "SUM(amount) GROUP BY user_id (240 rows)",
      bqTable: "clickstream (Events)",
      bqFilter: "sessions > 5 (240 rows)",
      joinKey: "users.id = billing.user_id = events.user_id",
      resultHeadline: "240 Enterprise accounts joined in 14ms",
      resultStat: "$3.42M Arr • 94.2% Health Score",
    },
    {
      title: "RevOps Target vs Actuals",
      question: "Cross-reference uploaded Excel quota targets with live revenue in Snowflake",
      pgTable: "rep_roster (Postgres)",
      pgFilter: "region = 'Americas' (45 reps)",
      sfTable: "closed_won (Snowflake)",
      sfFilter: "SUM(deal_val) YTD (45 reps)",
      bqTable: "quota_plan.xlsx (Upload)",
      bqFilter: "annual_targets (45 reps)",
      joinKey: "rep_roster.email = closed_won.rep_email = quota.rep",
      resultHeadline: "45 Sales Reps evaluated in 8ms",
      resultStat: "112% Quota Attainment • 6 President Club",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const current = scenarios[activeScenario];

  return (
    <div className="w-full bg-white border border-[#E5E9F2] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 max-[640px]:p-4 overflow-hidden relative">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-[#1E2761]/5 to-[#F96167]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Scenario switcher header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E9F2] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3FE] flex items-center justify-center">
            <Layers className="w-4 h-4 text-[#1E2761]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wider flex items-center gap-1.5">
              <span>Interactive Concept Demo</span>
              <span className="bg-[#FDE2E3] text-[#F96167] text-[9px] px-1.5 py-0.5 rounded font-bold">
                LIVE ANIMATION
              </span>
            </div>
            <div className="text-sm font-semibold text-[#1E2761]">
              {current.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F4F6FB] p-1 rounded-lg border border-[#E5E9F2]">
          {scenarios.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => setActiveScenario(idx)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                activeScenario === idx
                  ? "bg-white text-[#1E2761] shadow-2xs font-semibold"
                  : "text-[#5A6478] hover:text-[#1E2761]"
              }`}
            >
              Scenario {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question Bubble */}
      <div className="mb-6 bg-[#FAFBFC] border border-[#E5E9F2] rounded-xl p-3.5 flex items-start gap-3">
        <div className="w-6 h-6 rounded-md bg-[#1E2761] flex items-center justify-center text-white shrink-0 mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-[#F96167]" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A6478] mb-0.5">
            User Natural Language Prompt
          </div>
          <div className="text-xs font-medium text-[#1E2761]">
            &quot;{current.question}&quot;
          </div>
        </div>
      </div>

      {/* The 3-Tier Execution Pipeline Grid */}
      <div className="grid grid-cols-12 max-[1024px]:grid-cols-1 gap-4 items-center relative">
        {/* Step 1: Disparate Sources (Left) */}
        <div className="col-span-4 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-1 flex items-center justify-between">
            <span>1. Pushdown Filters</span>
            <span className="text-[9px] text-[#F96167] font-semibold">Zero ETL</span>
          </div>

          {/* Source A */}
          <div className="p-2.5 rounded-xl border border-[#E5E9F2] bg-white shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EBF3FE] flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-[#1E2761]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.pgTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium truncate">{current.pgFilter}</div>
            </div>
          </div>

          {/* Source B */}
          <div className="p-2.5 rounded-xl border border-[#E5E9F2] bg-white shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E0F3FE] flex items-center justify-center shrink-0">
              <Snowflake className="w-4 h-4 text-[#00A1FF]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.sfTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium truncate">{current.sfFilter}</div>
            </div>
          </div>

          {/* Source C */}
          <div className="p-2.5 rounded-xl border border-[#E5E9F2] bg-white shadow-2xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDE2E3] flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-[#F96167]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#1E2761] truncate">{current.bqTable}</div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium truncate">{current.bqFilter}</div>
            </div>
          </div>
        </div>

        {/* Step 2: Decyra In-Memory Join Engine (Center) */}
        <div className="col-span-4 flex flex-col items-center justify-center p-3 relative">
          <div className="w-full relative border-2 border-dashed border-[#C7D7F7] bg-gradient-to-b from-[#F4F8FE] to-[#EBF3FE] rounded-2xl p-4 text-center shadow-sm">
            {/* Pulsing indicator */}
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#F96167] text-white px-2.5 py-0.5 rounded-full mb-3 shadow-xs">
              <Zap className="w-3 h-3 animate-pulse" />
              In-Memory Join (DuckDB)
            </div>

            <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-md border border-[#C7D7F7] flex items-center justify-center mb-2">
              <Layers className="w-6 h-6 text-[#1E2761]" />
            </div>

            <div className="text-xs font-bold text-[#1E2761]">
              Ephemeral Memory Layer
            </div>
            <div className="text-[10px] text-[#5A6478] mt-1 leading-snug font-mono bg-white/80 rounded p-1 border border-[#D0E1FD]">
              ON {current.joinKey}
            </div>

            <div className="mt-3 text-[10px] text-[#1E2761] font-semibold flex items-center justify-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Zero server storage • 100% Private</span>
            </div>
          </div>
        </div>

        {/* Step 3: Golden Record Result (Right) */}
        <div className="col-span-4 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#5A6478] mb-1 flex items-center justify-between">
            <span>2. Unified Golden Record</span>
            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Sub-second</span>
          </div>

          <div className="border border-[#C7D7F7] rounded-xl bg-white p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E2761]">
                {current.resultHeadline}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="bg-[#FAFBFC] rounded-lg p-2 border border-[#E5E9F2]">
              <div className="text-[10px] text-[#5A6478] uppercase font-semibold">Aggregate Metric</div>
              <div className="text-xs font-bold text-[#1E2761]">{current.resultStat}</div>
            </div>

            {/* Mock Mini Data Rows */}
            <div className="space-y-1 text-[10px] font-mono">
              <div className="flex justify-between bg-stone-50 px-1.5 py-1 rounded text-stone-700">
                <span className="truncate">Acme Corp • Mid-Market</span>
                <span className="font-bold text-emerald-600">$128,000</span>
              </div>
              <div className="flex justify-between bg-stone-50 px-1.5 py-1 rounded text-stone-700">
                <span className="truncate">Globex Inc • Enterprise</span>
                <span className="font-bold text-emerald-600">$340,000</span>
              </div>
              <div className="flex justify-between bg-stone-50 px-1.5 py-1 rounded text-stone-700">
                <span className="truncate">Stark Tech • Growth</span>
                <span className="font-bold text-emerald-600">$94,500</span>
              </div>
            </div>

            <div className="text-[9px] text-center text-[#5A6478] italic pt-1 border-t border-[#E5E9F2]">
              Backed by real auditable joined ANSI SQL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
