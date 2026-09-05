"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/order/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Order Tracking" }]} />
      <h1 className="text-h2 mt-4 text-[var(--brand-ink)]">Track Your Order</h1>
      <p className="text-body-sm mt-3 text-[var(--brand-steel)]">
        Enter your order reference and the email address used when you placed it.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="orderId"
            className="text-body-sm mb-1.5 block font-medium text-[var(--brand-ink)]"
          >
            Order reference
          </label>
          <input
            id="orderId"
            required
            placeholder="e.g. cmg8x..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="h-11 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 font-mono text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-body-sm mb-1.5 block font-medium text-[var(--brand-ink)]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]"
          />
        </div>
        <button
          type="submit"
          className="text-body-sm flex h-11 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
        >
          Track Order
        </button>
      </form>
    </div>
  );
}
