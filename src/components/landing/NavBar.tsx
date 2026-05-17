"use client";

import React, { useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-[#E5E9F2]"
      role="banner"
    >
      <nav
        className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Left: Wordmark */}
        <Link href="/" aria-label="Decyra home">
          <Wordmark size="md" />
        </Link>

        {/* Right: desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/login"
            className="text-[#1E2761] text-sm font-medium hover:text-[#F96167] transition-colors duration-150"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-[#F96167] text-white text-sm font-medium rounded-lg px-5 py-2.5 hover:bg-[#e8535a] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2"
            id="nav-cta"
          >
            Start here
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-[#1E2761] p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-[#E5E9F2] px-4 py-4 flex flex-col gap-3">
          <Link
            href="/login"
            className="text-[#1E2761] text-sm font-medium py-2"
            onClick={() => setMobileOpen(false)}
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="bg-[#F96167] text-white text-sm font-medium rounded-lg px-5 py-2.5 text-center hover:bg-[#e8535a] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Start here
          </Link>
        </div>
      )}
    </header>
  );
}
