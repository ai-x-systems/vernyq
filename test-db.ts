import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./src/generated/prisma/client";

async function main() {
  console.log("Testing Supabase connection...");

  const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_URL!,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    const result = await prisma.$queryRaw<
      Array<{ current_database: string; current_user: string }>
    >`SELECT current_database(), current_user`;

    console.log("DATABASE CONNECTION SUCCESS:");
    console.log(result);
  } catch (error) {
    console.error("DATABASE CONNECTION FAILED:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();