import React from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
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
  Users
} from "lucide-react";

export const metadata = {
  title: "Investor Overview & Company Memo | Decyra",
  description: "Executive brief, market opportunity, defensibility, unit economics, and vision behind Decyra's Zero-ETL Data Intelligence platform.",
};

export default function InvestorsPage() {
  return (
    <>
      <NavBar />

      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-24 pb-16 border-b border-[#E5E9F2]">
          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#1E2761]/6 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-[#F96167]/6 blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#1E2761] text-white mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F96167] animate-pulse" />
              Decyra Investor Overview & Executive Memo
            </div>

            <h1
              className="text-[52px] max-[1024px]:text-[42px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.14] mb-6 max-w-[960px] mx-auto"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The Zero-ETL Data Intelligence Platform for Modern Enterprises
            </h1>

            <p className="text-[19px] max-[640px]:text-[16px] text-[#5A6478] leading-relaxed max-w-[760px] mx-auto mb-10">
              Decyra replaces $200,000/year brittle ETL data pipelines and 2-week engineering backlogs with on-the-fly, in-memory cross-database federation powered by governed AI.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:founder@decyra.systems?subject=Decyra%20Investor%20Inquiry%20-%20Data%20Room%20Request"
                className="bg-[#F96167] text-white font-semibold rounded-lg px-8 py-3.5 text-sm hover:bg-[#e8535a] transition-all shadow-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Request Deck & Data Room
              </a>
              <Link
                href="/golden-layer"
                className="border border-[#1E2761] text-[#1E2761] font-semibold rounded-lg px-7 py-3.5 text-sm bg-white hover:bg-[#F4F8FE] transition-all flex items-center gap-2"
              >
                Explore Virtual Golden Layer →
              </Link>
            </div>
          </div>
        </section>

        {/* Key Metrics & Thesis Strip */}
        <section className="py-12 bg-[#FAFBFC] border-b border-[#E5E9F2]">
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Target Market (TAM)", value: "$80B+", sub: "BI, ETL & AI Analytics" },
                { label: "Gross Margin Profile", value: "> 85%", sub: "Vectorized in-memory edge compute" },
                { label: "Customer Cost Savings", value: "$120k+/yr", sub: "Saved in Fivetran & dbt fees" },
                { label: "Time-to-Value", value: "< 2 Mins", sub: "Read-only URI connection" },
              ].map((metric) => (
                <div key={metric.label} className="bg-white p-6 rounded-2xl border border-[#E5E9F2] shadow-xs">
                  <div className="text-2xl sm:text-3xl font-bold text-[#1E2761] mb-1 font-mono">{metric.value}</div>
                  <div className="text-xs font-bold text-[#1E2761] uppercase tracking-wide mb-0.5">{metric.label}</div>
                  <div className="text-xs text-[#5A6478]">{metric.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 6 Core Venture Questions (Deep Dive) */}
        <section className="py-20">
          <div className="max-w-[1100px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-[#F96167] tracking-wider uppercase">Strategic Analysis</span>
              <h2
                className="text-[36px] max-[640px]:text-[28px] font-bold text-[#1E2761] mt-2 mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Addressing the Hardest Venture Questions
              </h2>
              <p className="text-base text-[#5A6478] max-w-[680px] mx-auto">
                A transparent, rigorous breakdown of market forces, technical moats, unit economics, and competitive defensibility.
              </p>
            </div>

            <div className="space-y-12">
              {/* Question 1: What is the exact problem and why is it urgent today? */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">01</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">What exact problem are you solving, and why can&apos;t companies solve it today?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Every mid-market and enterprise company operates on <strong>fragmented, heterogeneous databases</strong>: their web app is on PostgreSQL, sales analytics reside in Snowflake, marketing data sits in Google BigQuery, and finance runs on Excel spreadsheets.
                  </p>
                  <p>
                    When a CEO or VP asks a simple business question — such as <em>&quot;Which churned accounts had over 50 active user sessions in Postgres last month?&quot;</em> — answering it currently requires:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#1E2761]">
                    <li>Paying <strong>$50,000–$200,000/year</strong> for ETL replication tools (Fivetran, dbt Cloud, Airflow).</li>
                    <li>Employing <strong>2 full-time data engineers</strong> ($300k+ payroll) to build and maintain brittle sync DAGs.</li>
                    <li>Waiting <strong>1 to 2 weeks</strong> for queries to be manually written and audited.</li>
                  </ul>
                  <p>
                    <strong>Decyra&apos;s Solution:</strong> Decyra queries each disparate database concurrently with predicate pushdown, joins the results on the fly in-memory (using vectorized DuckDB &amp; Apache Arrow), and answers the user in <strong>milliseconds</strong>. No ETL pipeline. No data engineering delay. Zero raw customer data stored.
                  </p>
                </div>
              </div>

              {/* Question 2: Defensibility against OpenAI / ChatGPT */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">02</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">Why can&apos;t OpenAI, Anthropic, or ChatGPT commoditize and kill Decyra?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    OpenAI builds general-purpose frontier LLMs. A general chat model completely fails at enterprise database querying for four fundamental architectural reasons:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] mb-1">1. Zero VPC / Database Connectivity</div>
                      <div className="text-xs text-[#5A6478]">
                        Frontier models cannot securely connect to private database VPCs, authenticate with read-only roles, or handle connection pooling across heterogeneous engines.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] mb-1">2. Hallucinations & AST Safety</div>
                      <div className="text-xs text-[#5A6478]">
                        ChatGPT frequently invents table names and column types. Decyra parses live database schemas, runs AST verification, and enforces strict read-only safety before any query runs.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] mb-1">3. Cross-Database Vectorized Execution</div>
                      <div className="text-xs text-[#5A6478]">
                        No foundation model can execute distributed pushdowns across Postgres and Snowflake and perform in-memory joins. Decyra provides the specialized execution engine.
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <div className="font-bold text-[#1E2761] mb-1">4. Zero Data Retention Enterprise Compliance</div>
                      <div className="text-xs text-[#5A6478]">
                        Enterprise compliance teams forbid sending production database schemas or customer records into public LLM training pipelines. Decyra guarantees zero-retention governance.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3: Defensibility against Snowflake and Databricks */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">03</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">What prevents Snowflake or Databricks from building this?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    <strong>Incentive Misalignment:</strong> Snowflake and Databricks are storage and compute consumption businesses. Their business model depends on forcing companies to ingest all of their corporate data into their proprietary cloud warehouse.
                  </p>
                  <p>
                    They have zero commercial incentive to make it easy for a business to keep operational data in PostgreSQL and marketing data in Google BigQuery without paying Snowflake storage and replication fees.
                  </p>
                  <p>
                    Decyra is <strong>completely cloud-agnostic and database-neutral</strong>. We act as the Switzerland of enterprise data, sitting above all storage layers and federating queries without holding data hostage.
                  </p>
                </div>
              </div>

              {/* Question 4: Business Model & Unit Economics */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">04</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">What does the business model look like, and what are your gross margins?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Decyra operates on a predictable B2B SaaS subscription model with tiered platform access:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 py-2">
                    <div className="p-4 rounded-xl border border-[#E5E9F2] bg-[#FAFBFC]">
                      <div className="text-xs font-bold uppercase text-[#5A6478]">Starter</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$49<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">Individual founders, analysts, single database connectors.</div>
                    </div>
                    <div className="p-4 rounded-xl border border-[#1E2761] bg-[#EBF3FE]/50 relative">
                      <div className="text-[9px] font-bold uppercase tracking-wider bg-[#F96167] text-white px-2 py-0.5 rounded-full absolute -top-2.5 right-3">High Volume</div>
                      <div className="text-xs font-bold uppercase text-[#1E2761]">Pro / Team</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$199<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">Cross-database joins, team sharing, saved data marts.</div>
                    </div>
                    <div className="p-4 rounded-xl border border-[#E5E9F2] bg-[#FAFBFC]">
                      <div className="text-xs font-bold uppercase text-[#5A6478]">Enterprise</div>
                      <div className="text-2xl font-bold text-[#1E2761] my-1">$999+<span className="text-xs text-[#5A6478] font-normal">/mo</span></div>
                      <div className="text-xs text-[#5A6478]">Private VPC deployment, custom SLAs, unlimited connectors.</div>
                    </div>
                  </div>
                  <p>
                    <strong>High Gross Margins (&gt;85%):</strong> Unlike compute-heavy AI video or raw LLM inference platforms, Decyra performs query routing and schema compilation in micro-tokens (&lt;500 tokens per query). Query execution computation is pushed down directly into the customer&apos;s existing databases or executed in lightweight vectorized local memory. Our compute infrastructure cost per customer query is measured in fractions of a cent.
                  </p>
                </div>
              </div>

              {/* Question 5: Go-To-Market and Customer Acquisition */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">05</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">What is the Go-To-Market (GTM) motion and sales velocity?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Decyra employs a high-velocity <strong>product-led growth (PLG) wedge combined with top-down enterprise expansion</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-[#5A6478]">
                    <li>
                      <strong className="text-[#1E2761]">Instant Self-Serve Onboarding:</strong> Users can upload a spreadsheet or connect a PostgreSQL / Supabase read-only URI and get their first AI-powered answer in under 2 minutes without speaking to a sales rep.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Viral Team Expansion:</strong> When an executive or product manager generates an automated interactive chart or cohort analysis, they share the live dashboard link with team members, driving organic seat expansion across the organization.
                    </li>
                    <li>
                      <strong className="text-[#1E2761]">Enterprise Upgrades:</strong> Once a company connects multiple mission-critical databases, they upgrade to Enterprise for custom VPC deployment, RBAC controls, and priority query federation.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Question 6: Security and Zero Data Liability */}
              <div className="bg-white rounded-2xl border border-[#E5E9F2] p-8 sm:p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-[#1E2761] text-white flex items-center justify-center text-xs font-bold font-mono">06</span>
                  <h3 className="text-xl font-bold text-[#1E2761]">What is the data security liability, and how do you pass enterprise infosec audits?</h3>
                </div>
                <div className="space-y-4 text-sm text-[#5A6478] leading-relaxed">
                  <p>
                    Decyra is engineered around a <strong>zero-raw-data-retention architecture</strong>:
                  </p>
                  <div className="grid sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <ShieldCheck className="w-5 h-5 text-[#F96167] mb-2" />
                      <div className="font-bold text-[#1E2761] text-xs mb-1">No Data Clones</div>
                      <div className="text-xs text-[#5A6478]">Customer database records are never copied, mirrored, or stored on Decyra disks.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <Lock className="w-5 h-5 text-[#F96167] mb-2" />
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Read-Only Enforced</div>
                      <div className="text-xs text-[#5A6478]">AST parser rejects any write/drop queries before dispatch. Zero mutation risk.</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E9F2]">
                      <Building2 className="w-5 h-5 text-[#F96167] mb-2" />
                      <div className="font-bold text-[#1E2761] text-xs mb-1">Private VPC Option</div>
                      <div className="text-xs text-[#5A6478]">Self-hosted container deployable inside customer&apos;s own AWS or GCP perimeter.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Contact / Data Room Callout */}
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
              We are actively speaking with venture capital funds, enterprise angel investors, and strategic partners who understand the massive market shift away from legacy ETL and toward instant AI data federation.
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
              <a
                href="mailto:founder@decyra.systems?subject=Investor%20Inquiry%20-%20Decyra%20Deck%20Request"
                className="w-full sm:w-auto bg-[#F96167] text-white font-semibold rounded-lg px-8 py-4 text-sm hover:bg-[#e8535a] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Request Pitch Deck &amp; Schedule Call
              </a>
              <Link
                href="/login"
                className="w-full sm:w-auto border border-white/30 text-white font-semibold rounded-lg px-7 py-4 text-sm hover:bg-white/10 transition-all text-center"
              >
                Test Live Platform
              </Link>
            </div>
            <div className="text-xs text-[#BAC5DE]/70 mt-6">
              Official Investor Relations: <a href="mailto:founder@decyra.systems" className="underline hover:text-white">founder@decyra.systems</a> • Decyra Systems Inc.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
