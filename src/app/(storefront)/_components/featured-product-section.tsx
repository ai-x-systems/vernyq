import Image from "next/image";
import Link from "next/link";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { getStorefrontProductList } from "@/features/catalog/services/product.service";
import { formatCentsAsUsd } from "@/lib/utils";

/**
 * Highlights the first ACTIVE product as a flagship. Renders nothing if
 * there isn't one yet. Deliberately does NOT assume specific
 * specification keys exist (e.g. "Temperature Range") — the
 * specifications JSON shape/taxonomy hasn't been locked yet, so this
 * just shows whatever the first couple of entries actually are.
 */
export async function FeaturedProductSection() {
  const brand = await getCurrentBrand();
  const products = await getStorefrontProductList(brand.id);
  const flagship = products[0];

  if (!flagship) return null;

  const image = flagship.images[0];
  const specEntries = Object.entries(
    (flagship.specifications as Record<string, string> | null) ?? {},
  ).slice(0, 3);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[0.75rem] bg-[var(--brand-frost-dim)]">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="text-body-sm flex h-full items-center justify-center text-[var(--brand-steel)]">
                Image coming soon
              </div>
            )}
          </div>

          <div>
            <p className="text-overline mb-3 text-[var(--brand-accent)]">Flagship</p>
            <h2 className="text-h2 text-[var(--brand-ink)]">{flagship.name}</h2>
            {flagship.shortDescription && (
              <p className="text-body-lg mt-4 text-[var(--brand-steel)]">
                {flagship.shortDescription}
              </p>
            )}

            {specEntries.length > 0 && (
              <div className="mt-6 space-y-3">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="text-body-sm text-[var(--brand-steel)]">
                    <span className="font-medium text-[var(--brand-ink)]">{key}:</span>{" "}
                    {value}
                  </div>
                ))}
              </div>
            )}

            <p className="text-price mt-6 text-[var(--brand-ink)]">
              {formatCentsAsUsd(flagship.priceCents)}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/product/${flagship.slug}`}
                className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-[var(--brand-ink)] px-8 font-medium text-white transition-colors hover:opacity-90"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
