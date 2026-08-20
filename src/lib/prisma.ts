import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Single Prisma Client instance, reused across hot-reloads in dev so we
 * don't exhaust the Postgres connection pool. Repositories import this —
 * nothing outside `repositories/` should import Prisma directly (see
 * lib/utils and each feature's `repositories/` folder).
 *
 * Uses the driver adapter (@prisma/adapter-pg) against DATABASE_URL/DIRECT_URL,
 * per Prisma 7's adapter-based client — matches the generator's custom output
 * at src/generated/prisma configured in prisma/schema.prisma.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prefer DATABASE_URL, fall back to DIRECT_URL (CI uses DIRECT_URL)
const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database connection string. Please set DATABASE_URL or DIRECT_URL in the environment or repository secrets."
  );
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
