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
  Zap
} from "lucide-react";

export const metadata = {
  title: "Investor Overview & Due Diligence Memo | Decyra",
  description: "The 30-Second Pitch, $80B Market Opportunity, Venture Q&A Teardown, and Global & MENA Expansion perspectives behind Decyra.",
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
            <div className="max-w-[820px] mx-auto bg-white border-2 border-[#1E2761]/15 rounded-2xl p-5 mb-8 shadow-sm">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#F96167] mb-1">
                The 30-Second Elevator Pitch
              </div>
              <p className="text-[19px] max-[640px]:text-[16px] text-[#1E2761] font-semibold leading-snug">
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

        {/* ── THE $80B MARKET OPPORTUNITY & KEY METRICS ── */}
        <section className="py-16 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Market Dynamics</span>
              <h2
                className="text-[34px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The $80B Market Opportunity
              </h2>
              <p className="text-sm text-[#5A6478] max-w-[680px] mx-auto">
                Driven by massive modern data stack fragmentation and the vast, underserved market of non-technical business operators.
              </p>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Addressable Market", value: "$80B+", sub: "BI ($33B), ETL ($19B) & AI ($28B)" },
                { label: "Gross Margin Profile", value: "> 85%", sub: "Vectorized in-memory edge compute" },
                { label: "Customer Cost Savings", value: "$120k+/yr", sub: "Eliminated Fivetran, dbt & sync fees" },
                { label: "Time-to-Value", value: "< 2 Mins", sub: "Read-only URI self-serve connection" },
              ].map((metric) => (
                <div key={metric.label} className="bg-white p-6 rounded-2xl border border-[#E5E9F2] shadow-xs">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1E2761] mb-1 font-mono">{metric.value}</div>
                  <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-0.5">{metric.label}</div>
                  <div className="text-xs text-[#5A6478]">{metric.sub}</div>
                </div>
              ))}
            </div>

            {/* Why The Timing Is Now: The 2 Compounding Forces */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-[#E5E9F2] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] flex items-center justify-center text-[#1E2761] mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  1. Modern Data Stack Fragmentation
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed">
                  Companies don&apos;t keep all data in one place. Operational records live in PostgreSQL, analytical events in Snowflake, clickstreams in Google BigQuery, and operational models in Excel. Centralizing them requires expensive ETL pipelines (Fivetran, Airflow, dbt) that break constantly and cost six figures annually.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-[#E5E9F2] shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#FDE2E3] flex items-center justify-center text-[#F96167] mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2761] mb-2 font-serif">
                  2. The Underserved Business Operator Market
                </h3>
                <p className="text-sm text-[#5A6478] leading-relaxed">
                  Over 90% of business operators (VPs, RevOps leaders, Product Managers, Founders) do not know SQL. They are forced to wait days or weeks for data analysts to answer ad-hoc questions. Decyra empowers them to converse directly with their data in plain English with instant auditable SQL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTITUTIONAL VENTURE Q&A TEARDOWN ── */}
        <section className="py-20">
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
                    Our moat consists of a proprietary three-layer technical architecture:
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
                        Decyra auto-discovers relationships between tables across disparate databases using vector embeddings, creating an automated cross-database knowledge graph.
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
