import { PrismaClient } from './generated/index.js';
import dotenv from "dotenv";
import { createPgAdapter } from "@prisma/adapter-pg";

dotenv.config();

const adapter = createPgAdapter(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Running seed...");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
