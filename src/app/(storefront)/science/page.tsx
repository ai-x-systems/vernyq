import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { brandConfig } from "@/config/brand.config";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "The Science of Cold Exposure";
const PAGE_DESCRIPTION =
  "An evidence-based look at what research on cold water immersion actually shows — and where it's still unsettled.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${brandConfig.domain}/science` },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/science`,
    siteName: brandConfig.name,
    type: "website",
  },
};

export default function SciencePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Science" }]} />
      <p className="text-overline mt-4 text-[var(--brand-accent)]">The science</p>
      <h1 className="text-h1 mt-2 text-[var(--brand-ink)]">Cold Exposure, In Context</h1>

      <div className="mt-8 space-y-6 text-body-lg leading-relaxed text-[var(--brand-steel)]">
        <p>
          Cold water immersion has been studied in exercise science and recovery research
          for decades, and interest in it — both scientific and popular — has grown
          substantially in recent years. We want to be straightforward about what that
          research does and doesn&apos;t show, rather than making performance or health
          promises we can&apos;t back up.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">What&apos;s reasonably well established</h2>
        <p>
          Brief cold water immersion causes measurable physiological responses —
          vasoconstriction, changes in heart rate, and a subjective sense of alertness
          that many people report immediately afterward. Many athletes and coaches have
          used cold immersion as part of post-exercise recovery routines for years.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">What&apos;s still genuinely unsettled</h2>
        <p>
          The research on cold water immersion and things like muscle recovery,
          long-term training adaptation, mood, and metabolic effects is mixed — some
          studies show benefits in specific contexts, others show little to no effect, and
          methodologies vary widely between them. We&apos;re not going to cite a single
          study out of context and present it as settled science, and we&apos;d encourage
          you to treat any source that does — including brands selling cold plunge
          equipment — with some skepticism.
        </p>

        <h2 className="text-h3 !mt-10 text-[var(--brand-ink)]">A note on health claims</h2>
        <p>
          Cold water immersion isn&apos;t risk-free, particularly for people with heart
          conditions or other cardiovascular concerns. We&apos;re not medical
          professionals, this page isn&apos;t medical advice, and if you have any
          underlying health condition, talk to a doctor before starting cold exposure as
          a practice.
        </p>
      </div>
    </div>
  );
}
