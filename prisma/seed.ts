import "dotenv/config";

import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { productInputSchema } from "../src/features/catalog/schemas/product.schema";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * DEVELOPMENT SEED — not production inventory, not verified product
 * copy. Every claim in this file traces back to what the supplier
 * (XUANCHENG GUGU SANITARY WARE CO LTD) actually told us. Nothing here
 * is customer-facing until an admin reviews it and flips status to
 * ACTIVE — this seed leaves it as DRAFT deliberately.
 */
async function main() {
const brand = await prisma.brand.upsert({
    where: { slug: "vernyq" },
    update: {},
    create: {
      slug: "vernyq",
      name: "Vernyq",
      themeConfig: {},
    },
  });

  const productData = productInputSchema.parse({
    brandId: brand.id,
    slug: "all-in-one-cold-plunge-heating-cooling",
    name: "All-in-One Cold Plunge — Heating & Cooling",
    shortDescription:
      "DEVELOPMENT DATA — supplier-quoted specs, not independently verified. Not for production use.",
    description:
      "DEVELOPMENT SEED PRODUCT. All specifications below are as quoted by the supplier " +
      "(GD-004) and have not been independently verified or tested by Vernyq. Do not " +
      "publish or represent these claims to real customers until specs are confirmed and " +
      "the product is reviewed by an admin and moved out of DRAFT status.",
    sku: "GD-004-DEV",
    priceCents: 300000, // $3,000 — supplier's current quoted price, NOT a landed cost or final retail price
    category: "cold-plunge-tub",
    specifications: {
      note: "DEVELOPMENT DATA — supplier-quoted, unverified",
      powerSupply: "110-125V / 60Hz",
      inputPowerWatts: 1150,
      compressorPowerWatts: 800,
      coolingCapacityWatts: 3210,
      heatingCapacityWatts: 4150,
      control: "Local control panel or WiFi app",
      refrigerant: "R410A",
      temperatureRangeF: { min: 36, max: 108 },
      filtration: "Built-in filter + pre-filter",
      disinfection: "Ozone disinfection",
    },
    supplierRef: "XUANCHENG GUGU SANITARY WARE CO LTD — GD-004 (internal reference only, never shown to customers)",
    status: "DRAFT",
  });

  // --- Prisma 7 JSON input boundary -----------------------------------
  // productInputSchema (Zod) intentionally types `specifications` as
  // Record<string, unknown> and `dimensions` as a partial object — that's
  // the correct, honest shape for *application* code: we don't know each
  // value is JSON-safe until we check it, so `unknown` is the right type
  // there, not a lie we paper over with `any`.
  //
  // Prisma 7's generated ProductCreateInput/ProductUpdateInput, however,
  // require the narrower `Prisma.InputJsonValue` union for JSON columns —
  // `unknown` isn't assignable to it because TS can't prove every value
  // in a Record<string, unknown> is JSON-serializable.
  //
  // The fix belongs exactly at this boundary: we already validated this
  // data through Zod above (so we know its shape), so it's safe to assert
  // it into Prisma's JSON type right here, once, rather than either (a)
  // weakening the Zod schema to `any`/`unknown` everywhere it's used, or
  // (b) reaching for `as any` to silence the checker.
  const specifications = productData.specifications as Prisma.InputJsonValue;
  const dimensions = productData.dimensions as Prisma.InputJsonValue | undefined;

  const product = await prisma.product.upsert({
    where: { brandId_slug: { brandId: brand.id, slug: productData.slug } },
    update: { ...productData, specifications, dimensions },
    create: { ...productData, specifications, dimensions },
  });

  await prisma.siteSettings.upsert({
    where: { brandId: brand.id },
    update: {},
    create: {
      brandId: brand.id,
      seoDefaults: {
        note: "DEVELOPMENT DATA — placeholder, refine in Phase 2K",
        defaultTitle: "Vernyq — Premium Cold Plunge Tubs",
      },
      homepageConfig: {},
    },
  });

  // Minimal blog relations — ONLY to validate the schema's relations work
  // end-to-end. Unpublished (publishedAt: null) so nothing here is ever
  // indexable or customer-facing. No fake author credentials, no health
  // claims — see Phase 2B Section 14.
  const author = await prisma.blogAuthor.upsert({
    where: { id: `${brand.id}-dev-author` }, // stable id so re-seeding is idempotent
    update: {},
    create: {
      id: `${brand.id}-dev-author`,
      brandId: brand.id,
      name: "[DEV TEST AUTHOR — placeholder, replace before launch]",
    },
  });

  const category = await prisma.blogCategory.upsert({
    where: { brandId_slug: { brandId: brand.id, slug: "dev-test-category" } },
    update: {},
    create: { brandId: brand.id, slug: "dev-test-category", name: "[DEV TEST CATEGORY]" },
  });

  await prisma.blogPost.upsert({
    where: { brandId_slug: { brandId: brand.id, slug: "dev-relation-check" } },
    update: {},
    create: {
      brandId: brand.id,
      categoryId: category.id,
      authorId: author.id,
      slug: "dev-relation-check",
      title: "[DEV] Relation validation post — not real content",
      excerpt: "This post exists only to confirm BlogPost/Category/Author relations resolve. Not published.",
      bodyMarkdown: "DEVELOPMENT DATA — delete before launch.",
      publishedAt: null, // never published
    },
  });

  // Deliberately NOT seeding: reviews (zero fake reviews, Section 13),
  // coupons, AdminUser (requires a real Supabase Auth user to exist
  // first — seeding a fake supabaseUid here would create an orphaned
  // admin record that can never actually log in).

  console.log("Seed complete.");
  console.log(`Brand: ${brand.name} (${brand.id})`);
  console.log(`Dev product: ${product.name} — status: ${product.status} (NOT live)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });