// src/features/payments/providers/index.ts
import type { PaymentProvider } from "@/lib/payments/provider";

// Minimal, empty registry placeholder. No providers are registered here yet.
// This file exists purely so imports (../providers) resolve during type-check.
const providers: Record<string, PaymentProvider> = {};

export const getProvider = (id: string): PaymentProvider | undefined => providers[id];
