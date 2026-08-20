// src/lib/payments/provider.ts
// Minimal provider types for compile-time only. No runtime secrets or integrations.

export type ProviderVerifyResult = {
  provider: string;
  providerReference: string;
  status: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  amountCents: number;
  metadata?: Record<string, unknown>;
};

export interface PaymentProvider {
  id: string;
  createPayment?: (args: { orderId: string; amountCents: number; metadata?: any }) => Promise<{ providerReference: string; metadata?: any }>;
  verifyPayment?: (raw: any) => Promise<ProviderVerifyResult>;
  refund?: (args: { providerReference: string; amountCents: number }) => Promise<any>;
}
