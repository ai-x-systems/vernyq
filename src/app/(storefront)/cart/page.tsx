"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatCentsAsUsd } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalCents, isHydrated } = useCart();

  if (!isHydrated) {
    return <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8" />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="text-h1 mb-10 mt-4 text-[var(--brand-ink)]">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-32 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[var(--brand-line)] bg-[var(--brand-frost-dim)]">
            <ShoppingBag className="size-7 text-[var(--brand-muted)]" />
          </div>
          <h2 className="text-h3 text-[var(--brand-ink)]">Your cart is empty</h2>
          <p className="text-body-sm mb-8 mt-2 text-[var(--brand-steel)]">
            Explore our cold plunge systems to get started.
          </p>
          <Link
            href="/cold-plunge-tubs"
            className="text-body-sm inline-flex h-12 items-center justify-center gap-2 rounded-[0.5rem] bg-[var(--brand-ink)] px-8 font-medium text-white transition-colors hover:opacity-90"
          >
            Shop Cold Plunges
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 pb-24 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-6 lg:col-span-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border-b border-[var(--brand-line)] pb-6 sm:gap-6"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-[0.5rem] bg-[var(--brand-frost-dim)] sm:size-32"
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : null}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-body font-medium text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-accent)]"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      className="p-1 text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-ink)]"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-[0.375rem] border border-[var(--brand-line)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex size-9 items-center justify-center text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-body-sm flex size-9 items-center justify-center border-x border-[var(--brand-line)] font-medium text-[var(--brand-ink)]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex size-9 items-center justify-center text-[var(--brand-steel)] transition-colors hover:text-[var(--brand-ink)]"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <p className="text-body font-medium text-[var(--brand-ink)]">
                      {formatCentsAsUsd(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="sticky top-24 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
              <h2 className="text-h3 mb-6 text-[var(--brand-ink)]">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-[var(--brand-steel)]">Subtotal</span>
                  <span className="text-body-sm text-[var(--brand-ink)]">
                    {formatCentsAsUsd(subtotalCents)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body-sm text-[var(--brand-steel)]">Shipping</span>
                  <span className="text-body-sm text-[var(--brand-steel)]">
                    Calculated at checkout
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--brand-line)] pt-3">
                  <span className="text-body font-medium text-[var(--brand-ink)]">Subtotal</span>
                  <span className="text-h3 text-[var(--brand-ink)]">
                    {formatCentsAsUsd(subtotalCents)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="text-body-sm mt-6 flex h-12 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
