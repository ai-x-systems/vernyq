/**
 * Server-only. Never import this from a Client Component — these values
 * must never reach the browser bundle. Bank account details are real
 * financial information; they live only in server-side environment
 * variables (BANK_TRANSFER_*), never in this repository's source.
 *
 * Returns null if not yet configured (env vars unset) so callers can
 * show an honest "details coming soon" fallback instead of crashing —
 * this is expected until the real values are set in Vercel.
 */

export type BankDetails = {
  bankName: string;
  bankLocation: string;
  accountHolder: string;
  accountType: string;
  swift: string;
  routingNumber: string;
  accountNumber: string;
  bankAddress: string;
};

export function getBankDetails(): BankDetails | null {
  const {
    BANK_TRANSFER_BANK_NAME,
    BANK_TRANSFER_BANK_LOCATION,
    BANK_TRANSFER_ACCOUNT_HOLDER,
    BANK_TRANSFER_ACCOUNT_TYPE,
    BANK_TRANSFER_SWIFT,
    BANK_TRANSFER_ROUTING,
    BANK_TRANSFER_ACCOUNT_NUMBER,
    BANK_TRANSFER_BANK_ADDRESS,
  } = process.env;

  // Require the fields that actually matter for a customer to send
  // money correctly. Location/address/routing can be blank for some
  // banks (e.g. IBAN-only accounts have no routing number).
  if (
    !BANK_TRANSFER_BANK_NAME ||
    !BANK_TRANSFER_ACCOUNT_HOLDER ||
    !BANK_TRANSFER_SWIFT ||
    !BANK_TRANSFER_ACCOUNT_NUMBER
  ) {
    return null;
  }

  return {
    bankName: BANK_TRANSFER_BANK_NAME,
    bankLocation: BANK_TRANSFER_BANK_LOCATION ?? "",
    accountHolder: BANK_TRANSFER_ACCOUNT_HOLDER,
    accountType: BANK_TRANSFER_ACCOUNT_TYPE ?? "",
    swift: BANK_TRANSFER_SWIFT,
    routingNumber: BANK_TRANSFER_ROUTING ?? "-",
    accountNumber: BANK_TRANSFER_ACCOUNT_NUMBER,
    bankAddress: BANK_TRANSFER_BANK_ADDRESS ?? "",
  };
}
