import type { DepositScope, OnlinePaymentMode } from "@prisma/client";

/**
 * Règles de réservation en ligne d'un établissement — fonctions pures, partagées par
 * le moteur de disponibilités et la création de réservation.
 */

export interface PaymentPolicy {
  mode: OnlinePaymentMode;
  scope: DepositScope;
  /** Pourcentage appliqué quand une prestation n'a pas de montant d'acompte fixe. */
  depositPercentage: number;
}

export interface PricedService {
  priceCents: number;
  depositRequired: boolean;
  depositCents: number;
}

/** Montant à régler en ligne à la réservation. */
export function computeOnlinePaymentCents(services: PricedService[], policy: PaymentPolicy): number {
  const total = services.reduce((acc, s) => acc + s.priceCents, 0);
  if (policy.mode === "NONE" || total <= 0) return 0;
  if (policy.mode === "FULL") return total;

  let deposit = 0;
  for (const s of services) {
    const concerned = policy.scope === "ALL_SERVICES" || s.depositRequired || s.depositCents > 0;
    if (!concerned) continue;
    deposit += s.depositCents > 0 ? s.depositCents : Math.round((s.priceCents * policy.depositPercentage) / 100);
  }
  return Math.min(deposit, total);
}

export interface BookingWindow {
  minNoticeMinutes: number;
  maxAdvanceDays: number;
}

/** Message d'erreur si le créneau est hors de la fenêtre de réservation en ligne, sinon null. */
export function bookingWindowError(start: Date, window: BookingWindow, now: Date = new Date()): string | null {
  const earliest = now.getTime() + window.minNoticeMinutes * 60_000;
  if (start.getTime() < earliest) {
    return window.minNoticeMinutes >= 60
      ? `Ce salon accepte les réservations en ligne au moins ${formatDuration(window.minNoticeMinutes)} à l'avance.`
      : "Ce créneau est trop proche pour être réservé en ligne.";
  }
  const latest = now.getTime() + window.maxAdvanceDays * 24 * 3_600_000;
  if (start.getTime() > latest) {
    return `Ce salon ouvre ses réservations en ligne ${window.maxAdvanceDays} jours à l'avance.`;
  }
  return null;
}

export interface ClosurePeriod {
  startDate: Date;
  endDate: Date;
  label?: string | null;
}

/** La date locale "YYYY-MM-DD" tombe-t-elle dans une fermeture exceptionnelle (bornes incluses) ? */
export function findClosure(date: string, closures: ClosurePeriod[]): ClosurePeriod | null {
  for (const c of closures) {
    const start = c.startDate.toISOString().slice(0, 10);
    const end = c.endDate.toISOString().slice(0, 10);
    if (date >= start && date <= end) return c;
  }
  return null;
}

export function formatDuration(minutes: number): string {
  if (minutes % 1440 === 0) {
    const d = minutes / 1440;
    return `${d} jour${d > 1 ? "s" : ""}`;
  }
  if (minutes % 60 === 0) {
    const h = minutes / 60;
    return `${h} heure${h > 1 ? "s" : ""}`;
  }
  return `${minutes} minutes`;
}
