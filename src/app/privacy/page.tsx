import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy | Decyra",
  description: "Learn how Decyra handles your data, database credentials, and privacy safeguards.",
};

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "data-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Information" },
  { id: "security-safeguards", title: "4. Security & Database Safeguards" },
  { id: "data-retention", title: "5. Data Retention & Privacy" },
  { id: "third-party", title: "6. Third-Party Processors" },
  { id: "your-rights", title: "7. Your Rights & Choices" },
  { id: "changes", title: "8. Changes to This Policy" },
  { id: "contact", title: "9. Contact Us" },
];

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 bg-[#FAFDFC] py-20 px-8 max-[640px]:px-4">
        <div className="max-w-[1000px] mx-auto">
          {/* Header */}
          <div className="border-b border-[#E5E9F2] pb-10 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#1E2761] mb-4">
              Privacy Policy
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
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  1. Introduction
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    Decyra (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website and services located at{" "}
                    <a href="https://decyra.systems" className="text-[#F96167] hover:underline font-medium">
                      decyra.systems
                    </a>{" "}
                    (collectively, the &ldquo;Service&rdquo;).
                  </p>
                  <p>
                    We respect your privacy and are committed to protecting it. This Privacy Policy describes
                    the types of information we may collect from you or that you may provide when you connect your
                    databases and use Decyra, and our practices for collecting, using, maintaining, protecting,
                    and disclosing that information.
                  </p>
                </div>
              </section>

              <section id="data-we-collect" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  2. Information We Collect
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    We collect several types of information from and about users of our Service:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#1A1F36]">Account Information:</strong> When you sign up, we collect your email address.
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">Database Metadata:</strong> To enable natural language querying, Decyra reads your database schema (table names, column names, data types, and key relationships).
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">Temporary Query Data:</strong> When you ask questions, our system executes queries against your connected database and returns the results to you. Query results are processed dynamically to formulate answers.
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">Usage & Diagnostics:</strong> We collect info on how you use our app, including query history, performance metrics, and device identifiers via Vercel Analytics.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="how-we-use" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  3. How We Use Information
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Provide, maintain, and improve the Service.</li>
                    <li>Generate SQL queries based on your natural language inputs.</li>
                    <li>Retrieve read-only data from your database to formulate explanations.</li>
                    <li>Send you technical notices, updates, and support messages.</li>
                    <li>Monitor and analyze usage trends to improve user experience.</li>
                  </ul>
                </div>
              </section>

              <section id="security-safeguards" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  4. Security & Database Safeguards
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <div className="bg-[#E8EDF7]/50 border border-[#E5E9F2] rounded-xl p-6 mb-4">
                    <h3 className="text-[15px] font-semibold text-[#1E2761] mb-2">Our Read-Only Mandate</h3>
                    <p className="text-sm">
                      Decyra connects to customer databases using <strong className="text-[#1E2761]">strictly read-only</strong> credentials.
                      We do not require and will never ask for write permissions (INSERT, UPDATE, DELETE). This prevents any potential data modification or deletion risks.
                    </p>
                  </div>
                  <p>
                    We employ industry-standard administrative, technical, and physical security measures to protect your data:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Database credentials are encrypted at rest using AES-256 encryption.</li>
                    <li>All network traffic between Decyra and your database is encrypted using TLS.</li>
                    <li>We support secure connection options, including IP whitelisting and SSH tunneling, to limit database access to authorized Decyra servers.</li>
                  </ul>
                </div>
              </section>

              <section id="data-retention" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  5. Data Retention & Privacy
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    We do not copy, replicate, or store your database&apos;s records in our own databases. When a query is run, the records are held in volatile memory to construct the answer and then discarded. We only store database connection configuration and schema metadata.
                  </p>
                </div>
              </section>

              <section id="third-party" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  6. Third-Party Processors
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    We use reputable third-party processors to host our platform, provide authentication, and process AI operations:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#1A1F36]">Supabase:</strong> For user authentication and database storage of account credentials.
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">Vercel:</strong> For application hosting and Vercel Analytics.
                    </li>
                    <li>
                      <strong className="text-[#1A1F36]">OpenAI / Anthropic:</strong> For natural language processing and SQL generation. We sign agreements ensuring your schema information and queries are not used to train models.
                    </li>
                  </ul>
                </div>
              </section>

              <section id="your-rights" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  7. Your Rights & Choices
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    Depending on your location, you may have specific rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The right to access, update, or delete your account information.</li>
                    <li>The right to disconnect your database at any time, which immediately deletes all cached schema metadata.</li>
                    <li>The right to opt-out of marketing communications.</li>
                  </ul>
                </div>
              </section>

              <section id="changes" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  8. Changes to This Policy
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Effective Date&rdquo; at the top of this policy.
                  </p>
                </div>
              </section>

              <section id="contact" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#1E2761] font-serif mb-4">
                  9. Contact Us
                </h2>
                <div className="text-[#5A6478] text-[15px] leading-relaxed space-y-4">
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:
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
