import type { PrismaClient } from "@prisma/client";

/**
 * Amorçage idempotent de la facturation :
 * - crée les forfaits de départ s'ils n'existent pas (les modifications de l'admin ne sont jamais écrasées) ;
 * - définit le forfait par défaut s'il n'y en a pas ;
 * - attribue un forfait offert aux établissements existants sans abonnement ;
 * - remet au taux standard les salons qui portaient l'ancien taux codé en dur (1,8 %).
 *
 * Les contenus ne décrivent que des fonctionnalités réellement disponibles.
 */
const STARTER_PLANS = [
  {
    slug: "atelier-solo",
    name: "Atelier Solo",
    description: "Pour les artisans indépendants, barbiers et praticiens en studio.",
    monthlyPriceCents: 3900,
    annualPriceCents: 3100,
    maxStaff: 1,
    maxResources: 2,
    maxVenues: 1,
    features: ["Agenda, caisse et fichier clients", "Réservation en ligne 24h/24", "Acompte en ligne par prestation"],
    isHighlighted: false,
    highlightLabel: null,
    isContactSales: false,
    order: 0,
  },
  {
    slug: "maison-equipe",
    name: "Maison & Équipe",
    description: "Pour les salons, instituts et spas avec plusieurs collaborateurs.",
    monthlyPriceCents: 6900,
    annualPriceCents: 5500,
    maxStaff: 6,
    maxResources: 10,
    maxVenues: 1,
    features: ["Agenda par collaborateur et par cabine", "Pointage et horaires de présence", "Fiches techniques clients"],
    isHighlighted: true,
    highlightLabel: "Le plus choisi",
    isContactSales: false,
    order: 1,
  },
  {
    slug: "grand-sanctuaire",
    name: "Grand Sanctuaire",
    description: "Pour les établissements multi-espaces et les groupes de salons.",
    monthlyPriceCents: 11900,
    annualPriceCents: 9500,
    maxStaff: null,
    maxResources: null,
    maxVenues: null,
    features: ["Plusieurs établissements sur un même compte", "Accompagnement à la prise en main"],
    isHighlighted: false,
    highlightLabel: null,
    isContactSales: true,
    order: 2,
  },
];

const LEGACY_HARDCODED_RATE = 0.018;

export async function bootstrapBilling(db: PrismaClient) {
  const report = { plansCreated: 0, venuesSubscribed: 0, venuesRateReset: 0, defaultPlanSet: false };

  for (const plan of STARTER_PLANS) {
    const existing = await db.subscriptionPlan.findUnique({ where: { slug: plan.slug } });
    if (!existing) {
      await db.subscriptionPlan.create({ data: plan });
      report.plansCreated++;
    }
  }

  let setting = await db.platformSetting.findFirst();
  if (!setting) setting = await db.platformSetting.create({ data: {} });

  if (!setting.defaultPlanId) {
    const fallback = await db.subscriptionPlan.findFirst({
      where: { isActive: true, isContactSales: false },
      orderBy: { order: "asc" },
    });
    if (fallback) {
      await db.platformSetting.update({ where: { id: setting.id }, data: { defaultPlanId: fallback.id } });
      report.defaultPlanSet = true;
    }
  }

  const grantPlan = await db.subscriptionPlan.findUnique({ where: { slug: "maison-equipe" } });
  if (grantPlan) {
    const venues = await db.venue.findMany({ where: { subscription: { is: null } }, select: { id: true } });
    for (const venue of venues) {
      await db.venueSubscription.create({
        data: { venueId: venue.id, planId: grantPlan.id, status: "ACTIVE", isComplimentary: true },
      });
      report.venuesSubscribed++;
    }
  }

  const reset = await db.venue.updateMany({
    // Comparaison tolérante : les flottants stockés ne sont pas toujours strictement égaux
    where: {
      commissionRate: { gte: LEGACY_HARDCODED_RATE - 1e-6, lte: LEGACY_HARDCODED_RATE + 1e-6 },
      commissionRateUntil: null,
    },
    data: { commissionRate: null },
  });
  report.venuesRateReset = reset.count;

  return report;
}
