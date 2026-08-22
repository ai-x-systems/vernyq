import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Prisma client entirely — these are unit tests asserting the
// *query shape* the repository sends to Prisma, not integration tests
// against a real database. No credentials, no live DB required.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    orderStatusEvent: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { orderRepository } from "../order.repository";

describe("orderRepository brand isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getById always includes brandId in the where clause", async () => {
    await orderRepository.getById("brand-a", "order-1");

    expect(prisma.order.findFirst).toHaveBeenCalledWith({
      where: { id: "order-1", brandId: "brand-a" },
    });
  });

  it("getByIdWithPayments always includes brandId in the where clause", async () => {
    await orderRepository.getByIdWithPayments("brand-a", "order-1");

    expect(prisma.order.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "order-1", brandId: "brand-a" },
      })
    );
  });

  it("updateStatus scopes the update by both id and brandId", async () => {
    await orderRepository.updateStatus("brand-a", "order-1", "PAID");

    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: "order-1", brandId: "brand-a" },
      data: { status: "PAID" },
    });
  });

  it("a different brandId produces a different query — cross-brand access is not possible via a shared code path", async () => {
    await orderRepository.getById("brand-a", "order-1");
    await orderRepository.getById("brand-b", "order-1");

    const calls = (prisma.order.findFirst as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0][0]).toEqual({ where: { id: "order-1", brandId: "brand-a" } });
    expect(calls[1][0]).toEqual({ where: { id: "order-1", brandId: "brand-b" } });
    expect(calls[0][0]).not.toEqual(calls[1][0]);
  });
});
