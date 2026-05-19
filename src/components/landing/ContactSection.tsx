"use client";

import React, { useState } from "react";
import { CheckCircle, ArrowRight, ShieldCheck, Database, Code2 } from "lucide-react";

export default function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Dummy submit delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="bg-[#1A1F36] py-24 max-[640px]:py-16 text-white border-t border-[#2A314D]">
      <div className="max-w-[1280px] mx-auto px-8 max-[640px]:px-4">
        <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-16 items-center">
          
          {/* Left: Form */}
          <div className="bg-white rounded-2xl p-8 max-[640px]:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <h2 className="text-[32px] font-bold text-[#1E2761] leading-tight mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Book a Strategy Call
            </h2>
            <p className="text-[#5A6478] mb-8">
              See how Decyra can give your team operational visibility in seconds.
            </p>

            {isSubmitted ? (
              <div className="bg-[#E8EDF7] rounded-xl p-10 text-center flex flex-col items-center">
                <CheckCircle size={56} className="text-[#1E2761] mb-5" />
                <h3 className="text-2xl font-bold text-[#1E2761] mb-3" style={{ fontFamily: "Georgia, serif" }}>Request Received</h3>
                <p className="text-[#5A6478] text-[16px]">Our team will be in touch shortly to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5 max-[500px]:grid-cols-1">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#1E2761] mb-1.5">Full Name</label>
                    <input required type="text" id="name" placeholder="John Doe" className="w-full bg-[#FAFBFC] border border-[#E5E9F2] rounded-lg px-4 py-3 text-[#1A1F36] placeholder-[#A6B0C3] focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1E2761] mb-1.5">Work Email</label>
                    <input required type="email" id="email" placeholder="john@company.com" className="w-full bg-[#FAFBFC] border border-[#E5E9F2] rounded-lg px-4 py-3 text-[#1A1F36] placeholder-[#A6B0C3] focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-[#1E2761] mb-1.5">Company Name</label>
                  <input required type="text" id="company" placeholder="Acme Corp" className="w-full bg-[#FAFBFC] border border-[#E5E9F2] rounded-lg px-4 py-3 text-[#1A1F36] placeholder-[#A6B0C3] focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent transition-all" />
                </div>

                <div>
                  <label htmlFor="usecase" className="block text-sm font-semibold text-[#1E2761] mb-1.5">Primary Use Case</label>
                  <select required id="usecase" defaultValue="" className="w-full bg-[#FAFBFC] border border-[#E5E9F2] rounded-lg px-4 py-3 text-[#1A1F36] focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Select an option...</option>
                    <option value="revops">Revenue Operations (RevOps)</option>
                    <option value="sales">Sales Leadership</option>
                    <option value="cs">Customer Success</option>
                    <option value="finance">Finance / Strategic Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1E2761] mb-1.5">How can we help?</label>
                  <textarea id="message" rows={4} placeholder="Briefly describe what you're looking to solve..." className="w-full bg-[#FAFBFC] border border-[#E5E9F2] rounded-lg px-4 py-3 text-[#1A1F36] placeholder-[#A6B0C3] focus:outline-none focus:ring-2 focus:ring-[#1E2761] focus:border-transparent transition-all resize-none"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#F96167] text-white font-semibold rounded-lg px-6 py-4 text-base hover:bg-[#e8535a] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#F96167] focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? "Sending..." : (
                    <>
                      Request Consultation <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Trust / Visual */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[40px] max-[640px]:text-[32px] font-bold leading-tight mb-6 text-white" style={{ fontFamily: "Georgia, serif" }}>
              Enterprise-grade AI, <br />ready for your data.
            </h3>
            <p className="text-[#A6B0C3] text-lg leading-relaxed mb-10 max-w-[500px]">
              Deploy Decyra securely in your environment. Our team will help you map your schema and configure your first operational workflows.
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <ShieldCheck size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Security First</h4>
                  <p className="text-[#A6B0C3] text-[15px]">Read-only architecture with zero data retention.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <Database size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Instant Connection</h4>
                  <p className="text-[#A6B0C3] text-[15px]">Connects to Postgres and automatically maps your schema.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-[#2A314D] flex items-center justify-center">
                  <Code2 size={20} className="text-[#F96167]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1" style={{ fontFamily: "Georgia, serif" }}>Auditable SQL</h4>
                  <p className="text-[#A6B0C3] text-[15px]">Every answer is backed by transparent, verifiable code.</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
