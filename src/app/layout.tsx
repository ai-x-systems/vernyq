import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { brandConfig } from "@/config/brand.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}