import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export interface GuestCustomerInput {
  brandId: string;
  name: string;
  email: string;
  phone?: string;
  shippingAddress?: Prisma.InputJsonValue;
}

/**
 * Guest checkout only (Phase 2B, Section 2) — no password, no Supabase
 * auth. Upserts on [brandId, email] so a returning guest doesn't create a
 * duplicate Customer row on their next order.
 */
export function upsertGuestCustomer(input: GuestCustomerInput) {
  const { brandId, email, name, phone, shippingAddress } = input;
  return prisma.customer.upsert({
    where: { brandId_email: { brandId, email } },
    update: { name, phone, shippingAddress },
    create: { brandId, email, name, phone, shippingAddress },
  });
}
