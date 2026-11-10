/**
 * Utilitaires financiers pour la manipulation monétaire stricte en centimes (minor units).
 * Règle d'or Belora : aucun flottant n'est persisté ou manipulé dans les calculs monétaires.
 */

/**
 * Convertit un montant en centimes en une chaîne formatée en euros (ex: 5000 -> "50,00 €" ou "50 €")
 */
export function formatCentsToEuros(cents: number, showDecimals: boolean = true): string {
  const euros = cents / 100;
  if (!showDecimals && cents % 100 === 0) {
    return `${euros.toLocaleString("fr-FR")} €`;
  }
  return `${euros.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

/**
 * Convertit un montant en euros vers des centimes d'euro (arrondi à l'entier le plus proche)
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Décompose un montant TTC en Sous-total HT et Montant TVA (taux par défaut 20% pour la France)
 * totalTtcCents = subtotalHtCents + vatAmountCents
 */
export function calculateVat(
  totalTtcCents: number,
  vatRate: number = 0.2
): { subtotalHtCents: number; vatAmountCents: number } {
  if (totalTtcCents <= 0) {
    return { subtotalHtCents: 0, vatAmountCents: 0 };
  }
  const subtotalHtCents = Math.round(totalTtcCents / (1 + vatRate));
  const vatAmountCents = totalTtcCents - subtotalHtCents;
  return { subtotalHtCents, vatAmountCents };
}

/**
 * Calcule le montant de l'acompte à exiger selon le pourcentage configuré (ex: 30%)
 */
export function calculateDeposit(totalTtcCents: number, percentage: number = 30): number {
  if (totalTtcCents <= 0 || percentage <= 0) return 0;
  return Math.round((totalTtcCents * percentage) / 100);
}

/**
 * Calcule la commission prélevée par la plateforme Belora (ex: 1.8%)
 */
export function calculatePlatformCommission(
  totalTtcCents: number,
  commissionRate: number = 0.018
): number {
  if (totalTtcCents <= 0 || commissionRate <= 0) return 0;
  return Math.round(totalTtcCents * commissionRate);
}
