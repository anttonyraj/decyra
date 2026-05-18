import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://decyra.systems"),
  title: "Decyra: Ask Your Business Data Anything",
  description:
    "Decyra connects to your data, generates SQL, runs it, and explains what it found in plain English. Built for RevOps teams at growing B2B SaaS companies. No SQL skills required.",
  keywords:
    "RevOps analytics, business intelligence, SQL generator, pipeline coverage, quota attainment, deal velocity, B2B SaaS analytics",
  openGraph: {
    title: "Decyra: Ask Your Business Data Anything",
    description:
      "AI data intelligence for RevOps and business operations teams. Connect your data, ask in plain English, get answers in seconds.",
    type: "website",
    url: "https://decyra.systems",
  },
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='white'/><circle cx='16' cy='16' r='8' fill='%23F96167'/></svg>",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-white text-[#1A1F36]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
