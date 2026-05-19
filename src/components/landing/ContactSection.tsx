"use client";

import React, { useState } from "react";
import { ShieldCheck, Database, Code2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactSection() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStartTrial = () => {
    setIsRedirecting(true);
    // Short delay for visual feedback before redirecting
    setTimeout(() => {
      router.push("/login");
    }, 800);
  };

  return (
    <section id="contact" className="bg-[#1A1F36] py-24 max-[640px]:py-16 text-white border-t border-[#2A314D]">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-16 items-center">
          
          {/* Left: Onboarding Info */}
          <div className="bg-white rounded-2xl p-8 max-[640px]:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h2 className="text-[32px] font-bold text-[#1E2761] leading-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Start your free trial. No credit card required.
            </h2>
            <p className="text-[#5A6478] mb-8 text-[15px]">
              Connect your database in seconds. Ask your first question in minutes.
            </p>

            <div className="grid grid-cols-2 gap-6 max-[500px]:grid-cols-1 mb-8">
              <div>
                <h3 className="text-[15px] font-bold text-[#1E2761] mb-1.5" style={{ fontFamily: "Georgia, serif" }}>
                  14-day free trial
                </h3>
                <p className="text-[13px] text-[#5A6478] leading-relaxed mb-1">
                  Full access to all features. Unlimited queries. Your demo database included.
                </p>
                <p className="text-[11px] text-[#8C9BA5] italic">
                  If you connect your own database, we'll walk you through the 5-minute setup.
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1E2761] mb-1.5" style={{ fontFamily: "Georgia, serif" }}>
                  Magic link authentication
                </h3>
                <p className="text-[13px] text-[#5A6478] leading-relaxed mb-1">
                  Sign in with your email. No password to remember. No credit card to enter.
                </p>
                <p className="text-[11px] text-[#8C9BA5] italic">
                  Start asking questions immediately.
                </p>
              </div>
            </div>

            <button 
              onClick={handleStartTrial}
              disabled={isRedirecting}
              className="w-full bg-[#F96167] text-white font-semibold rounded-lg px-6 py-4 text-base hover:bg-[#e8535a] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2 disabled:opacity-85 disabled:cursor-not-allowed"
            >
              {isRedirecting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Redirecting to sign in...
                </>
              ) : (
                "Start free trial"
              )}
            </button>
            
            <p className="text-[12px] text-[#5A6478] text-center mt-3 leading-relaxed">
              Includes 14-day trial on demo database. Connect your own data to start testing with real numbers.
            </p>
          </div>

          {/* Right: Trust / Visual */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[40px] max-[640px]:text-[32px] font-bold leading-tight mb-8 text-white" style={{ fontFamily: "Georgia, serif" }}>
              Everything you need to get started.
            </h3>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <ShieldCheck size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Security First</h4>
                  <p className="text-[#A6B0C3] text-[15px]">Read-only access only. Your data never leaves your database.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <Database size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Instant Setup</h4>
                  <p className="text-[#A6B0C3] text-[15px]">Connect your Postgres, Snowflake, or BigQuery in 5 minutes. Schema auto-detected.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <Code2 size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Full Transparency</h4>
                  <p className="text-[#A6B0C3] text-[15px]">See the SQL behind every answer. Audit, verify, copy, modify.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

