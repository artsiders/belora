"use client";

import { FormInput, FormRadio } from "@/components/pro-dashboard/ui/form-controls";
import { computeOnlinePaymentCents } from "@/modules/booking/booking-policy";
import type { FormattedEstablishment } from "@/modules/pro/settings.service";

type PaymentFields = Pick<FormattedEstablishment, "onlinePaymentMode" | "depositScope" | "depositPercentage">;

interface PaymentPolicySectionProps {
  value: PaymentFields;
  onChange: <K extends keyof PaymentFields>(key: K, value: FormattedEstablishment[K]) => void;
}

const MODES: { value: PaymentFields["onlinePaymentMode"]; label: string; description: string }[] = [
  { value: "NONE", label: "Aucun paiement en ligne", description: "Le client réserve sans payer ; tout est réglé en salon." },
  { value: "DEPOSIT", label: "Acompte en ligne", description: "Une partie est réglée à la réservation, le solde en salon. Réduit les rendez-vous manqués." },
  { value: "FULL", label: "Paiement intégral en ligne", description: "La prestation est réglée en totalité à la réservation ; rien à encaisser en salon." },
];

const euro = (cents: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);

/** Exemple chiffré : deux prestations, dont une sans acompte exigé. */
function Example({ value }: { value: PaymentFields }) {
  const services = [
    { priceCents: 8000, depositRequired: true, depositCents: 0 },
    { priceCents: 3000, depositRequired: false, depositCents: 0 },
  ];
  const online = computeOnlinePaymentCents(services, {
    mode: value.onlinePaymentMode,
    scope: value.depositScope,
    depositPercentage: value.depositPercentage,
  });
  return (
    <div className="rounded-lg bg-neutral-50 border border-neutral-200/80 p-4 text-sm text-neutral-700 space-y-1">
      <p className="font-semibold text-neutral-900">
        Exemple : coloration à 80 € (acompte exigé) + coupe à 30 € (sans acompte exigé)
      </p>
      <p>Réglé en ligne à la réservation : {euro(online)}</p>
      <p>Reste à encaisser en salon : {euro(11000 - online)}</p>
    </div>
  );
}

export function PaymentPolicySection({ value, onChange }: PaymentPolicySectionProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {MODES.map((mode) => (
          <FormRadio
            key={mode.value}
            name="onlinePaymentMode"
            label={mode.label}
            description={mode.description}
            checked={value.onlinePaymentMode === mode.value}
            onChange={() => onChange("onlinePaymentMode", mode.value)}
          />
        ))}
      </div>

      {value.onlinePaymentMode === "DEPOSIT" && (
        <div className="space-y-4 ps-4 border-s-2 border-primary-200">
          <div className="max-w-xs">
            <FormInput
              type="number"
              label="Montant de l'acompte (%)"
              helper="Appliqué aux prestations sans montant d'acompte fixe"
              min={0}
              max={100}
              step={5}
              value={String(value.depositPercentage)}
              onChange={(e) => onChange("depositPercentage", Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-800">Prestations concernées</p>
            <FormRadio
              name="depositScope"
              label="Uniquement les prestations qui exigent un acompte"
              description="Réglage prestation par prestation dans Gestion des prestations."
              checked={value.depositScope === "FLAGGED_SERVICES"}
              onChange={() => onChange("depositScope", "FLAGGED_SERVICES")}
            />
            <FormRadio
              name="depositScope"
              label="Toutes les prestations"
              description="Un montant fixe défini sur une prestation reste prioritaire."
              checked={value.depositScope === "ALL_SERVICES"}
              onChange={() => onChange("depositScope", "ALL_SERVICES")}
            />
          </div>
        </div>
      )}

      {value.onlinePaymentMode !== "NONE" && <Example value={value} />}

      <p className="text-sm text-neutral-500">
        Le paiement par carte sera activé dès le raccordement de votre compte de paiement. D&apos;ici là, les montants
        sont calculés et affichés au client, et l&apos;acompte prévu est déduit en caisse.
      </p>
    </div>
  );
}
