"use client";

import { AlertTriangle, CalendarClock, CheckCircle2 } from "lucide-react";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { SUBSCRIPTION_STATE_LABELS, formatPrice, planMonthlyPrice } from "@/modules/billing/format";
import type { VenueSubscriptionSummary } from "@/modules/billing/types";

interface SubscriptionStatusCardProps {
  subscription: VenueSubscriptionSummary | undefined;
  isLoading: boolean;
  onManageBilling: () => void;
  isOpeningBilling: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function statusMessage(sub: VenueSubscriptionSummary): string {
  if (sub.isComplimentary) return "Votre forfait est offert par l'équipe Belora.";
  switch (sub.state) {
    case "trialing":
      return sub.trialDaysLeft !== null
        ? `Essai gratuit : ${sub.trialDaysLeft} jour${sub.trialDaysLeft > 1 ? "s" : ""} restant${sub.trialDaysLeft > 1 ? "s" : ""}${
            sub.trialEndsAt ? `, jusqu'au ${dateFormatter.format(new Date(sub.trialEndsAt))}` : ""
          }.`
        : "Essai gratuit en cours.";
    case "active":
      if (sub.cancelAtPeriodEnd && sub.currentPeriodEnd) {
        return `Résiliation programmée : accès jusqu'au ${dateFormatter.format(new Date(sub.currentPeriodEnd))}.`;
      }
      return sub.currentPeriodEnd
        ? `Prochain renouvellement le ${dateFormatter.format(new Date(sub.currentPeriodEnd))}.`
        : "Abonnement actif.";
    case "past_due":
      return "Le dernier paiement n'a pas abouti. Mettez à jour votre moyen de paiement pour éviter la suspension des réservations en ligne.";
    case "trial_expired":
      return "Votre essai est terminé. Choisissez un forfait pour réactiver les réservations en ligne.";
    case "canceled":
      return "Votre abonnement est résilié. Choisissez un forfait pour réactiver les réservations en ligne.";
    default:
      return "Aucun forfait n'est associé à cet établissement.";
  }
}

export function SubscriptionStatusCard({
  subscription,
  isLoading,
  onManageBilling,
  isOpeningBilling,
}: SubscriptionStatusCardProps) {
  const needsAction = subscription && !subscription.hasAccess;
  const Icon = needsAction || subscription?.state === "past_due" ? AlertTriangle : subscription?.state === "trialing" ? CalendarClock : CheckCircle2;

  return (
    <section className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-neutral-500">Forfait actuel</p>
          {isLoading ? (
            <InlineSkeleton width="w-40" height="h-7" />
          ) : (
            <p className="text-xl font-bold text-neutral-950">{subscription?.plan?.name ?? "Aucun forfait"}</p>
          )}
          {isLoading ? (
            <InlineSkeleton width="w-24" height="h-4" />
          ) : subscription?.plan && !subscription.plan.isContactSales ? (
            <p className="text-sm text-neutral-600">
              {formatPrice(planMonthlyPrice(subscription.plan, subscription.interval ?? "MONTHLY"))} HT / mois
              {subscription.interval === "ANNUAL" ? ", facturé annuellement" : ""}
            </p>
          ) : null}
        </div>

        {subscription?.hasPaymentMethod && subscription.billingAvailable && (
          <button
            type="button"
            onClick={onManageBilling}
            disabled={isOpeningBilling}
            className="btn btn-outline btn-sm self-start"
          >
            {isOpeningBilling ? "Ouverture..." : "Factures et moyen de paiement"}
          </button>
        )}
      </div>

      <div
        className={`flex items-start gap-2.5 text-sm ${
          needsAction || subscription?.state === "past_due" ? "text-rose-800" : "text-neutral-700"
        }`}
      >
        {isLoading ? (
          <InlineSkeleton width="w-72" height="h-4" />
        ) : subscription ? (
          <>
            <Icon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
            <span>
              <span className="font-semibold">{subscription.isComplimentary ? "Offert" : SUBSCRIPTION_STATE_LABELS[subscription.state]}</span>
              {" · "}
              {statusMessage(subscription)}
            </span>
          </>
        ) : null}
      </div>
    </section>
  );
}
