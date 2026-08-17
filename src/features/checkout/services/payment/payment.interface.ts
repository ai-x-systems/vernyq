/**
 * PaymentService contract.
 *
 * The checkout UI and order logic depend ONLY on this interface, never on
 * a specific provider. Swapping providers (manual → Stripe → anything
 * else) means writing a new file in `./providers/` and changing one
 * factory wiring — nothing in checkout, orders, or the UI changes.
 *
 * CRITICAL RULE (per spec): an order may only transition PENDING_PAYMENT →
 * PAID after a verified webhook or a verified server-side status check via
 * `verifyPayment`. Reaching a "success" confirmation URL in the browser is
 * NEVER sufficient on its own — the client cannot be trusted to report its
 * own payment status.
 */

export interface CreateCheckoutInput {
  orderId: string;
  amountCents: number;
  currency: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutResult {
  /** Where to send the customer to complete payment. */
  redirectUrl: string;
  /** Opaque reference the provider uses to identify this checkout/session. */
  providerReference: string;
}

export interface VerifyPaymentResult {
  orderId: string;
  status: "paid" | "pending" | "failed";
  providerReference: string;
}

export interface WebhookVerificationResult {
  /** True only if the signature/payload was cryptographically verified. */
  verified: boolean;
  orderId?: string;
  status?: "paid" | "failed" | "refunded";
  raw?: unknown;
}

export interface RefundResult {
  orderId: string;
  refundedCents: number;
  providerReference: string;
}

export interface PaymentService {
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
  verifyPayment(providerReference: string): Promise<VerifyPaymentResult>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookVerificationResult>;
  refund(providerReference: string, amountCents: number): Promise<RefundResult>;
}
