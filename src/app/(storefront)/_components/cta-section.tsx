import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-[var(--brand-ink)] py-20 text-center lg:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-h2 text-white">See what we&apos;re building</h2>
        <p className="text-body-lg mt-4 text-white/70">
          We&apos;ll open orders once the launch system is verified and ready.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/cold-plunge-tubs"
            className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-white px-8 font-medium text-[var(--brand-ink)] transition-colors hover:bg-white/90"
          >
            Shop cold plunges
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/science"
            className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] border border-white/20 px-8 font-medium text-white transition-colors hover:bg-white/10"
          >
            Explore the science
          </Link>
        </div>
      </div>
    </section>
  );
}
