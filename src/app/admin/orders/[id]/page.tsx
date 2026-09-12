import Image from "next/image";
import { notFound } from "next/navigation";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { orderRepository } from "@/features/orders/repositories/order.repository";
import { OrderService } from "@/features/orders/services/order.service";
import { getSignedProofUrl } from "@/lib/supabase-admin";
import { formatCentsAsUsd } from "@/lib/utils";
import { OrderActionsPanel } from "./order-actions-panel";
import type { OrderStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const orderService = new OrderService();

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const brand = await getCurrentBrand();
  const order = await orderRepository.getOrderForAdmin(brand.id, id);

  if (!order) {
    notFound();
  }

  const payment = order.payments[0] ?? null;
  const proofSignedUrl = payment?.proofUrl ? await getSignedProofUrl(payment.proofUrl) : null;
  const allowedNextStatuses = orderService.getAllowedNextStatuses(order.status as OrderStatus);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[var(--brand-ink)]">Order {order.id.slice(0, 12)}…</h1>
          <p className="text-body-sm mt-1 text-[var(--brand-steel)]">
            Placed {order.createdAt.toLocaleString("en-US")}
          </p>
        </div>
        <span className="text-caption rounded-full border border-[var(--brand-line)] px-3 py-1 font-medium text-[var(--brand-ink)]">
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      {/* Items */}
      <div className="mt-8 space-y-4 border-t border-[var(--brand-line)] pt-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-[0.375rem] bg-[var(--brand-frost-dim)]">
              {item.product.images[0] && (
                <Image src={item.product.images[0].url} alt={item.product.images[0].altText} fill className="object-cover" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm font-medium text-[var(--brand-ink)]">{item.product.name}</p>
              <p className="text-caption text-[var(--brand-steel)]">Qty {item.quantity}</p>
            </div>
            <p className="text-body-sm text-[var(--brand-ink)]">{formatCentsAsUsd(item.unitPriceCents * item.quantity)}</p>
          </div>
        ))}
        <div className="flex justify-between border-t border-[var(--brand-line)] pt-3">
          <span className="text-body-sm font-medium text-[var(--brand-ink)]">Total</span>
          <span className="text-body-sm font-medium text-[var(--brand-ink)]">{formatCentsAsUsd(order.totalCents)}</span>
        </div>
      </div>

      {/* Customer + shipping */}
      <div className="mt-6 grid gap-6 border-t border-[var(--brand-line)] pt-6 sm:grid-cols-2">
        <div>
          <h2 className="text-body-sm mb-2 font-medium text-[var(--brand-ink)]">Customer</h2>
          <p className="text-body-sm text-[var(--brand-steel)]">{order.customer.name}</p>
          <p className="text-body-sm text-[var(--brand-steel)]">{order.customer.email}</p>
          {order.customer.phone && <p className="text-body-sm text-[var(--brand-steel)]">{order.customer.phone}</p>}
        </div>
        <div>
          <h2 className="text-body-sm mb-2 font-medium text-[var(--brand-ink)]">Shipping Address</h2>
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

      {/* Payment */}
      {payment && (
        <div className="mt-6 rounded-[0.5rem] border border-[var(--brand-line)] bg-[var(--brand-frost-dim)] p-6">
          <h2 className="text-h3 text-[var(--brand-ink)]">Payment</h2>
          <dl className="mt-3 grid gap-2 text-body-sm">
            <Row label="Method" value={payment.provider.replaceAll("_", " ")} />
            <Row label="Status" value={payment.status} />
            <Row label="Amount" value={formatCentsAsUsd(payment.amountCents)} />
            {payment.verifiedAt && <Row label="Verified" value={payment.verifiedAt.toLocaleString("en-US")} />}
          </dl>

          {payment.proofUrl && (
            <div className="mt-4">
              <p className="text-body-sm font-medium text-[var(--brand-ink)]">Payment proof</p>
              {proofSignedUrl ? (
                <a href={proofSignedUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
                  <div className="relative h-40 w-56 overflow-hidden rounded-[0.375rem] border border-[var(--brand-line)]">
                    <Image src={proofSignedUrl} alt="Uploaded payment proof" fill className="object-cover" unoptimized />
                  </div>
                  <span className="text-caption mt-1 block text-[var(--brand-accent)] underline underline-offset-2">Open full size</span>
                </a>
              ) : (
                <p className="text-caption mt-2 text-red-600">Couldn&apos;t generate a link to view the proof — check Supabase Storage config.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Status history */}
      {order.statusHistory.length > 0 && (
        <div className="mt-6 border-t border-[var(--brand-line)] pt-6">
          <h2 className="text-body-sm mb-2 font-medium text-[var(--brand-ink)]">History</h2>
          <ul className="space-y-1">
            {order.statusHistory.map((event) => (
              <li key={event.id} className="text-caption text-[var(--brand-steel)]">
                {event.createdAt.toLocaleString("en-US")} — {event.status.replaceAll("_", " ")}
                {event.note ? ` (${event.note})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 border-t border-[var(--brand-line)] pt-6">
        <OrderActionsPanel
          orderId={order.id}
          paymentId={payment?.id ?? null}
          paymentStatus={payment?.status ?? null}
          allowedNextStatuses={allowedNextStatuses}
          fulfillment={order.supplierFulfillment}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--brand-steel)]">{label}</dt>
      <dd className="text-[var(--brand-ink)]">{value}</dd>
    </div>
  );
}
