import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Terms of Service | Decyra",
  description: "Read the Terms of Service for using the Decyra business data assistant.",
};

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "description-service", title: "2. Description of Service" },
  { id: "accounts", title: "3. User Accounts & Registration" },
  { id: "database-connections", title: "4. Database Connections & Safety" },
  { id: "ai-disclaimers", title: "5. AI Features & Output Disclaimers" },
  { id: "fees-billing", title: "6. Fees, Billing & Subscriptions" },
  { id: "termination", title: "7. Account Termination" },
  { id: "limitation-liability", title: "8. Limitation of Liability" },
  { id: "governing-law", title: "9. Governing Law" },
  { id: "contact", title: "10. Contact Us" },
];

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-[#FAFDFC] py-20 px-8 max-[640px]:px-4">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="border-b border-[#E5E9F2] pb-10 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#1E2761] mb-4">
              Terms of Service
            </h1>
            <p className="text-sm text-[#5A6478]">
              Effective Date: May 22, 2026 &bull; Last Updated: May 22, 2026
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sticky Sidebar Table of Contents */}
            <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24 border border-[#E5E9F2] bg-white rounded-xl p-5 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1F36] mb-4">
                  On this page
                </h2>
                <nav className="flex flex-col gap-3">
                  {SECTIONS.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="text-xs text-[#5A6478] hover:text-[#F96167] transition-colors"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Document Content */}
            <div className="flex-1 text-[#1A1F36] space-y-12">
              <section id="acceptance" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  1. Acceptance of Terms
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    By accessing or using Decyra (&ldquo;Service&rdquo;), provided by Decyra (&ldquo;we&rdquo;,
                    &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service
                    (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you may not access or use the Service.
                  </p>
                  <p>
                    These Terms apply to all visitors, users, and others who access or use the Service.
                  </p>
                </div>
              </section>

              <section id="description-service" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  2. Description of Service
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    Decyra provides an AI-powered conversational analytics tool that connects to your business databases,
                    translates natural language questions into database queries (SQL), executes them, and returns formatted
                    answers and insights.
                  </p>
                </div>
              </section>

              <section id="accounts" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  3. User Accounts & Registration
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    To use the Service, you must sign in using a valid work email address. You are responsible for
                    maintaining the security of your account and the email address used to sign in. You agree to notify us
                    immediately of any unauthorized use of your account or security breach.
                  </p>
                </div>
              </section>

              <section id="database-connections" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  4. Database Connections & Safety
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    To enable the core features of Decyra, you must connect the Service to your database.
                  </p>
                  <div className="bg-[#E8EDF7]/50 border border-[#E5E9F2] rounded-xl p-6 mb-4">
                    <h3 className="text-[15px] font-semibold text-[#1E2761] mb-2">Important Credential Requirements</h3>
                    <p className="text-sm leading-relaxed text-[#5A6478]">
                      You agree to only supply <strong className="text-[#1E2761]">strictly read-only</strong> database credentials to Decyra.
                      You are solely responsible for ensuring that the provided user account in your database has no write (INSERT, UPDATE, DELETE, ALTER, etc.) permissions. Decyra will not be liable for any modifications or losses arising from write permissions left enabled on credentials provided to the Service.
                    </p>
                  </div>
                </div>
              </section>

              <section id="ai-disclaimers" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  5. AI Features & Output Disclaimers
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    Decyra uses advanced large language models (LLMs) to interpret your schema and draft SQL queries.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#1A1F36]">Accuracy Disclaimer:</strong> While we continuously improve query generation, AI models can occasionally produce incorrect, sub-optimal, or incomplete SQL statements (&ldquo;hallucinations&rdquo;).
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">User Verification:</strong> You are responsible for verifying the accuracy of critical outputs, especially before making business decisions based on queries run via Decyra.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="fees-billing" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  6. Fees, Billing & Subscriptions
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    Certain aspects of the Service may be provided for a fee or subscription.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#1A1F36]">Payment:</strong> You agree to pay all fees or charges to your account in accordance with the billing terms in effect.
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">Cancellation:</strong> Subscriptions can be cancelled at any time through the billing dashboard. Cancellations will apply to the next billing period.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="termination" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  7. Account Termination
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    We may terminate or suspend access to our Service immediately, without prior notice or liability, for
                    any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms
                    which by their nature should survive termination shall survive, including, without limitation, ownership
                    provisions, warranty disclaimers, indemnity, and limitations of liability.
                  </p>
                </div>
              </section>

              <section id="limitation-liability" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  8. Limitation of Liability
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    In no event shall Decyra, nor its directors, employees, partners, agents, suppliers, or affiliates, be
                    liable for any indirect, incidental, special, consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Your access to or use of or inability to access or use the Service.</li>
                    <li>Any conduct or content of any third party on the Service.</li>
                    <li>Any content obtained from the Service.</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                  </ul>
                </div>
              </section>

              <section id="governing-law" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  9. Governing Law
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of Delaware, United States,
                    without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  10. Contact Us
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="font-semibold text-[#1A1F36]">
                    Email: support@decyra.systems
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
