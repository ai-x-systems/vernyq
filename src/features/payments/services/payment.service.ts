// src/features/payments/services/payment.service.ts
import { paymentRepository } from "../repositories/payment.repository";
import { getProvider } from "../providers";
import { OrderService } from "@/features/orders/services/order.service";
import { orderRepository } from "@/features/orders/repositories/order.repository";

const orderService = new OrderService();

export class PaymentService {
  async createManualPayment(orderId: string, amountCents: number) {
    const provider = getProvider("manual");
    if (!provider || !provider.createPayment) throw new Error("Manual provider not available");
    const { providerReference } = await provider.createPayment({ orderId, amountCents });
    const order = await orderRepository.getById(orderId);
    if (!order) throw new Error("Order not found");

    const payment = await paymentRepository.create({
      orderId,
      brandId: order.brandId,
      amountCents,
      provider: provider.id,
      providerReference,
      status: "PENDING",
    } as any);

    return payment;
  }

  async verifyPayment(args: { provider: string; providerReference: string; orderId: string; amountCents: number; adminContext?: any }) {
    const { provider, providerReference, orderId, amountCents } = args;

    const existing = await paymentRepository.findByProviderRef(provider, providerReference);
    if (existing && existing.status === "PAID") {
      return existing; // idempotent success
    }

    const order = await orderRepository.getById(orderId);
    if (!order) throw new Error("Order not found");

    if (existing && existing.amountCents !== amountCents) {
      throw new Error("Payment amount mismatch");
    }

    let payment = existing;
    if (!payment) {
      payment = await paymentRepository.create({
        orderId,
        brandId: order.brandId,
        amountCents,
        provider,
        providerReference,
        status: "PENDING",
      } as any);
    }

    const updated = await paymentRepository.updateStatus(payment.id, "PAID", { verifiedAt: new Date() });

    await orderService.markPaymentVerified(orderId, `Verified by provider ${provider}`);

    return updated;
  }

  async refundPayment(paymentId: string, amountCents: number) {
    const payment = await paymentRepository.findById(paymentId);
    if (!payment) throw new Error("Payment not found");
    const provider = getProvider(payment.provider);
    if (!provider || !provider.refund) {
      throw new Error("Provider refund not available");
    }
    const res = await provider.refund({ providerReference: payment.providerReference, amountCents } as any);
    return res;
  }
}
