"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Database, 
  Layers, 
  DollarSign, 
  Sparkles, 
  Mail,
  ArrowRight
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "general" | "connectors" | "security" | "golden-layer" | "pricing";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // General & Product
  {
    id: "gen-1",
    category: "general",
    question: "What is Decyra, and how does it work?",
    answer: "Decyra is an AI-powered data intelligence platform that converts plain English questions into validated, optimized SQL queries, executes them against your database in milliseconds, and returns both formatted tabular answers and interactive charts. It enables business teams, founders, and executives to extract answers from their data without writing SQL or waiting on data engineering backlogs."
  },
  {
    id: "gen-2",
    category: "general",
    question: "How does Decyra prevent AI hallucinations in SQL queries?",
    answer: "Decyra utilizes a strict schema-context grounding pipeline. Before any SQL is generated, Decyra analyzes your database's actual table schemas, foreign key relationships, column types, and enum values. The generated SQL passes through an AST (Abstract Syntax Tree) validator and a read-only safety linter before execution. If a syntax error or missing column is detected, Decyra's self-healing compiler repairs the query before it reaches your database."
  },
  {
    id: "gen-3",
    category: "general",
    question: "Can non-technical business operators use Decyra?",
    answer: "Absolutely. Decyra was built specifically for product managers, finance teams, growth operators, and executives who know what business questions they need answered but don't know SQL. You can ask: 'What was our net revenue retention by cohort last quarter?' and Decyra handles the grouping, joins, and calculation automatically."
  },
  {
    id: "gen-4",
    category: "general",
    question: "Can I inspect and edit the generated SQL query?",
    answer: "Yes. Decyra is completely transparent. Every answer includes a 'View SQL' toggle showing the exact query executed, execution latency, and row counts. Power users and data analysts can modify the SQL manually and re-run it directly in the console."
  },

  // Connectors & Databases
  {
    id: "conn-1",
    category: "connectors",
    question: "Which databases and data warehouses does Decyra support?",
    answer: "Decyra natively connects to PostgreSQL, Snowflake, Google BigQuery, MySQL, and local or cloud Excel (.xlsx) and CSV files. Dedicated connectors for Amazon Redshift, Databricks, and MongoDB are currently in development for our next quarterly release."
  },
  {
    id: "conn-2",
    category: "connectors",
    question: "Do you ever store or replicate our database data on Decyra servers?",
    answer: "No. Decyra never replicates, clones, or stores your raw customer data. Queries are executed directly against your database using read-only credentials, and query result sets are streamed directly to your browser session over TLS 1.3 encryption. We only store database metadata (table names, column names, and schema definitions) needed to ground the AI model."
  },
  {
    id: "conn-3",
    category: "connectors",
    question: "Can I connect my local database or a database behind a private VPC?",
    answer: "Yes. For private VPCs and on-premise clusters, Decyra provides IP allowlisting, SSL certificate verification, and lightweight secure SSH tunneling or Decyra Gateway agents for enterprise deployments."
  },
  {
    id: "conn-4",
    category: "connectors",
    question: "How does Decyra handle messy spreadsheet uploads (Excel / CSV)?",
    answer: "When you upload an Excel workbook or CSV, Decyra automatically detects header rows, infers typed schemas (dates, currencies, integers, booleans), handles nulls, and spins up an isolated in-memory table so you can query spreadsheets with natural language just like an enterprise SQL database."
  },

  // Security & Governance
  {
    id: "sec-1",
    category: "security",
    question: "How does Decyra enforce read-only safety?",
    answer: "Security is our highest priority. Decyra operates strictly with read-only database roles (`SELECT` permissions only). Additionally, Decyra's execution engine features an automated AST AST-level blocker that rejects any mutating or dangerous statements (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `GRANT`, `TRUNCATE`) before the query is ever dispatched to your server."
  },
  {
    id: "sec-2",
    category: "security",
    question: "Is Decyra SOC 2 Type II compliant?",
    answer: "Decyra is architected to exceed SOC 2 Type II standards. All network traffic is encrypted with TLS 1.3 in transit, all cached schema metadata is encrypted with AES-256 at rest, and all system actions, user sessions, and executed queries are logged in immutable tamper-evident audit trails."
  },
  {
    id: "sec-3",
    category: "security",
    question: "Are our proprietary database records used to train public AI models?",
    answer: "Never. Decyra uses zero-data-retention enterprise LLM agreements. Your queries, schema structures, and business metrics are never used to train or fine-tune public foundation models."
  },
  {
    id: "sec-4",
    category: "security",
    question: "Does Decyra support role-based access control (RBAC)?",
    answer: "Yes. Decyra allows workspace administrators to configure user permissions, define team workspaces, manage database connection credentials centrally, and restrict which tables or databases specific team members can query."
  },

  // Virtual Golden Layer
  {
    id: "gold-1",
    category: "golden-layer",
    question: "What is the Virtual Golden Layer & Cross-Database Federation?",
    answer: "The Virtual Golden Layer is Decyra's breakthrough engine for querying multiple heterogeneous databases (e.g., PostgreSQL + Snowflake + BigQuery) in a single natural language question without building complex ETL pipelines, managing Airflow DAGs, or paying for Fivetran/dbt syncs. Decyra executes pushdown queries to each system concurrently and performs ultra-fast vectorized joins in an in-memory DuckDB layer in milliseconds."
  },
  {
    id: "gold-2",
    category: "golden-layer",
    question: "How much cost does the Virtual Golden Layer save compared to traditional ETL?",
    answer: "Typical enterprises spend between $50,000 to $200,000 annually on ETL pipeline software (Fivetran, dbt Cloud, Airflow hosting) plus the salaries of 1 to 2 full-time data engineers to maintain replication pipelines just to answer questions spanning two disparate systems. Decyra replaces this brittle overhead with instant on-the-fly federation."
  },
  {
    id: "gold-3",
    category: "golden-layer",
    question: "What is the query latency when joining records across multiple databases?",
    answer: "Decyra uses column projection and predicate pushdown so only the exact filtered rows needed are extracted from each source database. The extracted Arrow buffers are joined in our local vectorized in-memory engine, completing typical cross-database analytical joins in 10 to 50 milliseconds."
  },
  {
    id: "gold-4",
    category: "golden-layer",
    question: "Can I save virtual golden views as reusable Data Marts?",
    answer: "Yes. Once Decyra defines a cross-database join (e.g., 'Customer 360: Stripe Billing + Postgres App Data + Snowflake Warehouse'), you can save it as a Virtual Data Mart. Any team member can query that Mart in plain English without recalculating or reconnecting the underlying databases."
  },

  // Pricing & Deployment
  {
    id: "prc-1",
    category: "pricing",
    question: "Is there a free trial available?",
    answer: "Yes! Decyra offers a 14-day free trial with full access to our database connectors, AI query engine, visualization suite, and schema intelligence tools. No credit card is required to get started."
  },
  {
    id: "prc-2",
    category: "pricing",
    question: "How are query limits calculated?",
    answer: "Our Starter plan includes generous monthly AI query allowances for individual operators. Pro and Team plans provide scalable query tiers for growing teams, while Enterprise plans offer unlimited queries with dedicated high-concurrency LLM processing."
  },
  {
    id: "prc-3",
    category: "pricing",
    question: "Do you offer on-premise or self-hosted VPC deployments?",
    answer: "Yes. For regulated financial institutions, healthcare organizations, and high-security enterprises, Decyra provides a private Docker / Kubernetes deployment package that runs entirely inside your own AWS, GCP, or Azure VPC."
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<FAQItem["category"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "gen-1": true,
    "gen-2": true,
    "gold-1": true
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = 
        searchQuery.trim() === "" ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <NavBar />

      <main className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-24 pb-16 border-b border-[#E5E9F2]">
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[#1E2761]/5 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-[#F96167]/5 blur-3xl pointer-events-none" />

          <div className="max-w-[1000px] mx-auto px-8 max-[640px]:px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3FE] text-[#1E2761] mb-5 border border-[#C7D7F7]">
              <HelpCircle className="w-3.5 h-3.5 text-[#F96167]" />
              Knowledge Base & Support
            </div>

            <h1
              className="text-[48px] max-[1024px]:text-[38px] max-[640px]:text-[30px] font-bold text-[#1E2761] leading-tight mb-5"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Frequently Asked Questions
            </h1>

            <p className="text-[17px] text-[#5A6478] max-w-[680px] mx-auto mb-8">
              Everything you need to know about Decyra&apos;s AI query engine, database connectors, read-only security architecture, and multi-database federation.
            </p>

            {/* Live Search Input */}
            <div className="max-w-[560px] mx-auto relative">
              <Search className="w-5 h-5 text-[#8A94A6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search questions (e.g. read-only, Snowflake, DuckDB, pricing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-[#D0D7E2] shadow-sm text-sm text-[#1E2761] placeholder:text-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#1E2761]/20 focus:border-[#1E2761] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8A94A6] hover:text-[#1E2761]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Category Filter Tabs */}
        <section className="py-8 bg-[#FAFBFC] border-b border-[#E5E9F2] sticky top-16 z-30 backdrop-blur-md bg-[#FAFBFC]/90">
          <div className="max-w-[1000px] mx-auto px-8 max-[640px]:px-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
              {[
                { id: "all", label: "All Questions", icon: Sparkles },
                { id: "general", label: "Product & AI", icon: HelpCircle },
                { id: "connectors", label: "Connectors", icon: Database },
                { id: "security", label: "Security", icon: ShieldCheck },
                { id: "golden-layer", label: "Golden Layer", icon: Layers },
                { id: "pricing", label: "Pricing", icon: DollarSign },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as FAQItem["category"])}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? "bg-[#1E2761] text-white shadow-xs"
                        : "bg-white text-[#5A6478] border border-[#E5E9F2] hover:bg-[#F4F8FE] hover:text-[#1E2761]"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? "text-[#F96167]" : "text-[#5A6478]"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="py-16">
          <div className="max-w-[900px] mx-auto px-8 max-[640px]:px-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-[#FAFBFC] rounded-2xl border border-[#E5E9F2]">
                <HelpCircle className="w-12 h-12 text-[#A8B2C4] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1E2761] mb-1">No matching questions found</h3>
                <p className="text-sm text-[#5A6478] mb-4">
                  We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try another term or contact our support team.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="text-xs font-semibold text-[#F96167] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => {
                  const isOpen = !!openIds[faq.id];
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#E5E9F2] rounded-xl overflow-hidden bg-white hover:border-[#C7D7F7] transition-colors"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none focus:bg-[#FAFBFC]"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base font-semibold text-[#1E2761] leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#8A94A6] flex-shrink-0 transition-transform duration-200 mt-0.5 ${
                            isOpen ? "rotate-180 text-[#F96167]" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-[#5A6478] leading-relaxed border-t border-[#F0F4FA] bg-[#FAFBFC]/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Need More Help Banner */}
            <div className="mt-16 bg-gradient-to-r from-[#1E2761] to-[#2B3577] text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Have a question not listed here?</h3>
                <p className="text-sm text-[#BAC5DE] max-w-[480px]">
                  Our solutions architects and engineering team are available to review your architecture or assist with custom database connectors.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <a
                  href="mailto:support@decyra.systems"
                  className="w-full sm:w-auto bg-[#F96167] text-white font-semibold text-xs rounded-lg px-5 py-3 hover:bg-[#e8535a] transition-all flex items-center justify-center gap-2 text-center"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Engineering
                </a>
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto border border-white/30 text-white font-semibold text-xs rounded-lg px-5 py-3 hover:bg-white/10 transition-all text-center"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
