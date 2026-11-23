"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormCheckbox, FormInput, FormTextarea, ToggleSwitch } from "@/components/pro-dashboard/ui/form-controls";
import { LimitInput, MoneyInput, PercentInput } from "@/components/admin/ui/numeric-inputs";
import { billingKeys } from "@/components/billing/billing-queries";
import type { AdminPlan } from "@/modules/billing/types";
import type { PlanInput } from "@/lib/validations/billing.schema";

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Forfait édité ; absent = création. Remonter via `key` à chaque ouverture. */
  plan: AdminPlan | null;
  nextOrder: number;
}

const EMPTY_PLAN: PlanInput = {
  slug: "",
  name: "",
  description: "",
  monthlyPriceCents: 0,
  annualPriceCents: 0,
  trialDays: null,
  maxStaff: 1,
  maxResources: null,
  maxVenues: 1,
  commissionRate: null,
  includesSmsReminders: true,
  includesAnalytics: false,
  includesPriorityListing: false,
  features: [],
  isHighlighted: false,
  highlightLabel: "",
  isContactSales: false,
  isPublic: true,
  isActive: true,
  order: 0,
};

function toFormState(plan: AdminPlan | null, nextOrder: number): PlanInput {
  if (!plan) return { ...EMPTY_PLAN, order: nextOrder };
  return {
    slug: plan.slug,
    name: plan.name,
    description: plan.description ?? "",
    monthlyPriceCents: plan.monthlyPriceCents,
    annualPriceCents: plan.annualPriceCents,
    trialDays: plan.trialDays,
    maxStaff: plan.maxStaff,
    maxResources: plan.maxResources,
    maxVenues: plan.maxVenues,
    commissionRate: plan.commissionRate,
    includesSmsReminders: plan.includesSmsReminders,
    includesAnalytics: plan.includesAnalytics,
    includesPriorityListing: plan.includesPriorityListing,
    features: plan.features,
    isHighlighted: plan.isHighlighted,
    highlightLabel: plan.highlightLabel ?? "",
    isContactSales: plan.isContactSales,
    isPublic: plan.isPublic,
    isActive: plan.isActive,
    order: plan.order,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 pt-5 first:pt-0 border-t first:border-t-0 border-neutral-100">
      <legend className="text-base font-semibold text-neutral-900 mb-1">{title}</legend>
      {children}
    </fieldset>
  );
}

export function PlanFormModal({ isOpen, onClose, plan, nextOrder }: PlanFormModalProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PlanInput>(() => toFormState(plan, nextOrder));
  const [slugTouched, setSlugTouched] = useState(Boolean(plan));
  const [newFeature, setNewFeature] = useState("");

  const set = <K extends keyof PlanInput>(key: K, value: PlanInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = useMutation({
    mutationFn: async (payload: PlanInput) => {
      if (plan) return (await apiClient.patch(`/admin/plans/${plan.id}`, payload)).data;
      return (await apiClient.post("/admin/plans", payload)).data;
    },
    onSuccess: () => {
      toast.success(plan ? "Forfait mis à jour" : "Forfait créé");
      queryClient.invalidateQueries({ queryKey: billingKeys.adminPlans });
      queryClient.invalidateQueries({ queryKey: billingKeys.pricing });
      onClose();
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  const addFeature = () => {
    const value = newFeature.trim();
    if (!value || form.features.includes(value)) return;
    set("features", [...form.features, value]);
    setNewFeature("");
  };

  const annualDiscount =
    form.monthlyPriceCents > 0 && form.annualPriceCents < form.monthlyPriceCents
      ? Math.round((1 - form.annualPriceCents / form.monthlyPriceCents) * 100)
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? `Modifier le forfait ${plan.name}` : "Nouveau forfait"}
      description="Toutes les valeurs sont appliquées immédiatement à la page tarifs et aux nouvelles souscriptions."
      maxWidth="xl"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button
            type="submit"
            form="plan-form"
            disabled={save.isPending}
            className="btn btn-dark"
          >
            {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form
        id="plan-form"
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
      >
        <Section title="Présentation">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Nom"
              required
              value={form.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (!slugTouched) set("slug", slugify(e.target.value));
              }}
            />
            <FormInput
              label="Identifiant"
              required
              value={form.slug}
              helper="Utilisé dans les liens d'inscription"
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </div>
          <FormTextarea
            label="Description"
            rows={2}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
          <ToggleSwitch
            label="Mettre en avant"
            description="Carte accentuée sur la page tarifs"
            checked={form.isHighlighted}
            onChange={(v) => set("isHighlighted", v)}
          />
          {form.isHighlighted && (
            <FormInput
              label="Mention de mise en avant"
              placeholder="Ex : Le plus choisi"
              value={form.highlightLabel ?? ""}
              onChange={(e) => set("highlightLabel", e.target.value)}
            />
          )}
        </Section>

        <Section title="Tarif">
          <ToggleSwitch
            label="Forfait sur devis"
            description="Pas d'inscription directe : le bouton renvoie vers le contact commercial"
            checked={form.isContactSales}
            onChange={(v) => set("isContactSales", v)}
          />
          {!form.isContactSales && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MoneyInput
                label="Mensuel HT"
                value={form.monthlyPriceCents}
                onChange={(v) => set("monthlyPriceCents", v ?? 0)}
              />
              <MoneyInput
                label="Annuel HT par mois"
                value={form.annualPriceCents}
                helper={annualDiscount > 0 ? `Remise de ${annualDiscount} %` : "Facturé 12 mois d'avance"}
                onChange={(v) => set("annualPriceCents", v ?? 0)}
              />
              <FormInput
                label="Essai (jours)"
                type="number"
                min={0}
                max={90}
                value={form.trialDays === null ? "" : String(form.trialDays)}
                placeholder="Durée plateforme"
                helper="Vide = durée par défaut"
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  set("trialDays", Number.isNaN(n) ? null : Math.min(90, Math.max(0, n)));
                }}
              />
            </div>
          )}
          <PercentInput
            label="Commission propre au forfait"
            nullable
            value={form.commissionRate}
            helper="Vide = taux plateforme. Un taux négocié par établissement reste prioritaire."
            onChange={(v) => set("commissionRate", v)}
          />
        </Section>

        <Section title="Limites">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <LimitInput label="Collaborateurs" value={form.maxStaff} onChange={(v) => set("maxStaff", v)} />
            <LimitInput
              label="Cabines et postes"
              value={form.maxResources}
              onChange={(v) => set("maxResources", v)}
            />
            <LimitInput label="Établissements" value={form.maxVenues} onChange={(v) => set("maxVenues", v)} />
          </div>
        </Section>

        <Section title="Fonctionnalités incluses">
          <div className="space-y-3">
            <FormCheckbox
              label="Rappels SMS automatiques"
              checked={form.includesSmsReminders}
              onChange={(e) => set("includesSmsReminders", e.target.checked)}
            />
            <FormCheckbox
              label="Statistiques de chiffre d'affaires"
              checked={form.includesAnalytics}
              onChange={(e) => set("includesAnalytics", e.target.checked)}
            />
            <FormCheckbox
              label="Mise en avant sur la marketplace"
              checked={form.includesPriorityListing}
              onChange={(e) => set("includesPriorityListing", e.target.checked)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              Arguments supplémentaires affichés sur la carte. N&apos;indiquez que des services réellement fournis.
            </p>
            {form.features.map((feature, index) => (
              <div key={feature} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-neutral-800 border border-neutral-200/80 rounded-lg px-3 py-2">
                  {feature}
                </span>
                <button
                  type="button"
                  aria-label={`Retirer ${feature}`}
                  onClick={() => set("features", form.features.filter((_, i) => i !== index))}
                  className="btn btn-ghost btn-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex-1">
                <FormInput
                  placeholder="Ex : Accompagnement à la prise en main"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
              </div>
              <button type="button" onClick={addFeature} className="btn btn-outline">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </Section>

        <Section title="Disponibilité">
          <ToggleSwitch
            label="Souscriptible"
            description="Désactivé : plus aucune nouvelle souscription, les abonnés actuels sont conservés"
            checked={form.isActive}
            onChange={(v) => set("isActive", v)}
          />
          <ToggleSwitch
            label="Affiché sur la page tarifs"
            description="Masqué : forfait attribuable uniquement par l'équipe Belora"
            checked={form.isPublic}
            onChange={(v) => set("isPublic", v)}
          />
          <FormInput
            label="Ordre d'affichage"
            type="number"
            min={0}
            value={String(form.order)}
            onChange={(e) => set("order", Math.max(0, parseInt(e.target.value, 10) || 0))}
          />
        </Section>
      </form>
    </Modal>
  );
}
