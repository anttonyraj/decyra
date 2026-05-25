"use client";

import { useEffect, useRef } from "react";

export default function VisitorTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackVisitor = async () => {
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "visitor",
            referrer: document.referrer || "Direct",
            platform: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
          }),
        });
      } catch (err) {
        console.error("Visitor tracking error:", err);
      }
    };

    // Delay slightly to prioritize critical page loading path assets
    const timer = setTimeout(trackVisitor, 1200);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
