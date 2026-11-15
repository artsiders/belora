import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
  });

pool.on("error", (err) => {
  console.warn("[PG Pool] Idle client connection reset:", err.message);
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool;
}

export default db;
