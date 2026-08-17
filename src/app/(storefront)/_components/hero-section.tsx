import { RippleMotif } from "./ripple-motif";
import { brandConfig } from "@/config/brand.config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--brand-line)] bg-[var(--brand-frost)]">
      <RippleMotif />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center sm:py-40">
        <span className="rounded-full border border-[var(--brand-line)] bg-white px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--brand-steel)]">
          Store opening soon — not yet accepting orders
        </span>

        <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-7xl">
          Cold plunge, without the guesswork.
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-[var(--brand-steel)]">
          {brandConfig.name} is bringing one all-in-one heating-and-cooling plunge system to
          the U.S. market — built for a daily recovery ritual at home, not a construction
          project.
        </p>

        <a
          href="#the-system"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--brand-ink)] px-7 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          See what we&apos;re building
        </a>
      </div>
    </section>
  );
}
