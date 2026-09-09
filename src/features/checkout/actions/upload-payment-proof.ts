"use server";

import { getCurrentBrand } from "@/lib/get-current-brand";
import { getSupabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase-admin";
import { getOrderForTracking } from "@/features/orders/services/order-tracking.service";
import { orderRepository } from "@/features/orders/repositories/order.repository";

export type UploadPaymentProofResult =
  | { success: true }
  | { success: false; error: string };

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

// Only accept image types we can confidently map to a safe extension.
// The extension used in the storage path is derived from this map, never
// from the client-supplied filename — a filename is attacker-controlled
// input and must never flow into a storage path unsanitized.
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const GENERIC_ERROR =
  "We couldn't upload your payment proof. Please check the file and try again.";

/**
 * Uploads proof of a bank transfer for an order.
 *
 * Ownership is re-verified here with the exact same email-gate logic
 * used by the order tracking page (getOrderForTracking) — the fact that
 * the browser has the order-detail page open is never treated as proof
 * of authorization on its own.
 *
 * This intentionally never changes OrderPayment.status. See
 * order.repository.ts#setPaymentProof, which has no status parameter at
 * all — verifying payment stays an admin-only action (not yet built).
 */
export async function uploadPaymentProofAction(
  orderId: string,
  email: string,
  formData: FormData,
): Promise<UploadPaymentProofResult> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, error: "No file was provided." };
  }

  const ext = ALLOWED_MIME_TO_EXT[file.type];
  if (!ext) {
    return {
      success: false,
      error: "Please upload a JPEG, PNG, or WebP image.",
    };
  }

  if (file.size === 0) {
    return { success: false, error: "The selected file is empty." };
  }

  if (file.size > MAX_FILE_BYTES) {
    return { success: false, error: "File is too large. Maximum size is 5MB." };
  }

  const brand = await getCurrentBrand();

  // Same email-gate as order tracking: a wrong/missing email is treated
  // identically to "order does not exist" — this never confirms whether
  // an order id is valid to someone without the matching email.
  const order = await getOrderForTracking(brand.id, orderId, email);
  if (!order) {
    return { success: false, error: GENERIC_ERROR };
  }

  const payment = order.payments.find((p) => p.provider === "bank_transfer");
  if (!payment) {
    // Either there's no payment record yet, or this order used manual
    // payment request — proof upload only applies to bank transfer.
    return {
      success: false,
      error: "Payment proof upload is only available for bank transfer orders.",
    };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Object path only — this bucket is private, so there is no public
    // URL to store. Field name is `proofUrl` per the locked schema, but
    // the value here is a Storage object path; rendering it later
    // (admin review, not yet built) requires generating a signed URL,
    // not treating this value as a directly-fetchable link.
    const path = `${brand.id}/${orderId}/${payment.id}-${Date.now()}.${ext}`;

    const supabase = getSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      console.error("uploadPaymentProofAction storage upload failed:", uploadError);
      return { success: false, error: GENERIC_ERROR };
    }

    await orderRepository.setPaymentProof(brand.id, payment.id, path);

    return { success: true };
  } catch (err) {
    // Don't leak stack traces, bucket names, or storage internals to
    // the customer.
    console.error("uploadPaymentProofAction failed:", err);
    return { success: false, error: GENERIC_ERROR };
  }
}
