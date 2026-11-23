/**
 * Formatage des montants et des règles commerciales pour l'affichage.
 * Fichier sans dépendance serveur : utilisable côté client.
 */
import type {
  BillingIntervalValue,
  EffectiveSubscriptionStateValue,
  PublicPlan,
  PublicPricing,
} from "./types";

export const SUBSCRIPTION_STATE_LABELS: Record<EffectiveSubscriptionStateValue, string> = {
  trialing: "Essai en cours",
  active: "Actif",
  past_due: "Paiement en retard",
  trial_expired: "Essai terminé",
  canceled: "Résilié",
  none: "Sans abonnement",
};

export function formatPrice(cents: number, currency = "EUR"): string {
  const hasDecimals = cents % 100 !== 0;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatRate(rate: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(rate * 100)} %`;
}

export function planMonthlyPrice(plan: Pick<PublicPlan, "monthlyPriceCents" | "annualPriceCents">, interval: BillingIntervalValue) {
  return interval === "ANNUAL" ? plan.annualPriceCents : plan.monthlyPriceCents;
}

/** Remise annuelle maximale parmi les forfaits, arrondie au pourcent (0 si aucune). */
export function maxAnnualDiscountPercent(plans: Pick<PublicPlan, "monthlyPriceCents" | "annualPriceCents">[]): number {
  let max = 0;
  for (const p of plans) {
    if (p.monthlyPriceCents > 0 && p.annualPriceCents < p.monthlyPriceCents) {
      max = Math.max(max, Math.round((1 - p.annualPriceCents / p.monthlyPriceCents) * 100));
    }
  }
  return max;
}

export function limitLabel(limit: number | null, singular: string, plural: string): string {
  if (limit === null) return `${plural.charAt(0).toUpperCase()}${plural.slice(1)} illimités`;
  return `Jusqu'à ${limit} ${limit > 1 ? plural : singular}`;
}

/** Lignes « incluses » générées à partir des réglages techniques du forfait. */
export function planCapabilityLines(plan: PublicPlan): string[] {
  const lines = [
    limitLabel(plan.maxStaff, "collaborateur", "collaborateurs"),
    limitLabel(plan.maxResources, "cabine ou poste", "cabines et postes"),
  ];
  if (plan.maxVenues !== 1) lines.push(limitLabel(plan.maxVenues, "établissement", "établissements"));
  if (plan.includesSmsReminders) lines.push("Rappels SMS et e-mail automatiques");
  if (plan.includesAnalytics) lines.push("Statistiques de chiffre d'affaires");
  if (plan.includesPriorityListing) lines.push("Mise en avant sur la marketplace");
  return lines;
}

/** Phrase courte décrivant la commission, telle qu'affichée aux professionnels. */
export function commissionHeadline(commission: PublicPricing["commission"], rate = commission.defaultRate): string {
  switch (commission.mode) {
    case "DISABLED":
      return "Aucune commission sur vos réservations";
    case "NEW_CLIENTS_ONLY":
      return `0 % sur vos habitués, ${formatRate(rate)} uniquement sur les nouveaux clients apportés par Belora`;
    case "ALL_MARKETPLACE":
      return `${formatRate(rate)} sur les réservations issues de la marketplace, 0 % via votre lien de réservation`;
  }
}

/** Explication détaillée des règles (page tarifs, FAQ, espace pro). */
export function commissionDetails(commission: PublicPricing["commission"]): string[] {
  if (commission.mode === "DISABLED") {
    return ["Belora ne prélève aucune commission sur les rendez-vous : seul l'abonnement est facturé."];
  }
  const lines: string[] = [];
  lines.push(
    commission.mode === "NEW_CLIENTS_ONLY"
      ? "La commission ne s'applique qu'à la première réservation d'un client qui n'est pas encore dans votre fichier et qui vous a trouvé sur Belora."
      : "La commission s'applique aux réservations faites depuis la recherche et les pages Belora."
  );
  lines.push(
    "Les rendez-vous pris via votre propre lien de réservation (site, réseaux sociaux) ou saisis dans votre agenda ne sont jamais commissionnés."
  );
  lines.push(
    commission.base === "BOOKING_TOTAL"
      ? "Elle est calculée sur le prix total de la prestation."
      : "Elle est calculée sur le montant réglé en ligne par le client."
  );
  if (commission.minCents > 0 || commission.maxCents !== null) {
    const parts = [];
    if (commission.minCents > 0) parts.push(`minimum ${formatPrice(commission.minCents)}`);
    if (commission.maxCents !== null) parts.push(`plafonnée à ${formatPrice(commission.maxCents)}`);
    lines.push(`Par réservation : ${parts.join(", ")}.`);
  }
  if (commission.paymentFeePercent > 0 || commission.paymentFeeFixedCents > 0) {
    const fee = [
      commission.paymentFeePercent > 0 ? formatRate(commission.paymentFeePercent) : null,
      commission.paymentFeeFixedCents > 0 ? formatPrice(commission.paymentFeeFixedCents) : null,
    ]
      .filter(Boolean)
      .join(" + ");
    lines.push(`Frais de paiement en ligne : ${fee} par transaction.`);
  }
  return lines;
}

/** Ligne de commission propre à un forfait (null si aucune commission). */
export function planCommissionLine(plan: PublicPlan, mode: PublicPricing["commission"]["mode"]): string | null {
  if (mode === "DISABLED" || plan.commissionRate <= 0) return "Aucune commission sur vos réservations";
  return mode === "NEW_CLIENTS_ONLY"
    ? `Commission de ${formatRate(plan.commissionRate)} sur les nouveaux clients Belora uniquement`
    : `Commission de ${formatRate(plan.commissionRate)} sur les réservations de la marketplace`;
}
