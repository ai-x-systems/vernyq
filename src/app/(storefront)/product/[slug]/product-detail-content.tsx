"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Truck, Shield, RotateCcw, Check, ShieldCheck, Lock, MessageCircle, Play, Star, X } from "lucide-react";
import { formatCentsAsUsd } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useCart } from "@/contexts/cart-context";
import type { getPublishedProductBySlug, getProductReviews } from "@/features/catalog/services/product.service";

type Product = NonNullable<Awaited<ReturnType<typeof getPublishedProductBySlug>>>;
type ReviewData = Awaited<ReturnType<typeof getProductReviews>>;

type MediaItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string; embedUrl: string | null };

/**
 * Returns an iframe-embeddable URL for YouTube/Vimeo links, or null for a
 * direct video file URL (which gets a native <video> tag instead).
 */
function getVideoEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

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

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`size-4 ${n <= Math.round(value) ? "fill-[var(--brand-accent)] text-[var(--brand-accent)]" : "text-[var(--brand-line)]"}`}
        />
      ))}
    </div>
  );
}

export function ProductDetailContent({ product, reviewData }: { product: Product; reviewData: ReviewData }) {
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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

  const media: MediaItem[] = [
    ...product.images.map((img): MediaItem => ({ type: "image", url: img.url, alt: img.altText })),
    ...(product.videoUrl
      ? [{ type: "video", url: product.videoUrl, embedUrl: getVideoEmbedUrl(product.videoUrl) } as MediaItem]
      : []),
  ];
  const current = media[selectedMedia];

  return (
    <div className="pb-24 lg:pb-0">
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
              {current?.type === "image" && (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 h-full w-full cursor-zoom-in"
                  aria-label="View full size image"
                >
                  <Image
                    src={current.url}
                    alt={current.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </button>
              )}
              {current?.type === "video" &&
                (current.embedUrl ? (
                  <iframe
                    src={current.embedUrl}
                    title={`${product.name} video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={current.url} controls className="h-full w-full object-cover" />
                ))}
              {!current && (
                <div className="text-body-sm flex h-full items-center justify-center text-[var(--brand-steel)]">
                  Image coming soon
                </div>
              )}
            </div>
            {media.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {media.map((item, i) => (
                  <button
                    key={item.type === "image" ? item.url : `video-${i}`}
                    onClick={() => setSelectedMedia(i)}
                    className={`relative aspect-square overflow-hidden rounded-[0.375rem] border-2 transition-colors ${
                      selectedMedia === i
                        ? "border-[var(--brand-ink)]"
                        : "border-transparent hover:border-[var(--brand-line)]"
                    }`}
                  >
                    {item.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element -- thumbnail strip, not the primary LCP image
                      <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--brand-ink)]">
                        <Play className="size-5 fill-white text-white" />
                      </div>
                    )}
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

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-price text-[var(--brand-ink)]">
                {formatCentsAsUsd(product.priceCents)}
              </span>
              {product.compareAtCents && product.compareAtCents > product.priceCents && (
                <span className="text-body text-[var(--brand-muted)] line-through">
                  {formatCentsAsUsd(product.compareAtCents)}
                </span>
              )}
              <span
                className={`text-caption rounded-full border px-3 py-1 font-medium ${
                  product.inStock
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-[var(--brand-line)] text-[var(--brand-steel)]"
                }`}
              >
                {product.inStock ? "In Stock" : "Contact for Availability"}
              </span>
              {reviewData.count > 0 && (
                <span className="flex items-center gap-1.5">
                  <StarRating value={reviewData.average} />
                  <span className="text-caption text-[var(--brand-steel)]">
                    ({reviewData.count})
                  </span>
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
              {product.inStock ? (
                <>
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
                </>
              ) : (
                <div className="rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-4">
                  <p className="text-body-sm font-medium text-[var(--brand-ink)]">Currently unavailable</p>
                  <p className="text-body-sm mt-1 text-[var(--brand-steel)]">
                    We&apos;re finalizing stock on this system. Contact us and we&apos;ll let you know
                    the moment it&apos;s ready to ship.
                  </p>
                </div>
              )}

              <Link
                href="/contact"
                className="text-body-sm flex h-10 w-full items-center justify-center gap-2 rounded-[0.5rem] border border-[var(--brand-line)] font-medium text-[var(--brand-steel)] transition-colors hover:bg-[var(--brand-frost-dim)]"
              >
                <Mail className="size-4" /> Ask a Question
              </Link>
            </div>

            {/* Trust row — operational facts only, nothing fabricated */}
            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[var(--brand-line)] pt-6 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                <span className="text-caption text-[var(--brand-steel)]">
                  Payment verified manually before shipping
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                <span className="text-caption text-[var(--brand-steel)]">
                  No card data stored on this site
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[var(--brand-accent)]" />
                <span className="text-caption text-[var(--brand-steel)]">
                  Real support, real answers
                </span>
              </div>
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

      {/* Reviews — only rendered if real, approved reviews exist */}
      {reviewData.count > 0 && (
        <section className="border-t border-[var(--brand-line)] py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-overline mb-3 text-center text-[var(--brand-accent)]">Reviews</p>
            <div className="flex items-center justify-center gap-2">
              <StarRating value={reviewData.average} />
              <span className="text-body-sm text-[var(--brand-steel)]">
                {reviewData.average.toFixed(1)} · {reviewData.count} review{reviewData.count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-10 space-y-6">
              {reviewData.reviews.map((review) => (
                <div key={review.id} className="border-b border-[var(--brand-line)] pb-6 last:border-0">
                  <StarRating value={review.rating} />
                  <h3 className="text-body-sm mt-2 font-medium text-[var(--brand-ink)]">{review.title}</h3>
                  <p className="text-body-sm mt-1 text-[var(--brand-steel)]">{review.body}</p>
                  <p className="text-caption mt-2 text-[var(--brand-muted)]">
                    {review.customer.name} · {review.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="border-t border-[var(--brand-line)] bg-[var(--brand-ink)] py-16 text-center lg:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-h2 text-white">Ready to order?</h2>
          <p className="text-body-lg mt-3 text-white/70">
            {product.inStock
              ? "Your order is confirmed once we've personally verified your payment."
              : "Contact us and we'll confirm availability directly."}
          </p>
          <div className="mt-6 flex justify-center">
            {product.inStock ? (
              <button
                type="button"
                onClick={handleAddToCart}
                className="text-body-sm flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-white px-8 font-medium text-[var(--brand-ink)] transition-colors hover:opacity-90"
              >
                {justAdded ? (
                  <>
                    <Check className="size-4" /> Added to Cart
                  </>
                ) : (
                  <>Add to Cart — {formatCentsAsUsd(product.priceCents * quantity)}</>
                )}
              </button>
            ) : (
              <Link
                href="/contact"
                className="text-body-sm flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-white px-8 font-medium text-[var(--brand-ink)] transition-colors hover:opacity-90"
              >
                <Mail className="size-4" /> Contact Us
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--brand-line)] bg-white p-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <span className="text-body-sm font-medium text-[var(--brand-ink)]">
            {formatCentsAsUsd(product.priceCents)}
          </span>
          {product.inStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="text-body-sm flex h-10 flex-1 max-w-[220px] items-center justify-center gap-2 rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
            >
              {justAdded ? <Check className="size-4" /> : "Add to Cart"}
            </button>
          ) : (
            <Link
              href="/contact"
              className="text-body-sm flex h-10 flex-1 max-w-[220px] items-center justify-center gap-2 rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
            >
              Contact Us
            </Link>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && current?.type === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 text-white"
            aria-label="Close"
          >
            <X className="size-8" />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
            <Image src={current.url} alt={current.alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
