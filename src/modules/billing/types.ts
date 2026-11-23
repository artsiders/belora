/**
 * Types sérialisés (JSON) partagés entre les API et les interfaces.
 * Ce fichier ne doit importer aucun code serveur.
 */

export type BillingIntervalValue = "MONTHLY" | "ANNUAL";
export type SubscriptionStatusValue = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
export type CommissionModeValue = "DISABLED" | "NEW_CLIENTS_ONLY" | "ALL_MARKETPLACE";
export type CommissionBaseValue = "ONLINE_PAYMENT" | "BOOKING_TOTAL";
export type EffectiveSubscriptionStateValue =
  | "trialing"
  | "active"
  | "past_due"
  | "trial_expired"
  | "canceled"
  | "none";

export interface PublicPlan {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceCents: number;
  annualPriceCents: number;
  currency: string;
  trialDays: number;
  maxStaff: number | null;
  maxResources: number | null;
  maxVenues: number | null;
  commissionRate: number;
  includesSmsReminders: boolean;
  includesAnalytics: boolean;
  includesPriorityListing: boolean;
  features: string[];
  isHighlighted: boolean;
  highlightLabel: string | null;
  isContactSales: boolean;
}

export interface AdminPlan extends Omit<PublicPlan, "trialDays" | "commissionRate"> {
  trialDays: number | null;
  commissionRate: number | null;
  isPublic: boolean;
  isActive: boolean;
  order: number;
  subscriberCount: number;
}

export interface PublicPricing {
  plans: PublicPlan[];
  commission: {
    mode: CommissionModeValue;
    base: CommissionBaseValue;
    defaultRate: number;
    minCents: number;
    maxCents: number | null;
    paymentFeePercent: number;
    paymentFeeFixedCents: number;
    defaultTrialDays: number;
    salesContactEmail: string | null;
  };
}

export interface UsageLimit {
  used: number;
  limit: number | null;
}

export interface VenueSubscriptionSummary {
  state: EffectiveSubscriptionStateValue;
  hasAccess: boolean;
  status: SubscriptionStatusValue | null;
  interval: BillingIntervalValue | null;
  trialEndsAt: string | null;
  trialDaysLeft: number | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isComplimentary: boolean;
  hasPaymentMethod: boolean;
  plan: PublicPlan | null;
  usage: {
    staff: UsageLimit;
    resources: UsageLimit;
    venues: UsageLimit;
  };
  billingAvailable: boolean;
}

export interface AdminBillingSettings {
  defaultCommissionRate: number;
  commissionMode: CommissionModeValue;
  commissionBase: CommissionBaseValue;
  commissionMinCents: number;
  commissionMaxCents: number | null;
  paymentFeePercent: number;
  paymentFeeFixedCents: number;
  defaultTrialDays: number;
  defaultPlanId: string | null;
  salesContactEmail: string | null;
  maintenanceMode: boolean;
}
