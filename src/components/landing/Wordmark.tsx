import React from "react";

interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

const sizeMap = {
  sm: { dot: "w-1.5 h-1.5", text: "text-sm tracking-[0.15em]", tagline: "text-[8px]", ml: "ml-3.5" },
  md: { dot: "w-2 h-2",     text: "text-base tracking-[0.15em]", tagline: "text-[9px]", ml: "ml-4" },
  lg: { dot: "w-2.5 h-2.5", text: "text-lg tracking-[0.15em]", tagline: "text-[10px]", ml: "ml-5" },
};

export default function Wordmark({ size = "md", className = "", showTagline = false }: WordmarkProps) {
  const s = sizeMap[size];
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className={`inline-block ${s.dot} rounded-full bg-[#F96167] flex-shrink-0`}
          aria-hidden="true"
        />
        <span
          className={`font-serif font-bold text-[#1E2761] ${s.text} leading-none`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          DECYRA
        </span>
      </div>
      {showTagline && (
        <span
          className={`${s.tagline} font-medium uppercase tracking-[0.1em] text-[#5A6478] leading-none ${s.ml}`}
        >
          AI Data Intelligence
        </span>
      )}
    </div>
  );
}
