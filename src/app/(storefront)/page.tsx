import { HeroSection } from "./_components/hero-section";
import { TrustSection } from "./_components/trust-section";
import { FeaturedProductSection } from "./_components/featured-product-section";
import { WhyVernyqSection } from "./_components/why-vernyq-section";
import { CategorySection } from "./_components/category-section";
import { RecoveryRoutineSection } from "./_components/recovery-routine-section";
import { ScienceTeaserSection } from "./_components/science-teaser-section";
import { FaqPreviewSection } from "./_components/faq-preview-section";
import { CtaSection } from "./_components/cta-section";

// Queries the database (FeaturedProductSection) — must never be
// statically prerendered, same reasoning as /cold-plunge-tubs.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturedProductSection />
      <WhyVernyqSection />
      <CategorySection />
      <RecoveryRoutineSection />
      <ScienceTeaserSection />
      <FaqPreviewSection />
      <CtaSection />
    </>
  );
}
