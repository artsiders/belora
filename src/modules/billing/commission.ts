import type { BookingChannel, CommissionBase, CommissionMode } from "@prisma/client";

/**
 * Règles de commission Belora — fonctions pures, sans accès base, testables unitairement.
 *
 * Principe : l'abonnement rémunère le logiciel, la commission rémunère l'acquisition.
 * Une réservation n'est commissionnée que si elle vient de la marketplace et, selon le mode,
 * si le client est nouveau pour le salon.
 */

export interface CommissionPolicy {
  mode: CommissionMode;
  base: CommissionBase;
  minCents: number;
  maxCents: number | null;
  paymentFeePercent: number;
  paymentFeeFixedCents: number;
}

export interface RateSources {
  /** Taux négocié pour le salon (prioritaire tant qu'il est valide). */
  venueRate: number | null;
  venueRateUntil: Date | null;
  /** Taux du forfait souscrit. */
  planRate: number | null;
  /** Taux plateforme par défaut. */
  platformRate: number;
}

export interface CommissionInput {
  channel: BookingChannel;
  isNewClient: boolean;
  totalCents: number;
  onlineCents: number;
  rate: number;
}

export interface CommissionResult {
  isCommissionable: boolean;
  rate: number;
  commissionCents: number;
  /** Part de la commission prélevable automatiquement sur le paiement en ligne. */
  collectedCents: number;
  paymentFeeCents: number;
}

export function resolveCommissionRate(sources: RateSources, now: Date = new Date()): number {
  const venueRateValid =
    sources.venueRate !== null &&
    (sources.venueRateUntil === null || sources.venueRateUntil.getTime() > now.getTime());
  if (venueRateValid) return sources.venueRate as number;
  if (sources.planRate !== null) return sources.planRate;
  return sources.platformRate;
}

export function isBookingCommissionable(
  mode: CommissionMode,
  channel: BookingChannel,
  isNewClient: boolean
): boolean {
  if (mode === "DISABLED") return false;
  if (channel !== "MARKETPLACE") return false;
  if (mode === "NEW_CLIENTS_ONLY") return isNewClient;
  return true;
}

export function computePaymentFee(policy: CommissionPolicy, onlineCents: number): number {
  if (onlineCents <= 0) return 0;
  return Math.round(onlineCents * policy.paymentFeePercent) + policy.paymentFeeFixedCents;
}

export function computeCommission(policy: CommissionPolicy, input: CommissionInput): CommissionResult {
  const paymentFeeCents = computePaymentFee(policy, input.onlineCents);
  const isCommissionable = isBookingCommissionable(policy.mode, input.channel, input.isNewClient);

  let commissionCents = 0;
  if (isCommissionable && input.rate > 0) {
    const baseCents = policy.base === "ONLINE_PAYMENT" ? input.onlineCents : input.totalCents;
    commissionCents = Math.round(baseCents * input.rate);
    if (baseCents > 0) commissionCents = Math.max(commissionCents, policy.minCents);
    if (policy.maxCents !== null) commissionCents = Math.min(commissionCents, policy.maxCents);
  }

  // On ne peut jamais prélever plus que ce qui est payé en ligne (frais de paiement compris).
  const collectableCents = Math.max(0, input.onlineCents - paymentFeeCents);
  const collectedCents = Math.min(commissionCents, collectableCents);

  return {
    isCommissionable,
    rate: isCommissionable ? input.rate : 0,
    commissionCents,
    collectedCents,
    paymentFeeCents,
  };
}
