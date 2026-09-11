import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "About Vernyq";
const PAGE_DESCRIPTION =
  "Vernyq is a premium wellness equipment brand focused on doing one product category well — starting with cold plunge tubs.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/about` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/about`,
    siteName: brandConfig.name,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "About" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">About Vernyq</h1>

      <div className="mt-8 space-y-6 text-body-lg leading-relaxed text-[var(--brand-steel)]">
        <p>
          Vernyq exists to make one thing well: a cold plunge tub worth trusting with a
          real, considered purchase. We&apos;d rather sell one product properly —
          researched, specified honestly, and backed by real support — than list dozens
          of items we can&apos;t stand behind.
        </p>
        <p>
          We&apos;re a small, founder-led operation. That means no call center and no
          scripted replies — when you email us, a real person who actually knows the
          product answers. It also means we&apos;re upfront about where we are: we&apos;re
          early, we&apos;re working directly with our manufacturing partner to verify
          every claim before it goes on this site, and we&apos;d rather tell you
          &ldquo;we&apos;re still confirming that&rdquo; than guess.
        </p>
        <p>
          Our approach to product claims is simple: if we haven&apos;t verified it, we
          don&apos;t say it. No invented certifications, no fabricated reviews, no fake
          urgency. Specifications, shipping details, and warranty terms are published as
          they&apos;re confirmed — not before.
        </p>
        <p>
          If you have questions before you buy — about the product, sizing, setup, or
          anything else — <a href={`mailto:${brandConfig.contact.supportEmail}`} className="font-medium text-[var(--brand-ink)] underline underline-offset-2">reach out</a>.
          We&apos;d rather answer a question upfront than have you find out something
          after your order arrives.
        </p>
      </div>
    </div>
  );
}
