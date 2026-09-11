"use client";

import React, { useState } from "react";
import SectionLabel from "./SectionLabel";
import {
  BrainCircuit,
  Wrench,
  ShieldCheck,
  SearchCheck,
  Sparkles,
  Mic,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Terminal,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  category: string;
  status: "LIVE" | "IN PROGRESS" | "FUTURE IMPLEMENTATION";
  statusColor: string;
  statusBg: string;
  statusBorder: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  headline: string;
  description: string;
  useCase: string;
  investorMoat: string;
  samplePrompt: string;
}

const agentsList: AgentItem[] = [
  {
    id: "zero-egress",
    name: "Agentic Zero Data Egress",
    category: "Security & Privacy",
    status: "LIVE",
    statusColor: "text-emerald-700",
    statusBg: "bg-emerald-50",
    statusBorder: "border-emerald-200",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    headline: "100% In-Memory Processing with Zero Cloud Data Storage",
    description:
      "Unlike traditional AI tools that ingest and store customer databases on external servers, this agent conducts all schema discovery, SQL planning, and computation entirely in client browser RAM or in-place Cloud Lake storage.",
    useCase: "Guarantees enterprise CISOs and compliance auditors that zero confidential customer records or financial transactions ever touch Decyra disks.",
    investorMoat: "Bypasses 9-month enterprise procurement friction and passes SOC2/HIPAA compliance reviews on Day 1.",
    samplePrompt: "Query 250,000 sensitive patient billing records with 100% in-browser RAM privacy."
  },
  {
    id: "self-healing",
    name: "Agentic Self-Healing SQL",
    category: "Reliability & Execution",
    status: "IN PROGRESS",
    statusColor: "text-[#1E2761]",
    statusBg: "bg-[#EBF3FE]",
    statusBorder: "border-[#C7D7F7]",
    icon: Wrench,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    headline: "Autonomous Query Error Reflection & Real-Time Auto-Correction",
    description:
      "When enterprise schemas have unusual naming conventions (e.g., cust_nm vs customer_name) or SQL dialect differences, the agent traps the engine error, inspects metadata, auto-corrects the syntax, and re-executes in under 30 milliseconds.",
    useCase: "Non-technical executives never experience a broken query or confusing error code. Queries execute flawlessly on the first try.",
    investorMoat: "Increases query completion rates from the industry average of 74% to >98%, drastically reducing customer churn.",
    samplePrompt: "Auto-corrected column reference [mrr_usd] from engine feedback in 28ms ✓"
  },
  {
    id: "autonomous-analyst",
    name: "Decyra Autonomous AI Analyst (Sentinel)",
    category: "Autonomous Operations",
    status: "IN PROGRESS",
    statusColor: "text-[#1E2761]",
    statusBg: "bg-[#EBF3FE]",
    statusBorder: "border-[#C7D7F7]",
    icon: BrainCircuit,
    iconColor: "text-[#F96167]",
    iconBg: "bg-[#FDE2E3]",
    headline: "24/7 Background Anomaly Watchdog & Morning Executive Briefings",
    description:
      "Wakes up autonomously before morning standups, evaluates rolling 30-day baselines across live databases and APIs, investigates statistical shifts, and sends concise root-cause briefings directly to leadership via Email or Slack.",
    useCase: "Alerts the CRO and VP of Sales at 7:30 AM when enterprise renewals in EMEA drop by >20%, pinpointing the 2 stalled accounts before quarterly revenue misses occur.",
    investorMoat: "Transitions Decyra from a 'pull' tool to an autonomous 'push' platform, driving daily executive engagement and justifying $1,000+/mo enterprise contracts.",
    samplePrompt: "Morning Briefing: Q3 enterprise renewal risk detected (+2 stalled legal redlines)."
  },
  {
    id: "root-cause",
    name: "Autonomous Root-Cause Investigator",
    category: "Deep Analytics",
    status: "IN PROGRESS",
    statusColor: "text-[#1E2761]",
    statusBg: "bg-[#EBF3FE]",
    statusBorder: "border-[#C7D7F7]",
    icon: SearchCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    headline: "Multi-Hypothesis Decomposition for 'Why Did X Drop?' Questions",
    description:
      "Instead of returning a single flat metric, the agent autonomously spins up 3 parallel sub-queries (segmenting by customer cohort, product line, and sales rep) to answer the underlying reason behind business changes.",
    useCase: "Replaces 4 hours of tedious BI slicing with one click when an executive asks why gross margin dropped last month.",
    investorMoat: "Solves the biggest frustration with legacy BI: dashboards show what happened, Decyra's agent explains why it happened.",
    samplePrompt: "Investigate why gross margin compressed 4.2% across North American distributors."
  },
  {
    id: "proactive-copilot",
    name: "Schema-Aware Proactive Copilot",
    category: "Contextual Guidance",
    status: "FUTURE IMPLEMENTATION",
    statusColor: "text-amber-700",
    statusBg: "bg-amber-50",
    statusBorder: "border-amber-200",
    icon: Sparkles,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    headline: "Autonomous Query Formulation & Schema Exploration Assistant",
    description:
      "An intelligent in-app companion that scans connected data lakes and schemas to automatically generate high-value operational questions, suggest joins, and guide new operators through complex data landscapes.",
    useCase: "Helps new business users immediately extract value from a connected 200-table database without needing to ask the data engineering team for help.",
    investorMoat: "Reduces customer onboarding time from weeks to minutes, driving explosive self-serve product adoption.",
    samplePrompt: "Discovered 14 revenue tables. Suggested prompt: 'Track ARR cohorts by initial sign-up month'."
  },
  {
    id: "sonictra-voice",
    name: "Sonictra™ Conversational Voice Agent",
    category: "Multi-Modal Intelligence",
    status: "LIVE",
    statusColor: "text-emerald-700",
    statusBg: "bg-emerald-50",
    statusBorder: "border-emerald-200",
    icon: Mic,
    iconColor: "text-[#1E2761]",
    iconBg: "bg-[#E8EDF7]",
    headline: "Hands-Free Voice Querying & Synthesis in 12+ Global Languages",
    description:
      "Allows busy executives on the go to speak naturally into their phone or laptop. The agent transcribes, grounds SQL, queries the data, and speaks back plain-English insights in English, Arabic, Spanish, French, Japanese, and more.",
    useCase: "Field sales directors and traveling executives get instant revenue figures between meetings without typing complex prompts.",
    investorMoat: "Proprietary multi-lingual conversational interface unlocks global enterprise RevOps contracts across EMEA, APAC, and LATAM.",
    samplePrompt: "'كم بلغت إيرادات الربع الثالث مقارنة بالهدف؟' -> Delivered instant spoken and visual answer."
  }
];

export default function AgenticAiSection() {
  const [selectedAgent, setSelectedAgent] = useState<AgentItem>(agentsList[0]);

  return (
    <section
      id="agentic-ai"
      className="bg-white py-24 max-[640px]:py-16 border-t border-[#E5E9F2] relative overflow-hidden"
      aria-labelledby="agentic-heading"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-50/50 via-rose-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <SectionLabel>Autonomous Intelligence</SectionLabel>
          <h2
            id="agentic-heading"
            className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Decyra Agentic AI Suite
          </h2>
          <p className="text-[18px] max-[640px]:text-[16px] text-[#5A6478] max-w-[760px] mx-auto leading-relaxed">
            Beyond passive chatbots. Decyra deploys specialized, autonomous AI agents that plan,
            self-correct SQL, investigate metric root causes, and protect data privacy with zero human babysitting.
          </p>
        </div>

        {/* Interactive Agent Grid & Detail Panel */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left: Agent Selection Cards */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">
            {agentsList.map((agent) => {
              const Icon = agent.icon;
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-white border-[#1E2761] shadow-[0_4px_20px_rgba(30,39,97,0.08)] ring-1 ring-[#1E2761]"
                      : "bg-[#FAFBFC] border-[#E5E9F2] hover:bg-white hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#1E2761] text-white" : `${agent.iconBg} ${agent.iconColor}`
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#1E2761] text-[14px] truncate">
                          {agent.name}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-[#5A6478] truncate">
                        {agent.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${agent.statusBg} ${agent.statusColor} ${agent.statusBorder}`}
                    >
                      {agent.status}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-200 ${
                        isSelected
                          ? "text-[#1E2761] translate-x-0.5"
                          : "text-[#B0B8CC] group-hover:text-[#5A6478]"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Showcase of Selected Agent */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-[#E5E9F2] rounded-2xl p-8 max-[640px]:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#E5E9F2]">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedAgent.iconBg} ${selectedAgent.iconColor}`}>
                  <selectedAgent.icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3
                      className="text-2xl font-bold text-[#1E2761]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {selectedAgent.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-[#5A6478] uppercase tracking-wider">
                    {selectedAgent.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5A6478]">Development Status:</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${selectedAgent.statusBg} ${selectedAgent.statusColor} ${selectedAgent.statusBorder}`}
                >
                  {selectedAgent.status}
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="py-6 space-y-4">
              <h4 className="text-lg font-bold text-[#1E2761] leading-snug">
                {selectedAgent.headline}
              </h4>
              <p className="text-[15px] text-[#5A6478] leading-relaxed">
                {selectedAgent.description}
              </p>
            </div>

            {/* Use Case & Investor Moat Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-6">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E2761] uppercase tracking-wider mb-2">
                  <Zap size={14} className="text-[#F96167]" />
                  <span>Primary Business Value</span>
                </div>
                <p className="text-[13px] text-[#5A6478] leading-relaxed">
                  {selectedAgent.useCase}
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E2761] uppercase tracking-wider mb-2">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Enterprise &amp; Investor Moat</span>
                </div>
                <p className="text-[13px] text-[#5A6478] leading-relaxed">
                  {selectedAgent.investorMoat}
                </p>
              </div>
            </div>

            {/* Simulated Live Agent Stream */}
            <div className="bg-[#1A1F36] border border-[#2B3577] rounded-xl p-4 text-white">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A0ABC0] pb-2 mb-3 border-b border-[#2B3577]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">Decyra Autonomous Reasoning Stream</span>
                </div>
                <span className="text-[10px] text-[#A0ABC0]">Groq LPU Engine</span>
              </div>
              <div className="font-mono text-xs text-[#E2E8F0] leading-relaxed flex items-start gap-2">
                <Terminal size={14} className="text-[#F96167] shrink-0 mt-0.5" />
                <span>{selectedAgent.samplePrompt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner for Enterprise & Investors */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#1E2761] to-[#151b43] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Interested in deploying Decyra's Autonomous Agents for your enterprise?
            </h3>
            <p className="text-sm text-slate-300 max-w-[620px]">
              Join the private preview for our Autonomous AI Analyst, Sentinel digests, and self-healing SQL clusters.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 bg-[#F96167] hover:bg-[#e8535a] text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Request Private Beta Access</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
