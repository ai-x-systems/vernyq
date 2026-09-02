"use server";

import { getCurrentBrand } from "@/lib/get-current-brand";
import { checkoutSchema } from "../schemas/checkout.schema";
import { placeOrder, CheckoutError } from "../services/checkout.service";

export type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function placeOrderAction(input: unknown): Promise<PlaceOrderResult> {
  // Server-side validation — the client already validated with the same
  // schema, but that's a UX convenience only, never a trust boundary.
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Some information is missing or invalid. Please check the form and try again.",
    };
  }

  const brand = await getCurrentBrand();

  try {
    const order = await placeOrder(brand.id, parsed.data);
    return { success: true, orderId: order.id };
  } catch (err) {
    if (err instanceof CheckoutError) {
      return { success: false, error: err.message };
    }
    // Unexpected error — don't leak internals (stack traces, DB details)
    // to the customer.
    console.error("placeOrderAction failed:", err);
    return {
      success: false,
      error: "Something went wrong placing your order. Please try again.",
    };
  }
}
