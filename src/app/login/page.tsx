"use client";

import React, { useState } from "react";
import Link from "next/link";
import Wordmark from "@/components/landing/Wordmark";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Stage = "idle" | "loading" | "sent" | "google_loading";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get("error");
      const descParam = params.get("desc");
      if (errorParam === "auth_failed") {
        setError(descParam ? `${descParam} Please try using a magic link instead.` : "Authentication failed. Please try using a magic link instead.");
      }
    }
  }, []);

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
    
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setStage("idle");
    } else {
      setStage("sent");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setStage("google_loading");
    
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      setError(authError.message + " Please try using a magic link instead.");
      setStage("idle");
    }
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

              {/* Google Sign-in button */}
              <button
                type="button"
                disabled={stage === "loading" || stage === "google_loading"}
                onClick={handleGoogleSignIn}
                className="w-full h-12 flex items-center justify-center gap-[12px] bg-white border border-[#E5E9F2] rounded-lg hover:bg-[#FAFBFC] hover:border-[#D1D5DB] transition-all duration-150 text-[15px] text-[#1E2761] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stage === "google_loading" ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-[#1E2761] border-t-transparent rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="h-[1px] bg-[#E5E9F2] flex-1" />
                <span className="text-[13px] text-[#5A6478] px-4 font-normal">or</span>
                <div className="h-[1px] bg-[#E5E9F2] flex-1" />
              </div>

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
                  disabled={stage === "loading" || stage === "google_loading"}
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
                  disabled={stage === "loading" || stage === "google_loading"}
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
        <Link href="/privacy" className="text-[12px] text-[#5A6478] hover:text-[#1E2761] transition-colors">
          Privacy
        </Link>
        <Link href="/terms" className="text-[12px] text-[#5A6478] hover:text-[#1E2761] transition-colors">
          Terms
        </Link>
      </footer>
    </div>
  );
}
