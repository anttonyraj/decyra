import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import ContactSection from "@/components/landing/ContactSection";

export const metadata = {
  title: "Contact Us & Investor Relations | Decyra",
  description: "Get in touch with the Decyra team for enterprise deployments, investor inquiries, data room access, or custom database connectors.",
};

export default function ContactPage() {
  return (
    <>
      <NavBar />
      <main className="bg-[#1A1F36] min-h-screen">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
