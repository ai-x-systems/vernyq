"use server";

import { revalidatePath } from "next/cache";
import { getCurrentBrand } from "@/lib/get-current-brand";
import { toggleProductInStock } from "@/features/catalog/services/product.service";

export async function setProductStockAction(productId: string, inStock: boolean) {
  const brand = await getCurrentBrand();
  await toggleProductInStock(brand.id, productId, inStock);
  revalidatePath("/admin/products");
  revalidatePath("/cold-plunge-tubs");
  // Product slug isn't known here without an extra query — revalidating
  // the layout segment would need the slug; simplest correct option is
  // letting force-dynamic on the product page pick up the fresh value on
  // next request, which it already does since that page is never cached.
}
