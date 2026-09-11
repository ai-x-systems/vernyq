import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Shipping";
const PAGE_DESCRIPTION = "Shipping information for Vernyq orders.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/shipping` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/shipping`,
    siteName: brandConfig.name,
    type: "website",
  },
};

/**
 * DEV NOTE (not shown to customers): shipping origin, carrier, and lead
 * time are not finalized — supplier/fulfillment validation is still in
 * progress. Copy below is deliberately non-committal (no specific days,
 * no "ships from US warehouse" claim) so nothing here becomes a promise
 * we can't keep. Update this page with real numbers once fulfillment is
 * confirmed — see Phase 6/7 (admin + fulfillment) in the project plan.
 */
export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Shipping" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Shipping</h1>

      <div className="mt-8 space-y-6 text-body-lg leading-relaxed text-[var(--brand-steel)]">
        <p>
          We currently ship to customers within the United States. Because a cold plunge
          tub is a large, carefully packaged item, delivery is arranged individually for
          each order rather than through instant automated shipping quotes.
        </p>
        <p>
          After you place an order, we&apos;ll confirm the shipping timeline for your
          specific address directly by email before your item ships. If timing matters
          for your purchase — for example, you need it by a specific date —{" "}
          <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            contact us before ordering
          </a>{" "}
          and we&apos;ll give you our best current estimate.
        </p>
        <p>
          You&apos;ll receive tracking information as soon as your order ships. You can
          also check your order status any time on the{" "}
          <a href="/track-order" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            order tracking page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
