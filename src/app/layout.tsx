import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { brandConfig } from "@/config/brand.config";
import "./globals.css";

// The Vernyq design system (Stitch export, Aug 2026) specifies Inter
// exclusively — including for the uppercase "technical label" treatment
// that previously used a mono font. Mapped to both CSS font variables
// below so existing font-mono utility usage keeps working during the
// phased restyle (R1-R5) rather than breaking until every component is
// touched.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Placeholder metadata for scaffolding — the full Metadata API strategy
// (per-page overrides, JSON-LD, canonical URLs) is built in Phase 2K.
export const metadata: Metadata = {
  title: brandConfig.seo.defaultTitle,
  description: brandConfig.seo.defaultDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
