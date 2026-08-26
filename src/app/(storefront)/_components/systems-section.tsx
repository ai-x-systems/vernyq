import { getCurrentBrand } from "@/lib/get-current-brand";
import { getStorefrontProductList } from "@/features/catalog/services/product.service";
import { ProductCard } from "./product-card";
import { SectionHeader } from "@/components/ui/section-header";

/**
 * Shows real ACTIVE products only. Renders nothing at all if there are
 * none yet — no empty-state placeholder here, since this is a homepage
 * teaser section, not the collection page itself (which does show an
 * honest empty state, since that's a page someone navigated to on
 * purpose).
 */
export async function SystemsSection() {
  const brand = await getCurrentBrand();
  const products = await getStorefrontProductList(brand.id);

  if (products.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline="Our systems"
          title="Cold plunge systems"
          description="Every unit is a complete, all-in-one solution — not a collection of parts you assemble yourself."
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:gap-12">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
