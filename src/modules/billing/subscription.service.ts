import { db } from "@/lib/db";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import type { BillingInterval, Prisma, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import type { AdminVenueSubscriptionInput } from "@/lib/validations/billing.schema";
import { getPlatformSettings } from "./platform-settings.service";
import { toPublicPlan } from "./plan.service";
import { hasActiveAccess, resolveSubscriptionState, trialDaysLeft } from "./subscription-state";
import type { VenueSubscriptionSummary } from "./types";

export type LimitedResource = "staff" | "resources" | "venues";

const LIMIT_LABELS: Record<LimitedResource, string> = {
  staff: "collaborateurs",
  resources: "cabines et postes",
  venues: "établissements",
};

export class PlanLimitError extends Error {
  readonly status = 403;
}

export class BillingUnavailableError extends Error {
  readonly status = 503;
}

type Tx = Prisma.TransactionClient;

function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}

// -----------------------------------------------------------------------------
// ESSAI & ATTRIBUTION
// -----------------------------------------------------------------------------

/** Démarre la période d'essai d'un salon sur le forfait donné. */
export async function startTrial(
  tx: Tx,
  params: { venueId: string; plan: SubscriptionPlan; interval: BillingInterval }
) {
  const setting = await tx.platformSetting.findFirst();
  const days = params.plan.trialDays ?? setting?.defaultTrialDays ?? 14;
  const trialEndsAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return tx.venueSubscription.upsert({
    where: { venueId: params.venueId },
    create: {
      venueId: params.venueId,
      planId: params.plan.id,
      interval: params.interval,
      status: days > 0 ? "TRIALING" : "PAST_DUE",
      trialEndsAt: days > 0 ? trialEndsAt : null,
    },
    update: {},
  });
}

/** Attribution manuelle par l'équipe Belora (offert, prolongation d'essai, changement de forfait). */
export async function setVenueSubscriptionByAdmin(venueId: string, input: AdminVenueSubscriptionInput) {
  const plan = await db.subscriptionPlan.findUnique({ where: { id: input.planId } });
  if (!plan) throw new Error("Forfait introuvable.");

  const data = {
    planId: plan.id,
    status: input.status as SubscriptionStatus,
    interval: input.interval as BillingInterval,
    trialEndsAt: input.trialEndsAt ? new Date(input.trialEndsAt) : null,
    isComplimentary: input.isComplimentary,
  };

  return db.venueSubscription.upsert({
    where: { venueId },
    create: { venueId, ...data },
    update: data,
  });
}

// -----------------------------------------------------------------------------
// DROITS & LIMITES
// -----------------------------------------------------------------------------

async function countUsage(venueId: string) {
  const venue = await db.venue.findUnique({ where: { id: venueId }, select: { ownerId: true } });
  const [staff, resources, venues] = await Promise.all([
    db.staffMember.count({ where: { venueId, isActive: true } }),
    db.resource.count({ where: { venueId, isActive: true } }),
    venue ? db.venue.count({ where: { ownerId: venue.ownerId } }) : Promise.resolve(0),
  ]);
  return { staff, resources, venues };
}

export async function getVenueSubscriptionSummary(venueId: string): Promise<VenueSubscriptionSummary> {
  const [setting, sub, usage] = await Promise.all([
    getPlatformSettings(),
    db.venueSubscription.findUnique({ where: { venueId }, include: { plan: true } }),
    countUsage(venueId),
  ]);

  const state = resolveSubscriptionState(sub);
  const plan = sub?.plan ?? null;

  return {
    state,
    hasAccess: hasActiveAccess(state),
    status: sub?.status ?? null,
    interval: sub?.interval ?? null,
    trialEndsAt: sub?.trialEndsAt?.toISOString() ?? null,
    trialDaysLeft: sub?.status === "TRIALING" ? trialDaysLeft(sub.trialEndsAt) : null,
    currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    isComplimentary: sub?.isComplimentary ?? false,
    hasPaymentMethod: Boolean(sub?.stripeSubscriptionId),
    plan: plan ? toPublicPlan(plan, setting) : null,
    usage: {
      staff: { used: usage.staff, limit: plan?.maxStaff ?? null },
      resources: { used: usage.resources, limit: plan?.maxResources ?? null },
      venues: { used: usage.venues, limit: plan?.maxVenues ?? null },
    },
    billingAvailable: isStripeConfigured(),
  };
}

/**
 * Vérifie qu'un ajout reste dans les limites du forfait.
 * Un salon sans abonnement (données antérieures) n'est pas bloqué.
 */
export async function assertWithinPlanLimit(venueId: string, resource: LimitedResource, adding = 1) {
  const sub = await db.venueSubscription.findUnique({ where: { venueId }, include: { plan: true } });
  if (!sub) return;

  const state = resolveSubscriptionState(sub);
  if (!hasActiveAccess(state)) {
    throw new PlanLimitError(
      "Votre abonnement n'est plus actif. Choisissez un forfait dans Admin › Abonnement pour continuer."
    );
  }

  const limitKey = { staff: "maxStaff", resources: "maxResources", venues: "maxVenues" } as const;
  const limit = sub.plan[limitKey[resource]];
  if (limit === null) return;

  const usage = await countUsage(venueId);
  if (usage[resource] + adding > limit) {
    throw new PlanLimitError(
      `Votre forfait ${sub.plan.name} inclut jusqu'à ${limit} ${LIMIT_LABELS[resource]}. Passez à un forfait supérieur pour en ajouter.`
    );
  }
}

/** Le salon peut-il recevoir des réservations en ligne ? (sans abonnement : oui, données antérieures) */
export async function venueAcceptsOnlineBookings(venueId: string): Promise<boolean> {
  const sub = await db.venueSubscription.findUnique({ where: { venueId } });
  if (!sub) return true;
  return hasActiveAccess(resolveSubscriptionState(sub));
}

// -----------------------------------------------------------------------------
// FACTURATION STRIPE BILLING
// -----------------------------------------------------------------------------

function assertBillingAvailable() {
  if (!isStripeConfigured()) {
    throw new BillingUnavailableError(
      "Le paiement en ligne de l'abonnement n'est pas encore disponible. Contactez l'équipe Belora pour activer votre forfait."
    );
  }
}

async function ensureStripeProduct(plan: SubscriptionPlan): Promise<string> {
  if (plan.stripeProductId) return plan.stripeProductId;
  const product = await stripe.products.create({
    name: `Belora Pro - ${plan.name}`,
    metadata: { planId: plan.id },
  });
  await db.subscriptionPlan.update({ where: { id: plan.id }, data: { stripeProductId: product.id } });
  return product.id;
}

function recurringPrice(plan: SubscriptionPlan, interval: BillingInterval, productId: string) {
  return {
    currency: plan.currency.toLowerCase(),
    product: productId,
    // Le prix annuel est saisi en équivalent mensuel : il est facturé en une fois sur 12 mois.
    unit_amount: interval === "ANNUAL" ? plan.annualPriceCents * 12 : plan.monthlyPriceCents,
    recurring: { interval: interval === "ANNUAL" ? ("year" as const) : ("month" as const) },
  };
}

/**
 * Souscription ou changement de forfait.
 * - Abonnement Stripe existant : mise à jour immédiate avec prorata.
 * - Sinon : session de paiement Stripe Checkout (le reste de l'essai est conservé).
 */
export async function createSubscriptionCheckout(params: {
  venueId: string;
  planId: string;
  interval: BillingInterval;
  customerEmail: string;
}): Promise<{ url: string | null; updated: boolean }> {
  assertBillingAvailable();

  const plan = await db.subscriptionPlan.findUnique({ where: { id: params.planId } });
  if (!plan || !plan.isActive) throw new Error("Ce forfait n'est plus proposé.");
  if (plan.isContactSales) throw new Error("Ce forfait est proposé sur devis : contactez notre équipe commerciale.");

  const productId = await ensureStripeProduct(plan);
  const sub = await db.venueSubscription.findUnique({ where: { venueId: params.venueId } });

  if (sub?.stripeSubscriptionId) {
    const current = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const itemId = current.items.data[0]?.id;
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [{ id: itemId, price_data: recurringPrice(plan, params.interval, productId) }],
      proration_behavior: "create_prorations",
      cancel_at_period_end: false,
      metadata: { venueId: params.venueId, planId: plan.id, interval: params.interval },
    });
    await db.venueSubscription.update({
      where: { venueId: params.venueId },
      data: { planId: plan.id, interval: params.interval, cancelAtPeriodEnd: false },
    });
    return { url: null, updated: true };
  }

  const trialEnd =
    sub?.status === "TRIALING" && sub.trialEndsAt && sub.trialEndsAt.getTime() > Date.now() + 48 * 3600 * 1000
      ? Math.floor(sub.trialEndsAt.getTime() / 1000)
      : undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: sub?.stripeCustomerId || undefined,
    customer_email: sub?.stripeCustomerId ? undefined : params.customerEmail,
    line_items: [{ quantity: 1, price_data: recurringPrice(plan, params.interval, productId) }],
    subscription_data: {
      trial_end: trialEnd,
      metadata: { venueId: params.venueId, planId: plan.id, interval: params.interval },
    },
    metadata: { venueId: params.venueId, planId: plan.id, interval: params.interval },
    success_url: `${appUrl()}/pro/settings/subscription?checkout=success`,
    cancel_url: `${appUrl()}/pro/settings/subscription?checkout=canceled`,
  });

  return { url: session.url, updated: false };
}

export async function createBillingPortalSession(venueId: string): Promise<string> {
  assertBillingAvailable();
  const sub = await db.venueSubscription.findUnique({ where: { venueId } });
  if (!sub?.stripeCustomerId) {
    throw new Error("Aucun moyen de paiement n'est encore enregistré pour cet établissement.");
  }
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl()}/pro/settings/subscription`,
  });
  return portal.url;
}

// -----------------------------------------------------------------------------
// SYNCHRONISATION WEBHOOK
// -----------------------------------------------------------------------------

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
    case "unpaid":
    case "incomplete":
      return "PAST_DUE";
    default:
      return "CANCELED";
  }
}

function periodEnd(subscription: Stripe.Subscription): Date | null {
  // Selon la version d'API, la fin de période est portée par l'abonnement ou par ses lignes.
  const raw =
    (subscription as unknown as { current_period_end?: number }).current_period_end ??
    (subscription.items.data[0] as unknown as { current_period_end?: number } | undefined)?.current_period_end;
  return raw ? new Date(raw * 1000) : null;
}

export async function syncStripeSubscription(subscription: Stripe.Subscription) {
  const venueId = subscription.metadata?.venueId;
  const planId = subscription.metadata?.planId;
  const interval = subscription.metadata?.interval === "ANNUAL" ? "ANNUAL" : "MONTHLY";

  const existing = venueId
    ? await db.venueSubscription.findUnique({ where: { venueId } })
    : await db.venueSubscription.findUnique({ where: { stripeSubscriptionId: subscription.id } });
  const targetVenueId = venueId || existing?.venueId;
  if (!targetVenueId) return;

  const plan = planId ? await db.subscriptionPlan.findUnique({ where: { id: planId } }) : null;
  const resolvedPlanId = plan?.id ?? existing?.planId;
  if (!resolvedPlanId) return;

  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  const data = {
    planId: resolvedPlanId,
    interval: interval as BillingInterval,
    status: mapStripeStatus(subscription.status),
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
    currentPeriodEnd: periodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
  };

  await db.venueSubscription.upsert({
    where: { venueId: targetVenueId },
    create: { venueId: targetVenueId, ...data },
    update: data,
  });
}

export async function markSubscriptionPastDue(stripeSubscriptionId: string) {
  await db.venueSubscription.updateMany({
    where: { stripeSubscriptionId },
    data: { status: "PAST_DUE" },
  });
}
