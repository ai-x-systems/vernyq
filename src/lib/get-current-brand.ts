import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { brandConfig } from "@/config/brand.config";

/**
 * Resolves the Brand row for the currently running storefront.
 *
 * Vernyq runs one brand today, but every repository/service in the app
 * is already brandId-scoped (see order.repository.ts, product.repository.ts)
 * in anticipation of that changing. This is the single place that maps
 * "the site currently running" -> a real brandId, so that mapping only
 * has to be correct once. Server-only — never call from a Client Component.
 *
 * cache() dedupes this to a single query per request, even if multiple
 * server components on the same page call it.
 */
export const getCurrentBrand = cache(async () => {
  const brand = await prisma.brand.findUnique({
    where: { slug: brandConfig.slug },
  });

  if (!brand) {
    throw new Error(
      `No Brand row found for slug "${brandConfig.slug}". The database ` +
        `is missing its brand seed row — this is a deployment/seed issue, ` +
        `not a recoverable runtime state.`
    );
  }

  return brand;
});
