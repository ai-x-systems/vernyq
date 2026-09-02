import { getPurchasableProductsByIds } from "@/features/catalog/services/product.service";
import { upsertGuestCustomer } from "@/features/customers/repositories/customer.repository";
import { orderRepository } from "@/features/orders/repositories/order.repository";
import type { CheckoutInput } from "../schemas/checkout.schema";

/**
 * Thrown for expected, user-facing checkout failures (e.g. an item went
 * out of stock between add-to-cart and checkout). The action layer
 * catches this and shows the message directly; anything else is treated
 * as an unexpected error.
 */
export class CheckoutError extends Error {}

// Shipping cost calculation isn't finalized yet — flagged explicitly
// rather than inventing a number. Free at $0 until real logic/rates
// exist, matching "make the calculation/configuration explicit."
const SHIPPING_CENTS_PLACEHOLDER = 0;

export async function placeOrder(brandId: string, input: CheckoutInput) {
  // Re-fetch products from the database and re-price from there —
  // client-supplied prices/quantities from the cart are never trusted
  // for the actual charge, only used to know *which* products and how
  // many were requested.
  const productIds = input.items.map((i) => i.productId);
  const products = await getPurchasableProductsByIds(brandId, productIds);

  if (products.length !== new Set(productIds).size) {
    throw new CheckoutError(
      "One or more items in your cart are no longer available. Please review your cart and try again.",
    );
  }

  const productsById = new Map(products.map((p) => [p.id, p]));

  const orderItems = input.items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      throw new CheckoutError(
        "One or more items in your cart are no longer available. Please review your cart and try again.",
      );
    }
    return {
      productId: product.id,
      quantity: item.quantity,
      unitPriceCents: product.priceCents, // authoritative price, from the DB
    };
  });

  const subtotalCents = orderItems.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const shippingCents = SHIPPING_CENTS_PLACEHOLDER;
  const totalCents = subtotalCents + shippingCents;

  const customer = await upsertGuestCustomer({
    brandId,
    name: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
    email: input.customer.email,
    phone: input.customer.phone,
    shippingAddress: {
      address: input.shipping.address,
      apartment: input.shipping.apartment ?? null,
      city: input.shipping.city,
      state: input.shipping.state,
      postalCode: input.shipping.postalCode,
      country: input.shipping.country,
    },
  });

  const order = await orderRepository.createOrderWithItems({
    brandId,
    customerId: customer.id,
    shippingAddress: {
      address: input.shipping.address,
      apartment: input.shipping.apartment ?? null,
      city: input.shipping.city,
      state: input.shipping.state,
      postalCode: input.shipping.postalCode,
      country: input.shipping.country,
    },
    items: orderItems,
    subtotalCents,
    shippingCents,
    totalCents,
    paymentMethod: input.paymentMethod,
  });

  return order;
}
