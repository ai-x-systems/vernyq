import { prisma } from "@/lib/prisma";
import type { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

/**
 * All repository queries MUST be scoped by brandId for multi-tenant safety.
 * UI-side validation is not a tenancy boundary — always include brandId in
 * queries where appropriate to avoid accidental cross-tenant access.
 */

/**
 * The two payment methods a customer can select at launch. This is an
 * app-level type only — OrderPayment.provider stays a plain Prisma String
 * field (no new enum), per the 6C payment-flow lock. The actual operational
 * provider (Elevate Pay vs Payoneer) is never written here — it's recorded
 * later as a plain note on an OrderStatusEvent at verification time, so the
 * customer's original selection is never overwritten.
 */
export type PaymentMethod = "bank_transfer" | "manual_payment_request";

export const orderRepository = {
  getById: (brandId: string, id: string) =>
    prisma.order.findFirst({ where: { id, brandId } }),

  getByIdWithPayments: (brandId: string, id: string) =>
    prisma.order.findFirst({
      where: { id, brandId },
      include: { payments: true, items: true, statusHistory: true },
    }),

  create: (data: Parameters<typeof prisma.order.create>[0]["data"]) =>
    prisma.order.create({ data }),

  appendStatusEvent: (orderId: string, status: OrderStatus, note?: string) =>
    prisma.orderStatusEvent.create({
      data: { orderId, status, note },
    }),

  updateStatus: (brandId: string, orderId: string, status: OrderStatus) =>
    prisma.order.updateMany({
      where: { id: orderId, brandId },
      data: { status },
    }),

  /**
   * OrderPayment is a child of Order, not a separate payment architecture —
   * per the 6C lock, these stay here rather than in a new payments/
   * feature or repository.
   */

  createPayment: (params: {
    brandId: string;
    orderId: string;
    amountCents: number;
    provider: PaymentMethod;
  }) =>
    prisma.orderPayment.create({
      data: {
        brandId: params.brandId,
        orderId: params.orderId,
        amountCents: params.amountCents,
        provider: params.provider,
      },
    }),

  getPaymentById: (brandId: string, paymentId: string) =>
    prisma.orderPayment.findFirst({ where: { id: paymentId, brandId } }),

  getPaymentsForOrder: (brandId: string, orderId: string) =>
    prisma.orderPayment.findMany({
      where: { orderId, brandId },
      orderBy: { createdAt: "asc" },
    }),

  updatePaymentStatus: (
    brandId: string,
    paymentId: string,
    status: PaymentStatus,
    opts?: { verifiedAt?: Date; providerReference?: string }
  ) =>
    prisma.orderPayment.updateMany({
      where: { id: paymentId, brandId },
      data: {
        status,
        ...(opts?.verifiedAt !== undefined ? { verifiedAt: opts.verifiedAt } : {}),
        ...(opts?.providerReference !== undefined
          ? { providerReference: opts.providerReference }
          : {}),
      },
    }),
};
