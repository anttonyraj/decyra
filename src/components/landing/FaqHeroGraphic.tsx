"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, CheckCircle2, Terminal, Database, Sparkles } from "lucide-react";

export default function FaqHeroGraphic() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Plain English Input",
      detail: "\"Which enterprise clients churned after renewing last quarter?\"",
      status: "Natural Language Parsed",
      color: "text-indigo-400"
    },
    {
      title: "2. AST Safety & Read-Only Linter",
      detail: "Verified SELECT only. Mutating tokens blocked: [DROP, ALTER, INSERT, DELETE]",
      status: "Read-Only Verified ✓",
      color: "text-emerald-400"
    },
    {
      title: "3. Vectorized Schema Grounding",
      detail: "Direct foreign key alignment across PostgreSQL & Snowflake schemas in RAM",
      status: "Zero Raw Data Stored",
      color: "text-cyan-400"
    },
    {
      title: "4. Millisecond Answer Delivery",
      detail: "Aggregated results streamed over TLS 1.3 straight to browser session",
      status: "Completed in 14ms",
      color: "text-[#F96167]"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-[800px] mx-auto bg-[#1A1F36] border border-[#2B3577] rounded-2xl p-6 sm:p-8 shadow-xl text-white text-left my-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#F96167]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-[#BAC5DE] ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#F96167]" /> decyra-governed-pipeline.log
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" /> SOC2 Compliant Runtime
        </div>
      </div>

      {/* Dynamic Steps Display */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {steps.map((s, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={s.title}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-white/10 border-[#F96167] shadow-md transform scale-[1.02]"
                  : "bg-white/[0.02] border-white/5 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono text-white">{s.title}</span>
                {isActive && <span className={`text-[10px] font-mono font-bold ${s.color}`}>{s.status}</span>}
              </div>
              <p className="text-[11px] font-mono text-[#BAC5DE] leading-relaxed line-clamp-2">
                {s.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom Guarantee Strip */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#BAC5DE] font-mono">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#F96167]" />
          <span>Zero customer data retained on disk</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>AST Safety Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Self-healing SQL compiler</span>
        </div>
      </div>
    </div>
  );
}
