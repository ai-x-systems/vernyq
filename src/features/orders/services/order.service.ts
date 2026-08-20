import { orderRepository } from "../repositories/order.repository";

const allowedTransitions: Record<string, Set<string>> = {
  PENDING_PAYMENT: new Set(["PAID", "CANCELLED", "PAYMENT_FAILED"]),
  PAID: new Set(["PROCESSING", "REFUNDED", "CANCELLED"]),
  PROCESSING: new Set(["READY_FOR_FULFILLMENT"]),
  READY_FOR_FULFILLMENT: new Set(["SUPPLIER_ORDER_PENDING"]),
  SUPPLIER_ORDER_PENDING: new Set(["SUPPLIER_ORDERED"]),
  SUPPLIER_ORDERED: new Set(["SHIPPED"]),
  SHIPPED: new Set(["DELIVERED"]),
  DELIVERED: new Set([]),
  CANCELLED: new Set([]),
  REFUNDED: new Set([]),
  PAYMENT_FAILED: new Set([]),
};

export class OrderService {
  async createOrder(data: Parameters<typeof orderRepository.create>[0]) {
    return orderRepository.create(data as any);
  }

  private async validateTransition(current: string, next: string) {
    const allowed = allowedTransitions[current];
    if (!allowed || !allowed.has(next)) {
      throw new Error(`Invalid transition ${current} -> ${next}`);
    }
  }

  async transitionOrder(orderId: string, nextStatus: string, note?: string) {
    const order = await orderRepository.getById(orderId);
    if (!order) throw new Error("Order not found");
    await this.validateTransition(order.status, nextStatus);
    await orderRepository.updateStatus(orderId, nextStatus);
    await orderRepository.appendStatusEvent(orderId, nextStatus, note);
    return orderRepository.getByIdWithPayments(orderId);
  }

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
