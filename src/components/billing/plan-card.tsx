import { Check } from "lucide-react";
import type { BillingIntervalValue, PublicPlan } from "@/modules/billing/types";
import { formatPrice, planCapabilityLines, planMonthlyPrice } from "@/modules/billing/format";

interface PlanCardProps {
  plan: PublicPlan;
  interval: BillingIntervalValue;
  /** Bouton d'action (lien d'inscription, souscription, contact). */
  action: React.ReactNode;
  /** Mise en avant visuelle (par défaut : réglage du forfait). */
  highlighted?: boolean;
  /** Mention discrète en pied de carte (ex : « Forfait actuel »). */
  footnote?: React.ReactNode;
  /** Ligne décrivant la commission applicable à ce forfait. */
  commissionLine?: string | null;
}

/** Carte de forfait utilisée sur la page tarifs et dans l'espace abonnement pro. */
export function PlanCard({
  plan,
  interval,
  action,
  highlighted = plan.isHighlighted,
  footnote,
  commissionLine,
}: PlanCardProps) {
  const monthly = planMonthlyPrice(plan, interval);
  const features = [...planCapabilityLines(plan), ...(commissionLine ? [commissionLine] : []), ...plan.features];

  return (
    <article
      className={`p-7 sm:p-8 rounded-xl flex flex-col justify-between border bg-white transition-shadow duration-300 ${
        highlighted
          ? "border-primary-600 ring-2 ring-primary-600/20 shadow-lg"
          : "border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300"
      }`}
    >
      <div>
        {highlighted && plan.highlightLabel && (
          <p className="text-sm font-semibold text-primary-700 mb-2">{plan.highlightLabel}</p>
        )}
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-1">{plan.name}</h3>
        {plan.description && (
          <p className="text-sm text-neutral-600 mb-6 min-h-10 leading-snug">{plan.description}</p>
        )}

        <div className="mb-6 pb-6 border-b border-neutral-100">
          {plan.isContactSales ? (
            <span className="text-3xl font-bold text-neutral-950">Sur devis</span>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-neutral-950 num">{formatPrice(monthly, plan.currency)}</span>
                <span className="text-sm sm:text-base text-neutral-500">HT / mois</span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                {interval === "ANNUAL"
                  ? `Soit ${formatPrice(monthly * 12, plan.currency)} HT facturés une fois par an`
                  : "Sans engagement, résiliable à tout moment"}
              </p>
            </>
          )}
        </div>

        <ul className="space-y-3.5 text-sm text-neutral-700 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        {action}
        {footnote && <p className="text-sm text-neutral-500 text-center">{footnote}</p>}
      </div>
    </article>
  );
}
