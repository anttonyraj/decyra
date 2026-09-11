import React from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import GoldenLayerGraphic from "@/components/landing/GoldenLayerGraphic";
import SectionLabel from "@/components/landing/SectionLabel";
import { 
  Layers, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  GitFork, 
  Database, 
  Snowflake, 
  FileSpreadsheet, 
  Activity, 
  Check 
} from "lucide-react";

export const metadata = {
  title: "Virtual Golden Layer & Cross-Database Federation | Decyra",
  description: "Query and join disparate databases on the fly without writing ETL pipelines or managing warehouses. Decyra's in-memory multi-database federation.",
};

export default function GoldenLayerPage() {
  return (
    <>
      <NavBar />

      <main className="bg-white">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-24 pb-16 border-b border-[#E5E9F2]">
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#1E2761]/6 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#F96167]/6 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 relative z-10">
            <div className="text-center max-w-[860px] mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1E2761] text-white mb-6 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#F96167] animate-pulse" />
                Active Engineering • Q4 Roadmap
              </div>

              <h1
                className="text-[52px] max-[1024px]:text-[42px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.12] mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Virtual Golden Layer & Cross-Database Federation
              </h1>

              <p className="text-[18px] max-[640px]:text-[16px] text-[#5A6478] leading-relaxed max-w-[720px] mx-auto mb-10">
                Break through corporate data silos. Ask questions that span PostgreSQL, Snowflake, BigQuery, and spreadsheets simultaneously. Decyra queries each engine concurrently and joins the records in-memory in milliseconds.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#interactive-demo"
                  className="bg-[#F96167] text-white font-semibold rounded-lg px-7 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-sm flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> See Interactive Demo
                </a>
                <Link
                  href="/login"
                  className="border border-[#1E2761] text-[#1E2761] font-semibold rounded-lg px-7 py-3.5 text-sm bg-white hover:bg-[#F4F8FE] transition-all"
                >
                  Start using live connectors →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Market Gap & Cost Comparison Strip */}
        <section className="py-16 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="bg-[#1E2761] text-white rounded-3xl p-10 max-[640px]:p-6 shadow-xl border border-[#2B3577] grid grid-cols-12 max-[1024px]:grid-cols-1 gap-8 items-center">
              <div className="col-span-7">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F96167] mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#F96167]" />
                  The Gap in the Market
                </div>
                <h2 className="text-2xl max-[640px]:text-xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  Almost every AI data tool assumes you have just one database.
                </h2>
                <p className="text-white/80 text-[15px] leading-relaxed">
                  In reality, modern companies keep signups in <strong>PostgreSQL</strong>, billing in <strong>Snowflake</strong>, clickstreams in <strong>BigQuery</strong>, and operational targets in <strong>Excel</strong>. Nobody has built an intuitive conversational AI analyst that queries across heterogeneous multi-database architectures without code — until Decyra.
                </p>
              </div>

              <div className="col-span-5 bg-white/10 rounded-2xl p-7 border border-white/15 backdrop-blur-xs flex flex-col justify-center">
                <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-1">
                  ETL Elimination & ROI
                </div>
                <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  $50K – $200K / yr Saved
                </div>
                <p className="text-white/80 text-xs leading-relaxed">
                  To answer cross-system questions today, companies spend six figures on ETL tools (Fivetran, dbt, Airflow) plus months of engineering time. By joining on the fly in-memory, Decyra solves a problem that normally requires <strong>2 full-time data engineers</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Concept Demo Section */}
        <section id="interactive-demo" className="py-20 bg-white border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-12">
              <SectionLabel>Live Interactive Concept</SectionLabel>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] leading-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                How Decyra In-Memory Federation Works
              </h2>
              <p className="text-[16px] text-[#5A6478] max-w-[640px] mx-auto">
                Watch how natural language questions decompose into engine-specific sub-queries and join in RAM without moving raw database disks.
              </p>
            </div>

            <GoldenLayerGraphic />
          </div>
        </section>

        {/* 3 Core Architecture Pillars */}
        <section className="py-20 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>Architecture</SectionLabel>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] leading-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Engineered for Speed, Scalability, and Privacy
              </h2>
            </div>

            <div className="grid grid-cols-3 max-[1024px]:grid-cols-1 gap-6">
              <div className="bg-white border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#C7D7F7] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] font-bold mb-5">
                  <Zap className="w-6 h-6 text-[#1E2761]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Pushdown Predicate Architecture
                </h3>
                <p className="text-[14px] text-[#5A6478] leading-relaxed">
                  Decyra pushes filters and aggregations down to each native engine (Postgres, Snowflake, BigQuery), then retrieves only matching summary records to join in-memory in milliseconds. Fast, scalable, and bandwidth-efficient.
                </p>
              </div>

              <div className="bg-white border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#C7D7F7] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#FDE2E3] flex items-center justify-center text-[#F96167] font-bold mb-5">
                  <GitFork className="w-6 h-6 text-[#F96167]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Virtual Data Marts Without ETL
                </h3>
                <p className="text-[14px] text-[#5A6478] leading-relaxed">
                  Stop spending weeks building dbt and Airflow pipelines just to join CRM signups with billing invoices. Define virtual relationships and create unified Golden Records on demand.
                </p>
              </div>

              <div className="bg-white border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#C7D7F7] transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#EAF7EE] flex items-center justify-center text-emerald-700 font-bold mb-5">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                  Zero-Storage Enterprise Privacy
                </h3>
                <p className="text-[14px] text-[#5A6478] leading-relaxed">
                  Data is processed ephemerally in RAM and discarded immediately after the query. Decyra never persists or stores your customer data, ensuring immediate SOC2 and GDPR compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE 2027 HORIZON: 3 NEXT-GEN LEAPS ── */}
        <section className="py-24 bg-white border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F96167] mb-2">
                <Sparkles className="w-4 h-4" /> Future Roadmap • Vision
              </div>
              <h2
                className="text-[40px] max-[640px]:text-[30px] font-bold text-[#1E2761] leading-tight mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The Next Frontier: 3 Next-Gen Leaps
              </h2>
              <p className="text-[16px] text-[#5A6478] max-w-[640px] mx-auto">
                Where Decyra is heading next to redefine business intelligence from reactive questions to autonomous foresight.
              </p>
            </div>

            <div className="grid grid-cols-3 max-[1024px]:grid-cols-1 gap-6">
              {/* Leap 1 */}
              <div className="bg-[#FAFBFC] border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#1E2761] transition-all flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-4">🚀</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-1">
                    Leap 01 • Reactive to Proactive
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    Autonomous Self-Driving Analyst
                  </h3>
                  <p className="text-[14px] text-[#5A6478] leading-relaxed mb-5">
                    Instead of waiting for you to log in and think of a question, Decyra runs background semantic anomaly scans every 6 hours across your live databases.
                  </p>
                  <div className="bg-white border border-[#E5E9F2] rounded-xl p-3.5 text-xs text-[#1E2761] font-mono leading-relaxed shadow-2xs">
                    <span className="text-rose-600 font-bold">🚨 Slack Alert:</span> &quot;Churn in EMEA rose 18% today. Cross-analyzed Postgres signups with Snowflake billing: 34 enterprise renewals timed out in Germany.&quot;
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E9F2] text-xs font-semibold text-[#1E2761]">
                  The AI acts as an autonomous Chief of Staff.
                </div>
              </div>

              {/* Leap 2 */}
              <div className="bg-[#FAFBFC] border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#1E2761] transition-all flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-4">🧠</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-1">
                    Leap 02 • Zero Configuration
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    Zero-Setup Semantic Auto-Linking
                  </h3>
                  <p className="text-[14px] text-[#5A6478] leading-relaxed mb-5">
                    In traditional tools, data engineers manually specify foreign keys. Decyra uses vector embeddings to auto-discover relationships across tables and files without human intervention.
                  </p>
                  <div className="bg-white border border-[#E5E9F2] rounded-xl p-3.5 text-xs text-[#1E2761] font-mono leading-relaxed shadow-2xs">
                    <span className="text-indigo-600 font-bold">⚡ Auto-Graph:</span> &quot;Discovered: emails in postgres.users map 100% to hashed accounts in snowflake.billing. Schema graph linked.&quot;
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E9F2] text-xs font-semibold text-[#1E2761]">
                  Connect your DBs — Decyra builds the graph automatically.
                </div>
              </div>

              {/* Leap 3 */}
              <div className="bg-[#FAFBFC] border border-[#E5E9F2] rounded-2xl p-8 shadow-xs hover:border-[#1E2761] transition-all flex flex-col justify-between">
                <div>
                  <div className="text-3xl mb-4">🔮</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#F96167] mb-1">
                    Leap 03 • Decision Intelligence
                  </div>
                  <h3 className="text-lg font-bold text-[#1E2761] mb-2" style={{ fontFamily: "Georgia, serif" }}>
                    Predictive &quot;What-If&quot; Simulations
                  </h3>
                  <p className="text-[14px] text-[#5A6478] leading-relaxed mb-5">
                    Traditional BI only looks backward. Decyra enables forward-looking decision modeling using Monte Carlo simulation directly in the browser.
                  </p>
                  <div className="bg-white border border-[#E5E9F2] rounded-xl p-3.5 text-xs text-[#1E2761] font-mono leading-relaxed shadow-2xs">
                    <span className="text-emerald-700 font-bold">📈 Forward Model:</span> &quot;If we raise Pro Plan from $49 to $69, predicted Q4 revenue increases +22% with 4.1% estimated elasticity churn.&quot;
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E9F2] text-xs font-semibold text-[#1E2761]">
                  From answering what happened to modeling what will happen.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 bg-[#1E2761] text-white text-center">
          <div className="max-w-[800px] mx-auto px-8 max-[640px]:px-4">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Ready to eliminate your data silos?
            </h2>
            <p className="text-white/80 text-base mb-8 max-w-[560px] mx-auto">
              Start querying your PostgreSQL, Snowflake, and spreadsheet data today. Join the early beta for cross-database federation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="bg-[#F96167] text-white font-semibold rounded-lg px-8 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-md"
              >
                Get Started Free →
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 text-white font-semibold rounded-lg px-8 py-3.5 text-sm hover:bg-white/10 transition-all"
              >
                Contact Team for Early Access
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
