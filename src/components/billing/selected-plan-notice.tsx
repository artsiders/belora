"use client";

import Link from "next/link";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { usePublicPricing } from "./billing-queries";
import { formatPrice, planMonthlyPrice } from "@/modules/billing/format";
import type { BillingIntervalValue } from "@/modules/billing/types";

interface SelectedPlanNoticeProps {
  planSlug: string | null;
  interval: BillingIntervalValue;
}

/** Rappel du forfait choisi sur la page tarifs, affiché pendant l'inscription pro. */
export function SelectedPlanNotice({ planSlug, interval }: SelectedPlanNoticeProps) {
  const { data, isLoading } = usePublicPricing();
  const selfServe = data?.plans.filter((p) => !p.isContactSales) ?? [];
  const plan = selfServe.find((p) => p.slug === planSlug) ?? null;
  const trialDays = plan?.trialDays ?? data?.commission.defaultTrialDays ?? 0;

  return (
    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50 p-4 text-sm text-neutral-700 space-y-1">
      {isLoading ? (
        <InlineSkeleton width="w-64" height="h-4" />
      ) : plan ? (
        <p>
          Forfait <strong className="text-neutral-950">{plan.name}</strong> ·{" "}
          {formatPrice(planMonthlyPrice(plan, interval), plan.currency)} HT / mois
          {interval === "ANNUAL" ? " en engagement annuel" : ""}
        </p>
      ) : (
        <p>Vous pourrez choisir votre forfait depuis votre espace, à tout moment.</p>
      )}
      {!isLoading && trialDays > 0 && (
        <p className="text-neutral-500">
          {trialDays} jours d&apos;essai gratuit, sans carte bancaire.{" "}
          <Link href="/pro#pricing" className="underline underline-offset-2">
            Comparer les forfaits
          </Link>
        </p>
      )}
    </div>
  );
}
