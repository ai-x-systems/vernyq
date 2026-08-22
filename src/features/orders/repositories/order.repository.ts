import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * All repository queries MUST be scoped by brandId for multi-tenant safety.
 * UI-side validation is not a tenancy boundary — always include brandId in
 * queries where appropriate to avoid accidental cross-tenant access.
 */
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
};
