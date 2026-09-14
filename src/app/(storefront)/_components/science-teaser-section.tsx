import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Deliberately does NOT include the design reference's stat block
 * ("2-5 minutes typical", "50+ years of research", etc.) — those are
 * presented as settled fact with no citation, which directly
 * contradicts what /science itself says: research findings are mixed
 * and shouldn't be reduced to bold numbers out of context.
 */
export function ScienceTeaserSection() {
  return (
    <section className="bg-[var(--brand-ink)] py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-overline mb-3 text-[var(--brand-accent)]">The science</p>
            <h2 className="text-h2 text-white">Cold exposure, in context</h2>
            <p className="text-body-lg mt-4 leading-relaxed text-white/70">
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
          <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-8 lg:p-10">
            <p className="text-body text-white/80">
              We won&apos;t cite a single study out of context and present it as settled
              science — and we&apos;d encourage you to treat any brand selling cold plunge
              equipment that does with some skepticism, us included.
            </p>
            <p className="text-body mt-4 text-white/50">
              If you have a heart condition or other cardiovascular concern, talk to a
              doctor before starting cold exposure as a practice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
