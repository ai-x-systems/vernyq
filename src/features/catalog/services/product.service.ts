import {
  getProductBySlug,
  listActiveProducts,
  getActiveProductsByIds,
  listAllProductsForAdmin,
  setProductInStock,
  getApprovedReviewsForProduct,
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

export async function getAdminProductList(brandId: string) {
  return listAllProductsForAdmin(brandId);
}

export async function toggleProductInStock(brandId: string, productId: string, inStock: boolean) {
  return setProductInStock(brandId, productId, inStock);
}

export async function getProductReviews(productId: string) {
  const reviews = await getApprovedReviewsForProduct(productId);
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return { reviews, count, average };
}
