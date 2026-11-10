"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Save, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pro-dashboard/ui/form-controls";
import { FormattedCashSettings } from "@/modules/pro/settings.service";

export default function CashRegisterSettingsPage() {
  const queryClient = useQueryClient();

  const {
    data: cashSettings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pro", "settings", "cash-register"],
    queryFn: async () => {
      const res = await apiClient.get<{ settings: FormattedCashSettings }>(
        "/pro/settings/cash-register"
      );
      return res.data.settings;
    },
    staleTime: 60_000,
  });

  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptCheck, setAcceptCheck] = useState(false);
  const [ticketFooter, setTicketFooter] = useState(
    "Merci de votre visite et de votre confiance. Prenez soin de vous !"
  );

  useEffect(() => {
    if (cashSettings) {
      setAcceptCard(cashSettings.acceptCard);
      setAcceptCash(cashSettings.acceptCash);
      setAcceptCheck(cashSettings.acceptCheck);
      setTicketFooter(cashSettings.ticketFooter);
    }
  }, [cashSettings]);

  const updateMutation = useMutation({
    mutationFn: async (payload: FormattedCashSettings) => {
      const res = await apiClient.patch<{ settings: FormattedCashSettings }>(
        "/pro/settings/cash-register",
        payload
      );
      return res.data.settings;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["pro", "settings", "cash-register"], updated);
      toast.success("Paramètres de caisse enregistrés.");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement des paramètres.";
      toast.error(msg);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      acceptCard,
      acceptCash,
      acceptCheck,
      ticketFooter,
    });
  };

  const hasError = isError || Boolean(error);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
      {/* Titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Paramètres Caisse & Règlements
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Modes de paiement acceptés, taux de TVA et personnalisation du reçu.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending || isLoading}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>
            {updateMutation.isPending
              ? "Enregistrement..."
              : "Enregistrer les paramètres"}
          </span>
        </button>
      </div>

      {/* Erreur */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger les paramètres de caisse.</span>
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

      {isLoading ? (
        <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-4">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-20 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Moyens de Paiement */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <CreditCard className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Moyens de paiement acceptés au salon
              </h2>
            </div>

            <div className="space-y-3">
              <FormCheckbox
                label="Carte bancaire (TPE physique)"
                description="Activer l'encaissement CB rapide sur le terminal de vente."
                checked={acceptCard}
                onChange={(e) => setAcceptCard(e.target.checked)}
              />

              <FormCheckbox
                label="Espèces (Tiroir-caisse)"
                description="Permet le calcul automatique du rendu de monnaie lors du passage en caisse."
                checked={acceptCash}
                onChange={(e) => setAcceptCash(e.target.checked)}
              />

              <FormCheckbox
                label="Chèques bancaires"
                description="Autoriser le règlement par chèque avec numéro d'identification."
                checked={acceptCheck}
                onChange={(e) => setAcceptCheck(e.target.checked)}
              />
            </div>
          </div>

          {/* Taux de TVA */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Taux de TVA applicables
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <FormInput
                label="Taux standard prestations & revente (%)"
                defaultValue="20.0"
                disabled
                helper="Taux légal en vigueur sur les prestations de coiffure et esthétique en France métropolitaine."
              />
            </div>
          </div>

          {/* Personnalisation Reçu / Ticket */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
              Personnalisation du Reçu Client
            </h2>

            <FormTextarea
              label="Message de bas de ticket"
              helper="Ce texte apparaît au bas des reçus imprimés et envoyés par e-mail à vos clients."
              value={ticketFooter}
              onChange={(e) => setTicketFooter(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn btn-primary btn-lg"
            >
              <span>
                {updateMutation.isPending
                  ? "Enregistrement en cours..."
                  : "Enregistrer les préférences"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
