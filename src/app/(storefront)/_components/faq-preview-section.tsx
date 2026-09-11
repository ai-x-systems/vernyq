import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQS } from "@/config/faq";

/**
 * Shows the same real FAQ content as /faq (imported from the shared
 * src/config/faq.ts, not a separate copy) — first 4 only, with a link to
 * the full page. Deliberately not a fake/demo preview.
 */
export function FaqPreviewSection() {
  const preview = FAQS.slice(0, 4);

  return (
    <section className="border-t border-[var(--brand-line)] bg-[var(--brand-frost-dim)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="Questions"
          title="Frequently asked"
          description="Everything you need to know before ordering."
        />
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-[var(--brand-line)] border-y border-[var(--brand-line)]">
          {preview.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="text-h3 text-[var(--brand-ink)]">{faq.question}</h3>
              <p className="text-body mt-2 leading-relaxed text-[var(--brand-steel)]">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="text-body-sm inline-flex items-center gap-2 font-medium text-[var(--brand-accent)] transition-colors hover:text-[var(--brand-accent-light)]"
          >
            View all FAQs
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
