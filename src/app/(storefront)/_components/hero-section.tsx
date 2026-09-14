import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RippleMotif } from "./ripple-motif";
import { brandConfig } from "@/config/brand.config";

/**
 * Dark, full-bleed treatment matching the reference's visual weight —
 * deliberately kept photo-free rather than using generic stock lifestyle
 * imagery that would imply a customer experience we haven't actually
 * had yet. RippleMotif (accent-colored rings) carries the visual
 * interest instead.
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-[var(--brand-ink)]">
      <RippleMotif />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <span className="text-overline rounded-[0.5rem] border border-white/15 bg-white/5 px-4 py-1.5 text-white/70">
            Store opening soon — not yet accepting orders
          </span>

          <h1 className="text-display mt-6 text-balance text-white">
            Cold plunge, without the guesswork.
          </h1>

          <p className="text-body-lg mt-6 max-w-lg text-balance leading-relaxed text-white/70">
            {brandConfig.name} is bringing one all-in-one heating-and-cooling plunge system
            to the U.S. market — built for a daily recovery ritual at home, not a
            construction project.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            
              href="#the-system"
              className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-white px-8 font-medium text-[var(--brand-ink)] transition-colors hover:bg-white/90"
            >
              See what we&apos;re building
              <ArrowRight className="size-4" />
            </a>
            <Link
              href="/science"
              className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] border border-white/20 px-8 font-medium text-white transition-colors hover:bg-white/10"
            >
              Explore the science
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
