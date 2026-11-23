"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Info } from "lucide-react";
import { BillingIntervalToggle } from "@/components/billing/billing-interval-toggle";
import { PlanCard } from "@/components/billing/plan-card";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import {
  commissionDetails,
  commissionHeadline,
  maxAnnualDiscountPercent,
  planCommissionLine,
} from "@/modules/billing/format";
import type { BillingIntervalValue, PublicPlan, PublicPricing } from "@/modules/billing/types";

interface ProPricingSectionProps {
  pricing: PublicPricing | undefined;
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

function planActionHref(plan: PublicPlan, interval: BillingIntervalValue, salesEmail: string | null) {
  if (plan.isContactSales) {
    return salesEmail
      ? `mailto:${salesEmail}?subject=${encodeURIComponent(`Forfait ${plan.name}`)}`
      : "/help";
  }
  return `/register?role=pro&plan=${encodeURIComponent(plan.slug)}&interval=${interval}`;
}

function planActionLabel(plan: PublicPlan) {
  if (plan.isContactSales) return "Contacter notre équipe";
  return plan.trialDays > 0 ? `Essayer ${plan.trialDays} jours gratuitement` : "Choisir ce forfait";
}

/** Section tarifs de la page /pro, entièrement alimentée par les réglages de l'administration. */
export function ProPricingSection({ pricing, isLoading, hasError, onRetry }: ProPricingSectionProps) {
  const [interval, setInterval] = useState<BillingIntervalValue>("MONTHLY");
  const plans = pricing?.plans ?? [];
  const discount = maxAnnualDiscountPercent(plans.filter((p) => !p.isContactSales));
  const trialDays = pricing?.commission.defaultTrialDays ?? 0;

  return (
    <section
      id="pricing"
      className="py-12 sm:py-16 lg:py-20 bg-white border-b border-primary-200/80 scroll-mt-20"
      aria-labelledby="pricing-heading"
    >
      <div className="container-belora">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
          <div>
            <h2 id="pricing-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950">
              Un abonnement pour le logiciel,{" "}
              <span className="text-primary-600">une commission seulement quand Belora vous apporte un client.</span>
            </h2>
            <div className="mt-2 text-sm sm:text-base text-neutral-600">
              {isLoading ? (
                <InlineSkeleton width="w-80" height="h-5" />
              ) : pricing ? (
                <p>
                  {trialDays > 0 ? `${trialDays} jours d'essai sans carte bancaire. ` : ""}
                  Formule mensuelle sans engagement, changement de forfait à tout moment.
                </p>
              ) : null}
            </div>
          </div>

          {discount > 0 && (
            <BillingIntervalToggle
              value={interval}
              onChange={setInterval}
              annualDiscountPercent={discount}
              className="shrink-0 self-start sm:self-auto"
            />
          )}
        </div>

        {hasError ? (
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-50 p-8 text-center space-y-3">
            <AlertTriangle className="w-6 h-6 text-neutral-500 mx-auto" aria-hidden />
            <p className="text-base font-semibold text-neutral-900">Les tarifs ne peuvent pas être affichés</p>
            <p className="text-sm text-neutral-600">Vérifiez votre connexion puis réessayez.</p>
            <button type="button" onClick={onRetry} className="btn btn-outline btn-sm">
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-7 sm:p-8 rounded-xl border border-neutral-200/90 bg-white space-y-4">
                <InlineSkeleton width="w-40" height="h-7" />
                <InlineSkeleton width="w-56" height="h-4" />
                <InlineSkeleton width="w-28" height="h-10" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <p className="text-base text-neutral-600">
            Nos forfaits sont en cours de mise à jour. Contactez-nous pour connaître nos conditions.
          </p>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 lg:gap-8 items-stretch ${
              plans.length >= 3 ? "md:grid-cols-3" : plans.length === 2 ? "md:grid-cols-2" : ""
            }`}
          >
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                interval={interval}
                commissionLine={pricing ? planCommissionLine(plan, pricing.commission.mode) : null}
                action={
                  <Link
                    href={planActionHref(plan, interval, pricing?.commission.salesContactEmail ?? null)}
                    className={`btn btn-lg btn-block ${plan.isHighlighted ? "btn-primary" : "btn-outline"}`}
                  >
                    {planActionLabel(plan)}
                  </Link>
                }
              />
            ))}
          </div>
        )}

        {pricing && (
          <div className="mt-8 rounded-xl border border-neutral-200/90 bg-neutral-50/60 p-6 flex gap-3">
            <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" aria-hidden />
            <div className="space-y-2">
              <p className="text-base font-semibold text-neutral-950">{commissionHeadline(pricing.commission)}</p>
              <ul className="space-y-1 text-sm text-neutral-600">
                {commissionDetails(pricing.commission).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="text-sm text-neutral-500">Prix indiqués hors taxes.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
