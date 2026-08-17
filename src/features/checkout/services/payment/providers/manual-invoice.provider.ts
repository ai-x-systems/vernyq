import type {
  CreateCheckoutInput,
  CreateCheckoutResult,
  PaymentService,
  RefundResult,
  VerifyPaymentResult,
  WebhookVerificationResult,
} from "../payment.interface";

/**
 * Development/manual PaymentService provider.
 *
 * No real payment processor is connected yet (Stripe vs. another
 * high-ticket-capable processor is still an open decision per the spec —
 * Safepay/PayPro are explicitly flagged as likely unsuitable for
 * $3,000–$6,000 orders).
 *
 * This provider does NOT mark orders as paid automatically. It exists so
 * the checkout flow, order pipeline, and admin screens can be built and
 * tested end-to-end now, with a real gateway swapped in later without
 * touching anything outside this file.
 *
 * `verifyPayment` and `handleWebhook` intentionally return "pending" /
 * unverified — an admin must manually confirm payment in Phase 2H's admin
 * order screen until a real provider is wired up. This is deliberate, not
 * a shortcut: it's the enforcement of "never mark PAID on a client
 * redirect alone."
 */
export class ManualInvoiceProvider implements PaymentService {
  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    return {
      redirectUrl: `${input.successUrl}?orderId=${input.orderId}&status=awaiting_manual_confirmation`,
      providerReference: `manual_${input.orderId}`,
    };
  }

  async verifyPayment(providerReference: string): Promise<VerifyPaymentResult> {
    const orderId = providerReference.replace(/^manual_/, "");
    return {
      orderId,
      status: "pending", // Manual provider never self-reports "paid"
      providerReference,
    };
  }

  async handleWebhook(): Promise<WebhookVerificationResult> {
    // No webhook source exists for the manual provider.
    return { verified: false };
  }

  async refund(providerReference: string, amountCents: number): Promise<RefundResult> {
    const orderId = providerReference.replace(/^manual_/, "");
    return { orderId, refundedCents: amountCents, providerReference };
  }
}
