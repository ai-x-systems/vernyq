import { z } from "zod";

/**
 * US-only launch market (per brand.config.ts market.country). Country
 * is fixed rather than a free-text field to keep shipping/address
 * handling simple for launch, matching "do not add unnecessary
 * complexity."
 */
export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
] as const;

/**
 * Exactly the two locked payment methods. No PingPong, no
 * Payoneer/Elevate Pay exposed as customer-facing choices — those are
 * an internal operational decision recorded later at verification time,
 * never a checkout option.
 */
export const PAYMENT_METHODS = ["bank_transfer", "manual_payment_request"] as const;

export const checkoutSchema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().min(7, "Enter a valid phone number"),
  }),
  shipping: z.object({
    address: z.string().trim().min(1, "Address is required"),
    apartment: z.string().trim().optional(),
    city: z.string().trim().min(1, "City is required"),
    state: z.enum(US_STATES, { message: "Select a state" }),
    postalCode: z
      .string()
      .trim()
      .regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
    country: z.literal("US"),
  }),
  paymentMethod: z.enum(PAYMENT_METHODS, { message: "Select a payment method" }),
  // Cart contents are re-validated and re-priced server-side from the
  // database — this is only what the client believes it's ordering.
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutFieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "phone" | "address" | "city" | "state" | "postalCode" | "paymentMethod", string>>;
