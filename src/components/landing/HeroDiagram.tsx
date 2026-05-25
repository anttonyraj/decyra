"use client";

import React from "react";
import {
  Database,
  Cloud,
  Plus,
  TrendingUp,
  Target,
  PieChart,
  AlertCircle,
  Calendar,
  Mail,
  ChevronDown,
} from "lucide-react";
import DataSourceCard from "./DataSourceCard";
import BrowserMockup from "./BrowserMockup";

const sourceCards = [
  { icon: Database, label: "PostgreSQL / MySQL", comingSoon: false, checkmark: true },
  { icon: Database, label: "Snowflake", comingSoon: true },
  { icon: Database, label: "BigQuery", comingSoon: true },
  { icon: Database, label: "Redshift", comingSoon: true },
  { icon: Cloud, label: "Salesforce", comingSoon: true },
  { icon: Cloud, label: "HubSpot", comingSoon: true },
  { icon: Plus, label: "More connectors", comingSoon: false, italic: true, href: "mailto:founder@decyra.systems?subject=Requesting%20more%20connectors" },
];

const outputCards = [
  { icon: TrendingUp, label: "Pipeline coverage analysis", comingSoon: false },
  { icon: Target, label: "Rep performance & quota tracking", comingSoon: false },
  { icon: PieChart, label: "Win-rate by segment", comingSoon: false },
  { icon: AlertCircle, label: "Anomaly alerts", comingSoon: true },
  { icon: Calendar, label: "Scheduled reports", comingSoon: true },
  { icon: Mail, label: "Email digests", comingSoon: true },
];

/**
 * Animated coral dots per card row.
 * Pixel positions match card centers.
 */
function FlowConnector({ cardCenters }: { cardCenters: number[] }) {
  const dotStyle = (delay: number): React.CSSProperties => ({
    position: "absolute",
    top: "-2px",
    left: "0",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#F96167",
    animation: `flow-right 2s linear ${delay}s infinite`,
    opacity: 0,
  });

  return (
    <div
      className="relative w-14 self-stretch overflow-visible"
      aria-hidden="true"
    >
      <style>{`
        @keyframes flow-right {
          0%   { transform: translateX(0px);  opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateX(56px); opacity: 0; }
        }
      `}</style>
      {cardCenters.map((top, i) => (
        <div
          key={top}
          style={{ position: "absolute", left: 0, right: 0, top }}
        >
          <div style={{ height: "1px", background: "#E5E9F2", width: "100%" }} />
          <div style={dotStyle(i * 0.28)} />
          <div style={dotStyle(i * 0.28 + 1.1)} />
        </div>
      ))}
    </div>
  );
}

export default function HeroDiagram() {
  const leftCenters = [42, 92, 142, 192, 242, 292, 342];
  const rightCenters = [42, 92, 142, 192, 242, 292];

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
                checkmark={(card as { checkmark?: boolean }).checkmark}
                italic={(card as { italic?: boolean }).italic}
                href={(card as { href?: string }).href}
              />
            ))}
          </div>
        </div>

        {/* CONNECTOR: left → center */}
        <FlowConnector cardCenters={leftCenters} />

        {/* CENTER: mockup */}
        <div className="flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-3 text-center">
            Decyra
          </p>
          <BrowserMockup />
        </div>

        {/* CONNECTOR: center → right */}
        <FlowConnector cardCenters={rightCenters} />

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
                checkmark={(card as { checkmark?: boolean }).checkmark}
                italic={(card as { italic?: boolean }).italic}
                href={(card as { href?: string }).href}
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

