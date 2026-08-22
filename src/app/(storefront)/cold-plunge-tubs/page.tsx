import type { Metadata } from "next";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { getStorefrontProductList } from "@/features/catalog/services/product.service";
import { ProductCard } from "../_components/product-card";
import { brandConfig } from "@/config/brand.config";

const PAGE_TITLE = "Cold Plunge Tubs";
const PAGE_DESCRIPTION =
  "Browse Vernyq's cold plunge tubs — all-in-one heating-and-cooling systems built for a daily recovery ritual at home.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${brandConfig.domain}/cold-plunge-tubs`,
  },
  openGraph: {
    title: `${PAGE_TITLE} — ${brandConfig.name}`,
    description: PAGE_DESCRIPTION,
    url: `${brandConfig.domain}/cold-plunge-tubs`,
    siteName: brandConfig.name,
    type: "website",
  },
};

export default async function ColdPlungeTubsPage() {
  const brand = await getCurrentBrand();
  const products = await getStorefrontProductList(brand.id);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${brandConfig.domain}/product/${product.slug}`,
      name: product.name,
    })),
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--brand-accent)]">
          Shop
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--brand-ink)] sm:text-5xl">
          {PAGE_TITLE}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--brand-steel)]">
          {PAGE_DESCRIPTION}
        </p>

        {products.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
            />
          </>
        ) : (
          <div className="mt-12 rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-frost)] px-8 py-16 text-center">
            <p className="font-mono text-[13px] font-medium uppercase tracking-wider text-[var(--brand-steel)]">
              Nothing published yet
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--brand-steel)]">
              We&apos;re finishing verification on our first system before listing it here.
              Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
