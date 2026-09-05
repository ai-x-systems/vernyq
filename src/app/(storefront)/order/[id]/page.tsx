import Image from "next/image";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { getOrderForTracking, type TrackedOrder } from "@/features/orders/services/order-tracking.service";
import { getBankDetails } from "@/lib/bank-details";
import { formatCentsAsUsd } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

// Reads live order data — must never be statically prerendered/cached.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Awaiting Payment",
  PAID: "Payment Confirmed",
  PROCESSING: "Processing",
  READY_FOR_FULFILLMENT: "Preparing for Shipment",
  SUPPLIER_ORDER_PENDING: "Preparing for Shipment",
  SUPPLIER_ORDERED: "Preparing for Shipment",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  PAYMENT_FAILED: "Payment Failed",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Awaiting Verification",
  AUTHORIZED: "Authorized",
  PAID: "Verified",
  FAILED: "Failed",
  REFUNDED: "Refunded",
  PARTIALLY_REFUNDED: "Partially Refunded",
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { email } = await searchParams;

  const brand = await getCurrentBrand();

  // No email provided at all — this id might not even correspond to a
  // real order, but we don't check that here on purpose: doing so would
  // let someone use this page to test whether an id is valid before
  // they even have the matching email. Always show the same gate.
  if (!email) {
    return <EmailGate orderId={id} />;
  }

  const order = await getOrderForTracking(brand.id, id, email);

  if (!order) {
    // Wrong email for a real order looks identical to a nonexistent
    // order — never confirm which one it was.
    return <EmailGate orderId={id} error="We couldn't find an order matching that email." />;
  }

  return <OrderDetail order={order} />;
}

function EmailGate({ orderId, error }: { orderId: string; error?: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-h2 text-[var(--brand-ink)]">Track Your Order</h1>
      <p className="text-body-sm mt-3 text-[var(--brand-steel)]">
        Enter the email address used for this order to view its details.
      </p>
      {error && (
        <p className="text-caption mt-4 rounded-[0.375rem] bg-red-50 px-3 py-2 text-red-600">
          {error}
        </p>
      )}
      {/* Plain GET form — appends ?email=... to the URL, which this
          page re-reads server-side. No client JS required. */}
      <form method="GET" className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-body-sm mb-1.5 block font-medium text-[var(--brand-ink)]">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-11 w-full rounded-[0.375rem] border border-[var(--brand-line)] bg-white px-3 text-body-sm text-[var(--brand-ink)] outline-none transition-colors focus:border-[var(--brand-ink)]"
          />
        </div>
        <button
          type="submit"
          className="text-body-sm flex h-11 w-full items-center justify-center rounded-[0.5rem] bg-[var(--brand-ink)] font-medium text-white transition-colors hover:opacity-90"
        >
          View Order
        </button>
      </form>
      <p className="text-caption mt-4 text-[var(--brand-steel)]">
        Order reference: <span className="font-mono">{orderId}</span>
      </p>
    </div>
  );
}

function OrderDetail({ order }: { order: TrackedOrder }) {
  const bankDetails = order.payments[0]?.provider === "bank_transfer" ? getBankDetails() : null;
  const payment = order.payments[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Order" }]} />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[var(--brand-ink)]">Order Confirmed</h1>
          <p className="text-body-sm mt-1 font-mono text-[var(--brand-steel)]">{order.id}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-caption rounded-full border border-[var(--brand-line)] px-3 py-1 font-medium text-[var(--brand-ink)]">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="mt-10 space-y-4 border-t border-[var(--brand-line)] pt-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-[0.375rem] bg-[var(--brand-frost-dim)]">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.images[0].altText}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-medium text-[var(--brand-ink)]">
                {item.product.name}
              </p>
              <p className="text-caption text-[var(--brand-steel)]">Qty {item.quantity}</p>
            </div>
            <p className="text-body-sm text-[var(--brand-ink)]">
              {formatCentsAsUsd(item.unitPriceCents * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2 border-t border-[var(--brand-line)] pt-6">
        <div className="flex justify-between">
          <span className="text-body-sm text-[var(--brand-steel)]">Subtotal</span>
          <span className="text-body-sm text-[var(--brand-ink)]">
            {formatCentsAsUsd(order.subtotalCents)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-body-sm text-[var(--brand-steel)]">Shipping</span>
          <span className="text-body-sm text-[var(--brand-ink)]">
            {order.shippingCents === 0 ? "TBD" : formatCentsAsUsd(order.shippingCents)}
          </span>
        </div>
        <div className="flex justify-between border-t border-[var(--brand-line)] pt-2">
          <span className="text-body font-medium text-[var(--brand-ink)]">Total</span>
          <span className="text-h3 text-[var(--brand-ink)]">
            {formatCentsAsUsd(order.totalCents)}
          </span>
        </div>
      </div>

      {/* Customer & shipping */}
      <div className="mt-6 grid gap-6 border-t border-[var(--brand-line)] pt-6 sm:grid-cols-2">
        <div>
          <h2 className="text-body-sm mb-2 font-medium text-[var(--brand-ink)]">Customer</h2>
          <p className="text-body-sm text-[var(--brand-steel)]">{order.customer.name}</p>
          <p className="text-body-sm text-[var(--brand-steel)]">{order.customer.email}</p>
        </div>
        <div>
          <h2 className="text-body-sm mb-2 font-medium text-[var(--brand-ink)]">
            Shipping Address
          </h2>
          {order.shippingAddress && typeof order.shippingAddress === "object" && (
            <div className="text-body-sm text-[var(--brand-steel)]">
              {"address" in order.shippingAddress && <p>{String(order.shippingAddress.address)}</p>}
              {"city" in order.shippingAddress && "state" in order.shippingAddress && (
                <p>
                  {String(order.shippingAddress.city)}, {String(order.shippingAddress.state)}{" "}
                  {"postalCode" in order.shippingAddress ? String(order.shippingAddress.postalCode) : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment instructions */}
      <div className="mt-6 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-h3 text-[var(--brand-ink)]">Payment</h2>
          {payment && (
            <span className="text-caption rounded-full border border-[var(--brand-line)] bg-white px-3 py-1 font-medium text-[var(--brand-ink)]">
              {PAYMENT_STATUS_LABELS[payment.status]}
            </span>
          )}
        </div>

        {payment?.provider === "bank_transfer" && (
          <div className="mt-4">
            {bankDetails ? (
              <>
                <dl className="grid gap-2 text-body-sm">
                  <Row label="Bank" value={bankDetails.bankName} />
                  <Row label="Account Holder" value={bankDetails.accountHolder} />
                  {bankDetails.accountType && <Row label="Account Type" value={bankDetails.accountType} />}
                  <Row label="SWIFT / BIC" value={bankDetails.swift} />
                  {bankDetails.routingNumber !== "-" && (
                    <Row label="Routing Number" value={bankDetails.routingNumber} />
                  )}
                  <Row label="Account Number" value={bankDetails.accountNumber} />
                  {bankDetails.bankAddress && <Row label="Bank Address" value={bankDetails.bankAddress} />}
                  <Row label="Amount" value={formatCentsAsUsd(order.totalCents)} />
                  <Row label="Reference" value={order.id} mono />
                </dl>
                <p className="text-body-sm mt-4 text-[var(--brand-steel)]">
                  Please include the reference above with your transfer. Payment-proof upload
                  will be available soon. Once we&apos;ve verified your transfer, your order
                  status will update to &ldquo;Payment Confirmed.&rdquo;
                </p>
              </>
            ) : (
              <p className="text-body-sm text-[var(--brand-steel)]">
                Bank transfer instructions will be sent to your email shortly.
              </p>
            )}
          </div>
        )}

        {payment?.provider === "manual_payment_request" && (
          <p className="text-body-sm mt-4 text-[var(--brand-steel)]">
            We&apos;ll send a secure payment request to your email shortly. Once you&apos;ve
            paid and we&apos;ve confirmed it, your order status will update to &ldquo;Payment
            Confirmed.&rdquo;
          </p>
        )}

        <p className="text-caption mt-4 text-[var(--brand-steel)]">
          Payment status only changes after manual verification — this page will always
          reflect the current, confirmed status.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--brand-steel)]">{label}</dt>
      <dd className={`text-[var(--brand-ink)] ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
