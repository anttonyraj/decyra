import React from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import SectionLabel from "@/components/landing/SectionLabel";
import {
  ShieldCheck,
  Wrench,
  BrainCircuit,
  SearchCheck,
  Sparkles,
  Mic,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Terminal,
  ServerOff,
  Cpu,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  FileCode,
  Layers,
  Activity,
  Globe,
  Database
} from "lucide-react";

export const metadata = {
  title: "The Decyra Agentic AI Suite | Autonomous Enterprise Data Fabric",
  description: "Explore the six autonomous agents and security protocols powering Decyra. In-memory privacy, self-healing SQL, 24/7 revenue watchdog, and root-cause analysis.",
};

const suiteRoster = [
  {
    id: "vault",
    badge: "LIVE",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    title: "Decyra Vault™",
    tagline: "Zero-Egress In-Memory Privacy Architecture",
    category: "Security & Confidentiality Protocol",
    howItWorks:
      "Unlike traditional cloud analytics platforms that ingest, replicate, and persist your database rows on external servers, Decyra Vault executes all schema discovery, SQL planning, and vector querying strictly inside temporary client-side browser RAM or in-place directly on your cloud lakehouse via HTTP range requests. When the browser tab or query session finishes, the memory is wiped clean. Zero customer records ever touch Decyra disks.",
    architectureSteps: [
      "Client browser initiates encrypted TLS 1.3 session directly with data source.",
      "Only structural table metadata (column names, data types, row counts) is inspected.",
      "ANSI SQL query runs in client-side WebAssembly RAM or directly in-place in Cloud Storage.",
      "Results are rendered directly to memory; zero raw data is persisted or logged."
    ],
    customerValue: "Overcomes strict enterprise procurement barriers. Data protection officers, CISOs, and legal teams approve Decyra without fear of data leakage.",
    investorMoat: "Instant compliance certification (SOC2 Type II, HIPAA, GDPR-ready) with zero server-side storage infrastructure liability.",
    terminalOutput: "DECYRA_VAULT::SESSION_INIT -> Memory Buffer Allocated: 64MB [Isolated RAM]\nDECYRA_VAULT::EGRESS_CHECK -> Remote storage: BLOCKED | Raw disk write: DISABLED\nDECYRA_VAULT::STATUS -> 100% Client-Side In-Memory Execution Confirmed ✓"
  },
  {
    id: "auto-healing-sql",
    badge: "IN PROGRESS",
    badgeColor: "bg-[#EBF3FE] text-[#1E2761] border-[#C7D7F7]",
    icon: Wrench,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
    title: "Auto-Healing SQL",
    tagline: "Real-Time Query Error Correction & Self-Reflection",
    category: "Reliability & Execution Engine",
    howItWorks:
      "Enterprise databases are messy. Columns get renamed (e.g. 'mrr_usd' vs 'monthly_recurring_revenue'), date formats differ, and SQL dialects clash between PostgreSQL, Snowflake, and BigQuery. When an execution engine throws a syntax or column error, the Auto-Healing SQL agent catches the error trace, feeds the engine diagnostic into a reflection loop, corrects the query structure, and re-executes in under 30 milliseconds before returning the answer to the user.",
    architectureSteps: [
      "Planner Agent generates candidate ANSI SQL from natural language prompt.",
      "Engine dry-run executes query; traps dialect or syntax mismatch (e.g. column missing).",
      "Reflection Agent parses stack trace, cross-references schema dictionary, and resolves alias.",
      "Corrected SQL executes successfully with complete audit trail preserved."
    ],
    customerValue: "Eliminates frustrating 'Query Failed' red error banners. Non-technical operators and executives get reliable answers on the first try without relying on data engineers.",
    investorMoat: "Boosts prompt-to-answer completion rate from the industry average of 74% to >98%, cementing high net-revenue retention.",
    terminalOutput: "ERROR 42703: column \"client_name\" does not exist in table \"accounts\"\nAUTO_HEAL::AGENT_TRIGGERED -> Reflection loop parsing schema graph...\nAUTO_HEAL::MAPPING_RESOLVED -> Substitute column: \"account_title\"\nAUTO_HEAL::RE_EXECUTE -> Success in 24ms. 1,420 rows returned ✓"
  },
  {
    id: "sentinel",
    badge: "IN PROGRESS",
    badgeColor: "bg-[#EBF3FE] text-[#1E2761] border-[#C7D7F7]",
    icon: BrainCircuit,
    iconColor: "text-[#F96167]",
    iconBg: "bg-[#FDE2E3]",
    title: "Sentinel™",
    tagline: "24/7 Autonomous Revenue Watchdog",
    category: "Autonomous Operations & Alerting",
    howItWorks:
      "Sentinel doesn't wait for humans to ask questions. Operating on scheduled cron intervals or real-time event webhooks, Sentinel calculates 7-day and 30-day statistical baselines, detects metric anomalies (e.g. >2.5 standard deviations in churn or signups), runs diagnostic sub-queries to isolate the cause, and dispatches proactive executive briefs to leadership via Email and Slack at 7:30 AM before daily standups.",
    architectureSteps: [
      "Scheduled trigger initiates automated metrics scan against live connected sources.",
      "Statistical engine compares rolling trendlines vs. expected seasonality.",
      "Anomaly Detection: Flags significant shifts in ARR, renewal rate, or pipeline velocity.",
      "Autonomous Synthesis: Drafts concise executive email with root-cause context and recommendations."
    ],
    customerValue: "Transforms executive leadership from reactive fire-fighting to proactive intervention. Catches a $100K churn risk days before the quarter ends.",
    investorMoat: "Creates continuous daily active engagement. Executives receive direct enterprise value in their inbox every morning even when they don't log in.",
    terminalOutput: "SENTINEL::SCHEDULED_RUN -> 07:30:00 UTC [Automated Wakeup]\nSENTINEL::METRIC_ANOMALY -> North America Enterprise Renewals: -28.4% WoW\nSENTINEL::INVESTIGATION -> 2 accounts stalled in legal redlines: Acme Corp, Nexus Inc.\nSENTINEL::DISPATCH -> Executive Briefing emailed to leadership team ✓"
  },
  {
    id: "deepcausal",
    badge: "IN PROGRESS",
    badgeColor: "bg-[#EBF3FE] text-[#1E2761] border-[#C7D7F7]",
    icon: SearchCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "DeepCausal™",
    tagline: "Multi-Hypothesis Root-Cause Investigator",
    category: "Deep Analytical Reasoning",
    howItWorks:
      "Traditional dashboards tell you *what* happened, but leave you guessing *why* it happened. When an operator asks 'Why did gross margin drop last month?', DeepCausal autonomously spins up 3 parallel hypothesis sub-queries: segmenting by product SKU, inspecting supplier price increases, and analyzing sales discount trends. It correlates the variance across all three dimensions to deliver an undeniable root-cause answer in plain English.",
    architectureSteps: [
      "Detects analytical investigatory intent ('Why', 'Cause', 'Driver', 'Spike', 'Drop').",
      "Generates 3 parallel analytical hypotheses across distinct dimensions.",
      "Executes sub-queries concurrently across in-memory data tables.",
      "Variance correlation engine isolates primary driver and quantifies its contribution."
    ],
    customerValue: "Replaces 3 days of back-and-forth ticket requests to the data team with a 3-second definitive answer.",
    investorMoat: "Solves the core deficiency of legacy business intelligence (Tableau, PowerBI), creating an unassailable enterprise product moat.",
    terminalOutput: "USER_PROMPT -> \"Why did net expansion drop in Q3?\"\nDEEPCAUSAL::HYPOTHESIS_1 [Cohort Churn] -> Flat (0.2% variance)\nDEEPCAUSAL::HYPOTHESIS_2 [Tier Downgrades] -> Spike in Tier-2 to Tier-1 (-18% variance)\nDEEPCAUSAL::SYNTHESIS -> Primary driver: Mid-market seat contraction post-merger."
  },
  {
    id: "schemapilot",
    badge: "FUTURE IMPLEMENTATION",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Sparkles,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "SchemaPilot™",
    tagline: "Proactive Contextual Discovery Agent",
    category: "Self-Serve Operator Guidance",
    howItWorks:
      "When users connect a new 300-table Snowflake warehouse or a complex ERP database, they rarely know where to begin. SchemaPilot analyzes table relationships, primary/foreign keys, and data densities to construct an interactive topological map. It then auto-generates high-value operational business questions tailored specifically to the company's business model.",
    architectureSteps: [
      "Inspects database schema topology and infers business entity relationships.",
      "Identifies key metric tables (Orders, Customers, Invoices, Subscriptions, Churn).",
      "Formulates curated, high-impact business questions tailored to the industry.",
      "Guides operators through 1-click exploratory queries with suggested follow-ups."
    ],
    customerValue: "Enables non-technical users to generate value from enterprise data immediately without requiring documentation or training sessions.",
    investorMoat: "Slashes enterprise time-to-value (TTV) from 45 days to under 5 minutes, unlocking rapid viral expansion within client organizations.",
    terminalOutput: "SCHEMAPILOT::TOPOLOGY_SCAN -> 184 tables detected across 4 schemas\nSCHEMAPILOT::IDENTIFIED_DOMAINS -> Billing (Stripe), Sales (PostgreSQL), CRM (Salesforce)\nSCHEMAPILOT::RECOMMENDED_PROMPT -> \"Track customer cohort LTV by acquisition channel\""
  },
  {
    id: "sonictra",
    badge: "LIVE",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Mic,
    iconColor: "text-[#1E2761]",
    iconBg: "bg-[#E8EDF7]",
    title: "Sonictra™",
    tagline: "Multi-Modal Conversational Voice Agent",
    category: "Multi-Modal Voice & Synthesis",
    howItWorks:
      "Sonictra enables operators to interact with complex enterprise data completely hands-free. Using proprietary real-time streaming audio transcription and multilingual intent parsing, executives can speak naturally in English, Arabic, Spanish, French, Japanese, or German. Sonictra transcribes the audio, grounds the SQL logic, queries the database, and speaks the plain-English insight back out loud in real time.",
    architectureSteps: [
      "Browser audio streaming captures voice query in high-fidelity Opus format.",
      "Real-time multilingual transcription engine parses operational intent.",
      "Groq LPU reasoning model generates schema-grounded ANSI SQL query.",
      "Answer is rendered visually in data tables and synthesized into natural spoken voice."
    ],
    customerValue: "Designed for traveling executives, field sales leaders, and operators who need immediate answers between meetings or while commuting.",
    investorMoat: "Enterprise-grade multilingual support (including RTL Arabic) unlocks major global contracts in the Middle East, Europe, and Asia-Pacific.",
    terminalOutput: "SONICTRA::AUDIO_INPUT -> Stream received (Arabic: 'ما هي أعلى الصفقات المبرمة هذا الشهر؟')\nSONICTRA::TRANSCRIBE_INTENT -> \"What are the top closed deals this month?\"\nSONICTRA::QUERY_EXEC -> Found 4 deals totaling $620,000\nSONICTRA::VOICE_SYNTHESIS -> Audio output streaming completed in 420ms ✓"
  }
];

export default function AgenticAiSuitePage() {
  return (
    <>
      <NavBar />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-24 pb-16 border-b border-[#E5E9F2]">
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#1E2761]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#F96167]/5 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 relative z-10">
            <div className="text-center max-w-[860px] mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1E2761] text-white mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#F96167] animate-pulse" />
                Decyra Autonomous Architecture • 2026 Core
              </div>

              <h1
                className="text-[52px] max-[1024px]:text-[42px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.12] mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                THE DECYRA AGENTIC AI SUITE
              </h1>

              <p className="text-[20px] max-[640px]:text-[16px] text-[#5A6478] leading-relaxed max-w-[760px] mx-auto mb-10">
                Six specialized autonomous agents and security protocols powering your enterprise data fabric.
                Moving enterprise intelligence beyond passive prompt-response chatbots into self-healing, root-cause investigation, and zero-egress data privacy.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#roster"
                  className="bg-[#F96167] text-white font-semibold rounded-lg px-7 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4" /> Explore the 6 Agents
                </a>
                <Link
                  href="/contact"
                  className="border border-[#1E2761] text-[#1E2761] font-semibold rounded-lg px-7 py-3.5 text-sm hover:bg-[#E8EDF7]/50 transition-all"
                >
                  Request Enterprise Architecture Briefing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* High-Level Overview Grid */}
        <section className="py-16 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#E5E9F2] p-6 rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="font-bold text-lg text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Zero Data Egress
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed">
                  Confidential customer records and financial ledgers never touch Decyra servers. All computation happens in temporary client RAM or in-place on your cloud storage.
                </p>
              </div>

              <div className="bg-white border border-[#E5E9F2] p-6 rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Wrench size={20} />
                </div>
                <h3 className="font-bold text-lg text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Autonomous Self-Healing
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed">
                  Eliminates the #1 flaw of AI analytics: broken SQL queries. The reflection loop catches database engine errors, corrects syntax in 25ms, and delivers perfect answers.
                </p>
              </div>

              <div className="bg-white border border-[#E5E9F2] p-6 rounded-xl shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#F96167] flex items-center justify-center mb-4">
                  <BrainCircuit size={20} />
                </div>
                <h3 className="font-bold text-lg text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Autonomous Anomaly Watchdog
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed">
                  Sentinel proactively scans live metrics at 7:30 AM before executive standups, detects trend breaks, and emails leadership root-cause explanations without human prompts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Suite Roster */}
        <section id="roster" className="py-24 max-[640px]:py-16">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <SectionLabel>Architecture Deep-Dive</SectionLabel>
              <h2
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The 6 Autonomous Agents & Protocols
              </h2>
              <p className="text-[17px] text-[#5A6478] max-w-[680px] mx-auto leading-relaxed">
                Detailed breakdown of operational logic, execution traces, enterprise business value, and technical defensibility.
              </p>
            </div>

            {/* Agent Cards Stack */}
            <div className="space-y-12">
              {suiteRoster.map((agent, index) => {
                const Icon = agent.icon;
                return (
                  <div
                    key={agent.id}
                    id={agent.id}
                    className="bg-white border border-[#E5E9F2] rounded-2xl p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] scroll-mt-24"
                  >
                    {/* Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E9F2]">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${agent.iconBg} ${agent.iconColor}`}>
                          <Icon size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#5A6478]">0{index + 1}</span>
                            <h3
                              className="text-2xl lg:text-3xl font-bold text-[#1E2761]"
                              style={{ fontFamily: "Georgia, serif" }}
                            >
                              {agent.title}
                            </h3>
                          </div>
                          <p className="text-sm font-semibold text-[#F96167] mt-0.5">
                            {agent.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#5A6478]">{agent.category}</span>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${agent.badgeColor}`}>
                          {agent.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-12 gap-8 pt-8 items-start">
                      {/* Left: How it works & Steps */}
                      <div className="col-span-12 lg:col-span-7 space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-[#1E2761] uppercase tracking-wider mb-2">
                            How It Operates in Decyra
                          </h4>
                          <p className="text-[15px] text-[#5A6478] leading-relaxed">
                            {agent.howItWorks}
                          </p>
                        </div>

                        {/* Step By Step Architecture */}
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
                          <h5 className="text-xs font-bold text-[#1E2761] uppercase tracking-wider mb-3">
                            Execution Protocol Steps
                          </h5>
                          <ul className="space-y-2.5">
                            {agent.architectureSteps.map((step, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-3 text-xs text-[#5A6478]">
                                <span className="w-5 h-5 rounded-full bg-white border border-[#CBD5E1] text-[#1E2761] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Business Value & Investor Moat */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1E2761] uppercase tracking-wider mb-1.5">
                              <Zap size={14} className="text-[#F96167]" />
                              <span>Business Impact</span>
                            </div>
                            <p className="text-xs text-[#5A6478] leading-relaxed">
                              {agent.customerValue}
                            </p>
                          </div>

                          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#1E2761] uppercase tracking-wider mb-1.5">
                              <ShieldCheck size={14} className="text-emerald-600" />
                              <span>Defensible Moat</span>
                            </div>
                            <p className="text-xs text-[#5A6478] leading-relaxed">
                              {agent.investorMoat}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Terminal Execution Trace */}
                      <div className="col-span-12 lg:col-span-5 bg-[#1A1F36] border border-[#2B3577] rounded-xl p-5 text-white flex flex-col justify-between shadow-lg">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#A0ABC0] pb-2 mb-3 border-b border-[#2B3577]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-bold text-white">Agent Execution Stream</span>
                            </div>
                            <span className="text-[10px] text-[#A0ABC0]">Groq LPU Runtime</span>
                          </div>

                          <pre className="font-mono text-xs text-[#E2E8F0] whitespace-pre-wrap leading-relaxed">
                            {agent.terminalOutput}
                          </pre>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#2B3577] flex items-center justify-between text-[11px] text-[#A0ABC0]">
                          <span>Autonomous State: Active</span>
                          <span className="text-emerald-400 font-mono">Status 200 OK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison: Chatbots vs Agentic AI */}
        <section className="py-20 bg-[#FAFBFC] border-t border-[#E5E9F2]">
          <div className="max-w-[1080px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-12">
              <SectionLabel>Category Comparison</SectionLabel>
              <h2
                className="text-3xl font-bold text-[#1E2761]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Why Legacy Chatbot Wrappers Fail in Enterprise Analytics
              </h2>
            </div>

            <div className="overflow-x-auto border border-[#E5E9F2] rounded-2xl bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E9F2] bg-[#F4F6FB] text-xs font-bold text-[#1E2761] uppercase tracking-wider">
                    <th className="p-4">Capability</th>
                    <th className="p-4 text-[#5A6478]">Traditional Chatbots</th>
                    <th className="p-4 text-[#1E2761] bg-indigo-50/50">The Decyra Agentic AI Suite</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9F2] text-xs text-[#5A6478]">
                  <tr>
                    <td className="p-4 font-bold text-[#1E2761]">Error Handling</td>
                    <td className="p-4 text-rose-600">Crashes with SQL syntax error; forces user to debug.</td>
                    <td className="p-4 font-semibold text-emerald-700 bg-indigo-50/50">Auto-Healing SQL traps errors, reflects on engine trace, and auto-corrects in 25ms.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#1E2761]">Data Privacy</td>
                    <td className="p-4 text-rose-600">Uploads database rows to third-party cloud servers.</td>
                    <td className="p-4 font-semibold text-emerald-700 bg-indigo-50/50">Decyra Vault guarantees 100% in-browser RAM execution; zero customer records stored.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#1E2761]">Explaining 'Why'</td>
                    <td className="p-4 text-rose-600">Returns single flat number; requires 5 manual follow-up questions.</td>
                    <td className="p-4 font-semibold text-emerald-700 bg-indigo-50/50">DeepCausal runs 3 parallel sub-queries to isolate the exact cohort/product driver.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-[#1E2761]">Proactivity</td>
                    <td className="p-4 text-rose-600">Passive: Does nothing until human types a prompt.</td>
                    <td className="p-4 font-semibold text-emerald-700 bg-indigo-50/50">Sentinel proactively evaluates 30-day baselines at 7:30 AM and emails morning briefs.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enterprise Call to Action */}
        <section className="py-20 bg-gradient-to-r from-[#1E2761] to-[#151b43] text-white">
          <div className="max-w-[860px] mx-auto px-8 text-center space-y-6">
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Deploy Decyra's Autonomous Agents Across Your Data Stack
            </h2>
            <p className="text-base text-slate-300 max-w-[640px] mx-auto leading-relaxed">
              Experience the power of Zero-Egress Vault privacy, Auto-Healing SQL, and 24/7 Sentinel anomaly alerts with your real data.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="bg-[#F96167] text-white font-semibold rounded-lg px-8 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-md"
              >
                Try Decyra Free in Browser →
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 hover:border-white text-white font-semibold rounded-lg px-8 py-3.5 text-sm transition-all"
              >
                Book an Enterprise Technical Briefing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
