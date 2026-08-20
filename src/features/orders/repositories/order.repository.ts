import { prisma } from "@/lib/prisma";

export const orderRepository = {
  getById: (id: string) => prisma.order.findUnique({ where: { id } }),

  getByIdWithPayments: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: { payments: true, items: true, statusHistory: true },
    }),

  create: (data: Parameters<typeof prisma.order.create>[0]["data"]) =>
    prisma.order.create({ data }),

  appendStatusEvent: (orderId: string, status: string, note?: string) =>
    prisma.orderStatusEvent.create({
      data: { orderId, status: status as any, note },
    }),

  updateStatus: (orderId: string, status: string) =>
    prisma.order.update({ where: { id: orderId }, data: { status: status as any } }),
};
