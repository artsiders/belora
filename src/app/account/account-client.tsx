"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, RotateCcw } from "lucide-react";

interface Appointment {
  id: string;
  venueName: string;
  venueSlug: string;
  venueImage: string;
  serviceName: string;
  artisanName: string;
  date: string;
  time: string;
  price: number;
  status: "confirmed" | "completed" | "cancelled";
  address: string;
}

const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    venueName: "L’Atelier Botanique",
    venueSlug: "atelier-botanique-paris",
    venueImage: "/images/venues/atelier-botanique.jpg",
    serviceName: "Coupe Signature à Sec & Rituel Botanique",
    artisanName: "Hélène de Valois",
    date: "Vendredi 24 octobre 2026",
    time: "14h00",
    price: 75,
    status: "confirmed",
    address: "18 Rue de Turenne, 75003 Paris",
  },
];

const PAST_APPOINTMENTS: Appointment[] = [
  {
    id: "app-2",
    venueName: "Maison Albar Institut & Spa",
    venueSlug: "maison-albar-soins",
    venueImage: "/images/venues/maison-albar.jpg",
    serviceName: "Grand Rituel Kobido Traditionnel",
    artisanName: "Nour Kaddour",
    date: "12 septembre 2026",
    time: "11h30",
    price: 115,
    status: "completed",
    address: "24 Rue de la République, 69002 Lyon",
  },
  {
    id: "app-3",
    venueName: "Le Salon Saint-Germain",
    venueSlug: "barbier-saint-germain",
    venueImage: "/images/venues/salon-saint-germain.jpg",
    serviceName: "Taille de Barbe & Soin Hydratant",
    artisanName: "Marc Sémard",
    date: "18 août 2026",
    time: "16h00",
    price: 38,
    status: "completed",
    address: "12 Place des Grands Hommes, 33000 Bordeaux",
  },
];

export function AccountClient() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "profile">("upcoming");
  const [cancelledId, setCancelledId] = useState<string | null>(null);

  return (
    <div className="container-belora py-10 sm:py-12">
      {/* En-tête profil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-primary-200/80">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-200 border border-primary-300 text-neutral-800 flex items-center justify-center font-display text-xl font-normal">
            SM
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-neutral-950">
              Sophie Martin
            </h1>
            <p className="text-xs text-neutral-500">
              sophie.martin@exemple.fr · Membre depuis 2026
            </p>
          </div>
        </div>

        <Link href="/search" className="btn btn-outline btn-sm self-start sm:self-auto">
          <span>Prendre un nouveau rendez-vous</span>
        </Link>
      </div>

      {/* Navigation par onglets sobres */}
      <div className="flex items-center gap-6 border-b border-primary-200/80 mb-8 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${
            activeTab === "upcoming"
              ? "text-neutral-950 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          À venir ({UPCOMING_APPOINTMENTS.filter((a) => a.id !== cancelledId).length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("past")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${
            activeTab === "past"
              ? "text-neutral-950 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Historique ({PAST_APPOINTMENTS.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${
            activeTab === "profile"
              ? "text-neutral-950 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          Mes informations
        </button>
      </div>

      {/* Contenu de l'onglet actif */}
      {activeTab === "upcoming" && (
        <div className="space-y-4 max-w-3xl">
          {UPCOMING_APPOINTMENTS.filter((a) => a.id !== cancelledId).length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-primary-50/10 border border-primary-300 space-y-3">
              <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="font-display text-xl text-neutral-950">
                Aucun rendez-vous à venir
              </h3>
              <p className="text-xs text-neutral-600">
                Explorez nos maisons recommandées et sanctuarisez votre prochain rituel.
              </p>
              <Link href="/search" className="btn btn-primary btn-sm inline-block mt-2">
                Réserver un soin
              </Link>
            </div>
          ) : (
            UPCOMING_APPOINTMENTS.filter((a) => a.id !== cancelledId).map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-primary-50/10 border border-primary-300 shadow-2xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                    <Image
                      src={app.venueImage}
                      alt={app.venueName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded inline-block mb-1">
                      Confirmé
                    </span>
                    <h3 className="text-base font-semibold text-neutral-950">
                      {app.serviceName}
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium">
                      chez {app.venueName} · avec {app.artisanName}
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{app.date} à {app.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-primary-200">
                  <span className="font-display text-xl text-neutral-950 num">
                    {app.price} €
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/venue/${app.venueSlug}`}
                      className="btn btn-outline btn-xs"
                    >
                      Détails
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCancelledId(app.id)}
                      className="btn btn-ghost btn-xs text-rose-700 hover:bg-rose-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "past" && (
        <div className="space-y-4 max-w-3xl">
          {PAST_APPOINTMENTS.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-xl bg-primary-50/10 border border-primary-200/80 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                  <Image
                    src={app.venueImage}
                    alt={app.venueName}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-neutral-950">
                    {app.serviceName}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    {app.venueName} · {app.date}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Réalisé par {app.artisanName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-semibold text-neutral-800 num">
                  {app.price} €
                </span>
                <Link
                  href={`/book/${app.venueSlug}`}
                  className="btn btn-outline btn-xs inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réserver à nouveau</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="max-w-xl p-6 rounded-xl bg-primary-50/10 border border-primary-300 space-y-5">
          <h2 className="font-display text-xl text-neutral-950 mb-4">
            Coordonnées personnelles
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="label mb-1 block">Nom complet</label>
              <input
                type="text"
                defaultValue="Sophie Martin"
                className="input"
              />
            </div>
            <div>
              <label className="label mb-1 block">Adresse e-mail</label>
              <input
                type="email"
                defaultValue="sophie.martin@exemple.fr"
                className="input"
              />
            </div>
            <div>
              <label className="label mb-1 block">Numéro de téléphone</label>
              <input
                type="tel"
                defaultValue="06 12 34 56 78"
                className="input"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-primary-200/80 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Modifications enregistrées automatiquement
            </span>
            <button type="button" className="btn btn-primary btn-xs">
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
