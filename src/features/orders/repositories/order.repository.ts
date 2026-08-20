import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

/**
 * All repository queries MUST be scoped by brandId for multi-tenant safety.
 * UI-side validation is not a tenancy boundary — always include brandId in
 * queries where appropriate to avoid accidental cross-tenant access.
 */
export const orderRepository = {
  getById: (id: string) => prisma.order.findUnique({ where: { id } }),

  getByIdWithPayments: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: { payments: true, items: true, statusHistory: true },
    }),

  create: (data: Parameters<typeof prisma.order.create>[0]["data"]) =>
    prisma.order.create({ data }),

  appendStatusEvent: (orderId: string, status: Prisma.OrderStatus | string, note?: string) =>
    prisma.orderStatusEvent.create({
      data: { orderId, status: status as any, note },
    }),

  updateStatus: (orderId: string, status: Prisma.OrderStatus | string) =>
    prisma.order.update({ where: { id: orderId }, data: { status: status as any } }),
};
