"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { FormInput, FormRadio, ToggleSwitch } from "@/components/pro-dashboard/ui/form-controls";
import { Select } from "@/components/ui/select";
import { MoneyInput, PercentInput } from "@/components/admin/ui/numeric-inputs";
import { billingKeys } from "@/components/billing/billing-queries";
import { computeCommission } from "@/modules/billing/commission";
import { formatPrice } from "@/modules/billing/format";
import type { AdminBillingSettings, AdminPlan, CommissionModeValue } from "@/modules/billing/types";

/** Remonter le composant (prop `key`) pour repartir des valeurs enregistrées. */
interface CommissionSettingsFormProps {
  settings: AdminBillingSettings;
  plans: AdminPlan[];
}

const MODES: { value: CommissionModeValue; label: string; description: string }[] = [
  {
    value: "NEW_CLIENTS_ONLY",
    label: "Nouveaux clients uniquement",
    description: "Seule la première réservation d'un client absent du fichier du salon, venue de la marketplace.",
  },
  {
    value: "ALL_MARKETPLACE",
    label: "Toutes les réservations de la marketplace",
    description: "Habitués compris. Les réservations via le lien direct du salon restent sans commission.",
  },
  {
    value: "DISABLED",
    label: "Aucune commission",
    description: "Seul l'abonnement est facturé.",
  },
];

function Card({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-5">
      <div className="pb-4 border-b border-neutral-100">
        <h2 className="text-base font-bold text-neutral-900">{title}</h2>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

/** Exemple chiffré recalculé en direct pour visualiser l'effet des réglages. */
function CommissionPreview({ form }: { form: AdminBillingSettings }) {
  const totalCents = 8000;
  const onlineCents = 2400;
  const example = computeCommission(
    {
      mode: form.commissionMode,
      base: form.commissionBase,
      minCents: form.commissionMinCents,
      maxCents: form.commissionMaxCents,
      paymentFeePercent: form.paymentFeePercent,
      paymentFeeFixedCents: form.paymentFeeFixedCents,
    },
    { channel: "MARKETPLACE", isNewClient: true, totalCents, onlineCents, rate: form.defaultCommissionRate }
  );
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-4 text-sm text-neutral-700 space-y-1">
      <p className="font-semibold text-neutral-900">Exemple : nouveau client, prestation à 80 €, acompte de 24 €</p>
      <p>Commission due : {formatPrice(example.commissionCents)}</p>
      <p>Prélevée automatiquement sur l&apos;acompte : {formatPrice(example.collectedCents)}</p>
      <p>Reste à facturer au salon : {formatPrice(example.commissionCents - example.collectedCents)}</p>
      <p>Frais de paiement : {formatPrice(example.paymentFeeCents)}</p>
    </div>
  );
}

export function CommissionSettingsForm({ settings, plans }: CommissionSettingsFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<AdminBillingSettings>(settings);

  const set = <K extends keyof AdminBillingSettings>(key: K, value: AdminBillingSettings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(settings), [form, settings]);

  const save = useMutation({
    mutationFn: async (payload: AdminBillingSettings) => (await apiClient.patch("/admin/monetization", payload)).data,
    onSuccess: (data) => {
      queryClient.setQueryData(billingKeys.adminMonetization, data);
      queryClient.invalidateQueries({ queryKey: billingKeys.pricing });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Paramètres enregistrés");
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  const planOptions = plans
    .filter((p) => p.isActive && !p.isContactSales)
    .map((p) => ({ value: p.id, label: p.name }));

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(form);
      }}
    >
      <Card
        title="Commission d'acquisition"
        description="Rémunère Belora lorsqu'un client est apporté par la marketplace. Un taux négocié par établissement ou un taux de forfait reste prioritaire."
      >
        <div className="space-y-3">
          {MODES.map((mode) => (
            <FormRadio
              key={mode.value}
              name="commissionMode"
              label={mode.label}
              description={mode.description}
              checked={form.commissionMode === mode.value}
              onChange={() => set("commissionMode", mode.value)}
            />
          ))}
        </div>

        {form.commissionMode !== "DISABLED" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PercentInput
                label="Taux plateforme"
                value={form.defaultCommissionRate}
                onChange={(v) => set("defaultCommissionRate", v ?? 0)}
              />
              <MoneyInput
                label="Minimum par réservation"
                value={form.commissionMinCents}
                onChange={(v) => set("commissionMinCents", v ?? 0)}
              />
              <MoneyInput
                label="Plafond par réservation"
                nullable
                value={form.commissionMaxCents}
                helper="Vide = sans plafond"
                onChange={(v) => set("commissionMaxCents", v)}
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-800">Base de calcul</p>
              <FormRadio
                name="commissionBase"
                label="Prix total de la prestation"
                description="La part non couverte par le paiement en ligne est à facturer au salon."
                checked={form.commissionBase === "BOOKING_TOTAL"}
                onChange={() => set("commissionBase", "BOOKING_TOTAL")}
              />
              <FormRadio
                name="commissionBase"
                label="Montant payé en ligne"
                description="Aucune commission si le client ne paie rien en ligne."
                checked={form.commissionBase === "ONLINE_PAYMENT"}
                onChange={() => set("commissionBase", "ONLINE_PAYMENT")}
              />
            </div>
            <CommissionPreview form={form} />
          </>
        )}
      </Card>

      <Card title="Frais de paiement en ligne" description="Prélevés sur chaque paiement en ligne pour couvrir les frais bancaires.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PercentInput
            label="Part variable"
            max={10}
            value={form.paymentFeePercent}
            onChange={(v) => set("paymentFeePercent", v ?? 0)}
          />
          <MoneyInput
            label="Part fixe"
            value={form.paymentFeeFixedCents}
            onChange={(v) => set("paymentFeeFixedCents", v ?? 0)}
          />
        </div>
      </Card>

      <Card title="Inscription des professionnels" description="Essai gratuit et forfait attribué par défaut.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Durée d'essai par défaut (jours)"
            type="number"
            min={0}
            max={90}
            value={String(form.defaultTrialDays)}
            helper="Un forfait peut définir sa propre durée"
            onChange={(e) => set("defaultTrialDays", Math.min(90, Math.max(0, parseInt(e.target.value, 10) || 0)))}
          />
          <Select
            label="Forfait par défaut"
            options={planOptions}
            value={form.defaultPlanId ?? undefined}
            onChange={(v) => set("defaultPlanId", v || null)}
            clearable
            placeholder="Premier forfait affiché"
            helper="Attribué quand aucun forfait n'est choisi à l'inscription"
          />
        </div>
        <FormInput
          label="E-mail du contact commercial"
          type="email"
          value={form.salesContactEmail ?? ""}
          helper="Utilisé par le bouton des forfaits sur devis"
          onChange={(e) => set("salesContactEmail", e.target.value || null)}
        />
      </Card>

      <Card title="Mode maintenance" description="Suspend les réservations en ligne. L'espace pro et l'agenda restent accessibles.">
        <ToggleSwitch
          label={form.maintenanceMode ? "Réservations en ligne suspendues" : "Réservations en ligne ouvertes"}
          checked={form.maintenanceMode}
          onChange={(v) => set("maintenanceMode", v)}
        />
      </Card>

      <div className="flex justify-end gap-2">
        <button type="button" disabled={!isDirty} onClick={() => setForm(settings)} className="btn btn-ghost">
          Annuler les modifications
        </button>
        <button type="submit" disabled={!isDirty || save.isPending} className="btn btn-dark">
          {save.isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
