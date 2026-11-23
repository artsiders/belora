"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PublicPricing, VenueSubscriptionSummary } from "@/modules/billing/types";

export const billingKeys = {
  pricing: ["billing", "pricing"] as const,
  proSubscription: (venueId: string | null | undefined) => ["pro", "subscription", venueId ?? "none"] as const,
  adminPlans: ["admin", "plans"] as const,
  adminMonetization: ["admin", "monetization"] as const,
};

/** Tarifs publics (forfaits + règles de commission). */
export function usePublicPricing() {
  return useQuery<PublicPricing>({
    queryKey: billingKeys.pricing,
    queryFn: async () => (await apiClient.get<PublicPricing>("/plans")).data,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}

/** Abonnement de l'établissement actif dans l'espace pro. */
export function useProSubscription(venueId: string | null | undefined) {
  return useQuery<VenueSubscriptionSummary>({
    queryKey: billingKeys.proSubscription(venueId),
    queryFn: async () =>
      (await apiClient.get<{ subscription: VenueSubscriptionSummary }>("/pro/subscription")).data.subscription,
    enabled: Boolean(venueId),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    placeholderData: keepPreviousData,
  });
}
