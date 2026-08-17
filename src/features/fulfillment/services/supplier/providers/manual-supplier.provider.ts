import type {
  CancelResult,
  CreateSupplierOrderInput,
  CreateSupplierOrderResult,
  SupplierOrderStatus,
  SupplierProvider,
} from "../supplier.interface";

/**
 * Manual SupplierProvider — Phase 1 fulfillment.
 *
 * `createOrder` does NOT contact any real supplier system — the current
 * supplier has no ordering API. It records that a supplier order needs to
 * be placed by hand (WhatsApp/email to Klay Lin per the current process)
 * and returns a placeholder reference. The admin then manually enters the
 * real supplier order ID, tracking number, carrier, and BOL once the
 * supplier provides them — see Phase 2I / 2H admin fulfillment screen.
 *
 * Swap for `alibaba-supplier.provider.ts` or `supplier-api.provider.ts`
 * only once the supplier provides actual API credentials and
 * documentation — not before.
 */
export class ManualSupplierProvider implements SupplierProvider {
  async createOrder(input: CreateSupplierOrderInput): Promise<CreateSupplierOrderResult> {
    return {
      supplierOrderId: `MANUAL-PENDING-${input.orderId}`,
      automated: false,
    };
  }

  async getOrderStatus(supplierOrderId: string): Promise<SupplierOrderStatus> {
    // Manual provider has no live status source — admin-entered data in
    // the database is the source of truth, not this provider.
    return { supplierOrderId, status: "pending" };
  }

  async getTracking(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature must match SupplierProvider
    supplierOrderId: string,
  ): Promise<Pick<SupplierOrderStatus, "trackingNumber" | "carrier" | "bolNumber">> {
    return { trackingNumber: undefined, carrier: undefined, bolNumber: undefined };
  }

  async cancelOrder(supplierOrderId: string): Promise<CancelResult> {
    return { supplierOrderId, cancelled: false };
  }
}
