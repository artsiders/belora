import { describe, it, expect } from "vitest";
import {
  computeCommission,
  isBookingCommissionable,
  resolveCommissionRate,
  type CommissionPolicy,
} from "@/modules/billing/commission";
import { activeSubscriptionWhere, hasActiveAccess, resolveSubscriptionState, trialDaysLeft } from "@/modules/billing/subscription-state";
import { commissionHeadline, maxAnnualDiscountPercent } from "@/modules/billing/format";

const policy: CommissionPolicy = {
  mode: "NEW_CLIENTS_ONLY",
  base: "BOOKING_TOTAL",
  minCents: 0,
  maxCents: null,
  paymentFeePercent: 0,
  paymentFeeFixedCents: 0,
};

describe("Commission d'acquisition", () => {
  it("ne commissionne qu'un nouveau client venu de la marketplace en mode NEW_CLIENTS_ONLY", () => {
    expect(isBookingCommissionable("NEW_CLIENTS_ONLY", "MARKETPLACE", true)).toBe(true);
    expect(isBookingCommissionable("NEW_CLIENTS_ONLY", "MARKETPLACE", false)).toBe(false);
    expect(isBookingCommissionable("NEW_CLIENTS_ONLY", "DIRECT_LINK", true)).toBe(false);
    expect(isBookingCommissionable("NEW_CLIENTS_ONLY", "IN_SALON", true)).toBe(false);
  });

  it("commissionne les habitués de la marketplace en mode ALL_MARKETPLACE, jamais le lien direct", () => {
    expect(isBookingCommissionable("ALL_MARKETPLACE", "MARKETPLACE", false)).toBe(true);
    expect(isBookingCommissionable("ALL_MARKETPLACE", "DIRECT_LINK", true)).toBe(false);
    expect(isBookingCommissionable("DISABLED", "MARKETPLACE", true)).toBe(false);
  });

  it("calcule sur le prix total et ne prélève en ligne que ce que couvre l'acompte", () => {
    const r = computeCommission(policy, {
      channel: "MARKETPLACE",
      isNewClient: true,
      totalCents: 10000,
      onlineCents: 1000,
      rate: 0.2,
    });
    expect(r.commissionCents).toBe(2000);
    expect(r.collectedCents).toBe(1000);
  });

  it("calcule sur le paiement en ligne si la base est ONLINE_PAYMENT", () => {
    const r = computeCommission({ ...policy, base: "ONLINE_PAYMENT" }, {
      channel: "MARKETPLACE",
      isNewClient: true,
      totalCents: 10000,
      onlineCents: 3000,
      rate: 0.1,
    });
    expect(r.commissionCents).toBe(300);
    expect(r.collectedCents).toBe(300);
  });

  it("applique minimum, plafond et frais de paiement", () => {
    const withMin = computeCommission({ ...policy, minCents: 500 }, {
      channel: "MARKETPLACE", isNewClient: true, totalCents: 1000, onlineCents: 0, rate: 0.1,
    });
    expect(withMin.commissionCents).toBe(500);
    expect(withMin.collectedCents).toBe(0);

    const capped = computeCommission({ ...policy, maxCents: 1500, paymentFeePercent: 0.015, paymentFeeFixedCents: 25 }, {
      channel: "MARKETPLACE", isNewClient: true, totalCents: 20000, onlineCents: 6000, rate: 0.2,
    });
    expect(capped.commissionCents).toBe(1500);
    expect(capped.paymentFeeCents).toBe(115);
    expect(capped.collectedCents).toBe(1500);
  });

  it("ne commissionne rien pour un habitué", () => {
    const r = computeCommission(policy, { channel: "MARKETPLACE", isNewClient: false, totalCents: 10000, onlineCents: 3000, rate: 0.2 });
    expect(r.commissionCents).toBe(0);
    expect(r.rate).toBe(0);
  });

  it("résout le taux : négocié valide > forfait > plateforme", () => {
    const now = new Date("2026-11-23T10:00:00Z");
    const base = { venueRate: null, venueRateUntil: null, planRate: null, platformRate: 0.018 };
    expect(resolveCommissionRate(base, now)).toBe(0.018);
    expect(resolveCommissionRate({ ...base, planRate: 0.15 }, now)).toBe(0.15);
    expect(resolveCommissionRate({ ...base, planRate: 0.15, venueRate: 0 }, now)).toBe(0);
    expect(
      resolveCommissionRate({ ...base, planRate: 0.15, venueRate: 0, venueRateUntil: new Date("2026-11-01") }, now)
    ).toBe(0.15);
  });
});

describe("État d'abonnement", () => {
  const now = new Date("2026-11-23T10:00:00Z");
  const sub = { status: "TRIALING" as const, trialEndsAt: new Date("2026-11-30"), currentPeriodEnd: null, isComplimentary: false };

  it("distingue essai en cours et essai expiré", () => {
    expect(resolveSubscriptionState(sub, now)).toBe("trialing");
    expect(resolveSubscriptionState({ ...sub, trialEndsAt: new Date("2026-11-20") }, now)).toBe("trial_expired");
    expect(hasActiveAccess("trial_expired")).toBe(false);
  });

  it("garde l'accès jusqu'à la fin de la période payée après résiliation", () => {
    expect(resolveSubscriptionState({ ...sub, status: "CANCELED", currentPeriodEnd: new Date("2026-12-01") }, now)).toBe("active");
    expect(resolveSubscriptionState({ ...sub, status: "CANCELED", currentPeriodEnd: new Date("2026-11-01") }, now)).toBe("canceled");
  });

  it("un forfait offert est toujours actif", () => {
    expect(resolveSubscriptionState({ ...sub, status: "CANCELED", isComplimentary: true }, now)).toBe("active");
  });

  it("compte les jours d'essai restants", () => {
    expect(trialDaysLeft(new Date("2026-11-30T10:00:00Z"), now)).toBe(7);
    expect(trialDaysLeft(new Date("2026-11-01"), now)).toBe(0);
  });

  it("produit un filtre de recherche sur l'abonnement", () => {
    expect(activeSubscriptionWhere(now).subscription.is.OR.length).toBeGreaterThan(0);
  });
});

describe("Textes de tarification", () => {
  it("calcule la remise annuelle maximale", () => {
    expect(maxAnnualDiscountPercent([{ monthlyPriceCents: 3900, annualPriceCents: 3100 }, { monthlyPriceCents: 6900, annualPriceCents: 5500 }])).toBe(21);
    expect(maxAnnualDiscountPercent([{ monthlyPriceCents: 1000, annualPriceCents: 1000 }])).toBe(0);
  });

  it("formule la commission selon le mode", () => {
    const c = { mode: "NEW_CLIENTS_ONLY" as const, base: "BOOKING_TOTAL" as const, defaultRate: 0.2, minCents: 0, maxCents: null, paymentFeePercent: 0, paymentFeeFixedCents: 0, defaultTrialDays: 14, salesContactEmail: null };
    expect(commissionHeadline(c)).toContain("nouveaux clients");
    expect(commissionHeadline({ ...c, mode: "DISABLED" })).toBe("Aucune commission sur vos réservations");
  });
});
