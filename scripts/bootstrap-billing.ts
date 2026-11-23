/**
 * Amorçage de la facturation (forfaits de départ, forfait par défaut, abonnements des salons existants).
 * Idempotent : peut être relancé sans risque.
 *
 *   pnpm tsx scripts/bootstrap-billing.ts
 */
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { bootstrapBilling } from "../src/modules/billing/bootstrap";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

bootstrapBilling(prisma)
  .then((report) => console.log("Facturation initialisée :", report))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
