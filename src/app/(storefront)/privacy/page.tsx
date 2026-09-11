import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Privacy Policy";
const PAGE_DESCRIPTION = "How Vernyq collects, uses, and protects your information.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/privacy` },
};

/**
 * DEV NOTE (not shown to customers): this is a working draft reflecting
 * our actual data practices as of the current architecture (Supabase/
 * Postgres storage, Vercel hosting, no card data collected on-site, no
 * dedicated customer-account system). It is NOT a substitute for review
 * by a lawyer, especially given cross-border (Pakistan-operated,
 * US-market) commerce. Update this if the data practices described here
 * change (e.g. if an analytics tool or new processor is added).
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Privacy" }]} />
      <h1 className="text-h1 mt-4 text-[var(--brand-ink)]">Privacy Policy</h1>
      <p className="text-body-sm mt-2 text-[var(--brand-steel)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="mt-8 space-y-6 text-body leading-relaxed text-[var(--brand-steel)]">
        <p>
          This policy explains what information {brandConfig.name} collects when you use
          this site or place an order, and how it&apos;s used.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Information we collect</h2>
        <p>
          When you place an order, we collect the information needed to fulfill it: your
          name, email address, phone number (if provided), and shipping address. We do
          not collect or store payment card details on this site — payment is arranged
          via bank transfer or a payment request sent directly to you, and no card
          numbers pass through or are stored by our systems.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">How we use your information</h2>
        <p>
          We use your information to create and fulfill your order, communicate with you
          about it (including payment instructions and shipping updates), and provide
          support if you contact us. We don&apos;t sell your personal information to
          third parties.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Where your information is stored</h2>
        <p>
          Order and account information is stored in a managed database (Supabase,
          running on infrastructure in the United States), and this site is hosted on
          Vercel. If you upload proof of payment for a bank transfer, that file is stored
          in a private, access-restricted storage bucket — it is not publicly
          accessible and is only used to verify your payment.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Your choices</h2>
        <p>
          You can ask us to access, correct, or delete the personal information we hold
          about you by emailing{" "}
          <a href={`mailto:${brandConfig.contact.supportEmail}`} className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            {brandConfig.contact.supportEmail}
          </a>
          . We&apos;ll respond as quickly as we reasonably can. Note that we may need to
          retain certain order records for legitimate business or legal purposes (for
          example, records related to a completed purchase) even after a deletion
          request.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Cookies and tracking</h2>
        <p>
          Your cart is stored locally in your browser, not on our servers, until you
          check out. We do not currently use third-party advertising trackers on this
          site.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Changes to this policy</h2>
        <p>
          If our data practices change materially, we&apos;ll update this page. Continued
          use of the site after an update means you accept the revised policy.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">Contact</h2>
        <p>
          Questions about this policy?{" "}
          <a href="/contact" className="font-medium text-[var(--brand-ink)] underline underline-offset-2">
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
