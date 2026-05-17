import React from "react";

interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { dot: "w-1.5 h-1.5", text: "text-sm tracking-[0.15em]" },
  md: { dot: "w-2 h-2", text: "text-base tracking-[0.15em]" },
  lg: { dot: "w-2.5 h-2.5", text: "text-lg tracking-[0.15em]" },
};

export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  const styles = sizeMap[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className={`inline-block ${styles.dot} rounded-full bg-[#F96167] flex-shrink-0`}
        aria-hidden="true"
      />
      <span
        className={`font-serif font-bold text-[#1E2761] ${styles.text} leading-none`}
        style={{ fontFamily: "Georgia, serif" }}
      >
        DECYRA
      </span>
    </div>
  );
}
