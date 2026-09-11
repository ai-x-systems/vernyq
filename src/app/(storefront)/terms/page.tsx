import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Terms of Service";
const PAGE_DESCRIPTION = "The terms that apply when you order from Vernyq.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/terms` },
};

/**
 * DEV NOTE (not shown to customers): governing law / jurisdiction is
 * deliberately NOT specified below — this needs a real lawyer, not a
 * guess, given the cross-border setup (individual seller based in
 * Pakistan, customers primarily in the US). Get that reviewed before
 * treating this page as final. Return/warranty specifics intentionally
 * link out to their own pages rather than restate numbers that aren't
 * decided yet.
 */
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Terms" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Terms of Service</h1>
      <p className="text-body-sm mt-2 text-[var(--brand-steel)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-[var(--brand-steel)]">
        <p>
          These terms apply when you place an order through this site, operated by an
          individual seller doing business as {brandConfig.name}. By placing an order,
          you agree to them.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Orders and pricing</h2>
        <p>
          All prices are listed in {brandConfig.market.currency}. Placing an order
          creates it in an &ldquo;Awaiting Payment&rdquo; state — your order is not
          confirmed until we&apos;ve verified your payment. We reserve the right to
          cancel an order (with a full refund of any payment received) if we&apos;re
          unable to fulfill it, including in cases of a pricing or listing error.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Payment</h2>
        <p>
          We currently accept payment by bank/wire transfer or a manual payment request
          sent to your email. We do not collect card details directly on this site.
          Your order status only changes to &ldquo;Payment Confirmed&rdquo; after we&apos;ve
          personally verified your payment — this is never decided automatically by
          your browser or device.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Shipping, warranty, and returns</h2>
        <p>
          See our{" "}
          <a href="/shipping" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">Shipping</a>,{" "}
          <a href="/warranty" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">Warranty</a>, and{" "}
          <a href="/returns" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">Returns</a>{" "}
          pages for current details on each. Some terms in these areas are still being
          finalized — contact us before ordering if any of them are decision-critical
          for you.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Product information</h2>
        <p>
          We make a genuine effort to describe products accurately and to avoid
          publishing specifications we haven&apos;t verified. If you notice something
          that looks wrong or unclear, please tell us.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {brandConfig.name} is not liable for
          indirect, incidental, or consequential damages arising from your use of this
          site or your purchase, beyond the amount you paid for the product in question.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after an
          update means you accept the revised terms.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Contact</h2>
        <p>
          Questions about these terms?{" "}
          <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
