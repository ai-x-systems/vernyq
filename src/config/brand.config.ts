/**
 * Brand configuration — the single seam between the reusable commerce
 * engine and this specific brand.
 *
 * RULE: No feature, component, or service anywhere in this codebase may
 * hardcode a brand name, color, domain, product, or supplier. Everything
 * brand-specific is read from here (or, once Phase 2B lands, from the
 * `Brand` row in the database for values that need to be admin-editable).
 *
 * To launch a second brand on this same engine: change the values below
 * (or point them at env vars / a different Brand row) — no business logic
 * changes.
 */

export const brandConfig = {
  slug: "vernyq",
  name: "Vernyq",
  tagline: "Premium recovery, delivered.",

  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "vernyq.vercel.app",

  market: {
    country: "US",
    currency: "USD",
  },

  contact: {
    // TODO: real support email must be configured before launch.
    // Do not use a placeholder address in production.
    supportEmail: "",
  },

  seo: {
    defaultTitle: "Vernyq — Premium Cold Plunge Tubs",
    defaultDescription:
      "Premium cold plunge tubs designed for recovery, wellness, and everyday performance.",
    primaryKeyword: "cold plunge tub",
  },

  // NOT a registered corporate entity — this is the customer-facing brand
  // name used for copyright/footer copy only, per explicit instruction not
  // to imply a specific corporate/legal structure that doesn't exist yet.
  // "Marketing Mix Solution LLC" is a dissolved/unrelated prior entity and
  // must never be shown to customers as the operator of this store.
  legal: {
    entityName: "Vernyq",
  },
} as const;

export type BrandConfig = typeof brandConfig;