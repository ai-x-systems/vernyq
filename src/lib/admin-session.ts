import crypto from "crypto";

/**
 * Deliberately simple: one shared password (ADMIN_PASSWORD), one signed
 * session cookie. No AdminUser/Supabase Auth wiring yet — the AdminUser
 * model in schema.prisma is reserved for when there's more than one
 * admin. Swapping to real per-user auth later doesn't require touching
 * any order/fulfillment logic, only this file, login/logout, and
 * middleware.ts.
 *
 * The cookie is a signed token (expiry + HMAC), not a session ID — this
 * server has no session store, so validity is checked purely by
 * signature + expiry, statelessly, on every request in middleware.
 */

export const ADMIN_SESSION_COOKIE = "vernyq_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Set it in your environment before using admin login."
    );
  }
  return secret;
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error(
      "ADMIN_PASSWORD is not set. Set it in your environment before using admin login."
    );
  }
  // Timing-safe comparison — plain `===` on secrets leaks timing info.
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  const expiresAt = Number(payload);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}
