import { prisma } from "@/lib/prisma";

/**
 * SupplierFulfillment is 1:1 with Order (see schema.prisma — orderId is
 * @unique). No brandId column on this model; ownership is always
 * checked via the parent Order, which IS brandId-scoped — every method
 * here takes brandId and joins through Order rather than trusting a
 * bare fulfillment id.
 */
export const fulfillmentRepository = {
  getByOrderId: (brandId: string, orderId: string) =>
    prisma.supplierFulfillment.findFirst({
      where: { orderId, order: { brandId } },
    }),

  /**
   * Creates the fulfillment record on first update, or updates it on
   * subsequent ones — this is intentionally the only write path so admin
   * screens never need to know whether a row already exists.
   */
  upsertForOrder: async (
    brandId: string,
    orderId: string,
    data: {
      supplierName?: string;
      supplierOrderId?: string;
      trackingNumber?: string;
      carrier?: string;
      bolNumber?: string;
      notes?: string;
    }
  ) => {
    // Confirm the order actually belongs to this brand before writing —
    // upsert's `where` can't express the join, so this check happens
    // first as a separate, explicit step.
    const order = await prisma.order.findFirst({ where: { id: orderId, brandId } });
    if (!order) {
      throw new Error("Order not found for this brand");
    }

    return prisma.supplierFulfillment.upsert({
      where: { orderId },
      create: { orderId, ...data },
      update: data,
    });
  },
};
