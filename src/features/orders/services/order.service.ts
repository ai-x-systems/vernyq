import { orderRepository } from "../repositories/order.repository";
import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * Allowed state transitions for orders.
 * Typed as OrderStatus to catch typos at compile time.
 */
const allowedTransitions: Record<OrderStatus, Set<OrderStatus>> = {
  PENDING_PAYMENT: new Set<OrderStatus>(["PAID", "CANCELLED", "PAYMENT_FAILED"]),
  PAID: new Set<OrderStatus>(["PROCESSING", "REFUNDED", "CANCELLED"]),
  PROCESSING: new Set<OrderStatus>(["READY_FOR_FULFILLMENT"]),
  READY_FOR_FULFILLMENT: new Set<OrderStatus>(["SUPPLIER_ORDER_PENDING"]),
  SUPPLIER_ORDER_PENDING: new Set<OrderStatus>(["SUPPLIER_ORDERED"]),
  SUPPLIER_ORDERED: new Set<OrderStatus>(["SHIPPED"]),
  SHIPPED: new Set<OrderStatus>(["DELIVERED"]),
  DELIVERED: new Set<OrderStatus>([]),
  CANCELLED: new Set<OrderStatus>([]),
  REFUNDED: new Set<OrderStatus>([]),
  PAYMENT_FAILED: new Set<OrderStatus>([]),
};

export class OrderService {
  async createOrder(data: Parameters<typeof orderRepository.create>[0]) {
    return orderRepository.create(data);
  }

  private async validateTransition(current: OrderStatus, next: OrderStatus) {
    const allowed = allowedTransitions[current];
    if (!allowed || !allowed.has(next)) {
      throw new Error(`Invalid transition ${current} -> ${next}`);
    }
  }

  async transitionOrder(orderId: string, nextStatus: OrderStatus, note?: string) {
    const order = await orderRepository.getById(orderId);
    if (!order) throw new Error("Order not found");

    // DB model type may be broader/nullable; cast here after presence check.
    const currentStatus = order.status as OrderStatus;
    await this.validateTransition(currentStatus, nextStatus);

    await orderRepository.updateStatus(orderId, nextStatus);
    await orderRepository.appendStatusEvent(orderId, nextStatus, note);
    return orderRepository.getByIdWithPayments(orderId);
  }

  // convenience methods
  async markPaymentVerified(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "PAID", note);
  }

  async cancelOrder(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "CANCELLED", note);
  }

  async startProcessing(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "PROCESSING", note);
  }

  async markReadyForFulfillment(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "READY_FOR_FULFILLMENT", note);
  }

  async markSupplierOrderPending(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "SUPPLIER_ORDER_PENDING", note);
  }

  async markSupplierOrdered(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "SUPPLIER_ORDERED", note);
  }

  async markShipped(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "SHIPPED", note);
  }

  async markDelivered(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "DELIVERED", note);
  }

  async refundOrder(orderId: string, note?: string) {
    return this.transitionOrder(orderId, "REFUNDED", note);
  }
}
