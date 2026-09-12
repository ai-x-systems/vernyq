import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Contact Us";
const PAGE_DESCRIPTION = "Get in touch with Vernyq for questions about orders, products, or support.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/contact` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/contact`,
    siteName: brandConfig.name,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Contact Us</h1>
      <p className="text-body-lg mt-4 leading-relaxed text-[var(--brand-steel)]">
        Questions about a product, an existing order, or anything else — email us and
        we&apos;ll get back to you as soon as we can.
      </p>

      <div className="mt-8 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-[var(--brand-accent)]" />
          <a href={`mailto:${brandConfig.contact.supportEmail}`} className="text-body font-medium text-[var(--brand-ink)] underline underline-offset-2">
            {brandConfig.contact.supportEmail}
          </a>
        </div>
        <p className="text-body-sm mt-3 text-[var(--brand-steel)]">
          If your question is about an existing order, include your order reference
          (shown on your order confirmation page) so we can find it quickly.
        </p>
      </div>

      <p className="text-body-sm mt-6 text-[var(--brand-steel)]">
        Looking for an existing order?{" "}
        <a href="/track-order" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
          Track your order
        </a>{" "}
        instead.
      </p>
    </div>
  );
}
