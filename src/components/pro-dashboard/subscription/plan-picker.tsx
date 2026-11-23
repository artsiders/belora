"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { BillingIntervalToggle } from "@/components/billing/billing-interval-toggle";
import { PlanCard } from "@/components/billing/plan-card";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { maxAnnualDiscountPercent, planCommissionLine } from "@/modules/billing/format";
import type { BillingIntervalValue, PublicPlan, PublicPricing, VenueSubscriptionSummary } from "@/modules/billing/types";

interface PlanPickerProps {
  pricing: PublicPricing | undefined;
  subscription: VenueSubscriptionSummary | undefined;
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  onSelect: (plan: PublicPlan, interval: BillingIntervalValue) => void;
  pendingPlanId: string | null;
}

export function PlanPicker({ pricing, subscription, isLoading, hasError, onRetry, onSelect, pendingPlanId }: PlanPickerProps) {
  const [interval, setInterval] = useState<BillingIntervalValue>(subscription?.interval ?? "MONTHLY");
  const plans = pricing?.plans ?? [];
  const discount = maxAnnualDiscountPercent(plans.filter((p) => !p.isContactSales));
  const currentPlanId = subscription?.plan?.id;
  const isPaying = subscription?.hasPaymentMethod && subscription.state !== "canceled";
  const salesEmail = pricing?.commission.salesContactEmail;

  const actionFor = (plan: PublicPlan) => {
    const isCurrent = plan.id === currentPlanId && interval === subscription?.interval && isPaying;
    if (plan.isContactSales) {
      return salesEmail ? (
        <a href={`mailto:${salesEmail}?subject=${encodeURIComponent(`Forfait ${plan.name}`)}`} className="btn btn-outline btn-block">
          Contacter notre équipe
        </a>
      ) : null;
    }
    if (isCurrent) {
      return (
        <button type="button" disabled className="btn btn-outline btn-block">
          Forfait actuel
        </button>
      );
    }
    return (
      <button
        type="button"
        disabled={!subscription?.billingAvailable || pendingPlanId !== null}
        onClick={() => onSelect(plan, interval)}
        className={`btn btn-block ${plan.isHighlighted ? "btn-primary" : "btn-outline"}`}
      >
        {pendingPlanId === plan.id ? "Redirection..." : isPaying ? "Passer à ce forfait" : "Choisir ce forfait"}
      </button>
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-950">Changer de forfait</h2>
          <p className="text-sm text-neutral-500">
            Le changement est immédiat ; la différence de prix est calculée au prorata.
          </p>
        </div>
        {discount > 0 && <BillingIntervalToggle value={interval} onChange={setInterval} annualDiscountPercent={discount} />}
      </div>

      {subscription && !subscription.billingAvailable && (
        <p className="text-sm text-neutral-600">
          Le paiement en ligne de l&apos;abonnement n&apos;est pas encore ouvert. Contactez l&apos;équipe Belora pour activer votre forfait.
        </p>
      )}

      {hasError ? (
        <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" aria-hidden />
            Impossible de charger les forfaits.
          </span>
          <button type="button" onClick={onRetry} className="btn btn-outline btn-xs">
            Réessayer
          </button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-6 rounded-xl bg-white border border-neutral-200 space-y-3">
              <InlineSkeleton width="w-32" height="h-6" />
              <InlineSkeleton width="w-24" height="h-9" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              highlighted={plan.id === currentPlanId}
              commissionLine={pricing ? planCommissionLine(plan, pricing.commission.mode) : null}
              action={actionFor(plan)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
