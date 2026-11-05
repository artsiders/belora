"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Smartphone,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  FormTextarea,
  ToggleSwitch,
} from "@/components/pro-dashboard/ui/form-controls";

export default function NotificationsSettingsPage() {
  const [emailConfirmEnabled, setEmailConfirmEnabled] = useState(true);
  const [sms24hEnabled, setSms24hEnabled] = useState(true);
  const [sms2hEnabled, setSms2hEnabled] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(
    "Bonjour {client_name}, votre rendez-vous chez {venue_name} pour {service_name} est confirmé le {date} à {time}. En cas d'empêchement, vous pouvez modifier votre créneau ici : {link}"
  );

  const [notification, setNotification] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Paramètres des notifications et SMS enregistrés.");
    setTimeout(() => setNotification(null), 3000);
  };

  // Aperçu dynamique
  const previewSms = smsTemplate
    .replace("{client_name}", "Sophie")
    .replace("{venue_name}", "L’Atelier Botanique")
    .replace("{service_name}", "Coupe Signature")
    .replace("{date}", "Mardi 24 Oct.")
    .replace("{time}", "14h00")
    .replace("{link}", "belora.com/r/b9f2");

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

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
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto rounded-xl shadow-2xs"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les modèles</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Déclencheurs de Rappels */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-5">
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
                label="Rappel d'urgence par SMS à H-2 (2 heures avant)"
                description="Idéal pour les salons de centre-ville et les réservations du jour."
                checked={sms2hEnabled}
                onChange={setSms2hEnabled}
              />
            </div>
          </div>
        </div>

        {/* Modèle de SMS Personnalisable & Aperçu */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
              <MessageSquare className="w-4.5 h-4.5 text-primary-700" />
              <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
                Modèle de SMS de rappel
              </h2>
            </div>

            <FormTextarea
              label="Contenu du SMS"
              value={smsTemplate}
              onChange={(e) => setSmsTemplate(e.target.value)}
              helper="Variables disponibles : {client_name}, {venue_name}, {service_name}, {date}, {time}, {link}"
            />
          </div>

          {/* Mock Aperçu Téléphone Mobile */}
          <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl bg-neutral-900 text-white shadow-md flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-800 text-xs text-neutral-400">
                <Smartphone className="w-4 h-4 text-primary-300" />
                <span>Aperçu sur le mobile du client</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700 text-xs text-neutral-100 leading-relaxed font-sans shadow-sm">
                <p className="font-semibold text-primary-200 mb-1">BELORA</p>
                <p>{previewSms}</p>
              </div>
            </div>

            <span className="text-sm text-neutral-500 pt-4 block">
              Expéditeur affiché : Belora • Conforme réglementation ARCEP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
