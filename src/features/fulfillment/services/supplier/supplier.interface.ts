/**
 * SupplierService contract.
 *
 * The current supplier (XUANCHENG GUGU SANITARY WARE CO LTD) has only
 * indicated automated ordering MAY become possible at higher volume — no
 * API or documentation exists today. This interface exists so the
 * fulfillment pipeline is provider-agnostic; a real `alibaba-supplier` or
 * `supplier-api` provider can be dropped in later once actual credentials
 * and docs exist, without touching order logic or the admin UI.
 */

export interface CreateSupplierOrderInput {
  orderId: string;
  supplierSku: string;
  quantity: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface CreateSupplierOrderResult {
  supplierOrderId: string;
  /** True only for providers that actually submit orders programmatically. */
  automated: boolean;
}

export interface SupplierOrderStatus {
  supplierOrderId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  carrier?: string;
  bolNumber?: string;
  estimatedDeliveryDate?: string;
}

export interface CancelResult {
  supplierOrderId: string;
  cancelled: boolean;
}

export interface SupplierProvider {
  createOrder(input: CreateSupplierOrderInput): Promise<CreateSupplierOrderResult>;
  getOrderStatus(supplierOrderId: string): Promise<SupplierOrderStatus>;
  getTracking(supplierOrderId: string): Promise<Pick<SupplierOrderStatus, "trackingNumber" | "carrier" | "bolNumber">>;
  cancelOrder(supplierOrderId: string): Promise<CancelResult>;
}
