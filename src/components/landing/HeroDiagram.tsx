"use client";

import React from "react";
import {
  Database,
  FileSpreadsheet,
  FileText,
  Cloud,
  Plus,
  TrendingUp,
  Target,
  PieChart,
  AlertCircle,
  Calendar,
  Mail,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import DataSourceCard from "./DataSourceCard";
import BrowserMockup from "./BrowserMockup";

const sourceCards = [
  { icon: Database, label: "PostgreSQL / MySQL", comingSoon: false },
  { icon: FileSpreadsheet, label: "Excel & Google Sheets", comingSoon: true },
  { icon: FileText, label: "CSV uploads", comingSoon: true },
  { icon: Cloud, label: "Salesforce", comingSoon: true },
  { icon: Cloud, label: "HubSpot", comingSoon: true },
  { icon: Plus, label: "More connectors", comingSoon: false, italic: true },
];

const outputCards = [
  { icon: TrendingUp, label: "Pipeline coverage analysis", comingSoon: false },
  { icon: Target, label: "Rep performance & quota tracking", comingSoon: false },
  { icon: PieChart, label: "Win-rate by segment", comingSoon: false },
  { icon: AlertCircle, label: "Anomaly alerts", comingSoon: true },
  { icon: Calendar, label: "Scheduled reports", comingSoon: true },
  { icon: Mail, label: "Email digests", comingSoon: true },
];

/** Three vertically-distributed navy arrows used as connectors between columns */
function ArrowConnector() {
  return (
    <div className="flex flex-col justify-around items-center h-full py-8" aria-hidden="true">
      <ArrowRight size={16} className="text-[#1E2761]" style={{ opacity: 0.3 }} />
      <ArrowRight size={16} className="text-[#1E2761]" style={{ opacity: 0.3 }} />
      <ArrowRight size={16} className="text-[#1E2761]" style={{ opacity: 0.3 }} />
    </div>
  );
}

export default function HeroDiagram() {
  return (
    <div className="w-full">
      {/* Desktop layout */}
      <div className="hidden md:grid items-start gap-0" style={{ gridTemplateColumns: "1fr auto 2fr auto 1fr" }}>
        {/* LEFT: data sources */}
        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            Your Data Sources
          </p>
          <div className="flex flex-col gap-2.5">
            {sourceCards.map((card) => (
              <DataSourceCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                comingSoon={card.comingSoon}
                italic={(card as { italic?: boolean }).italic}
              />
            ))}
          </div>
        </div>

        {/* CONNECTOR: left → center */}
        <div className="w-10 self-stretch mt-6">
          <ArrowConnector />
        </div>

        {/* CENTER: mockup */}
        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            Decyra
          </p>
          <BrowserMockup />
        </div>

        {/* CONNECTOR: center → right */}
        <div className="w-10 self-stretch mt-6">
          <ArrowConnector />
        </div>

        {/* RIGHT: outputs */}
        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            What You Get
          </p>
          <div className="flex flex-col gap-2.5">
            {outputCards.map((card) => (
              <DataSourceCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                comingSoon={card.comingSoon}
                variant="right"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout — stacked vertically */}
      <div className="md:hidden flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            Your Data Sources
          </p>
          <div className="flex flex-col gap-2">
            {sourceCards.map((card) => (
              <DataSourceCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                comingSoon={card.comingSoon}
                italic={(card as { italic?: boolean }).italic}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center text-[#1E2761] opacity-30" aria-hidden="true">
          <ChevronDown size={28} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            Decyra
          </p>
          <BrowserMockup />
        </div>

        <div className="flex justify-center text-[#1E2761] opacity-30" aria-hidden="true">
          <ChevronDown size={28} />
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            What You Get
          </p>
          <div className="flex flex-col gap-2">
            {outputCards.map((card) => (
              <DataSourceCard
                key={card.label}
                icon={card.icon}
                label={card.label}
                comingSoon={card.comingSoon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
