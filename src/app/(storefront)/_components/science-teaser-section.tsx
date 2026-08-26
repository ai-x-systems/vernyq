import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ScienceTeaserSection() {
  return (
    <section className="bg-[var(--brand-ink)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-overline mb-3 text-[var(--brand-accent)]">The science</p>
          <h2 className="text-h2 text-white">Cold exposure, in context</h2>
          <p className="text-body-lg mt-4 text-white/70">
            Cold water immersion has been studied in exercise science and recovery
            research for decades. We&apos;re building out an evidence-based explanation
            of what the research actually shows — and where it&apos;s still unsettled —
            rather than making performance promises we can&apos;t back up.
          </p>
          <Link
            href="/science"
            className="text-body-sm mt-6 inline-flex items-center gap-2 font-medium text-[var(--brand-accent-light)] transition-colors hover:text-white"
          >
            Explore the science
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
