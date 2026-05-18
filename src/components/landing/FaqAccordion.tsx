"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem = ({ question, answer, isOpen, onClick }: FaqItemProps) => {
  return (
    <div className="border-b border-[#E5E9F2] last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2761] focus-visible:ring-offset-2 rounded-sm group"
        aria-expanded={isOpen}
      >
        <span
          className="text-[18px] max-[640px]:text-[16px] font-bold text-[#1E2761] pr-6"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {question}
        </span>
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full border border-[#E5E9F2] flex items-center justify-center text-[#5A6478] transition-all duration-200 group-hover:border-[#1E2761] group-hover:text-[#1E2761]",
            isOpen && "border-[#1E2761] bg-[#1E2761] text-white"
          )}
        >
          <ChevronDown
            size={18}
            className={cn("transition-transform duration-200", isOpen && "rotate-180")}
          />
        </div>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-[16px] text-[#5A6478] leading-relaxed pr-10">
          {answer}
        </p>
      </div>
    </div>
  );
};

interface FaqAccordionProps {
  items: {
    question: string;
    answer: React.ReactNode;
  }[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto max-w-[800px] bg-white border border-[#E5E9F2] rounded-xl px-8 max-[640px]:px-4 shadow-sm">
      {items.map((item, index) => (
        <FaqItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
