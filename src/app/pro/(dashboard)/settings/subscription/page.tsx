"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { useEstablishment } from "@/contexts/pro-establishment-context";
import { billingKeys, useProSubscription, usePublicPricing } from "@/components/billing/billing-queries";
import { SubscriptionStatusCard } from "@/components/pro-dashboard/subscription/subscription-status-card";
import { UsageMeters } from "@/components/pro-dashboard/subscription/usage-meters";
import { DirectBookingLinkCard } from "@/components/pro-dashboard/subscription/direct-booking-link-card";
import { PlanPicker } from "@/components/pro-dashboard/subscription/plan-picker";
import { commissionDetails } from "@/modules/billing/format";
import type { BillingIntervalValue, PublicPlan } from "@/modules/billing/types";

/** Retour du paiement en ligne : message de confirmation puis nettoyage de l'URL. */
function CheckoutFeedback({ onSuccess }: { onSuccess: () => void }) {
  const searchParams = useSearchParams();
  const handled = useRef(false);
  useEffect(() => {
    const status = searchParams.get("checkout");
    if (!status || handled.current) return;
    handled.current = true;
    if (status === "success") {
      toast.success("Merci ! Votre abonnement est en cours d'activation.");
      onSuccess();
    } else if (status === "canceled") {
      toast("Souscription interrompue : aucun paiement n'a été effectué.");
    }
    window.history.replaceState(null, "", "/pro/settings/subscription");
  }, [searchParams, onSuccess]);
  return null;
}

export default function SubscriptionSettingsPage() {
  const queryClient = useQueryClient();
  const { currentEstablishment } = useEstablishment();
  const venueId = currentEstablishment?.id;
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const subscription = useProSubscription(venueId);
  const pricing = usePublicPricing();
  const hasError = subscription.isError || Boolean((subscription.data as { error?: string } | undefined)?.error);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: billingKeys.proSubscription(venueId) });

  const checkout = useMutation({
    mutationFn: async ({ plan, interval }: { plan: PublicPlan; interval: BillingIntervalValue }) =>
      (await apiClient.post<{ url: string | null; updated: boolean }>("/pro/subscription/checkout", { planId: plan.id, interval }))
        .data,
    onMutate: ({ plan }) => setPendingPlanId(plan.id),
    onSuccess: (data) => {
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      toast.success("Votre forfait a été modifié.");
      setPendingPlanId(null);
      invalidate();
    },
    onError: (err: ApiErrorResponse) => {
      setPendingPlanId(null);
      toast.error(err.error);
    },
  });

  const portal = useMutation({
    mutationFn: async () => (await apiClient.post<{ url: string }>("/pro/subscription/portal")).data,
    onSuccess: (data) => window.location.assign(data.url),
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  const commission = pricing.data?.commission;
  const commissionNote =
    commission && commission.mode !== "DISABLED"
      ? "Les réservations faites par ce lien ne sont jamais commissionnées."
      : "Vos clients réservent directement votre établissement.";

  return (
    <div className="p-4 sm:p-8 container mx-auto space-y-6">
      <Suspense fallback={null}>
        <CheckoutFeedback onSuccess={invalidate} />
      </Suspense>

      <div className="pb-4 border-b border-neutral-200">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Abonnement</h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
          Votre forfait Belora Pro, son utilisation et les conditions de commission.
        </p>
      </div>

      {hasError ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden />
            <span>Impossible de charger votre abonnement.</span>
          </div>
          <button type="button" onClick={() => subscription.refetch()} className="btn btn-outline btn-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            Réessayer
          </button>
        </div>
      ) : (
        <>
          <SubscriptionStatusCard
            subscription={subscription.data}
            isLoading={subscription.isLoading || !venueId}
            onManageBilling={() => portal.mutate()}
            isOpeningBilling={portal.isPending}
          />
          <UsageMeters subscription={subscription.data} isLoading={subscription.isLoading || !venueId} />
        </>
      )}

      {currentEstablishment && (
        <DirectBookingLinkCard venueSlug={currentEstablishment.slug} commissionNote={commissionNote} />
      )}

      {commission && (
        <section className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2">
          <h2 className="text-base font-bold text-neutral-950">Conditions de commission</h2>
          <ul className="space-y-1 text-sm text-neutral-600">
            {commissionDetails(commission).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {!subscription.data?.isComplimentary && (
        <PlanPicker
          key={subscription.data?.interval ?? "none"}
          pricing={pricing.data}
          subscription={subscription.data}
          isLoading={pricing.isLoading || subscription.isLoading}
          hasError={pricing.isError}
          onRetry={() => pricing.refetch()}
          onSelect={(plan, interval) => checkout.mutate({ plan, interval })}
          pendingPlanId={pendingPlanId}
        />
      )}
    </div>
  );
}
