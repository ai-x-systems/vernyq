"use client";

import { useTransition } from "react";
import { setProductStockAction } from "./actions";

export function StockToggle({ productId, inStock }: { productId: string; inStock: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => setProductStockAction(productId, !inStock))}
      className={`text-caption rounded-full border px-3 py-1 font-medium transition-colors disabled:opacity-60 ${
        inStock
          ? "border-green-600 bg-green-50 text-green-700"
          : "border-[var(--brand-line)] text-[var(--brand-steel)] hover:bg-[var(--brand-frost-dim)]"
      }`}
    >
      {isPending ? "Saving…" : inStock ? "In Stock" : "Out of Stock"}
    </button>
  );
}
