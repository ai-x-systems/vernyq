"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { FAQS } from "@/config/faq";

/**
 * Shows the same real FAQ content as /faq (imported from the shared
 * src/config/faq.ts, not a separate copy) — first 4 only, with a link to
 * the full page. Deliberately not a fake/demo preview.
 */
export function FaqPreviewSection() {
  const preview = FAQS.slice(0, 4);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-[var(--brand-line)] bg-[var(--brand-frost-dim)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="Questions"
          title="Frequently asked"
          description="Everything you need to know before ordering."
        />
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-[var(--brand-line)] rounded-[0.5rem] border border-[var(--brand-line)] bg-white">
          {preview.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-body-sm font-medium text-[var(--brand-ink)]">
                    {faq.question}
                  </span>
                  <Plus
                    className={`size-4 shrink-0 text-[var(--brand-steel)] transition-transform ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-body-sm px-6 pb-5 leading-relaxed text-[var(--brand-steel)]">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
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
