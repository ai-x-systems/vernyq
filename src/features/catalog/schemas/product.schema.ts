import { z } from "zod";

/**
 * Validates data going INTO the database for a Product. Used by the admin
 * product service (Phase 2H) and by the dev seed, so seeded data is held
 * to the same bar as anything an admin creates.
 */
export const productInputSchema = z.object({
  brandId: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase, hyphen-separated"),
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDescription: z.string().max(300).optional(),
  sku: z.string().optional(),
  priceCents: z.number().int().positive(),
  compareAtCents: z.number().int().positive().optional(),
  category: z.string().optional(),
  specifications: z.record(z.string(), z.unknown()).default({}),
  dimensions: z
    .object({
      lengthMm: z.number().positive(),
      widthMm: z.number().positive(),
      heightMm: z.number().positive(),
    })
    .partial()
    .optional(),
  weightGrams: z.number().int().positive().optional(),
  warrantyInfo: z.string().optional(),
  shippingInfo: z.string().optional(),
  supplierRef: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),
});

export type ProductInput = z.infer<typeof productInputSchema>;
