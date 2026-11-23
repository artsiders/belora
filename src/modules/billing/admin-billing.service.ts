import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { getPlatformSettings } from "./platform-settings.service";
import { resolveSubscriptionState, hasActiveAccess } from "./subscription-state";
import type { AdminBillingSettings, EffectiveSubscriptionStateValue } from "./types";

export interface MonetizationOverview {
  settings: AdminBillingSettings;
  totals: {
    commissionsDueEuros: number;
    commissionsCollectedEuros: number;
    commissionsToInvoiceEuros: number;
    paymentFeesEuros: number;
    commissionedBookings: number;
    newClientBookings: number;
    directLinkBookings: number;
    mrrEuros: number;
    activeSubscriptions: number;
    trialingSubscriptions: number;
  };
  venues: {
    venueId: string;
    venueName: string;
    planName: string | null;
    subscriptionState: EffectiveSubscriptionStateValue;
    effectiveRate: number;
    hasNegotiatedRate: boolean;
    gmvEuros: number;
    commissionsEuros: number;
    commissionsToInvoiceEuros: number;
  }[];
}

const SUCCESS_STATUSES = [BookingStatus.CONFIRMED, BookingStatus.COMPLETED];

export async function getMonetizationOverview(): Promise<MonetizationOverview> {
  const setting = await getPlatformSettings();
  const now = new Date();

  const venues = await db.venue.findMany({
    orderBy: { name: "asc" },
    include: {
      subscription: { include: { plan: true } },
      bookings: {
        where: { status: { in: SUCCESS_STATUSES } },
        select: {
          totalPriceCents: true,
          commissionCents: true,
          commissionCollectedCents: true,
          paymentFeeCents: true,
          isNewClient: true,
          channel: true,
        },
      },
    },
  });

  const totals = {
    commissionsDueCents: 0,
    commissionsCollectedCents: 0,
    paymentFeesCents: 0,
    commissionedBookings: 0,
    newClientBookings: 0,
    directLinkBookings: 0,
    mrrCents: 0,
    activeSubscriptions: 0,
    trialingSubscriptions: 0,
  };

  const venueRows = venues.map((v) => {
    let gmv = 0;
    let due = 0;
    let collected = 0;
    for (const b of v.bookings) {
      gmv += b.totalPriceCents;
      due += b.commissionCents;
      collected += b.commissionCollectedCents;
      totals.paymentFeesCents += b.paymentFeeCents;
      if (b.commissionCents > 0) totals.commissionedBookings++;
      if (b.isNewClient && b.channel === "MARKETPLACE") totals.newClientBookings++;
      if (b.channel === "DIRECT_LINK") totals.directLinkBookings++;
    }
    totals.commissionsDueCents += due;
    totals.commissionsCollectedCents += collected;

    const sub = v.subscription;
    const state = resolveSubscriptionState(sub, now);
    if (sub && state === "trialing") totals.trialingSubscriptions++;
    if (sub && hasActiveAccess(state) && state !== "trialing" && !sub.isComplimentary) {
      totals.activeSubscriptions++;
      totals.mrrCents += sub.interval === "ANNUAL" ? sub.plan.annualPriceCents : sub.plan.monthlyPriceCents;
    }

    const negotiated =
      v.commissionRate !== null && (v.commissionRateUntil === null || v.commissionRateUntil > now);

    return {
      venueId: v.id,
      venueName: v.name,
      planName: sub?.plan.name ?? null,
      subscriptionState: state,
      effectiveRate: negotiated
        ? (v.commissionRate as number)
        : sub?.plan.commissionRate ?? setting.defaultCommissionRate,
      hasNegotiatedRate: negotiated,
      gmvEuros: gmv / 100,
      commissionsEuros: due / 100,
      commissionsToInvoiceEuros: (due - collected) / 100,
    };
  });

  return {
    settings: {
      defaultCommissionRate: setting.defaultCommissionRate,
      commissionMode: setting.commissionMode,
      commissionBase: setting.commissionBase,
      commissionMinCents: setting.commissionMinCents,
      commissionMaxCents: setting.commissionMaxCents,
      paymentFeePercent: setting.paymentFeePercent,
      paymentFeeFixedCents: setting.paymentFeeFixedCents,
      defaultTrialDays: setting.defaultTrialDays,
      defaultPlanId: setting.defaultPlanId,
      salesContactEmail: setting.salesContactEmail,
      maintenanceMode: setting.maintenanceMode,
    },
    totals: {
      commissionsDueEuros: totals.commissionsDueCents / 100,
      commissionsCollectedEuros: totals.commissionsCollectedCents / 100,
      commissionsToInvoiceEuros: (totals.commissionsDueCents - totals.commissionsCollectedCents) / 100,
      paymentFeesEuros: totals.paymentFeesCents / 100,
      commissionedBookings: totals.commissionedBookings,
      newClientBookings: totals.newClientBookings,
      directLinkBookings: totals.directLinkBookings,
      mrrEuros: totals.mrrCents / 100,
      activeSubscriptions: totals.activeSubscriptions,
      trialingSubscriptions: totals.trialingSubscriptions,
    },
    venues: venueRows,
  };
}
