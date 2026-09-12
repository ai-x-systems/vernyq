"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/generated/prisma/enums";
import { verifyPaymentAction, transitionOrderAction, updateFulfillmentAction } from "./actions";

type Props = {
  orderId: string;
  paymentId: string | null;
  paymentStatus: string | null;
  allowedNextStatuses: OrderStatus[];
  fulfillment: {
    supplierName: string | null;
    supplierOrderId: string | null;
    trackingNumber: string | null;
    carrier: string | null;
    bolNumber: string | null;
    notes: string | null;
  } | null;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Payment Confirmed",
  PROCESSING: "Start Processing",
  READY_FOR_FULFILLMENT: "Mark Ready for Fulfillment",
  SUPPLIER_ORDER_PENDING: "Mark Supplier Order Pending",
  SUPPLIER_ORDERED: "Mark Supplier Ordered",
  SHIPPED: "Mark Shipped",
  DELIVERED: "Mark Delivered",
  CANCELLED: "Cancel Order",
  REFUNDED: "Refund Order",
  PAYMENT_FAILED: "Mark Payment Failed",
};

export function OrderActionsPanel({ orderId, paymentId, paymentStatus, allowedNextStatuses, fulfillment }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function runAction(fn: () => Promise<{ success: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  function handleFulfillmentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    runAction(() => updateFulfillmentAction(orderId, formData));
  }

  return (
    <div className="space-y-8">
      {paymentId && paymentStatus === "PENDING" && (
        <div>
          <h2 className="text-h3 text-[var(--brand-ink)]">Payment</h2>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => verifyPaymentAction(orderId, paymentId))}
            className="text-body-sm mt-3 flex h-10 items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] px-5 font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Verifying…" : "Verify Payment"}
          </button>
        </div>
      )}

      {allowedNextStatuses.length > 0 && (
        <div>
          <h2 className="text-h3 text-[var(--brand-ink)]">Order Status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {allowedNextStatuses.map((status) => (
              <button
                key={status}
                type="button"
                disabled={isPending}
                onClick={() => runAction(() => transitionOrderAction(orderId, status))}
                className="text-body-sm flex h-10 items-center justify-center rounded-[0.5rem] border border-[var(--brand-line)] px-4 font-medium text-[var(--brand-ink)] transition-colors hover:bg-[var(--brand-frost-dim)] disabled:opacity-60"
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-h3 text-[var(--brand-ink)]">Fulfillment Details</h2>
        <p className="text-caption mt-1 text-[var(--brand-steel)]">
          Entered manually — no supplier API exists yet (see manual-supplier.provider.ts).
        </p>
        <form onSubmit={handleFulfillmentSubmit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field name="supplierName" label="Supplier name" defaultValue={fulfillment?.supplierName} />
          <Field name="supplierOrderId" label="Supplier order ID" defaultValue={fulfillment?.supplierOrderId} />
          <Field name="trackingNumber" label="Tracking number" defaultValue={fulfillment?.trackingNumber} />
          <Field name="carrier" label="Carrier" defaultValue={fulfillment?.carrier} />
          <Field name="bolNumber" label="BOL number" defaultValue={fulfillment?.bolNumber} />
          <Field name="notes" label="Notes" defaultValue={fulfillment?.notes} />
          <button
            type="submit"
            disabled={isPending}
            className="text-body-sm col-span-full flex h-10 w-fit items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] px-5 font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save Fulfillment Details"}
          </button>
        </form>
      </div>

      {error && (
        <p className="text-caption rounded-[0.375rem] bg-red-50 px-3 py-2 text-red-600">{error}</p>
      )}
    </div>
  );
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string | null | undefined }) {
  return (
    <div>
      <label htmlFor={name} className="text-caption mb-1 block font-medium text-[var(--brand-steel)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-10 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]"
      />
    </div>
  );
}
