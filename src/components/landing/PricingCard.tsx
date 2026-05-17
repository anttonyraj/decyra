import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  tier: string;
  price: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
  external?: boolean;
}

export default function PricingCard({
  tier,
  price,
  description,
  features,
  ctaLabel,
  ctaHref,
  highlighted = false,
  badge,
  external = false,
}: PricingCardProps) {
  const ctaClasses = highlighted
    ? "bg-[#F96167] text-white hover:bg-[#e8535a]"
    : "border border-[#1E2761] text-[#1E2761] hover:bg-[#E8EDF7]";

  return (
    <div
      className={`pricing-card rounded-2xl p-8 flex flex-col gap-6 bg-white ${
        highlighted
          ? "border-2 border-[#F96167] relative"
          : "border border-[#E5E9F2]"
      }`}
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-[#F96167] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Tier header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#5A6478] mb-1">
          {tier}
        </p>
        <div className="flex items-end gap-1">
          <span
            className="text-4xl font-bold text-[#1A1F36]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {price}
          </span>
          <span className="text-[#5A6478] text-sm mb-1.5">/month</span>
        </div>
        <p className="text-sm text-[#5A6478] mt-1.5">{description}</p>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f) => {
          const isComingSoon = f.includes("(coming soon)");
          const label = f.replace(" (coming soon)", "");
          return (
            <li key={f} className="flex items-start gap-2.5">
              <Check
                size={15}
                className={`flex-shrink-0 mt-0.5 ${
                  isComingSoon ? "text-[#5A6478] opacity-50" : "text-[#1E2761]"
                }`}
              />
              <span
                className={`text-sm leading-snug ${
                  isComingSoon
                    ? "text-[#5A6478] opacity-60"
                    : "text-[#1A1F36]"
                }`}
              >
                {label}
                {isComingSoon && (
                  <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#5A6478] border border-[#5A6478] rounded px-1 py-0.5 opacity-60">
                    soon
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      {external ? (
        <a
          href={ctaHref}
          className={`block text-center rounded-lg py-3 px-6 text-sm font-semibold transition-colors duration-150 ${ctaClasses}`}
        >
          {ctaLabel}
        </a>
      ) : (
        <Link
          href={ctaHref}
          className={`block text-center rounded-lg py-3 px-6 text-sm font-semibold transition-colors duration-150 ${ctaClasses}`}
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
