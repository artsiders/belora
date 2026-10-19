import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const INITIAL_CATEGORIES = [
  {
    name: "Coiffure",
    slug: "coiffure",
    description: "Coupe, brushing, coloration, balayage, soins capillaires et coiffure événementielle.",
    icon: "Scissors",
    order: 1,
  },
  {
    name: "Barbier",
    slug: "barbier",
    description: "Taille de barbe, rasage traditionnel au coupe-choux, coupe homme et soins visage.",
    icon: "Sparkles", // Lucide icon
    order: 2,
  },
  {
    name: "Onglerie",
    slug: "onglerie",
    description: "Manucure, pose de faux ongles, vernis semi-permanent, nail art et beauté des pieds.",
    icon: "Hand",
    order: 3,
  },
  {
    name: "Institut de beauté",
    slug: "institut-de-beaute",
    description: "Soins du visage, épilation, beauté du regard, rehaussement et extensions de cils.",
    icon: "Smile",
    order: 4,
  },
  {
    name: "Massage & Bien-être",
    slug: "massage-bien-etre",
    description: "Massages relaxants, suédois, californiens, drainages lymphatiques et rituels corps.",
    icon: "Heart",
    order: 5,
  },
  {
    name: "Spa",
    slug: "spa",
    description: "Accès hammam, sauna, bains à remous et soins balnéo pour une détente totale.",
    icon: "Waves",
    order: 6,
  },
];

const INITIAL_SUBSCRIPTION_PLANS = [
  {
    name: "Starter Pro",
    slug: "starter-pro",
    description: "L'essentiel pour lancer son activité : agenda en ligne, 1 calendrier membre et réservation sans commission sur vos clients existants.",
    priceMinorUnits: 2900, // 29.00 EUR
    currency: "EUR",
    interval: "MONTHLY" as const,
    features: {
      staffMembersLimit: 1,
      onlineBooking: true,
      remindersEmail: true,
      remindersSms: false,
      reporting: "BASIC",
    },
  },
  {
    name: "Pro Business",
    slug: "pro-business",
    description: "Pour les salons et équipes : calendriers illimités, rappels SMS, gestion avancée de planning et statistiques de performance.",
    priceMinorUnits: 5900, // 59.00 EUR
    currency: "EUR",
    interval: "MONTHLY" as const,
    features: {
      staffMembersLimit: 10,
      onlineBooking: true,
      remindersEmail: true,
      remindersSms: true,
      reporting: "ADVANCED",
    },
  },
];

async function main() {
  console.log("Seeding Belora database...");

  // 1. Initialisation des catégories marketplace
  console.log("Seeding categories...");
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
      },
    });
  }

  // 2. Initialisation des plans d'abonnement pro
  console.log("Seeding subscription plans...");
  for (const plan of INITIAL_SUBSCRIPTION_PLANS) {
    await prisma.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: {
        name: plan.name,
        description: plan.description,
        priceMinorUnits: plan.priceMinorUnits,
        currency: plan.currency,
        interval: plan.interval,
        features: plan.features,
      },
      create: {
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        priceMinorUnits: plan.priceMinorUnits,
        currency: plan.currency,
        interval: plan.interval,
        features: plan.features,
      },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
