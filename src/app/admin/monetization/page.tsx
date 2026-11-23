"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Coins, FileText, Link2, Repeat, UserPlus, Users } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { StatCard } from "@/components/admin/ui/stat-card";
import { CommissionSettingsForm } from "@/components/admin/billing/commission-settings-form";
import { billingKeys } from "@/components/billing/billing-queries";
import { SUBSCRIPTION_STATE_LABELS, formatRate } from "@/modules/billing/format";
import type { MonetizationOverview } from "@/modules/billing/admin-billing.service";
import type { AdminPlan } from "@/modules/billing/types";

const euro = (amount: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(amount);

export default function AdminMonetizationPage() {
  const overview = useQuery<MonetizationOverview>({
    queryKey: billingKeys.adminMonetization,
    queryFn: async () => (await apiClient.get<MonetizationOverview>("/admin/monetization")).data,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    placeholderData: keepPreviousData,
  });
  const plans = useQuery<{ plans: AdminPlan[] }>({
    queryKey: billingKeys.adminPlans,
    queryFn: async () => (await apiClient.get<{ plans: AdminPlan[] }>("/admin/plans")).data,
    staleTime: 30_000,
  });

  const data = overview.data;
  const isLoading = overview.isLoading;
  const hasError = overview.isError || Boolean((data as { error?: string } | undefined)?.error);
  const totals = data?.totals;

  return (
    <div className="space-y-8 container mx-auto">
      <AdminPageHeader
        title="Monétisation"
        description="Revenus récurrents des abonnements et commissions d'acquisition, avec les règles qui les produisent."
      />

      {hasError && (
        <Alert
          variant="error"
          title="Impossible de charger la monétisation"
          description="Vérifiez votre connexion puis réessayez."
          action={{ label: "Réessayer", onClick: () => overview.refetch(), isLoading: overview.isFetching }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Revenu mensuel récurrent"
          icon={Repeat}
          isLoading={isLoading}
          value={totals ? euro(totals.mrrEuros) : "—"}
          hint={totals ? `${totals.activeSubscriptions} abonnements payants, ${totals.trialingSubscriptions} en essai` : undefined}
        />
        <StatCard
          label="Commissions dues"
          icon={Coins}
          isLoading={isLoading}
          value={totals ? euro(totals.commissionsDueEuros) : "—"}
          hint={totals ? `${totals.commissionedBookings} réservations commissionnées` : undefined}
        />
        <StatCard
          label="Reste à facturer aux salons"
          icon={FileText}
          isLoading={isLoading}
          value={totals ? euro(totals.commissionsToInvoiceEuros) : "—"}
          hint={totals ? `${euro(totals.commissionsCollectedEuros)} déjà prélevés en ligne` : undefined}
        />
        <StatCard
          label="Nouveaux clients apportés"
          icon={UserPlus}
          isLoading={isLoading}
          value={totals?.newClientBookings ?? "—"}
        />
        <StatCard
          label="Réservations via lien direct"
          icon={Link2}
          isLoading={isLoading}
          value={totals?.directLinkBookings ?? "—"}
          hint="Jamais commissionnées"
        />
        <StatCard
          label="Frais de paiement perçus"
          icon={Users}
          isLoading={isLoading}
          value={totals ? euro(totals.paymentFeesEuros) : "—"}
        />
      </div>

      {data ? (
        <CommissionSettingsForm key={JSON.stringify(data.settings)} settings={data.settings} plans={plans.data?.plans ?? []} />
      ) : (
        isLoading && <InlineSkeleton width="w-full" height="h-40" />
      )}

      <section className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-900">Par établissement</h2>
          <p className="text-sm text-neutral-500">Taux effectif appliqué et commissions générées.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500 border-b border-neutral-200/80">
              <th className="px-5 py-3 font-medium">Établissement</th>
              <th className="px-5 py-3 font-medium">Forfait</th>
              <th className="px-5 py-3 font-medium">Taux</th>
              <th className="px-5 py-3 font-medium">Volume</th>
              <th className="px-5 py-3 font-medium">Commissions</th>
              <th className="px-5 py-3 font-medium">À facturer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-4">
                  <InlineSkeleton width="w-full" height="h-5" />
                </td>
              </tr>
            ) : (data?.venues.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-neutral-500">
                  Aucun établissement enregistré.
                </td>
              </tr>
            ) : (
              data?.venues.map((v) => (
                <tr key={v.venueId}>
                  <td className="px-5 py-3 font-medium text-neutral-900">{v.venueName}</td>
                  <td className="px-5 py-3">
                    <span className="block">{v.planName ?? "—"}</span>
                    <span className="text-neutral-500">{SUBSCRIPTION_STATE_LABELS[v.subscriptionState]}</span>
                  </td>
                  <td className="px-5 py-3">
                    {formatRate(v.effectiveRate)}
                    {v.hasNegotiatedRate && <span className="text-neutral-500"> · négocié</span>}
                  </td>
                  <td className="px-5 py-3 num">{euro(v.gmvEuros)}</td>
                  <td className="px-5 py-3 num">{euro(v.commissionsEuros)}</td>
                  <td className="px-5 py-3 num">{euro(v.commissionsToInvoiceEuros)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
