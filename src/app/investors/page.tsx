import React from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import InvestorThesisGraphic from "@/components/landing/InvestorThesisGraphic";
import { 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  Layers, 
  DollarSign, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Lock,
  Cpu,
  BarChart3,
  Globe2,
  Languages,
  Server,
  Zap,
  Target,
  Rocket,
  Check,
  X,
  PieChart,
  Scale,
  Workflow
} from "lucide-react";

export const metadata = {
  title: "Investor Overview & Due Diligence Memo | Decyra",
  description: "The 30-Second Pitch, $80B Market Opportunity, Valuation Benchmarks, Venture Q&A Teardown, and Global & MENA Expansion perspectives behind Decyra.",
};

export default function InvestorsPage() {
  return (
    <>
      <NavBar />

      <main className="bg-white">
        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-24 pb-16 border-b border-[#E5E9F2]">
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#1E2761]/6 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#F96167]/6 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1E2761] text-white mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F96167] animate-pulse" />
              Decyra Investor Overview &amp; Executive Memo
            </div>

            <h1
              className="text-[52px] max-[1024px]:text-[42px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.14] mb-6 max-w-[980px] mx-auto"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The Zero-ETL Data Intelligence Platform for Modern Enterprises
            </h1>

            {/* 30-Second Elevator Pitch Callout */}
            <div className="max-w-[840px] mx-auto bg-white border-2 border-[#1E2761]/15 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#F96167] mb-1">
                The 30-Second Elevator Pitch
              </div>
              <p className="text-[20px] max-[640px]:text-[16px] text-[#1E2761] font-semibold leading-snug">
                Decyra is the conversational AI layer that replaces $200,000/year ETL pipelines for business operators — joining PostgreSQL, Snowflake, BigQuery, and spreadsheets on the fly in-memory in milliseconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Link
                href="/contact"
                className="bg-[#F96167] text-white font-semibold rounded-lg px-8 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Request Deck &amp; Data Room
              </Link>
              <Link
                href="/golden-layer"
                className="border border-[#1E2761] text-[#1E2761] font-semibold rounded-lg px-7 py-3.5 text-sm bg-white hover:bg-[#F4F8FE] transition-all flex items-center gap-2"
              >
                Explore Virtual Golden Layer →
              </Link>
            </div>

            {/* Interactive Concept Animation Graphic */}
            <div className="max-w-[1100px] mx-auto">
              <InvestorThesisGraphic />
            </div>
          </div>
        </section>

        {/* ── WHY INVEST NOW? (THE 3 MACRO INFLECTION POINTS) ── */}
        <section className="py-16 bg-white border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Strategic Inflection</span>
              <h2
                className="text-[34px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Why Invest in Decyra Now?
              </h2>
              <p className="text-sm text-[#5A6478] max-w-[680px] mx-auto">
                Three massive technological and market shifts have collided to create an urgent window for a unified, conversational data layer.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1E2761] mb-2 font-serif">
                  1. &quot;Consolidation Fatigue&quot; in Data
                </h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Companies spent the last 5 years buying Fivetran, dbt, Snowflake, and Looker. Despite spending $250k+/year, business operators still submit tickets to data engineers to answer simple revenue questions. Centralizing everything into one warehouse has failed.
                </p>
              </div>

              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#FDE2E3] flex items-center justify-center text-[#F96167] mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1E2761] mb-2 font-serif">
                  2. Vectorized In-Memory Breakthroughs
                </h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Technologies like DuckDB and Apache Arrow now allow in-memory columnar joins across millions of records in 15 milliseconds on a lightweight serverless CPU. We can join disparate databases without needing a massive physical data lake.
                </p>
              </div>

              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#F96167]" />
                </div>
                <h3 className="text-base font-bold text-[#1E2761] mb-2 font-serif">
                  3. Deterministic AI Reasoning
                </h3>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Raw generative chat hallucinates column names. By binding LLMs to deterministic Abstract Syntax Tree (AST) compilers and schema graphs, Decyra produces 100% auditable, read-only SQL queries with zero hallucination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE $80B MARKET OPPORTUNITY & VALUATION BENCHMARKS ── */}
        <section className="py-16 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Market Dynamics &amp; Valuation</span>
              <h2
                className="text-[34px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The $80B Market Opportunity &amp; Cap Potential
              </h2>
              <p className="text-sm text-[#5A6478] max-w-[680px] mx-auto">
                Decyra captures market share across three massive converging software segments: Business Intelligence, Data Pipelines (ETL), and Enterprise AI.
              </p>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Addressable Market (TAM)", value: "$80B+", sub: "BI ($33B), ETL ($19B) & AI ($28B)" },
                { label: "Serviceable Market (SAM)", value: "$24B", sub: "Enterprises with 2+ database silos" },
                { label: "Serviceable Obtainable (SOM)", value: "$1.2B", sub: "Initial 15,000 mid-market companies" },
                { label: "Gross Margin Profile", value: "> 85%", sub: "Vectorized in-memory edge compute" },
              ].map((metric) => (
                <div key={metric.label} className="bg-white p-6 rounded-2xl border border-[#E5E9F2] shadow-xs">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1E2761] mb-1 font-mono">{metric.value}</div>
                  <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-0.5">{metric.label}</div>
                  <div className="text-xs text-[#5A6478]">{metric.sub}</div>
                </div>
              ))}
            </div>

            {/* Precedent Valuation Benchmarks Table */}
            <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 shadow-xs mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1E2761] font-serif">
                    Precedent Public &amp; M&amp;A Valuation Benchmarks
                  </h3>
                  <p className="text-xs text-[#5A6478]">
                    Data infrastructure businesses command top-tier SaaS multiples (15x - 35x ARR) due to mission-critical stickiness and zero churn.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3FE] text-[#1E2761] self-start sm:self-auto">
                  <Scale className="w-3.5 h-3.5 text-[#F96167]" />
                  Decacorn Category Potential
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#5A6478]">
                  <thead className="bg-[#FAFBFC] text-[#1E2761] font-bold uppercase tracking-wider border-b border-[#E5E9F2]">
                    <tr>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Valuation / Market Cap</th>
                      <th className="py-3 px-4">Limitation Decyra Solves</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E9F2]">
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1E2761]">Snowflake (NYSE: SNOW)</td>
                      <td className="py-3.5 px-4">Cloud Data Warehouse</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2761]">$50B+ Market Cap</td>
                      <td className="py-3.5 px-4">Only supports internal data; requires expensive ingestion fees.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1E2761]">Databricks</td>
                      <td className="py-3.5 px-4">Data Lakehouse &amp; AI</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2761]">$43B Valuation</td>
                      <td className="py-3.5 px-4">Complex, developer-first tooling; inaccessible to non-technical operators.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1E2761]">Tableau (Acquired by Salesforce)</td>
                      <td className="py-3.5 px-4">Legacy BI &amp; Dashboards</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2761]">$15.7B Acquisition</td>
                      <td className="py-3.5 px-4">Static reports, rigid schemas, requires dedicated BI teams.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1E2761]">Fivetran</td>
                      <td className="py-3.5 px-4">Automated Data Pipelines</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2761]">$5.6B Valuation</td>
                      <td className="py-3.5 px-4">Forces physical data replication; expensive row-based sync fees.</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold text-[#1E2761]">Looker (Acquired by Google)</td>
                      <td className="py-3.5 px-4">Semantic BI Modeling</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#1E2761]">$2.6B Acquisition</td>
                      <td className="py-3.5 px-4">High code maintenance (LookML), slow to adapt to changing queries.</td>
                    </tr>
                    <tr className="bg-[#F4F8FE]/80 font-semibold text-[#1E2761]">
                      <td className="py-3.5 px-4 flex items-center gap-1.5 font-bold text-[#1E2761]">
                        <span className="w-2 h-2 rounded-full bg-[#F96167]" /> Decyra
                      </td>
                      <td className="py-3.5 px-4">Conversational Zero-ETL Fabric</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F96167]">$15B+ Long-Term Target</td>
                      <td className="py-3.5 px-4 font-normal text-[#1E2761]">
                        Zero ETL pipelines, cross-database in-memory joins, conversational natural language for all business operators.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── GROWTH FLYWHEEL & ROADMAP TO $100M ARR ── */}
        <section className="py-20 bg-white border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Scale &amp; Velocity</span>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Growth Flywheel &amp; Road to $100M ARR
              </h2>
              <p className="text-base text-[#5A6478] max-w-[700px] mx-auto">
                How Decyra compounds revenue through a low-friction Product-Led Growth (PLG) wedge expanding into six-figure enterprise contracts.
              </p>
            </div>

            {/* 3 Growth Milestones */}
            <div className="grid md:grid-cols-3 gap-8 mb-14">
              <div className="bg-[#FAFBFC] border-2 border-[#E5E9F2] p-8 rounded-2xl relative">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-2">Phase 1: Seed to Series A</div>
                <div className="text-3xl font-bold text-[#1E2761] mb-2 font-mono">$0 → $2.5M ARR</div>
                <div className="text-xs font-semibold text-[#1E2761] mb-4">PLG Self-Serve &amp; Operator Adoption</div>
                <ul className="text-xs text-[#5A6478] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Instant pre-loaded sandbox &amp; drag-and-drop CSV uploads.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Self-serve Postgres connection tier ($49 - $199/mo).
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Viral intra-company sharing of live chart snapshots &amp; dashboards.
                  </li>
                </ul>
              </div>

              <div className="bg-[#EBF3FE]/50 border-2 border-[#1E2761] p-8 rounded-2xl relative shadow-sm">
                <div className="absolute -top-3 right-6 bg-[#1E2761] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Current Execution Phase
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1E2761] mb-2">Phase 2: Series A to Series B</div>
                <div className="text-3xl font-bold text-[#1E2761] mb-2 font-mono">$2.5M → $15M ARR</div>
                <div className="text-xs font-semibold text-[#1E2761] mb-4">Virtual Golden Layer Expansion</div>
                <ul className="text-xs text-[#5A6478] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Cross-database joins across Snowflake, Postgres &amp; BigQuery ($999/mo).
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Expansion from business operators to centralized data leadership (CDO / VP of Data).
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Net Revenue Retention (NRR) target &gt;130% via seat expansion and database add-ons.
                  </li>
                </ul>
              </div>

              <div className="bg-[#FAFBFC] border-2 border-[#E5E9F2] p-8 rounded-2xl relative">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-2">Phase 3: Growth to IPO</div>
                <div className="text-3xl font-bold text-[#1E2761] mb-2 font-mono">$15M → $100M+ ARR</div>
                <div className="text-xs font-semibold text-[#1E2761] mb-4">Global Enterprise &amp; Sovereign Cloud</div>
                <ul className="text-xs text-[#5A6478] space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    In-region sovereign clouds: AWS UAE, Oracle Cloud Saudi Arabia, Azure EU.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Air-gapped on-premise Kubernetes deployments for banking &amp; defense ($50k-$150k ACV).
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    Defensible cross-database knowledge graphs establishing sticky vendor lock-in.
                  </li>
                </ul>
              </div>
            </div>

            {/* SaaS Metrics Highlights */}
            <div className="bg-[#1E2761] text-white rounded-2xl p-8 sm:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold font-mono text-[#F96167] mb-1">&gt; 130%</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-[#BAC5DE]">Target NRR</div>
                  <div className="text-[11px] text-[#BAC5DE]/80 mt-1">Multi-DB connector expansions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">&lt; 5 Mos</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-[#BAC5DE]">CAC Payback</div>
                  <div className="text-[11px] text-[#BAC5DE]/80 mt-1">Driven by low-touch PLG signup</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono text-[#F96167] mb-1">&gt; 5.5x</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-[#BAC5DE]">LTV / CAC</div>
                  <div className="text-[11px] text-[#BAC5DE]/80 mt-1">High retention &amp; low churn</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono text-white mb-1">&gt; 85%</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-[#BAC5DE]">Gross Margins</div>
                  <div className="text-[11px] text-[#BAC5DE]/80 mt-1">Software-only edge compute</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPETITIVE BATTLECARD MATRIX ── */}
        <section className="py-20 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Competitive Advantage</span>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Competitive Matrix: Why Decyra Wins
              </h2>
              <p className="text-base text-[#5A6478] max-w-[700px] mx-auto">
                How Decyra displaces the friction of legacy BI, brittle ETL pipelines, and single-database AI wrappers.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E9F2] shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F8FE] text-[#1E2761] font-bold uppercase tracking-wider border-b border-[#E5E9F2]">
                  <tr>
                    <th className="py-4 px-6">Capability / Metric</th>
                    <th className="py-4 px-6 bg-[#1E2761] text-white">Decyra (Zero-ETL AI)</th>
                    <th className="py-4 px-6">Legacy BI (Tableau/PowerBI)</th>
                    <th className="py-4 px-6">ETL Pipelines (Fivetran/dbt)</th>
                    <th className="py-4 px-6">Generic AI (ChatGPT/Text2SQL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E9F2] text-[#5A6478]">
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#1E2761]">Interface</td>
                    <td className="py-4 px-6 font-semibold text-[#1E2761] bg-[#EBF3FE]/40">Natural Language Conversational</td>
                    <td className="py-4 px-6">Complex Drag-and-Drop Builders</td>
                    <td className="py-4 px-6">No UI (Code/YAML pipelines)</td>
                    <td className="py-4 px-6">Unstructured chat text</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#1E2761]">Cross-Database Joins</td>
                    <td className="py-4 px-6 font-semibold text-emerald-700 bg-[#EBF3FE]/40 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> In-Memory Vectorized (0ms sync)
                    </td>
                    <td className="py-4 px-6 text-amber-700">Requires prior data consolidation</td>
                    <td className="py-4 px-6 text-amber-700">Requires 30-60 min batch syncing</td>
                    <td className="py-4 px-6 text-rose-600 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500" /> Single database only
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#1E2761]">Implementation Cost</td>
                    <td className="py-4 px-6 font-semibold text-emerald-700 bg-[#EBF3FE]/40">
                      $49 - $999/mo (Zero new hires)
                    </td>
                    <td className="py-4 px-6">$50k - $150k/yr + BI specialists</td>
                    <td className="py-4 px-6">$100k - $250k/yr + 2 Data Engineers</td>
                    <td className="py-4 px-6">$20/mo (High engineering build cost)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#1E2761]">Security &amp; Data Residency</td>
                    <td className="py-4 px-6 font-semibold text-emerald-700 bg-[#EBF3FE]/40 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> Zero retention, VPC / Sovereign local
                    </td>
                    <td className="py-4 px-6">Enterprise cloud-dependent</td>
                    <td className="py-4 px-6">Replicates raw rows to multiple clouds</td>
                    <td className="py-4 px-6 text-rose-600 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500" /> Cannot access private VPC DBs
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-[#1E2761]">Auditability &amp; Accuracy</td>
                    <td className="py-4 px-6 font-semibold text-emerald-700 bg-[#EBF3FE]/40 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> 100% ANSI SQL with full lineage
                    </td>
                    <td className="py-4 px-6">High (rigid semantic models)</td>
                    <td className="py-4 px-6">High (pipeline maintenance burden)</td>
                    <td className="py-4 px-6 text-rose-600 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500" /> Frequent hallucinations
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── DUE DILIGENCE TEARDOWN ── */}
        <section className="py-20 bg-white">
          <div className="max-w-[1100px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Due Diligence Teardown</span>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The Core Venture Q&amp;A Teardown
              </h2>
              <p className="text-base text-[#5A6478] max-w-[680px] mx-auto">
                The direct, unvarnished answers to the hardest strategic questions asked by venture partners and institutional investors.
              </p>
            </div>

            <div className="space-y-10">
              {/* Question 1: Why won't OpenAI or ChatGPT just build this? */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">01</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;Why won&apos;t OpenAI or ChatGPT just build this?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    OpenAI is a foundation model provider focused on broad AGI. A generalized chat interface cannot query enterprise operational data for three fundamental structural reasons:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Database Network Isolation</div>
                      <div className="text-xs text-[#5A6478]">
                        ChatGPT cannot securely connect into private enterprise VPCs, maintain connection pooling, or authenticate with fine-grained database roles.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Zero Hallucination via Schema Binding</div>
                      <div className="text-xs text-[#5A6478]">
                        ChatGPT invents column names. Decyra binds queries to actual verified database schemas, primary keys, and foreign keys through our AST compiler.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Read-Only Permission Guardrails</div>
                      <div className="text-xs text-[#5A6478]">
                        Decyra enforces hard AST-level blockers rejecting mutating queries (`DROP`, `DELETE`, `ALTER`) before execution. Enterprise security forbids raw chat queries.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2: Why won't Snowflake kill you? */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">02</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;Why won&apos;t Snowflake kill you?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    <strong>Snowflake only supports Snowflake.</strong> Snowflake&apos;s commercial business model depends on forcing enterprises to ingest all corporate data into their proprietary cloud storage and pay ongoing compute credits.
                  </p>
                  <p>
                    In reality, modern companies have data scattered across PostgreSQL (production app), Stripe (billing), HubSpot (CRM), and Excel (financial models). Snowflake has zero incentive to make it easy to query Postgres or Google BigQuery without moving that data into Snowflake.
                  </p>
                  <p>
                    <strong>Decyra is the Switzerland of enterprise data:</strong> completely cloud-agnostic, database-neutral, and capable of federating queries across any storage provider without holding data hostage.
                  </p>
                </div>
              </div>

              {/* Question 3: What is your moat / defensibility? */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">03</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;What is your moat and technical defensibility?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Our defensibility is built on three deeply coupled layers that cannot be replicated by simple API wrappers:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">1. Pushdown Query Decomposition</div>
                      <div className="text-xs text-[#5A6478]">
                        Decyra translates natural language into sub-queries pushed down natively to Postgres, Snowflake, or BigQuery so only minimal filtered rows are extracted.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">2. In-Memory Vector Execution</div>
                      <div className="text-xs text-[#5A6478]">
                        Extracted Arrow buffers are joined in our local vectorized in-memory DuckDB layer in 10-25ms. No warehouse replication.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">3. Semantic Link Graphs</div>
                      <div className="text-xs text-[#5A6478]">
                        Decyra auto-discovers relationships between tables across disparate databases using vector embeddings, creating an automated cross-database knowledge graph that strengthens with usage.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 4: Go-to-Market & Customer Acquisition Model */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">04</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;What is your go-to-market and customer acquisition model?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    We use a high-velocity <strong>Product-Led Growth (PLG) wedge</strong> that naturally expands into enterprise contract values:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5A6478]">
                    <li>
                      <strong className="text-[#1E2761]">Instant Demo Database &amp; Drag-and-Drop:</strong> A new user can test Decyra on our pre-loaded sandbox database or drop a CSV/Excel file and get visual answers in under 60 seconds without talking to sales.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Self-Serve Database Connection:</strong> Operators plug in a read-only PostgreSQL URI to instantly answer questions about their own production numbers.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Viral Internal Virality:</strong> Generated charts and cohort metrics are shared across Slack and executive meetings, driving teammates to sign up.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Enterprise Multi-DB Upsell:</strong> Once companies need cross-database joins across Snowflake, BigQuery, and custom VPC deployments, they upgrade to our $999+/mo Enterprise tier.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Question 5: Unit Economics & Margins */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">05</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;What are your unit economics and gross margins?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Decyra is a <strong>software-only business with &gt;85% gross margins</strong>:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="text-xs font-bold uppercase text-[#5A6478]">Starter Tier</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$49<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">COGS per user: &lt; $3.50/mo. Gross margin: 92%.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#EBF3FE]/60 border border-[#1E2761]">
                      <div className="text-xs font-bold uppercase text-[#1E2761]">Pro / Team Tier</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$199<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">Cross-DB joins. COGS: &lt; $18/mo. Gross margin: 91%.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="text-xs font-bold uppercase text-[#5A6478]">Enterprise Tier</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$999+<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">VPC deployment, SLA. COGS: &lt; $80/mo. Gross margin: 92%+.</div>
                    </div>
                  </div>
                  <p>
                    <strong>Why COGS are so low:</strong> Decyra doesn&apos;t run heavy model fine-tuning or continuous GPUs. Query planning is executed in micro-tokens (&lt;500 tokens per prompt), and heavy data compute is pushed down to the customer&apos;s existing databases or executed in ephemeral serverless RAM.
                  </p>
                </div>
              </div>

              {/* Question 6: What happens if the AI generates a wrong query? */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">06</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;How do you guarantee accuracy and prevent AI hallucinations?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Unlike consumer LLMs that guess answers, Decyra treats the LLM purely as a semantic parser. The generated SQL is compiled and validated against the actual verified schema before execution:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5A6478]">
                    <li>
                      <strong className="text-[#1E2761]">Deterministic AST Compilation:</strong> Every query is verified for column and table existence. If a table doesn&apos;t exist, it is rejected before touching the database.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Full SQL &amp; Lineage Transparency:</strong> Users can inspect the exact generated SQL query, execution plan, and join logic behind every number with a single click.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Schema Disambiguation Prompts:</strong> When an ambiguous business metric is requested (e.g. &quot;churn rate&quot;), Decyra prompts the user to select their company&apos;s definition or learns from the semantic glossary.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Question 7: Switching Cost & Retention Moat */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">07</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;If you don&apos;t store customer data, what is your switching cost and retention moat?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Data storage is a commodity; <strong>semantic business logic and cross-database lineage are an immovable enterprise moat</strong>. Decyra&apos;s switching costs compound over time in three ways:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">1. The Semantic Metric Dictionary</div>
                      <div className="text-xs text-[#5A6478]">
                        Once RevOps, Finance, and Product define complex composite metrics (e.g., &quot;Enterprise Net Churn&quot; joined across Stripe and Postgres), those business definitions live permanently in Decyra.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">2. Team Workflow &amp; Dashboard Lock-in</div>
                      <div className="text-xs text-[#5A6478]">
                        Every saved board, executive Slack report, and monthly board pack chart references Decyra&apos;s query endpoints. Unplugging Decyra immediately blinds operational leadership.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">3. Cross-Database Semantic Graph</div>
                      <div className="text-xs text-[#5A6478]">
                        Decyra learns foreign key patterns and synonym mappings as users query the system. This trained enterprise graph cannot be exported to a generic competitor.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 8: Production Safety & Crash Prevention */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">08</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;What prevents a business operator from running a query that crashes production databases?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Every database administrator (DBA) fears giving non-technical operators query access. Decyra implements <strong>four military-grade production safeguards</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5A6478]">
                    <li>
                      <strong className="text-[#1E2761]">Automatic Read-Replica Routing:</strong> Decyra connects exclusively to read replicas or follower instances, isolating the primary transactional database from all analytical load.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Pushdown Cost &amp; Partition Estimation:</strong> Before any SQL is dispatched, Decyra inspects the query plan (`EXPLAIN`). If a query triggers an unindexed full-table scan over millions of rows, execution is blocked and partition filters are automatically suggested.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Strict Circuit Breakers &amp; Timeouts:</strong> Hard statement timeouts (default 5,000ms) and automatic row caps prevent runaway queries or locks.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Mandatory Read-Only AST Validation:</strong> Our compiler physically rejects mutating statements (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `ALTER`) before they ever touch the network wire.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Question 9: Schema Drift */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">09</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;How does Decyra handle Schema Drift when engineering alters database tables?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    In fast-moving companies, backend developers rename columns, add new tables, and deprecate fields every week. Decyra solves this with <strong>Autonomous Schema Sync &amp; Vector Re-grounding</strong>:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Continuous Asynchronous DDL Diffing</div>
                      <div className="text-xs text-[#5A6478]">
                        Decyra runs non-blocking periodic schema inspections to capture newly added columns, altered data types, and dropped constraints without performance impact.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Semantic Alias Healing</div>
                      <div className="text-xs text-[#5A6478]">
                        If `user_id` is renamed to `account_uuid`, our vector embeddings recognize semantic equivalence, preserve historical dashboard definitions, and notify workspace admins to approve the alias update.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 10: Build vs Buy / In-House DIY Defense */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">10</span>
                  <h3 className="text-xl font-bold text-[#1E2761] font-serif">
                    &quot;Why can&apos;t an internal enterprise team just build this with DuckDB + LangChain over a weekend?&quot;
                  </h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    A weekend hackathon script connecting an LLM to DuckDB works on a single toy dataset with 100 rows. It dies immediately in an enterprise environment due to <strong>The Enterprise Chasm</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5A6478]">
                    <li>
                      <strong className="text-[#1E2761]">Multi-Dialect SQL Transpilation:</strong> Generating valid pushdown SQL that runs simultaneously across Postgres syntax, Snowflake syntax, and BigQuery syntax with dialect-specific date math and type casting requires years of compiler engineering.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Fine-Grained RBAC &amp; PII Column Masking:</strong> An intern must not see executive compensation columns, even if both work with the `employees` table. Decyra enforces column-level cryptographic masking and role authorization.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Sub-25ms Distributed Pushdown:</strong> Naive DIY scripts download entire tables into memory, causing server crashes. Decyra&apos;s pushdown optimizer extracts only the pre-aggregated micro-partitions.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Maintenance &amp; Opportunity Cost:</strong> Enterprises spend $400k+/year in engineering salaries trying to build and maintain internal data tools. Paying Decyra $199 - $999/month is a 10x ROI on day one.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GLOBAL & MENA (GCC) INVESTOR PERSPECTIVE ── */}
        <section className="py-20 bg-[#F4F8FE] border-t border-b border-[#E5E9F2]">
          <div className="max-w-[1100px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2761] tracking-wider uppercase bg-[#EBF3FE] px-3 py-1 rounded-full border border-[#C7D7F7] mb-3">
                <Globe2 className="w-3.5 h-3.5 text-[#F96167]" />
                Regional &amp; Sovereign Expansion Strategy
              </div>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Global &amp; MENA Investor Perspective
              </h2>
              <p className="text-base text-[#5A6478] max-w-[700px] mx-auto">
                How Decyra captures explosive growth across the GCC (UAE, Saudi Arabia), Europe, and emerging markets while navigating strict sovereign compliance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Point 1: Data Sovereignty */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E9F2] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <ShieldCheck className="w-5 h-5 text-[#F96167]" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  1. Sovereign Data Residency (KSA PDPL, UAE, SAMA &amp; GDPR)
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed mb-4">
                  Sovereign funds and enterprise buyers in Saudi Arabia and the UAE strictly enforce in-country data residency laws forbidding customer records from crossing borders.
                </p>
                <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2] text-xs text-[#1E2761] space-y-1.5 font-mono">
                  <div className="text-emerald-700 font-bold">✓ Decyra Advantage:</div>
                  <div>• Zero Data Retention: Customer data never leaves the client database network.</div>
                  <div>• In-Region Hosting: Deployable directly into AWS UAE (me-central-1), Oracle Cloud Saudi Arabia (Riyadh/Jeddah), or Azure UAE.</div>
                  <div>• Air-gapped on-premise Kubernetes support for government &amp; banking.</div>
                </div>
              </div>

              {/* Point 2: Legacy Modernization */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E9F2] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <Server className="w-5 h-5 text-[#1E2761]" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  2. Legacy Modernization in Emerging Markets
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed mb-4">
                  Enterprises across GCC, Southeast Asia, and LATAM run massive legacy on-premises databases (Oracle, Microsoft SQL Server, on-prem PostgreSQL) that cannot be migrated to the cloud quickly.
                </p>
                <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2] text-xs text-[#1E2761] space-y-1.5 font-mono">
                  <div className="text-indigo-700 font-bold">✓ Decyra Advantage:</div>
                  <div>• Eliminates 2-year &quot;Big Bang&quot; cloud warehouse migration projects.</div>
                  <div>• Outbound secure gateway agent queries on-premise systems alongside modern cloud DBs on day one.</div>
                  <div>• Zero inbound firewall holes required.</div>
                </div>
              </div>

              {/* Point 3: Arabic & Multilingual Reasoning */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E9F2] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <Languages className="w-5 h-5 text-[#F96167]" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  3. Bilingual Intelligence (Arabic &amp; English)
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed mb-4">
                  Business leaders in Saudi Arabia, UAE, and Qatar require systems that understand local business contexts in Arabic as seamlessly as in English.
                </p>
                <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2] text-xs text-[#1E2761] space-y-1.5 font-mono">
                  <div className="text-emerald-700 font-bold">✓ Decyra Advantage:</div>
                  <div>• Dual-language semantic reasoning: ask in Modern Standard Arabic or English.</div>
                  <div>• Semantic grounding layer translates intent into standard ANSI SQL.</div>
                  <div>• Generates bilingual charts and executive summaries.</div>
                </div>
              </div>

              {/* Point 4: Capital Efficiency & Path to Series A */}
              <div className="bg-white rounded-2xl p-8 border border-[#E5E9F2] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  4. High Capital Efficiency &amp; Runway
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed mb-4">
                  Unlike AI labs that burn millions per month on GPU clusters, Decyra is built on lean serverless architecture with immediate payback periods.
                </p>
                <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2] text-xs text-[#1E2761] space-y-1.5 font-mono">
                  <div className="text-cyan-700 font-bold">✓ Decyra Advantage:</div>
                  <div>• Low burn rate: serverless micro-inference keeps hosting costs negligible.</div>
                  <div>• CAC Payback: &lt; 5 months driven by product-led viral adoption.</div>
                  <div>• Clear 18-month execution roadmap to $2.5M ARR.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CAPITAL ALLOCATION & USE OF FUNDS ── */}
        <section className="py-20 bg-white border-b border-[#E5E9F2]">
          <div className="max-w-[1100px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Execution &amp; Milestones</span>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Capital Allocation &amp; Use of Proceeds
              </h2>
              <p className="text-base text-[#5A6478] max-w-[680px] mx-auto">
                How investment capital is deployed with maximum discipline to achieve the $2.5M ARR milestone within 18 months.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="text-2xl font-bold font-mono text-[#1E2761] mb-1">60%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-2">Core Engineering &amp; Distributed Systems</div>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Expanding the vectorized in-memory query engine, adding native connectors for Oracle, SAP HANA, and Microsoft SQL Server, and hardening the cross-database AST compiler.
                </p>
              </div>

              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="text-2xl font-bold font-mono text-[#1E2761] mb-1">25%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1E2761] mb-2">Go-to-Market &amp; Developer Relations</div>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Scaling self-serve conversion funnels, developer advocacy, content marketing on data engineering cost reduction, and mid-market enterprise sales engineering.
                </p>
              </div>

              <div className="bg-[#FAFBFC] border border-[#E5E9F2] p-6 rounded-2xl">
                <div className="text-2xl font-bold font-mono text-[#1E2761] mb-1">15%</div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Security &amp; Sovereign Compliance</div>
                <p className="text-xs text-[#5A6478] leading-relaxed">
                  Completing SOC2 Type II, ISO 27001, and local in-region data sovereign certifications across Saudi Arabia (NCA/SAMA), UAE, and the European Union (GDPR).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOUNDER CONTACT & DATA ROOM CTA ── */}
        <section className="py-20 bg-[#1E2761] text-white">
          <div className="max-w-[1000px] mx-auto px-8 max-[640px]:px-4 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F96167] mb-3 block">
              Direct Access to Founding Team
            </span>
            <h2
              className="text-[40px] max-[640px]:text-[30px] font-bold leading-tight mb-6"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Interested in Backing the Next Era of Enterprise Data Intelligence?
            </h2>
            <p className="text-[#BAC5DE] text-base max-w-[640px] mx-auto mb-10 leading-relaxed">
              We are actively speaking with venture capital funds, institutional partners, and family offices across North America, Europe, and the MENA region.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-[640px] mx-auto text-left mb-10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#BAC5DE] mb-4">Included in our Data Room:</div>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
                  Full Pitch Deck &amp; 3-Year Product Roadmap
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
                  Detailed Unit Economics, Gross Margin &amp; Financial Projections
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
                  Precedent Valuation Benchmark Model ($15B+ Decacorn Strategy)
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
                  Technical Whitepaper on Virtual Golden Layer Vectorized Joins
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F96167] flex-shrink-0" />
                  Live Product Demo &amp; Architecture Walkthrough
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-[#F96167] text-white font-semibold rounded-lg px-8 py-4 text-sm hover:bg-[#e8535a] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Request Pitch Deck &amp; Schedule Call
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto border border-white/30 text-white font-semibold rounded-lg px-7 py-4 text-sm hover:bg-white/10 transition-all text-center"
              >
                Test Live Platform
              </Link>
            </div>
            <div className="text-xs text-[#BAC5DE]/70 mt-6">
              Official Investor Relations: <Link href="/contact" className="underline hover:text-white">Contact Founders &amp; Executive Team</Link> • Decyra Systems Inc.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
