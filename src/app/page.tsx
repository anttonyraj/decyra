import React from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import HeroDiagram from "@/components/landing/HeroDiagram";
import SectionLabel from "@/components/landing/SectionLabel";
import QuestionCard from "@/components/landing/QuestionCard";
import PricingCard from "@/components/landing/PricingCard";
import Footer from "@/components/landing/Footer";

// ─── DATA ───────────────────────────────────────────────────────────────────

const problemColumns = [
  {
    heading: "Every question is a ticket.",
    body: "You file a request, wait 3 days, get a number. By the time it arrives, the deal is closed or lost.",
  },
  {
    heading: "BI dashboards aren't enough.",
    body: "Your Salesforce reports cover the basics. Real questions — 'why did win rate drop in mid-market?' — need ad-hoc analysis.",
  },
  {
    heading: "ChatGPT can't see your data.",
    body: "General AI writes SQL well, but it can't run it against your live pipeline. Decyra can.",
  },
];

const howItWorksSteps = [
  {
    num: "01",
    heading: "Connect your data",
    body: "Plug in PostgreSQL today. MySQL, CSV, Salesforce, and HubSpot rolling out over the next 8 weeks. Schema auto-detected in seconds.",
  },
  {
    num: "02",
    heading: "Ask in plain English",
    body: "Type any business question. Decyra generates the SQL, shows it to you, lets you review before running.",
  },
  {
    num: "03",
    heading: "Get the answer + the why",
    body: "Results as a table, plus a 2-sentence explanation of what the data is telling you. Built for executives, not just analysts.",
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
    body: "Pipeline coverage, rep performance, quota attainment — without bothering your data team.",
  },
  {
    title: "VPs of Sales",
    body: "Real-time visibility into deal velocity, win rates, and forecast accuracy.",
  },
  {
    title: "Heads of Customer Success",
    body: "Customer health signals, expansion opportunities, churn risk — in plain English.",
  },
  {
    title: "Founders and CEOs of growing SaaS companies",
    body: "Real-time business answers without learning SQL or hiring an analyst.",
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
          className="bg-white pt-24 pb-16 max-[640px]:pt-16 max-[640px]:pb-12"
          aria-labelledby="hero-headline"
        >
          <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
            {/* Centered text block */}
            <div className="text-center max-w-[900px] mx-auto">
              {/* Small label */}
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-6">
                Built for RevOps at growing SaaS companies
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
                Decyra connects to your data, generates the SQL, runs it, and
                explains what it found. No data team. No SQL. No waiting.
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
                Built by a 20-year data architecture veteran. Read-only access.
                Your data never trains our models.
              </p>
            </div>

            {/* Hero diagram */}
            <div className="mt-20 max-[640px]:mt-12">
              <HeroDiagram />
            </div>

            {/* Disclaimer */}
            <p className="mt-10 text-[13px] italic text-[#5A6478] text-center">
              PostgreSQL connector and demo database available now. Other
              connectors and outputs rolling out over the next 8 weeks.
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
                RevOps teams shouldn't wait for the data team.
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
                These take minutes with Decyra. Without it, they take days — if
                they happen at all.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1 gap-5">
              {questions.map((q) => (
                <QuestionCard key={q} question={q} />
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section
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
                For the people who need answers now.
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
                Unlimited team members on every plan. Pay for the company, not
                the headcount.
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
