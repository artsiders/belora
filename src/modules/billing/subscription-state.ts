import type { SubscriptionStatus } from "@prisma/client";

/**
 * État effectif d'un abonnement, calculé à partir du statut stocké et des dates.
 * Un essai dont la date de fin est passée est considéré expiré même si Stripe n'a encore rien notifié.
 */
export type EffectiveSubscriptionState =
  | "trialing"
  | "active"
  | "past_due"
  | "trial_expired"
  | "canceled"
  | "none";

export interface SubscriptionSnapshot {
  status: SubscriptionStatus;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  isComplimentary: boolean;
}

export function resolveSubscriptionState(
  sub: SubscriptionSnapshot | null,
  now: Date = new Date()
): EffectiveSubscriptionState {
  if (!sub) return "none";
  if (sub.isComplimentary) return "active";

  switch (sub.status) {
    case "TRIALING":
      return sub.trialEndsAt && sub.trialEndsAt.getTime() <= now.getTime() ? "trial_expired" : "trialing";
    case "ACTIVE":
      return "active";
    case "PAST_DUE":
      return "past_due";
    case "CANCELED":
      // Accès conservé jusqu'à la fin de la période déjà payée
      return sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() > now.getTime() ? "active" : "canceled";
    default:
      return "none";
  }
}

/** Le salon peut-il utiliser le logiciel et recevoir des réservations en ligne ? */
export function hasActiveAccess(state: EffectiveSubscriptionState): boolean {
  // PAST_DUE : délai de grâce pendant que Stripe relance le paiement
  return state === "trialing" || state === "active" || state === "past_due";
}

export function trialDaysLeft(trialEndsAt: Date | null, now: Date = new Date()): number | null {
  if (!trialEndsAt) return null;
  const ms = trialEndsAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

/**
 * Filtre Prisma : salons dont l'abonnement donne accès à la marketplace.
 * À combiner avec les autres critères de recherche.
 */
export function activeSubscriptionWhere(now: Date = new Date()) {
  return {
    subscription: {
      is: {
        OR: [
          { isComplimentary: true },
          { status: { in: ["ACTIVE", "PAST_DUE"] as SubscriptionStatus[] } },
          { status: "TRIALING" as SubscriptionStatus, trialEndsAt: { gt: now } },
          { status: "TRIALING" as SubscriptionStatus, trialEndsAt: null },
          { status: "CANCELED" as SubscriptionStatus, currentPeriodEnd: { gt: now } },
        ],
      },
    },
  };
}
