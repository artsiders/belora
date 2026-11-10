"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Mail,
  Smartphone,
  Save,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  FormTextarea,
  ToggleSwitch,
} from "@/components/pro-dashboard/ui/form-controls";
import { FormattedNotificationSettings } from "@/modules/pro/settings.service";

export default function NotificationsSettingsPage() {
  const queryClient = useQueryClient();

  const {
    data: notifSettings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pro", "settings", "notifications"],
    queryFn: async () => {
      const res = await apiClient.get<{
        settings: FormattedNotificationSettings;
      }>("/pro/settings/notifications");
      return res.data.settings;
    },
    staleTime: 60_000,
  });

  const [emailConfirmEnabled, setEmailConfirmEnabled] = useState(true);
  const [sms24hEnabled, setSms24hEnabled] = useState(true);
  const [sms2hEnabled, setSms2hEnabled] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(
    "Bonjour {client_name}, votre rendez-vous chez {venue_name} pour {service_name} est confirmé le {date} à {time}. En cas d'empêchement, vous pouvez modifier votre créneau ici : {link}"
  );

  useEffect(() => {
    if (notifSettings) {
      setEmailConfirmEnabled(notifSettings.emailConfirmEnabled);
      setSms24hEnabled(notifSettings.sms24hEnabled);
      setSms2hEnabled(notifSettings.sms2hEnabled);
      setSmsTemplate(notifSettings.smsTemplate);
    }
  }, [notifSettings]);

  const updateMutation = useMutation({
    mutationFn: async (payload: FormattedNotificationSettings) => {
      const res = await apiClient.patch<{
        settings: FormattedNotificationSettings;
      }>("/pro/settings/notifications", payload);
      return res.data.settings;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["pro", "settings", "notifications"], updated);
      toast.success("Paramètres des notifications et SMS enregistrés.");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'enregistrement des notifications.";
      toast.error(msg);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      emailConfirmEnabled,
      sms24hEnabled,
      sms2hEnabled,
      smsTemplate,
    });
  };

  // Aperçu dynamique
  const previewSms = smsTemplate
    .replace("{client_name}", "Sophie")
    .replace("{venue_name}", "L’Atelier Botanique")
    .replace("{service_name}", "Coupe Signature")
    .replace("{date}", "Mardi 24 Oct.")
    .replace("{time}", "14h00")
    .replace("{link}", "belora.com/r/b9f2");

  const hasError = isError || Boolean(error);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl">
      {/* Titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            SMS & E-mails de rappels
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Automatisez la confirmation et les rappels pour éliminer les rendez-vous manqués.
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
              : "Enregistrer les modèles"}
          </span>
        </button>
      </div>

      {/* Erreur */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger les paramètres de notification.</span>
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
          <div className="h-24 bg-slate-100 rounded animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Déclencheurs de Rappels */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <Mail className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Déclencheurs automatiques
              </h2>
            </div>

            <div className="divide-y divide-neutral-100 space-y-4">
              <div className="pt-2">
                <ToggleSwitch
                  label="E-mail de confirmation immédiate"
                  description="Envoyé dès la réservation en ligne ou la prise de rendez-vous manuelle."
                  checked={emailConfirmEnabled}
                  onChange={setEmailConfirmEnabled}
                />
              </div>

              <div className="pt-4">
                <ToggleSwitch
                  label="Rappel par SMS à J-1 (24h avant le créneau)"
                  description="Réduit le taux de non-présentation de plus de 80%."
                  checked={sms24hEnabled}
                  onChange={setSms24hEnabled}
                />
              </div>

              <div className="pt-4">
                <ToggleSwitch
                  label="Rappel SMS d'urgence à H-2 (2 heures avant)"
                  description="Recommandé pour les prestations techniques longues (balayages, colorations)."
                  checked={sms2hEnabled}
                  onChange={setSms2hEnabled}
                />
              </div>
            </div>
          </div>

          {/* Modèle de SMS & Aperçu Réaliste */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <MessageSquare className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Personnalisation du modèle SMS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Éditeur de modèle */}
              <div className="space-y-3">
                <FormTextarea
                  label="Texte du message"
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  rows={6}
                />

                <div className="text-xs text-neutral-500 space-y-1">
                  <span className="font-semibold text-neutral-700 block">
                    Variables dynamiques disponibles :
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{client_name}"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{venue_name}"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{service_name}"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{date}"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{time}"}
                    </span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-800">
                      {"{link}"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aperçu Téléphone Mobile */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Aperçu smartphone client</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200">
                  <div className="p-3.5 rounded-xl bg-white shadow-2xs border border-neutral-200 text-sm text-neutral-800 leading-relaxed font-sans">
                    {previewSms}
                  </div>
                  <div className="text-right text-[11px] text-neutral-400 mt-1.5 font-medium">
                    Expéditeur : Belora &bull; Aujourd&apos;hui à 10:42
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="btn btn-primary btn-lg"
            >
              <span>
                {updateMutation.isPending
                  ? "Enregistrement en cours..."
                  : "Enregistrer les modèles de notifications"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
