"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { useEstablishment } from "@/contexts/pro-establishment-context";
import { useProSubscription } from "@/components/billing/billing-queries";

const TRIAL_REMINDER_DAYS = 7;

/**
 * Bandeau permanent de l'espace pro : fin d'essai proche, essai terminé, paiement en échec.
 * Rien n'est affiché tant que l'abonnement n'est pas chargé (pas d'alerte trompeuse).
 */
export function SubscriptionBanner() {
  const pathname = usePathname();
  const { currentEstablishment } = useEstablishment();
  const { data } = useProSubscription(currentEstablishment?.id);

  if (!data || data.isComplimentary || pathname === "/pro/settings/subscription") return null;

  let tone: "info" | "alert" | null = null;
  let message = "";
  if (data.state === "trialing" && data.trialDaysLeft !== null && data.trialDaysLeft <= TRIAL_REMINDER_DAYS) {
    tone = "info";
    message =
      data.trialDaysLeft === 0
        ? "Votre essai gratuit se termine aujourd'hui."
        : `Votre essai gratuit se termine dans ${data.trialDaysLeft} jour${data.trialDaysLeft > 1 ? "s" : ""}.`;
  } else if (data.state === "none") {
    tone = "info";
    message = "Aucun forfait n'est encore associé à votre établissement.";
  } else if (data.state === "trial_expired" || data.state === "canceled") {
    tone = "alert";
    message = "Les réservations en ligne de votre établissement sont suspendues. Votre agenda reste accessible.";
  } else if (data.state === "past_due") {
    tone = "alert";
    message = "Le paiement de votre abonnement n'a pas abouti. Mettez à jour votre moyen de paiement.";
  }
  if (!tone) return null;

  const Icon = tone === "alert" ? AlertTriangle : CalendarClock;
  return (
    <div
      role="status"
      className={`border-b px-4 py-2.5 text-sm flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${
        tone === "alert" ? "bg-rose-50 border-rose-200 text-rose-900" : "bg-secondary-50 border-secondary-200 text-neutral-900"
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4 shrink-0" aria-hidden />
        {message}
      </span>
      <Link href="/pro/settings/subscription" className="font-semibold underline underline-offset-2">
        Choisir mon forfait
      </Link>
    </div>
  );
}
