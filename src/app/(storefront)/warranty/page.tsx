import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Warranty";
const PAGE_DESCRIPTION = "Warranty information for Vernyq products.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/warranty` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/warranty`,
    siteName: brandConfig.name,
    type: "website",
  },
};

/**
 * DEV NOTE (not shown to customers): warranty duration and exact coverage
 * terms are not finalized. Do not add a specific time period (e.g. "1
 * year") to this page until that's actually been decided — see the
 * open flag from the technical audit. Copy below commits only to what's
 * actually true right now: we'll stand behind manufacturing defects,
 * without inventing a duration.
 */
export default function WarrantyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Warranty" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Warranty</h1>

      <div className="mt-8 space-y-6 text-body-lg leading-relaxed text-[var(--brand-steel)]">
        <p>
          We stand behind the products we sell. If your unit arrives with a
          manufacturing defect, or fails under normal use due to a manufacturing issue,{" "}
          <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            contact us
          </a>{" "}
          with your order reference and a description (and photos, if relevant) of the
          issue, and we&apos;ll work with you to resolve it.
        </p>
        <p>
          We&apos;re finalizing the full written warranty terms — including exact
          coverage period and process — with our manufacturing partner, and will
          publish them here once confirmed. If specific warranty terms matter to your
          purchase decision, contact us before ordering and we&apos;ll give you our
          current, honest answer rather than a number we haven&apos;t confirmed yet.
        </p>
      </div>
    </div>
  );
}
