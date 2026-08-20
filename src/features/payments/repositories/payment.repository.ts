// src/features/payments/repositories/payment.repository.ts
import { prisma } from "@/lib/prisma";

export const paymentRepository = {
  create: (data: Parameters<typeof prisma.orderPayment.create>[0]["data"]) =>
    prisma.orderPayment.create({ data }),

  findById: (id: string) =>
    prisma.orderPayment.findUnique({ where: { id } }),

  findByProviderRef: (provider: string, providerReference: string) =>
    prisma.orderPayment.findFirst({ where: { provider, providerReference } }),

  updateStatus: (id: string, status: string, updates?: Partial<{ verifiedAt: Date }>) =>
    prisma.orderPayment.update({ where: { id }, data: { status: status as any, ...(updates ?? {}) } }),
};
