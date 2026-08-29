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
 *
 * IMPORTANT: client creation is lazy (via the Proxy below), not eager at
 * module scope. A missing/invalid DATABASE_URL must throw at the moment
 * a query actually runs — inside whatever try/catch the calling code
 * has — not at import time, which happens before any component's code
 * runs and which no try/catch anywhere else in the app can ever catch.
 * An eager throw here previously caused every page to fail with Next.js's
 * generic, undebuggable crash screen instead of a catchable error.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing database connection string. Please set DATABASE_URL or DIRECT_URL in the environment or repository secrets."
    );
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const client = createPrismaClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    } else {
      return client;
    }
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
