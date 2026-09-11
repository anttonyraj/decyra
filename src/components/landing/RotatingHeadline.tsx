"use client";

import React, { useState, useEffect } from "react";

const rotatingPhrases = [
  "in your own language.",
  "in plain English.",
  "in Arabic (العربية).",
  "in Spanish (Español).",
  "in French (Français).",
  "in Hindi (हिन्दी).",
  "in any language.",
];

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mx-auto max-w-[960px]">
      <h1
        id="hero-headline"
        className="text-[58px] max-[1024px]:text-[46px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.14] mb-5 tracking-tight"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <span className="block">Ask your business data anything</span>
        <span className="relative inline-grid text-center mt-2 min-h-[1.25em]">
          {rotatingPhrases.map((phrase, i) => (
            <span
              key={phrase}
              className={`col-start-1 row-start-1 text-[#F96167] underline decoration-[#F96167]/30 transition-all duration-700 ease-in-out whitespace-nowrap ${
                i === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3 pointer-events-none"
              }`}
            >
              {phrase}
            </span>
          ))}
        </span>
      </h1>
      <p
        className="text-[24px] max-[1024px]:text-[20px] max-[640px]:text-[17px] font-medium text-[#1E2761] mb-6 leading-snug"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Get instant, auditable answers backed by real SQL.
      </p>
    </div>
  );
}
