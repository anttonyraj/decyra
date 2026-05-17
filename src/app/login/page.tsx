"use client";

import React, { useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/landing/Wordmark";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

type Stage = "idle" | "loading" | "sent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");

  function validate(value: string) {
    if (!value) return "Enter your work email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "That doesn't look like a valid email.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(email);
    if (err) { setError(err); return; }
    setError("");
    setStage("loading");
    // TODO: call your magic-link API endpoint here
    await new Promise((r) => setTimeout(r, 900)); // simulated latency
    setStage("sent");
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* Minimal top bar */}
      <header className="h-14 flex items-center px-8 max-[640px]:px-4">
        <Link href="/" aria-label="Back to Decyra home">
          <Wordmark size="sm" />
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E5E9F2] px-10 py-12 max-[480px]:px-6 max-[480px]:py-8"
          style={{ boxShadow: "0 8px 32px rgba(30,39,97,0.07)" }}
        >
          {stage === "sent" ? (
            /* ── Confirmation state ── */
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle
                  size={48}
                  className="text-[#F96167]"
                  strokeWidth={1.5}
                />
              </div>
              <h1
                className="text-2xl font-bold text-[#1E2761] mb-3"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Check your inbox.
              </h1>
              <p className="text-[15px] text-[#5A6478] leading-relaxed mb-2">
                We sent a sign-in link to
              </p>
              <p className="text-[15px] font-semibold text-[#1A1F36] mb-6 break-all">
                {email}
              </p>
              <p className="text-[13px] text-[#5A6478] leading-relaxed">
                The link expires in 15 minutes. Check spam if it doesn't arrive
                within a minute.
              </p>
              <button
                onClick={() => { setStage("idle"); setEmail(""); }}
                className="mt-8 text-sm text-[#5A6478] hover:text-[#1E2761] transition-colors underline underline-offset-2"
              >
                Use a different email
              </button>
            </div>
          ) : (
            /* ── Input state ── */
            <>
              {/* Label */}
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5A6478] mb-5">
                Welcome back
              </p>

              {/* Heading */}
              <h1
                className="text-[28px] font-bold text-[#1E2761] leading-tight mb-2"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Sign in to Decyra
              </h1>
              <p className="text-[15px] text-[#5A6478] leading-relaxed mb-8">
                Enter your work email. We'll send you a one-time sign-in link.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <label
                  htmlFor="email"
                  className="block text-[13px] font-semibold text-[#1A1F36] mb-1.5"
                >
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(validate(e.target.value));
                  }}
                  disabled={stage === "loading"}
                  className={`w-full rounded-lg border px-4 py-3 text-[15px] text-[#1A1F36] placeholder:text-[#B0B8CC] outline-none transition-colors duration-150 mb-1 ${
                    error
                      ? "border-[#F96167] focus:border-[#F96167] focus:ring-2 focus:ring-[#FDE2E3]"
                      : "border-[#E5E9F2] focus:border-[#1E2761] focus:ring-2 focus:ring-[#E8EDF7]"
                  } disabled:opacity-50`}
                  aria-describedby={error ? "email-error" : undefined}
                  aria-invalid={!!error}
                />
                {error && (
                  <p
                    id="email-error"
                    className="text-[12px] text-[#F96167] mb-4 mt-1"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                {!error && <div className="mb-4" />}

                <button
                  type="submit"
                  disabled={stage === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-[#F96167] text-white font-semibold rounded-lg py-3 text-[15px] hover:bg-[#e8535a] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  id="login-submit"
                >
                  {stage === "loading" ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send magic link
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Trust note */}
              <p className="mt-6 text-[12px] italic text-[#5A6478] text-center leading-relaxed">
                No password required. Link expires in 15 minutes.
              </p>

              {/* Divider */}
              <div className="mt-8 pt-6 border-t border-[#E5E9F2] text-center">
                <p className="text-[13px] text-[#5A6478]">
                  Don't have an account?{" "}
                  <Link
                    href="/#pricing"
                    className="text-[#1E2761] font-semibold hover:text-[#F96167] transition-colors underline-offset-2"
                  >
                    See plans →
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer strip */}
      <footer className="h-12 flex items-center justify-center gap-6 border-t border-[#E5E9F2] bg-white">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[12px] text-[#5A6478] hover:text-[#1E2761] transition-colors"
        >
          <ArrowLeft size={12} />
          Back to decyra.systems
        </Link>
        <span className="text-[#E5E9F2]">|</span>
        <Link href="#" className="text-[12px] text-[#5A6478] hover:text-[#1E2761] transition-colors">
          Privacy
        </Link>
        <Link href="#" className="text-[12px] text-[#5A6478] hover:text-[#1E2761] transition-colors">
          Terms
        </Link>
      </footer>
    </div>
  );
}
