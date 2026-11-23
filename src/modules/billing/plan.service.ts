import { db } from "@/lib/db";
import type { PlatformSetting, SubscriptionPlan } from "@prisma/client";
import type { PlanInput } from "@/lib/validations/billing.schema";
import { getPlatformSettings, toPublicCommissionSummary } from "./platform-settings.service";
import type { AdminPlan, PublicPlan, PublicPricing } from "./types";

export function toPublicPlan(plan: SubscriptionPlan, setting: PlatformSetting): PublicPlan {
  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    monthlyPriceCents: plan.monthlyPriceCents,
    annualPriceCents: plan.annualPriceCents,
    currency: plan.currency,
    trialDays: plan.trialDays ?? setting.defaultTrialDays,
    maxStaff: plan.maxStaff,
    maxResources: plan.maxResources,
    maxVenues: plan.maxVenues,
    commissionRate: plan.commissionRate ?? setting.defaultCommissionRate,
    includesSmsReminders: plan.includesSmsReminders,
    includesAnalytics: plan.includesAnalytics,
    includesPriorityListing: plan.includesPriorityListing,
    features: plan.features,
    isHighlighted: plan.isHighlighted,
    highlightLabel: plan.highlightLabel,
    isContactSales: plan.isContactSales,
  };
}

/** Forfaits affichés sur la page tarifs + règles de commission publiques. */
export async function getPublicPricing(): Promise<PublicPricing> {
  const [setting, plans] = await Promise.all([
    getPlatformSettings(),
    db.subscriptionPlan.findMany({
      where: { isPublic: true, isActive: true },
      orderBy: [{ order: "asc" }, { monthlyPriceCents: "asc" }],
    }),
  ]);
  return {
    plans: plans.map((p) => toPublicPlan(p, setting)),
    commission: toPublicCommissionSummary(setting),
  };
}

export async function getAdminPlans(): Promise<AdminPlan[]> {
  const plans = await db.subscriptionPlan.findMany({
    orderBy: [{ order: "asc" }, { monthlyPriceCents: "asc" }],
    include: { _count: { select: { subscriptions: true } } },
  });
  return plans.map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    monthlyPriceCents: plan.monthlyPriceCents,
    annualPriceCents: plan.annualPriceCents,
    currency: plan.currency,
    trialDays: plan.trialDays,
    maxStaff: plan.maxStaff,
    maxResources: plan.maxResources,
    maxVenues: plan.maxVenues,
    commissionRate: plan.commissionRate,
    includesSmsReminders: plan.includesSmsReminders,
    includesAnalytics: plan.includesAnalytics,
    includesPriorityListing: plan.includesPriorityListing,
    features: plan.features,
    isHighlighted: plan.isHighlighted,
    highlightLabel: plan.highlightLabel,
    isContactSales: plan.isContactSales,
    isPublic: plan.isPublic,
    isActive: plan.isActive,
    order: plan.order,
    subscriberCount: plan._count.subscriptions,
  }));
}

/** Forfait souscriptible à l'inscription : celui demandé, sinon le forfait par défaut, sinon le premier public. */
export async function resolveSignupPlan(planSlug?: string | null): Promise<SubscriptionPlan | null> {
  if (planSlug) {
    const requested = await db.subscriptionPlan.findFirst({
      where: { slug: planSlug, isActive: true, isContactSales: false },
    });
    if (requested) return requested;
  }
  const setting = await getPlatformSettings();
  if (setting.defaultPlanId) {
    const fallback = await db.subscriptionPlan.findFirst({
      where: { id: setting.defaultPlanId, isActive: true },
    });
    if (fallback) return fallback;
  }
  return db.subscriptionPlan.findFirst({
    where: { isActive: true, isPublic: true, isContactSales: false },
    orderBy: [{ order: "asc" }, { monthlyPriceCents: "asc" }],
  });
}

function normalizePlanInput(input: PlanInput) {
  return {
    ...input,
    description: input.description?.trim() || null,
    highlightLabel: input.isHighlighted ? input.highlightLabel?.trim() || null : null,
    features: input.features.map((f) => f.trim()).filter(Boolean),
  };
}

export async function createPlan(input: PlanInput): Promise<SubscriptionPlan> {
  const existing = await db.subscriptionPlan.findUnique({ where: { slug: input.slug } });
  if (existing) throw new Error("Un forfait utilise déjà cet identifiant.");
  return db.subscriptionPlan.create({ data: normalizePlanInput(input) });
}

export async function updatePlan(id: string, input: PlanInput): Promise<SubscriptionPlan> {
  const clash = await db.subscriptionPlan.findFirst({ where: { slug: input.slug, NOT: { id } } });
  if (clash) throw new Error("Un forfait utilise déjà cet identifiant.");
  const data = normalizePlanInput(input);
  const plan = await db.subscriptionPlan.update({ where: { id }, data });

  // Un forfait par défaut ne peut pas devenir « sur devis » ni être désactivé
  const setting = await getPlatformSettings();
  if (setting.defaultPlanId === id && (!plan.isActive || plan.isContactSales)) {
    await db.platformSetting.update({ where: { id: setting.id }, data: { defaultPlanId: null } });
  }
  return plan;
}

export async function deletePlan(id: string): Promise<void> {
  const count = await db.venueSubscription.count({ where: { planId: id } });
  if (count > 0) {
    throw new Error(
      "Ce forfait a des abonnés : désactivez-le plutôt que de le supprimer, ou déplacez d'abord ses abonnés."
    );
  }
  const setting = await getPlatformSettings();
  if (setting.defaultPlanId === id) {
    await db.platformSetting.update({ where: { id: setting.id }, data: { defaultPlanId: null } });
  }
  await db.subscriptionPlan.delete({ where: { id } });
}
