"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  FormInput,
  FormTextarea,
  Checkbox,
} from "@/components/pro-dashboard/ui/form-controls";
import { FormattedEstablishment } from "@/modules/pro/settings.service";

export default function EstablishmentSettingsPage() {
  const queryClient = useQueryClient();

  const {
    data: establishmentData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pro", "settings", "establishment"],
    queryFn: async () => {
      const res = await apiClient.get<{ establishment: FormattedEstablishment }>(
        "/pro/settings/establishment"
      );
      return res.data.establishment;
    },
    staleTime: 60_000,
  });

  const [formState, setFormState] = useState<FormattedEstablishment | null>(null);

  useEffect(() => {
    if (establishmentData) {
      setFormState(establishmentData);
    }
  }, [establishmentData]);

  const updateMutation = useMutation({
    mutationFn: async (payload: FormattedEstablishment) => {
      const res = await apiClient.patch<{ establishment: FormattedEstablishment }>(
        "/pro/settings/establishment",
        payload
      );
      return res.data.establishment;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["pro", "settings", "establishment"], updated);
      setFormState(updated);
      toast.success("Paramètres de l'établissement enregistrés avec succès.");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement des paramètres.";
      toast.error(msg);
    },
  });

  const handleOpeningHourChange = (
    dayIndex: number,
    field: "isOpen" | "openTime" | "closeTime",
    value: boolean | string
  ) => {
    if (!formState) return;
    setFormState({
      ...formState,
      openingHours: formState.openingHours.map((oh) =>
        oh.dayIndex === dayIndex ? { ...oh, [field]: value } : oh
      ),
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    updateMutation.mutate(formState);
  };

  const hasError = isError || Boolean(error);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Paramètres Établissement
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Identité légale, adresse, horaires d&apos;ouverture et conditions de réservation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading || !formState}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>
            {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
          </span>
        </button>
      </div>

      {/* État d'erreur */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger les paramètres de l&apos;établissement.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn btn-outline btn-xs flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* Chargement chirurgical inline */}
      {isLoading || !formState ? (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-4">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* ===================================================================
              SECTION 1 : IDENTITÉ LÉGALE & CONTACT
              =================================================================== */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Building2 className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Identité légale & Coordonnées
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Nom commercial de l'établissement"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                required
              />
              <FormInput
                label="Activité principale"
                value={formState.category}
                onChange={(e) =>
                  setFormState({ ...formState, category: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Numéro SIRET"
                value={formState.siret}
                onChange={(e) =>
                  setFormState({ ...formState, siret: e.target.value })
                }
                required
              />
              <FormInput
                label="Numéro de TVA Intracommunautaire"
                value={formState.vatNumber}
                onChange={(e) =>
                  setFormState({ ...formState, vatNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Téléphone public"
                type="tel"
                value={formState.phone}
                onChange={(e) =>
                  setFormState({ ...formState, phone: e.target.value })
                }
                required
              />
              <FormInput
                label="Adresse e-mail publique"
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                required
              />
            </div>

            <FormTextarea
              label="Présentation éditoriale de l'atelier"
              helper="Affichée en tête de votre fiche publique sur Belora"
              value={formState.description}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* ===================================================================
              SECTION 2 : ADRESSE PHYSIQUE
              =================================================================== */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <MapPin className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Localisation & Accès
              </h2>
            </div>

            <FormInput
              label="Adresse postale"
              value={formState.address}
              onChange={(e) =>
                setFormState({ ...formState, address: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Code Postal"
                value={formState.postalCode}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    postalCode: e.target.value,
                  })
                }
                required
              />
              <FormInput
                label="Ville"
                value={formState.city}
                onChange={(e) =>
                  setFormState({ ...formState, city: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* ===================================================================
              SECTION 3 : HORAIRES D'OUVERTURE HEBDOMADAIRES
              =================================================================== */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Clock className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Horaires d&apos;ouverture hebdomadaires
              </h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {formState.openingHours.map((oh) => (
                <div
                  key={oh.day}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                >
                  <div className="w-28 font-bold text-neutral-900 text-sm">
                    {oh.day}
                  </div>

                  <div className="flex items-center gap-4">
                    <label
                      htmlFor={`day-${oh.day}`}
                      className="group flex items-center gap-2 cursor-pointer select-none"
                    >
                      <Checkbox
                        id={`day-${oh.day}`}
                        checked={oh.isOpen}
                        onChange={(e) =>
                          handleOpeningHourChange(
                            oh.dayIndex,
                            "isOpen",
                            e.target.checked
                          )
                        }
                      />
                      <span className="text-sm font-semibold text-neutral-800">
                        {oh.isOpen ? "Ouvert" : "Fermé"}
                      </span>
                    </label>

                    {oh.isOpen ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={oh.openTime}
                          onChange={(e) =>
                            handleOpeningHourChange(
                              oh.dayIndex,
                              "openTime",
                              e.target.value
                            )
                          }
                          className="input input-sm font-semibold"
                        />
                        <span className="text-neutral-400 font-medium">à</span>
                        <input
                          type="time"
                          value={oh.closeTime}
                          onChange={(e) =>
                            handleOpeningHourChange(
                              oh.dayIndex,
                              "closeTime",
                              e.target.value
                            )
                          }
                          className="input input-sm font-semibold"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400 italic">
                        Journée de fermeture
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================================
              SECTION 4 : POLITIQUES DE RÉSERVATION & ACOMPTES
              =================================================================== */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <ShieldCheck className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Politiques d&apos;annulation & Acomptes en ligne
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                type="number"
                label="Délai d'annulation gratuite (en heures)"
                helper="Exemple : 24 pour autoriser l'annulation sans frais jusqu'à 24h avant"
                value={formState.cancellationDelayHours}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    cancellationDelayHours: Number(e.target.value),
                  })
                }
                min={0}
                step={1}
              />

              <FormInput
                type="number"
                label="Pourcentage d'acompte par défaut (%)"
                helper="Sécurise vos réservations contre les no-shows via Stripe Connect"
                value={formState.depositPercentage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    depositPercentage: Number(e.target.value),
                  })
                }
                min={0}
                max={100}
                step={5}
              />
            </div>
          </div>

          {/* Bouton de soumission en bas */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary btn-lg"
            >
              <span>
                {updateMutation.isPending
                  ? "Enregistrement en cours..."
                  : "Enregistrer toutes les modifications"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
