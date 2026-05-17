import React from "react";
import { ArrowRight } from "lucide-react";

interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div
      className="question-card border border-[#E5E9F2] rounded-xl p-6 bg-white flex flex-col justify-between gap-4 cursor-default"
      tabIndex={0}
      role="article"
    >
      <p
        className="text-[18px] text-[#1E2761] leading-snug"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {question}
      </p>
      <div className="flex justify-end">
        <span className="text-[#F96167]" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      </div>
    </div>
  );
}
