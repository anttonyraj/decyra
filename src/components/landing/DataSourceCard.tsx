import React from "react";
import type { LucideIcon } from "lucide-react";

interface DataSourceCardProps {
  icon: LucideIcon;
  label: string;
  comingSoon?: boolean;
  italic?: boolean;
  variant?: "left" | "right";
}

export default function DataSourceCard({
  icon: Icon,
  label,
  comingSoon = false,
  italic = false,
  variant = "left",
}: DataSourceCardProps) {
  return (
    <div
      className={`source-card flex items-center gap-2.5 border border-[#E5E9F2] rounded-lg px-3 py-2.5 bg-white cursor-default select-none ${
        variant === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <Icon
        size={15}
        className="text-[#5A6478] flex-shrink-0"
        aria-hidden="true"
      />
      <span
        className={`text-[13px] font-medium text-[#1A1F36] flex-1 leading-tight ${
          italic ? "italic text-[#5A6478]" : ""
        }`}
      >
        {label}
      </span>
      {comingSoon && (
        <span
          className="flex-shrink-0 rounded-[4px] font-semibold uppercase leading-none"
          style={{
            background: "#FDE2E3",
            color: "#F96167",
            fontSize: "9px",
            letterSpacing: "0.08em",
            padding: "2px 6px",
            marginRight: "0px",
          }}
        >
          Soon
        </span>
      )}
    </div>
  );
}
