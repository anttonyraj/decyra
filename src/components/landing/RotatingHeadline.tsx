"use client";

import React, { useState, useEffect } from "react";

interface RotatingItem {
  phrase: string;
  color: string;
  underlineColor: string;
}

// Ordered by most spoken world languages, with culturally resonant colors
// Arabic shines in vibrant emerald green (esteemed and loved in Arab and Islamic culture)
const rotatingPhrases: RotatingItem[] = [
  { phrase: "in your own language.", color: "#F96167", underlineColor: "rgba(249, 97, 103, 0.35)" },
  { phrase: "in Arabic (العربية).", color: "#059669", underlineColor: "rgba(5, 150, 105, 0.45)" }, // Emerald green for Arabic & Islamic tradition
  { phrase: "in plain English.", color: "#2563EB", underlineColor: "rgba(37, 99, 235, 0.4)" }, // Classic tech royal blue
  { phrase: "in Spanish (Español).", color: "#EA580C", underlineColor: "rgba(234, 88, 12, 0.4)" }, // Warm terracotta / golden flame
  { phrase: "in Chinese (中文).", color: "#E11D48", underlineColor: "rgba(225, 29, 72, 0.4)" }, // Imperial red / celebratory crimson
  { phrase: "in French (Français).", color: "#3B82F6", underlineColor: "rgba(59, 130, 246, 0.4)" }, // Azure blue
  { phrase: "in German (Deutsch).", color: "#D97706", underlineColor: "rgba(217, 119, 6, 0.4)" }, // Amber gold
  { phrase: "in any language.", color: "#8B5CF6", underlineColor: "rgba(139, 92, 246, 0.4)" }, // Universal violet
];

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const currentItem = rotatingPhrases[index];

  return (
    <div className="text-center mx-auto max-w-[960px]">
      <h1
        id="hero-headline"
        className="text-[58px] max-[1024px]:text-[46px] max-[640px]:text-[32px] font-bold text-[#1E2761] leading-[1.14] mb-5 tracking-tight"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <span className="block">Ask your business data anything</span>
        <span className="relative inline-grid text-center mt-2 min-h-[1.25em]">
          {rotatingPhrases.map((item, i) => (
            <span
              key={item.phrase}
              style={{
                color: item.color,
                textDecorationColor: item.underlineColor,
              }}
              className={`col-start-1 row-start-1 underline transition-all duration-700 ease-in-out whitespace-nowrap ${
                i === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3 pointer-events-none"
              }`}
            >
              {item.phrase}
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
