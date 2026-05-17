import React from "react";
import Link from "next/link";
import { Database, Code2, Users, Zap, CheckCircle, XCircle } from "lucide-react";
import NavBar from "@/components/landing/NavBar";
import HeroDiagram from "@/components/landing/HeroDiagram";
import SectionLabel from "@/components/landing/SectionLabel";
import QuestionCard from "@/components/landing/QuestionCard";
import PricingCard from "@/components/landing/PricingCard";
import Footer from "@/components/landing/Footer";

// ─── DATA ────────────────────────────────────────────────────────────────────

const problemColumns = [
  {
    heading: "Reporting takes too long.",
    body: "You file a request, wait three days, get a number. By then the deal is closed or the quarter has moved. The bottleneck is never the data. It's always the process.",
  },
  {
    heading: "Dashboards don't answer real questions.",
    body: "Static reports cover the basics. The questions that actually drive decisions ('why did win rate drop in mid-market?') live outside any dashboard, and always will.",
  },
  {
    heading: "You shouldn't need an analyst for this.",
    body: "Ad-hoc queries, data pulls, custom reports. These are the bottleneck between your team and the operational visibility they need right now.",
  },
];

const howItWorksSteps = [
  {
    num: "01",
    heading: "Connect your data",
    body: "Point Decyra at your PostgreSQL database. Schema auto-detected in seconds. No ETL pipeline, no data warehouse, no engineering ticket required.",
  },
  {
    num: "02",
    heading: "Ask in plain English",
    body: "Type any business question. Decyra writes the SQL, shows it to you for review, and runs it only when you're ready. You stay in control.",
  },
  {
    num: "03",
    heading: "Get the answer instantly",
    body: "A results table plus a plain-English explanation of what the data is telling you. Every answer is backed by real, auditable SQL.",
  },
];

const whyDecyraPillars = [
  {
    icon: Database,
    heading: "Schema-Aware Intelligence",
    body: "Decyra reads your actual database schema before writing any SQL. Every answer maps to real tables and real columns. No hallucinated metrics.",
  },
  {
    icon: Code2,
    heading: "Transparent by Design",
    body: "Every answer shows the SQL that generated it. Inspect it, audit it, copy it. No black-box results. No guessing what the number means.",
  },
  {
    icon: Users,
    heading: "Built for Operators, Not Analysts",
    body: "Designed for RevOps directors, VPs of Sales, and CS leaders. Not a developer tool. Not a BI platform. An AI analyst built for business teams.",
  },
  {
    icon: Zap,
    heading: "Answers in Seconds, Not Days",
    body: "Skip the ticket, skip the wait, skip the back-and-forth. Ask a business question and see the answer. Operational visibility on demand.",
  },
];

const comparisonColumns = [
  {
    label: "Traditional BI Tools",
    highlight: false,
    items: [
      { text: "Dashboards require setup and ongoing maintenance", positive: false },
      { text: "Ad-hoc questions still route through analysts", positive: false },
      { text: "Days to answer one-off business questions", positive: false },
      { text: "Built for reporting, not real-time exploration", positive: false },
      { text: "High configuration overhead", positive: false },
    ],
  },
  {
    label: "Generic AI Chatbots",
    highlight: false,
    items: [
      { text: "No live database connection", positive: false },
      { text: "May hallucinate schema, columns, and metrics", positive: false },
      { text: "Cannot safely execute SQL against real data", positive: false },
      { text: "No operational or business context", positive: false },
      { text: "Results are not auditable", positive: false },
    ],
  },
  {
    label: "Decyra",
    highlight: true,
    items: [
      { text: "Connects directly to your operational database", positive: true },
      { text: "Schema-aware: maps to real tables and columns", positive: true },
      { text: "Plain-English questions, real SQL answers in seconds", positive: true },
      { text: "Built for RevOps, sales ops, and CS teams", positive: true },
      { text: "Every answer is transparent and auditable", positive: true },
    ],
  },
];

const questions = [
  "What's our pipeline coverage by segment for Q3?",
  "Which reps are below 80% of quota right now?",
  "What's our average deal cycle this quarter vs last?",
  "Which customers grew their MRR 30%+ in the last quarter?",
  "Why did our win-rate drop in the SMB segment last month?",
  "Which deals slipped from Q2 to Q3, and what changed?",
];

const roles = [
  {
    title: "Directors of RevOps",
    body: "Pipeline coverage, rep performance, quota attainment. No waiting on your data team or rebuilding another dashboard.",
  },
  {
    title: "VPs of Sales",
    body: "Real-time visibility into deal velocity, win rates, and forecast accuracy. The answers you need for the Monday morning call.",
  },
  {
    title: "Heads of Customer Success",
    body: "Customer health signals, expansion opportunities, churn risk. In plain English, from your operational data.",
  },
  {
    title: "Founders and CEOs of growing SaaS companies",
    body: "Business answers without learning SQL, building dashboards, or hiring a data analyst. Ask, and know.",
  },
];

const pricingTiers = [
  {
    tier: "Starter",
    price: "$99",
    description: "For solo operators and small teams",
    features: ["1 data source", "500 queries / month", "Email support"],
    ctaLabel: "Start free 14-day trial",
    ctaHref: "/login",
    highlighted: false,
  },
  {
    tier: "Business",
    price: "$299",
    description: "For growing teams",
    badge: "Most Popular",
    features: [
      "3 data sources",
      "Unlimited queries",
      "Anomaly alerts (coming soon)",
      "Scheduled reports (coming soon)",
      "Priority email support",
    ],
    ctaLabel: "Start free 14-day trial",
    ctaHref: "/login",
    highlighted: true,
  },
  {
    tier: "Pro",
    price: "$799",
    description: "For data-driven companies",
    features: [
      "Unlimited data sources",
      "Unlimited queries",
      "All Business features",
      "Dedicated Slack support",
      "Custom integrations",
    ],
    ctaLabel: "Talk to founder",
    ctaHref: "mailto:founder@decyra.systems",
    highlighted: false,
    external: true,
  },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <NavBar />

      <main>
        {/* ── HERO ── */}
        <section
          id="product"
          className="bg-white pt-24 pb-16 max-[640px]:pt-16 max-[640px]:pb-12"
          aria-labelledby="hero-headline"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center max-w-[900px] mx-auto">
              {/* Category label */}
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-6">
                AI Data Intelligence
              </p>

              {/* Headline */}
              <h1
                id="hero-headline"
                className="text-[64px] max-[1024px]:text-[52px] max-[640px]:text-[40px] font-bold text-[#1A1F36] leading-[1.08] mb-6"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Ask your business data anything.
                <br />
                Get the answer in plain English.
              </h1>

              {/* Subhead */}
              <p className="text-[20px] max-[640px]:text-[18px] text-[#5A6478] leading-relaxed max-w-[700px] mx-auto mb-10">
                Decyra is the AI analyst for revenue and business operations teams. Connect your database, type a question, see the answer. No SQL, no data team, no waiting.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="bg-[#F96167] text-white font-semibold rounded-lg px-7 py-3.5 text-base hover:bg-[#e8535a] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2"
                  id="hero-cta-primary"
                >
                  Start here →
                </Link>
                <a
                  href="#how-it-works"
                  className="border border-[#1E2761] text-[#1E2761] font-semibold rounded-lg px-7 py-3.5 text-base hover:bg-[#E8EDF7] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:ring-offset-2"
                  id="hero-cta-secondary"
                >
                  See how it works
                </a>
              </div>

              {/* Trust line */}
              <p className="mt-6 text-[14px] italic text-[#5A6478]">
                Every answer is backed by real SQL you can inspect and audit.
              </p>
            </div>

            {/* Hero diagram */}
            <div className="mt-20 max-[640px]:mt-12">
              <HeroDiagram />
            </div>

            {/* Disclaimer */}
            <p className="mt-10 text-[13px] italic text-[#5A6478] text-center">
              PostgreSQL connector and demo database available now. Other connectors rolling out over the next 8 weeks.
            </p>
          </div>
        </section>

        {/* ── CATEGORY POSITIONING STRIP ── */}
        <section className="border-y border-[#E5E9F2] py-12 max-[640px]:py-8 bg-white">
          <div className="max-w-[860px] mx-auto px-8 max-[640px]:px-4 text-center">
            <h2
              className="text-[24px] max-[640px]:text-[20px] font-bold text-[#1E2761] mb-3 leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              The simplicity of AI chat. The reliability of business intelligence.
            </h2>
            <p className="text-[16px] text-[#5A6478] leading-relaxed max-w-[640px] mx-auto">
              Decyra combines conversational AI with governed SQL execution, schema-aware querying, and operational business context. Not a chatbot. Not a dashboard. An AI analyst.
            </p>
          </div>
        </section>

        {/* ── PROBLEM ── */}
        <section
          className="bg-[#FAFBFC] py-24 max-[640px]:py-16"
          aria-labelledby="problem-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>The Problem</SectionLabel>
              <h2
                id="problem-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight max-w-[640px] mx-auto"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Operational teams are still waiting days for answers.
              </h2>
            </div>

            <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-8 max-[768px]:gap-6">
              {problemColumns.map((col) => (
                <div
                  key={col.heading}
                  className="bg-white border border-[#E5E9F2] rounded-xl p-8 max-[640px]:p-6"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <h3
                    className="text-xl font-bold text-[#1E2761] mb-3 leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {col.heading}
                  </h3>
                  <p className="text-[16px] text-[#5A6478] leading-relaxed">
                    {col.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="how-it-works"
          className="bg-white py-24 max-[640px]:py-16"
          aria-labelledby="how-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>How It Works</SectionLabel>
              <h2
                id="how-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Three steps. Zero SQL.
              </h2>
            </div>

            <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-8 max-[768px]:gap-6">
              {howItWorksSteps.map((step) => (
                <div
                  key={step.num}
                  className="border border-[#E5E9F2] rounded-xl p-8 max-[640px]:p-6"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <span
                    className="text-[56px] font-bold text-[#F96167] leading-none block mb-4 opacity-80"
                    style={{ fontFamily: "Georgia, serif" }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#1E2761] mb-3"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {step.heading}
                  </h3>
                  <p className="text-[16px] text-[#5A6478] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU CAN ASK ── */}
        <section
          className="bg-white py-24 max-[640px]:py-16 border-t border-[#E5E9F2]"
          aria-labelledby="questions-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-5">
              <SectionLabel>Real questions Decyra answers</SectionLabel>
              <h2
                id="questions-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                The questions your team asks every week.
              </h2>
              <p className="text-[18px] text-[#5A6478] leading-relaxed max-w-[600px] mx-auto">
                These take seconds with Decyra. Without it, they're a three-day reporting cycle. If they happen at all.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 gap-5">
              {questions.map((q) => (
                <QuestionCard key={q} question={q} />
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY DECYRA ── */}
        <section
          id="why-decyra"
          className="bg-[#FAFBFC] py-24 max-[640px]:py-16"
          aria-labelledby="why-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>Why Decyra</SectionLabel>
              <h2
                id="why-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight max-w-[640px] mx-auto"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Practical. Transparent. Built for operators.
              </h2>
            </div>

            <div className="grid grid-cols-2 max-[768px]:grid-cols-1 gap-6">
              {whyDecyraPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.heading}
                    className="bg-white border border-[#E5E9F2] rounded-xl p-8 max-[640px]:p-6 flex gap-5"
                    style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-lg bg-[#E8EDF7] flex items-center justify-center">
                        <Icon size={18} className="text-[#1E2761]" />
                      </div>
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold text-[#1E2761] mb-2"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {pillar.heading}
                      </h3>
                      <p className="text-[15px] text-[#5A6478] leading-relaxed">
                        {pillar.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── COMPARISON ── */}
        <section
          className="bg-white py-24 max-[640px]:py-16"
          aria-labelledby="comparison-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>Why teams choose Decyra</SectionLabel>
              <h2
                id="comparison-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                A different category entirely.
              </h2>
              <p className="text-[18px] text-[#5A6478] mt-4 max-w-[560px] mx-auto leading-relaxed">
                Decyra isn't a better dashboard or a smarter chatbot. It's a new layer between your data and your decisions.
              </p>
            </div>

            <div className="grid grid-cols-3 max-[768px]:grid-cols-1 gap-6">
              {comparisonColumns.map((col) => (
                <div
                  key={col.label}
                  className={`rounded-xl p-8 max-[640px]:p-6 flex flex-col ${
                    col.highlight
                      ? "border-2 border-[#1E2761] bg-white"
                      : "border border-[#E5E9F2] bg-[#FAFBFC]"
                  }`}
                  style={{ boxShadow: col.highlight ? "0 8px 24px rgba(30,39,97,0.08)" : "0 4px 12px rgba(0,0,0,0.03)" }}
                >
                  {/* Column header */}
                  <div className="mb-6">
                    {col.highlight ? (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#F96167]" aria-hidden="true" />
                        <span
                          className="font-bold text-[#1E2761] tracking-[0.12em] text-sm"
                          style={{ fontFamily: "Georgia, serif" }}
                        >
                          DECYRA
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-[#5A6478] mb-1">{col.label}</p>
                    )}
                    <div className={`h-0.5 w-8 rounded-full mt-2 ${col.highlight ? "bg-[#F96167]" : "bg-[#E5E9F2]"}`} />
                  </div>

                  {/* Feature list */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {col.items.map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        {item.positive ? (
                          <CheckCircle
                            size={16}
                            className="text-[#1E2761] flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <XCircle
                            size={16}
                            className="text-[#B0B8CC] flex-shrink-0 mt-0.5"
                          />
                        )}
                        <span
                          className={`text-[14px] leading-snug ${
                            item.positive ? "text-[#1A1F36]" : "text-[#5A6478]"
                          }`}
                        >
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section
          id="built-for"
          className="bg-[#E8EDF7] py-24 max-[640px]:py-16"
          aria-labelledby="for-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-14">
              <SectionLabel>Built For</SectionLabel>
              <h2
                id="for-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                For the teams that need answers now.
              </h2>
            </div>

            <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-6">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="bg-white border border-[#E5E9F2] rounded-xl p-8 max-[640px]:p-6"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                >
                  <h3
                    className="text-xl font-bold text-[#1E2761] mb-3"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {role.title}
                  </h3>
                  <p className="text-[16px] text-[#5A6478] leading-relaxed">
                    {role.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section
          id="pricing"
          className="bg-white py-24 max-[640px]:py-16"
          aria-labelledby="pricing-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            <div className="text-center mb-5">
              <SectionLabel>Pricing</SectionLabel>
              <h2
                id="pricing-heading"
                className="text-[40px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-tight mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Flat company pricing. No per-seat tax.
              </h2>
              <p className="text-[18px] text-[#5A6478] leading-relaxed">
                Unlimited team members on every plan. Pay for the company, not the headcount.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 max-[1024px]:grid-cols-1 gap-6 max-w-[960px] mx-auto">
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.tier}
                  {...tier}
                  external={tier.external ?? false}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSING CTA ── */}
        <section
          className="bg-[#1E2761] py-24 max-[640px]:py-16"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 text-center">
            <h2
              id="cta-heading"
              className="text-[48px] max-[640px]:text-[36px] font-bold text-white leading-tight mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              See your data in plain English.
            </h2>
            <p className="text-[18px] text-[#E8EDF7] mb-10">
              Start here. Two clicks, no credit card.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#F96167] text-white font-semibold rounded-lg px-8 py-4 text-base hover:bg-[#e8535a] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2 focus:ring-offset-[#1E2761]"
              id="closing-cta"
            >
              Start here →
            </Link>
            <p className="mt-6 text-[13px] italic text-[#E8EDF7] opacity-70">
              Free 14-day trial. Demo database included. No setup required.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
