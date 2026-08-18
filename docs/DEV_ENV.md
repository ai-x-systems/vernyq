# Development Environment (DEV_ENV)

This file documents the environment variables and runtime expectations for local development and CI for the Vernyq repository. Follow these rules exactly — do not commit any .env files or credentials.

## Environment variables (what they mean)

- DIRECT_URL
  - Usage: Prisma CLI / migrations / seed / test utilities (prisma.config.ts, prisma/seed.ts, test-db.ts).
  - Context: server-only, CLI/direct DB connection.
  - Classification: server-only secret / build-time when running Prisma CLI tasks.
  - Notes: Keep DIRECT_URL in server-only environments (CI, Vercel server env). Do NOT expose via NEXT_PUBLIC_*.

- DATABASE_URL
  - Usage: application runtime (src/lib/prisma.ts uses DATABASE_URL to create the runtime Prisma adapter).
  - Context: server runtime.
  - Classification: server-only secret.
  - Notes: Set DATABASE_URL in hosting environment for app runtime (Vercel Production/Preview/SERVER env). Do NOT expose via NEXT_PUBLIC_*.

- NEXT_PUBLIC_SITE_URL
  - Usage: public site URL surfaced to the browser (src/config/brand.config.ts uses NEXT_PUBLIC_SITE_URL if set).
  - Context: browser/public.
  - Classification: public/browser-safe.
  - Notes: Safe to expose; used for canonical URLs and site links.

- SUPABASE_*, PAYMENT_*, WEBHOOK_* (if present)
  - Usage: not found in code inspected in this audit; if/when added, treat as server-only secrets unless explicitly intended for public exposure.
  - Classification: server-only secret (by default).

## Rules

- NEVER commit .env files, secrets, or credential material to source control.
- NEVER expose DATABASE_URL or DIRECT_URL through any NEXT_PUBLIC_* variable.
- Ensure that only safe, non-secret values are placed in NEXT_PUBLIC_* variables.
- Prisma 7 configuration:
  - prisma.config.ts is the canonical CLI datasource configuration and should reference DIRECT_URL for CLI/seed operations.
  - Do NOT add DATABASE_URL or DIRECT_URL to prisma/schema.prisma.
  - The runtime Prisma adapter should use DATABASE_URL for application runtime.
- CI/hosting (Vercel): ensure both DIRECT_URL (for CLI/seed/migrations) and DATABASE_URL (for runtime) are configured in the project settings if you run both CLI and runtime tasks.

## How to generate the Prisma client locally

1. Ensure DIRECT_URL (for CLI) or DATABASE_URL (for runtime) is set in your shell environment when needed.
2. Run:

   npm run prisma:generate

This will create the generated Prisma client at `src/generated/prisma` as configured by prisma/schema.prisma.

## Local seed (development)

To seed a local development database (only run against a development DB):

1. Set DIRECT_URL to point at a development-only Postgres instance.
2. Run:

   npm run seed

Do NOT run the seed against production databases.

## Migration policy (summary)

- The repository currently has an empty prisma/migrations directory. Do NOT run `prisma migrate dev` against production.
- If you will create a baseline migration, create it locally against a development-only DB and DO NOT apply it to production without explicit approval.

## Contact

For repository infra questions contact: vernyq.support@gmail.com
