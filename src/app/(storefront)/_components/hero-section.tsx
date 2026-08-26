import { RippleMotif } from "./ripple-motif";
import { brandConfig } from "@/config/brand.config";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--brand-line)] bg-[var(--brand-frost)]">
      <RippleMotif />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center sm:py-40">
        <span className="text-overline rounded-[0.5rem] border border-[var(--brand-line)] bg-white px-4 py-1.5 text-[var(--brand-steel)]">
          Store opening soon — not yet accepting orders
        </span>

        <h1 className="text-display mt-8 text-balance text-[var(--brand-ink)]">
          Cold plunge, without the guesswork.
        </h1>

        <p className="text-body-lg mt-6 max-w-xl text-balance text-[var(--brand-steel)]">
          {brandConfig.name} is bringing one all-in-one heating-and-cooling plunge system to
          the U.S. market — built for a daily recovery ritual at home, not a construction
          project.
        </p>
      </div>
    </section>
  );
}
