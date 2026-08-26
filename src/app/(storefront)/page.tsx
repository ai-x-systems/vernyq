import { HeroSection } from "./_components/hero-section";
import { TrustSection } from "./_components/trust-section";
import { FeaturedProductSection } from "./_components/featured-product-section";
import { CategorySection } from "./_components/category-section";
import { ScienceTeaserSection } from "./_components/science-teaser-section";
import { SystemsSection } from "./_components/systems-section";
import { CtaSection } from "./_components/cta-section";

// Queries the database (FeaturedProductSection, SystemsSection) — must
// never be statically prerendered, same reasoning as /cold-plunge-tubs.
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeaturedProductSection />
      <CategorySection />
      <ScienceTeaserSection />
      <SystemsSection />
      <CtaSection />
    </>
  );
}
