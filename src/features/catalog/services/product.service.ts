import {
  getProductBySlug,
  listActiveProducts,
  getActiveProductsByIds,
} from "../repositories/product.repository";

/**
 * Product service. UI/Server Actions call this, never the repository
 * directly — keeps room to add caching, business rules, or cross-feature
 * composition later without touching callers.
 */

export async function getPublishedProductBySlug(brandId: string, slug: string) {
  const product = await getProductBySlug(brandId, slug);
  if (!product || product.status !== "ACTIVE") return null;
  return product;
}

export async function getStorefrontProductList(brandId: string) {
  return listActiveProducts(brandId);
}

export async function getPurchasableProductsByIds(brandId: string, ids: string[]) {
  return getActiveProductsByIds(brandId, ids);
}
