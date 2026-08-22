import Image from "next/image";
import Link from "next/link";
import { formatCentsAsUsd } from "@/lib/utils";

type ProductCardProduct = {
  slug: string;
  name: string;
  shortDescription: string | null;
  priceCents: number;
  compareAtCents: number | null;
  images: { url: string; altText: string }[];
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const image = product.images[0];
  const isOnSale =
    product.compareAtCents != null && product.compareAtCents > product.priceCents;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-white transition-colors hover:border-[var(--brand-accent)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--brand-frost)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-wider text-[var(--brand-steel)]">
            Image coming soon
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--brand-ink)]">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[var(--brand-steel)]">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-6">
          <span className="text-lg font-semibold text-[var(--brand-ink)]">
            {formatCentsAsUsd(product.priceCents)}
          </span>
          {isOnSale && product.compareAtCents && (
            <span className="text-sm text-[var(--brand-steel)] line-through">
              {formatCentsAsUsd(product.compareAtCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
