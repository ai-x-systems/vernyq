import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentBrand } from "@/lib/get-current-brand";
import {
  getPublishedProductBySlug,
  getStorefrontProductList,
} from "@/features/catalog/services/product.service";
import { brandConfig } from "@/config/brand.config";
import { ProductDetailContent } from "./product-detail-content";
import { ProductCard } from "../../_components/product-card";
import { SectionHeader } from "@/components/ui/section-header";

// Reads live product data — must never be statically prerendered/cached
// at build time, and the DB must be reachable at request time.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getCurrentBrand();
  const product = await getPublishedProductBySlug(brand.id, slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription || product.shortDescription || product.description.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `${brandConfig.domain}/product/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${brandConfig.domain}/product/${product.slug}`,
      siteName: brandConfig.name,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  // TEMPORARY DIAGNOSTIC — same pattern as the homepage sections. Remove
  // once we've confirmed the site is stable.
  let brand: Awaited<ReturnType<typeof getCurrentBrand>>;
  let product: Awaited<ReturnType<typeof getPublishedProductBySlug>>;
  let allProducts: Awaited<ReturnType<typeof getStorefrontProductList>> = [];

  try {
    brand = await getCurrentBrand();
    product = await getPublishedProductBySlug(brand.id, slug);
    if (product) {
      allProducts = await getStorefrontProductList(brand.id);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    return (
      <div
        style={{
          background: "#fee",
          border: "2px solid red",
          padding: 16,
          margin: 16,
          fontFamily: "monospace",
          fontSize: 12,
          whiteSpace: "pre-wrap",
        }}
      >
        <strong>DIAGNOSTIC — /product/[slug] error:</strong>
        {"\n"}
        {message}
        {stack ? `\n\n${stack}` : ""}
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((img) => img.url),
    sku: product.sku ?? undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${brandConfig.domain}/product/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: brandConfig.domain },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cold Plunge Tubs",
        item: `${brandConfig.domain}/cold-plunge-tubs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${brandConfig.domain}/product/${product.slug}`,
      },
    ],
  };

  return (
    <div className="bg-white">
      <ProductDetailContent product={product} />

      {relatedProducts.length > 0 && (
        <section className="border-t border-[var(--brand-line)] py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <SectionHeader overline="Explore" title="Other systems" />
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
