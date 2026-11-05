"use client";

import React, { useState } from "react";
import { CreditCard, Save, CheckCircle2 } from "lucide-react";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pro-dashboard/ui/form-controls";

export default function CashRegisterSettingsPage() {
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptCheck, setAcceptCheck] = useState(false);
  const [ticketFooter, setTicketFooter] = useState(
    "Merci de votre visite et de votre confiance. Prenez soin de vous !"
  );
  const [notification, setNotification] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Paramètres de caisse enregistrés.");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl">
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
            Paramètres Caisse & Règlements
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Modes de paiement acceptés, taux de TVA et personnalisation du reçu.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto rounded-xl shadow-2xs"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les paramètres</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Moyens de Paiement */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
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
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
            Taux de TVA applicables
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <FormInput
              label="Taux standard prestations & revente (%)"
              defaultValue="20.0"
              disabled
              helper="Fixé selon la réglementation fiscale française"
            />
            <FormInput
              label="Taux réduit soins spécifiques (%)"
              defaultValue="5.5"
              disabled
            />
          </div>
        </div>

        {/* Mentions sur le Ticket de Caisse */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
            Personnalisation du ticket de caisse
          </h2>

          <FormTextarea
            label="Message de bas de ticket"
            value={ticketFooter}
            onChange={(e) => setTicketFooter(e.target.value)}
            helper="Imprimé ou envoyé par e-mail au client à chaque règlement"
          />
        </div>
      </form>
    </div>
  );
}
