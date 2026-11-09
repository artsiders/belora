"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  FormInput,
  FormTextarea,
  Checkbox,
} from "@/components/pro-dashboard/ui/form-controls";
import { MOCK_ESTABLISHMENT, ProEstablishment } from "@/lib/data/pro-mock-data";

export default function EstablishmentSettingsPage() {
  const [establishment, setEstablishment] =
    useState<ProEstablishment>(MOCK_ESTABLISHMENT);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleOpeningHourChange = (
    dayIndex: number,
    field: "isOpen" | "openTime" | "closeTime",
    value: boolean | string
  ) => {
    setEstablishment((prev) => ({
      ...prev,
      openingHours: prev.openingHours.map((oh) =>
        oh.dayIndex === dayIndex ? { ...oh, [field]: value } : oh
      ),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-4xl">
      {/* Toast de sauvegarde */}
      {savedNotification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Paramètres de l&apos;établissement enregistrés avec succès.</span>
        </div>
      )}

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
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Enregistrer les paramètres</span>
        </button>
      </div>

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
              value={establishment.name}
              onChange={(e) =>
                setEstablishment({ ...establishment, name: e.target.value })
              }
              required
            />
            <FormInput
              label="Activité principale"
              value={establishment.category}
              onChange={(e) =>
                setEstablishment({ ...establishment, category: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Numéro SIRET"
              value={establishment.siret}
              onChange={(e) =>
                setEstablishment({ ...establishment, siret: e.target.value })
              }
              required
            />
            <FormInput
              label="Numéro de TVA Intracommunautaire"
              value={establishment.vatNumber}
              onChange={(e) =>
                setEstablishment({
                  ...establishment,
                  vatNumber: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Téléphone public"
              type="tel"
              value={establishment.phone}
              onChange={(e) =>
                setEstablishment({ ...establishment, phone: e.target.value })
              }
              required
            />
            <FormInput
              label="Adresse e-mail publique"
              type="email"
              value={establishment.email}
              onChange={(e) =>
                setEstablishment({ ...establishment, email: e.target.value })
              }
              required
            />
          </div>

          <FormTextarea
            label="Présentation éditoriale de l'atelier"
            helper="Affichée en tête de votre fiche publique sur Belora"
            value={establishment.description}
            onChange={(e) =>
              setEstablishment({
                ...establishment,
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
            value={establishment.address}
            onChange={(e) =>
              setEstablishment({ ...establishment, address: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Code Postal"
              value={establishment.postalCode}
              onChange={(e) =>
                setEstablishment({
                  ...establishment,
                  postalCode: e.target.value,
                })
              }
              required
            />
            <FormInput
              label="Ville"
              value={establishment.city}
              onChange={(e) =>
                setEstablishment({ ...establishment, city: e.target.value })
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
            {establishment.openingHours.map((oh) => (
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
            SECTION 4 : POLITIQUES DE RÉSERVATION & STRIPE CONNECT
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
              value={establishment.cancellationDelayHours}
              onChange={(e) =>
                setEstablishment({
                  ...establishment,
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
              value={establishment.depositPercentage}
              onChange={(e) =>
                setEstablishment({
                  ...establishment,
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
            className="btn btn-primary btn-lg"
          >
            <span>Enregistrer toutes les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
}
