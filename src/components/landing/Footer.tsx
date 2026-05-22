import React from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E9F2]" role="contentinfo">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: wordmark + copyright */}
        <div className="flex items-center gap-3">
          <Wordmark size="sm" />
          <span className="text-[#5A6478] text-xs hidden sm:inline">
            &copy; 2026 Decyra
          </span>
        </div>

        {/* Right: links */}
        <nav aria-label="Footer navigation">
          <div className="flex items-center gap-4">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/#contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-[#5A6478] hover:text-[#1E2761] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
