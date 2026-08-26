// One-time / idempotent: ensures the Brand row for this deployment exists.
// Safe to re-run — upserts by slug, never creates duplicates, never
// touches products/orders/customers. prisma/seed.ts is dev-only and must
// NOT be run against production (it creates a DRAFT placeholder product) —
// this script is the production-safe alternative for just the one row
// every DB-backed page actually depends on.
//
// Run with the PRODUCTION DATABASE_URL:
//   DATABASE_URL="<production connection string>" npx tsx scripts/ensure-brand.ts

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { brandConfig } from "../src/config/brand.config";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const brand = await prisma.brand.upsert({
    where: { slug: brandConfig.slug },
    update: {},
    create: {
      slug: brandConfig.slug,
      name: brandConfig.name,
      themeConfig: {},
    },
  });

  console.log(`Brand ensured: ${brand.name} (${brand.id})`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
