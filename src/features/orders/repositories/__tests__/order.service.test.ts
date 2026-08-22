import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../repositories/order.repository", () => ({
  orderRepository: {
    getById: vi.fn(),
    getByIdWithPayments: vi.fn(),
    updateStatus: vi.fn(),
    appendStatusEvent: vi.fn(),
    create: vi.fn(),
  },
}));

import { orderRepository } from "../../repositories/order.repository";
import { OrderService } from "../order.service";

describe("OrderService brand isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws and never transitions when the order is not found under the given brandId", async () => {
    (orderRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const service = new OrderService();

    await expect(
      service.transitionOrder("brand-a", "order-1", "PAID")
    ).rejects.toThrow("Order not found");

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
    expect(orderRepository.appendStatusEvent).not.toHaveBeenCalled();
  });

  it("passes brandId through to every repository call during a valid transition", async () => {
    (orderRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "PENDING_PAYMENT",
    });
    (orderRepository.getByIdWithPayments as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "PAID",
    });
    const service = new OrderService();

    await service.markPaymentVerified("brand-a", "order-1", "verified by admin");

    expect(orderRepository.getById).toHaveBeenCalledWith("brand-a", "order-1");
    expect(orderRepository.updateStatus).toHaveBeenCalledWith("brand-a", "order-1", "PAID");
    expect(orderRepository.getByIdWithPayments).toHaveBeenCalledWith("brand-a", "order-1");
  });

  it("rejects an invalid status transition even when the order is found", async () => {
    (orderRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: "DELIVERED",
    });
    const service = new OrderService();

    await expect(
      service.transitionOrder("brand-a", "order-1", "PAID")
    ).rejects.toThrow("Invalid transition");

    expect(orderRepository.updateStatus).not.toHaveBeenCalled();
  });
});
