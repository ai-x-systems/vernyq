import { createClient } from "@supabase/supabase-js";

/**
 * Server-only. Never import this from a Client Component — the service
 * role key bypasses Row Level Security and must never reach the browser
 * bundle. Used only for admin-mediated writes to private Storage buckets
 * (e.g. payment-proof uploads), where the server has already verified
 * the request is allowed before calling this.
 *
 * Lazily constructed (not a module-level client) so a missing env var
 * throws only when something actually tries to use Storage, inside
 * whatever try/catch the caller has — same reasoning as lib/prisma.ts.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in the environment.",
    );
  }

  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

export const PAYMENT_PROOFS_BUCKET = "payment-proofs";

/**
 * Generates a short-lived signed URL so admin can view a payment-proof
 * image without the bucket ever being public. Server-only, admin-gated
 * caller required — this function itself doesn't check authorization,
 * middleware.ts on /admin/* does.
 */
export async function getSignedProofUrl(path: string, expiresInSeconds = 300): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(PAYMENT_PROOFS_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data) {
    console.error("getSignedProofUrl failed:", error);
    return null;
  }

  return data.signedUrl;
}
