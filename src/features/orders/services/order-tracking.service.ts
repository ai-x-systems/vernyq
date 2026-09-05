import { orderRepository } from "@/features/orders/repositories/order.repository";

/**
 * Security model for customer-facing order lookup:
 *
 * The order id (a cuid) is already a long, effectively unguessable
 * string — nothing like a sequential "VY-1001" order number. On top of
 * that, this requires the customer's email to also match exactly before
 * any order details are returned. A wrong/missing email is treated
 * identically to "order does not exist" — this function never reveals
 * whether an order exists for an id if the email doesn't match, which
 * prevents someone from using this to test whether a given id is valid.
 *
 * This is a proportionate bar for launch (not a full signed-token
 * system) — flagged here if a stronger mechanism is wanted later.
 */
export async function getOrderForTracking(brandId: string, orderId: string, email: string) {
  const order = await orderRepository.getOrderForCustomerView(brandId, orderId);

  if (!order) return null;
  if (order.customer.email.toLowerCase() !== email.trim().toLowerCase()) return null;

  return order;
}

export type TrackedOrder = NonNullable<Awaited<ReturnType<typeof getOrderForTracking>>>;
