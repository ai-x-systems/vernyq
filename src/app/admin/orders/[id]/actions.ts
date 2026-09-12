"use server";

import { revalidatePath } from "next/cache";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { orderRepository } from "@/features/orders/repositories/order.repository";
import { fulfillmentRepository } from "@/features/fulfillment/repositories/fulfillment.repository";
import { OrderService } from "@/features/orders/services/order.service";
import type { OrderStatus } from "@/generated/prisma/enums";

const orderService = new OrderService();

export type ActionResult = { success: true } | { success: false; error: string };

/**
 * Combines the two things "verifying payment" actually means: the
 * OrderPayment row moves to PAID with a verifiedAt timestamp, and the
 * Order itself transitions PENDING_PAYMENT -> PAID. Both or neither —
 * an admin should never end up with one updated and not the other.
 */
export async function verifyPaymentAction(orderId: string, paymentId: string): Promise<ActionResult> {
  try {
    const brand = await getCurrentBrand();
    await orderRepository.updatePaymentStatus(brand.id, paymentId, "PAID", { verifiedAt: new Date() });
    await orderService.markPaymentVerified(brand.id, orderId, "Payment verified by admin");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("verifyPaymentAction failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to verify payment." };
  }
}

export async function transitionOrderAction(orderId: string, nextStatus: OrderStatus): Promise<ActionResult> {
  try {
    const brand = await getCurrentBrand();
    await orderService.transitionOrder(brand.id, orderId, nextStatus, "Updated by admin");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("transitionOrderAction failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update order status." };
  }
}

export async function updateFulfillmentAction(orderId: string, formData: FormData): Promise<ActionResult> {
  try {
    const brand = await getCurrentBrand();
    await fulfillmentRepository.upsertForOrder(brand.id, orderId, {
      supplierName: str(formData.get("supplierName")),
      supplierOrderId: str(formData.get("supplierOrderId")),
      trackingNumber: str(formData.get("trackingNumber")),
      carrier: str(formData.get("carrier")),
      bolNumber: str(formData.get("bolNumber")),
      notes: str(formData.get("notes")),
    });
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err) {
    console.error("updateFulfillmentAction failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to save fulfillment details." };
  }
}

function str(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
