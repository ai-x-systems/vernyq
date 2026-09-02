import { prisma } from "@/lib/prisma";

/**
 * Product repository. Per the architecture rule established in Phase 1/2A:
 * services never call Prisma directly — only repositories do. Every query
 * here is scoped by brandId (Phase 2B, Section 8: tenancy boundaries must
 * never rely on UI validation alone).
 */

export function getProductBySlug(brandId: string, slug: string) {
  return prisma.product.findUnique({
    where: { brandId_slug: { brandId, slug } },
    include: {
      images: { orderBy: { position: "asc" } },
      faqs: { orderBy: { position: "asc" } },
    },
  });
}

export function listActiveProducts(brandId: string) {
  return prisma.product.findMany({
    where: { brandId, status: "ACTIVE" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Used by checkout to re-price cart items server-side. Only returns
 * ACTIVE products — a product that went DRAFT/archived after being
 * added to someone's cart must not be purchasable.
 */
export function getActiveProductsByIds(brandId: string, ids: string[]) {
  return prisma.product.findMany({
    where: { brandId, status: "ACTIVE", id: { in: ids } },
  });
}

export function listAllProductsForAdmin(brandId: string) {
  return prisma.product.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
  });
}
