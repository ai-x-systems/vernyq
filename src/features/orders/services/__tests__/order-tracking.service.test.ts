import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/features/orders/repositories/order.repository", () => ({
  orderRepository: {
    getOrderForCustomerView: vi.fn(),
  },
}));

import { orderRepository } from "@/features/orders/repositories/order.repository";
import { getOrderForTracking } from "../order-tracking.service";

describe("order-tracking.service getOrderForTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the order when the email matches exactly", async () => {
    (orderRepository.getOrderForCustomerView as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "order-1",
      customer: { email: "jane@example.com" },
    });

    const result = await getOrderForTracking("brand-a", "order-1", "jane@example.com");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("order-1");
  });

  it("matches case-insensitively", async () => {
    (orderRepository.getOrderForCustomerView as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "order-1",
      customer: { email: "Jane@Example.com" },
    });

    const result = await getOrderForTracking("brand-a", "order-1", "jane@example.com");
    expect(result).not.toBeNull();
  });

  it("returns null when the email does not match, without revealing the order exists", async () => {
    (orderRepository.getOrderForCustomerView as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "order-1",
      customer: { email: "jane@example.com" },
    });

    const result = await getOrderForTracking("brand-a", "order-1", "wrong@example.com");
    expect(result).toBeNull();
  });

  it("returns null when the order doesn't exist at all — identical shape to a wrong-email result", async () => {
    (orderRepository.getOrderForCustomerView as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await getOrderForTracking("brand-a", "nonexistent", "jane@example.com");
    expect(result).toBeNull();
  });

  it("passes brandId through to the repository lookup", async () => {
    (orderRepository.getOrderForCustomerView as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await getOrderForTracking("brand-a", "order-1", "jane@example.com");

    expect(orderRepository.getOrderForCustomerView).toHaveBeenCalledWith("brand-a", "order-1");
  });
});
