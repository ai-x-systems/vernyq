import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Returns";
const PAGE_DESCRIPTION = "Return information for Vernyq orders.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/returns` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/returns`,
    siteName: brandConfig.name,
    type: "website",
  },
};

/**
 * DEV NOTE (not shown to customers): return window (days) is not
 * finalized — flagged as an open decision. This is a real launch risk:
 * shipping a $6k checkout with no stated return policy is worth deciding
 * before real orders start flowing, both for customer trust and for
 * payment-dispute exposure. Copy below is honest but deliberately
 * doesn't commit to a specific window.
 */
export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Returns" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Returns</h1>

      <div className="mt-8 space-y-6 text-body-lg leading-relaxed text-[var(--brand-steel)]">
        <p>
          A cold plunge tub is a considerable investment and expensive to ship, so we
          want to help you get it right the first time. Before ordering, feel free to{" "}
          <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            reach out with any questions
          </a>{" "}
          about sizing, setup, or specifications.
        </p>
        <p>
          If there&apos;s a problem with your order — it arrives damaged, defective, or
          not as described — contact us with your order reference as soon as possible
          and we&apos;ll work with you to make it right.
        </p>
        <p>
          We&apos;re finalizing our full written returns policy and will publish it here
          once confirmed. If a specific return window matters to your purchase decision,
          contact us before ordering and we&apos;ll give you our current, honest answer.
        </p>
      </div>
    </div>
  );
}
