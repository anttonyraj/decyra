import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.15em] text-[#1E2761] mb-5 ${className}`}
    >
      {children}
    </p>
  );
}
