"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Truck, Shield, RotateCcw, Check } from "lucide-react";
import { formatCentsAsUsd } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useCart } from "@/contexts/cart-context";
import type { getPublishedProductBySlug } from "@/features/catalog/services/product.service";

type Product = NonNullable<Awaited<ReturnType<typeof getPublishedProductBySlug>>>;

function SpecTable({ specifications }: { specifications: Record<string, string> }) {
  const entries = Object.entries(specifications);
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[0.5rem] border border-[var(--brand-line)]">
      {entries.map(([key, value], index) => (
        <div
          key={key}
          className={`flex flex-col sm:flex-row sm:items-center ${index !== 0 ? "border-t border-[var(--brand-line)]" : ""}`}
        >
          <div className="bg-[var(--brand-frost-dim)] px-5 py-3.5 sm:w-1/3">
            <span className="text-body-sm font-medium text-[var(--brand-ink)]">{key}</span>
          </div>
          <div className="px-5 py-3.5 sm:w-2/3">
            <span className="text-body-sm text-[var(--brand-steel)]">{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailContent({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        imageUrl: product.images[0]?.url ?? null,
      },
      quantity,
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const specifications = (product.specifications as Record<string, string> | null) ?? {};
  const specEntries = Object.entries(specifications);
  const dimensions = (product.dimensions as Record<string, string> | null) ?? {};
  const dimensionEntries = Object.entries(dimensions);
  const images = product.images;

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Cold Plunge Tubs", href: "/cold-plunge-tubs" },
            { label: product.name },
          ]}
        />

        <div className="grid gap-8 pb-16 lg:grid-cols-2 lg:gap-16 lg:pb-24">
          {/* Gallery */}
          <div>
            <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[0.75rem] bg-[var(--brand-frost-dim)]">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="text-body-sm flex h-full items-center justify-center text-[var(--brand-steel)]">
                  Image coming soon
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square overflow-hidden rounded-[0.375rem] border-2 transition-colors ${
                      selectedImage === i
                        ? "border-[var(--brand-ink)]"
                        : "border-transparent hover:border-[var(--brand-line)]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail strip, not the primary LCP image */}
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <h1 className="text-h1 text-[var(--brand-ink)]">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-body-lg mt-3 leading-relaxed text-[var(--brand-steel)]">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-price text-[var(--brand-ink)]">
                {formatCentsAsUsd(product.priceCents)}
              </span>
              {product.compareAtCents && product.compareAtCents > product.priceCents && (
                <span className="text-body text-[var(--brand-muted)] line-through">
                  {formatCentsAsUsd(product.compareAtCents)}
                </span>
              )}
            </div>

            {specEntries.length > 0 && (
              <div className="mt-6 space-y-2">
                {specEntries.slice(0, 4).map(([key, value]) => (
                  <div key={key} className="text-body-sm text-[var(--brand-steel)]">
                    <span className="font-medium text-[var(--brand-ink)]">{key}:</span> {value}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-body-sm font-medium text-[var(--brand-ink)]">
                  Quantity
                </label>
                <div className="flex items-center rounded-[0.375rem] border border-[var(--brand-line)]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-body-sm flex h-10 w-10 items-center justify-center border-x border-[var(--brand-line)] font-medium text-[var(--brand-ink)]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="text-body-sm flex h-12 w-full items-center justify-center gap-2 rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
              >
                {justAdded ? (
                  <>
                    <Check className="size-4" /> Added to Cart
                  </>
                ) : (
                  <>Add to Cart — {formatCentsAsUsd(product.priceCents * quantity)}</>
                )}
              </button>

              <Link
                href="/contact"
                className="text-body-sm flex h-10 w-full items-center justify-center gap-2 rounded-[0.5rem] border border-[var(--brand-line)] font-medium text-[var(--brand-steel)] transition-colors hover:bg-[var(--brand-frost-dim)]"
              >
                <Mail className="size-4" /> Ask a Question
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specEntries.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="text-overline mb-3 text-[var(--brand-accent)]">Specifications</p>
                <h2 className="text-h2 text-[var(--brand-ink)]">Technical details</h2>
                {dimensionEntries.length > 0 && (
                  <p className="text-body-sm mt-4 text-[var(--brand-steel)]">
                    <span className="font-medium text-[var(--brand-ink)]">Dimensions:</span>{" "}
                    {dimensionEntries.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
              </div>
              <SpecTable specifications={specifications} />
            </div>
          </div>
        </section>
      )}

      {/* Full description */}
      <section className="border-t border-[var(--brand-line)] bg-[var(--brand-frost-dim)] py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-overline mb-3 text-[var(--brand-accent)]">About this system</p>
          <div className="text-body-lg space-y-4 text-[var(--brand-steel)]">
            {product.description.split("\n").filter(Boolean).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping / Warranty / Returns — only real, per-product info shown;
          Returns links out to the site-wide policy rather than asserting
          unverified per-product terms. */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {product.shippingInfo && (
              <div className="rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
                <Truck className="mb-4 size-6 text-[var(--brand-accent)]" />
                <h3 className="text-h3 text-[var(--brand-ink)]">Shipping</h3>
                <p className="text-body-sm mt-2 text-[var(--brand-steel)]">
                  {product.shippingInfo}
                </p>
                <Link href="/shipping" className="text-caption mt-3 inline-flex items-center gap-1 text-[var(--brand-accent)] transition-colors hover:text-[var(--brand-accent-light)]">
                  Shipping details →
                </Link>
              </div>
            )}
            {product.warrantyInfo && (
              <div className="rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
                <Shield className="mb-4 size-6 text-[var(--brand-accent)]" />
                <h3 className="text-h3 text-[var(--brand-ink)]">Warranty</h3>
                <p className="text-body-sm mt-2 text-[var(--brand-steel)]">
                  {product.warrantyInfo}
                </p>
                <Link href="/warranty" className="text-caption mt-3 inline-flex items-center gap-1 text-[var(--brand-accent)] transition-colors hover:text-[var(--brand-accent-light)]">
                  Warranty details →
                </Link>
              </div>
            )}
            <div className="rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
              <RotateCcw className="mb-4 size-6 text-[var(--brand-accent)]" />
              <h3 className="text-h3 text-[var(--brand-ink)]">Returns</h3>
              <p className="text-body-sm mt-2 text-[var(--brand-steel)]">
                See our full return policy for eligibility and timelines.
              </p>
              <Link href="/returns" className="text-caption mt-3 inline-flex items-center gap-1 text-[var(--brand-accent)] transition-colors hover:text-[var(--brand-accent-light)]">
                Return policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — only rendered if this product has real, admin-entered FAQs */}
      {product.faqs.length > 0 && (
        <section className="border-t border-[var(--brand-line)] bg-[var(--brand-frost-dim)] py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-overline mb-3 text-center text-[var(--brand-accent)]">FAQ</p>
            <h2 className="text-h2 text-center text-[var(--brand-ink)]">Common questions</h2>
            <div className="mt-10 divide-y divide-[var(--brand-line)] rounded-[0.5rem] border border-[var(--brand-line)] bg-white">
              {product.faqs.map((faq) => (
                <details key={faq.id} className="group px-6 py-4">
                  <summary className="text-body-sm cursor-pointer list-none font-medium text-[var(--brand-ink)] marker:content-none">
                    {faq.question}
                  </summary>
                  <p className="text-body-sm mt-2 text-[var(--brand-steel)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
