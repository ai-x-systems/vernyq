import Link from "next/link";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { orderRepository } from "@/features/orders/repositories/order.repository";
import { formatCentsAsUsd } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const STATUSES: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING",
  "READY_FOR_FULFILLMENT",
  "SUPPLIER_ORDER_PENDING",
  "SUPPLIER_ORDERED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
  "PAYMENT_FAILED",
];

type Props = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const statusFilter = STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined;

  const brand = await getCurrentBrand();
  const [orders, total] = await orderRepository.listForAdmin(brand.id, {
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <h1 className="text-h2 text-[var(--brand-ink)]">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterLink label="All" active={!statusFilter} href="/admin/orders" />
        {STATUSES.map((s) => (
          <FilterLink key={s} label={s.replaceAll("_", " ")} active={statusFilter === s} href={`/admin/orders?status=${s}`} />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-[0.5rem] border border-[var(--brand-line)] bg-white">
        <table className="w-full text-body-sm">
          <thead>
            <tr className="border-b border-[var(--brand-line)] text-left text-[var(--brand-steel)]">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const payment = order.payments[0];
              return (
                <tr key={order.id} className="border-b border-[var(--brand-line)] last:border-0 hover:bg-[var(--brand-frost-dim)]">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-[var(--brand-accent)] underline underline-offset-2">
                      {order.id.slice(0, 12)}…
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--brand-ink)]">
                    {order.customer.name}
                    <div className="text-caption text-[var(--brand-steel)]">{order.customer.email}</div>
                  </td>
                  <td className="px-4 py-3 text-[var(--brand-ink)]">{order.status.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-[var(--brand-ink)]">
                    {payment ? `${payment.provider.replaceAll("_", " ")} — ${payment.status}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--brand-ink)]">{formatCentsAsUsd(order.totalCents)}</td>
                  <td className="px-4 py-3 text-[var(--brand-steel)]">
                    {order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--brand-steel)]">
                  No orders {statusFilter ? `with status ${statusFilter.replaceAll("_", " ")}` : "yet"}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-body-sm text-[var(--brand-steel)]">
          <span>
            Page {page} of {totalPages} ({total} orders)
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?${statusFilter ? `status=${statusFilter}&` : ""}page=${page - 1}`}
                className="rounded-[0.375rem] border border-[var(--brand-line)] px-3 py-1.5 hover:bg-[var(--brand-frost-dim)]"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?${statusFilter ? `status=${statusFilter}&` : ""}page=${page + 1}`}
                className="rounded-[0.375rem] border border-[var(--brand-line)] px-3 py-1.5 hover:bg-[var(--brand-frost-dim)]"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Link
      href={href}
      className={`text-caption rounded-full border px-3 py-1 font-medium ${
        active
          ? "border-[var(--brand-ink)] bg-[var(--brand-ink)] text-white"
          : "border-[var(--brand-line)] text-[var(--brand-steel)] hover:bg-[var(--brand-frost-dim)]"
      }`}
    >
      {label}
    </Link>
  );
}
