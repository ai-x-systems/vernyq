import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/features/catalog/services/product.service", () => ({
  getPurchasableProductsByIds: vi.fn(),
}));

vi.mock("@/features/customers/repositories/customer.repository", () => ({
  upsertGuestCustomer: vi.fn(),
}));

vi.mock("@/features/orders/repositories/order.repository", () => ({
  orderRepository: {
    createOrderWithItems: vi.fn(),
  },
}));

import { getPurchasableProductsByIds } from "@/features/catalog/services/product.service";
import { upsertGuestCustomer } from "@/features/customers/repositories/customer.repository";
import { orderRepository } from "@/features/orders/repositories/order.repository";
import { placeOrder, CheckoutError } from "../checkout.service";
import type { CheckoutInput } from "../../schemas/checkout.schema";

const baseInput: CheckoutInput = {
  customer: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "5551234567",
  },
  shipping: {
    address: "123 Main St",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    country: "US",
  },
  paymentMethod: "bank_transfer",
  items: [{ productId: "prod-1", quantity: 2 }],
};

describe("checkout.service placeOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (upsertGuestCustomer as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "cust-1" });
    (orderRepository.createOrderWithItems as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "order-1",
    });
  });

  it("uses the database price, never any client-supplied price", async () => {
    // Note: CheckoutInput structurally has no price field at all — a
    // client literally cannot supply one. This test proves the DB price
    // (600000) is what actually gets used for the charge.
    (getPurchasableProductsByIds as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "prod-1", priceCents: 600000 },
    ]);

    await placeOrder("brand-a", baseInput);

    expect(orderRepository.createOrderWithItems).toHaveBeenCalledWith(
      expect.objectContaining({
        subtotalCents: 600000 * 2,
        totalCents: 600000 * 2,
        items: [{ productId: "prod-1", quantity: 2, unitPriceCents: 600000 }],
      }),
    );
  });

  it("passes brandId through to the product lookup and order creation", async () => {
    (getPurchasableProductsByIds as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "prod-1", priceCents: 100000 },
    ]);

    await placeOrder("brand-a", baseInput);

    expect(getPurchasableProductsByIds).toHaveBeenCalledWith("brand-a", ["prod-1"]);
    expect(orderRepository.createOrderWithItems).toHaveBeenCalledWith(
      expect.objectContaining({ brandId: "brand-a" }),
    );
  });

  it("throws CheckoutError when a requested product is not active/found, and never creates an order", async () => {
    (getPurchasableProductsByIds as ReturnType<typeof vi.fn>).mockResolvedValue([]); // nothing found

    await expect(placeOrder("brand-a", baseInput)).rejects.toThrow(CheckoutError);

    expect(orderRepository.createOrderWithItems).not.toHaveBeenCalled();
  });

  it("records the customer's selected payment method without alteration", async () => {
    (getPurchasableProductsByIds as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "prod-1", priceCents: 50000 },
    ]);

    await placeOrder("brand-a", { ...baseInput, paymentMethod: "manual_payment_request" });

    expect(orderRepository.createOrderWithItems).toHaveBeenCalledWith(
      expect.objectContaining({ paymentMethod: "manual_payment_request" }),
    );
  });
});
