"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Venue, Service } from "@/lib/data/venues";
import {
  Check,
  ChevronRight,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface BookClientProps {
  venue: Venue;
}

const AVAILABLE_DAYS = [
  { date: "Mardi 21 oct.", label: "Aujourd'hui", dayCode: "2026-10-21" },
  { date: "Mercredi 22 oct.", label: "Demain", dayCode: "2026-10-22" },
  { date: "Jeudi 23 oct.", label: "Jeu.", dayCode: "2026-10-23" },
  { date: "Vendredi 24 oct.", label: "Ven.", dayCode: "2026-10-24" },
  { date: "Samedi 25 oct.", label: "Sam.", dayCode: "2026-10-25" },
];

const TIME_SLOTS = [
  "10h00",
  "11h15",
  "14h00",
  "15h30",
  "16h45",
  "18h00",
];

export function BookClient({ venue }: BookClientProps) {
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service");

  // Sélection des services
  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    if (initialServiceId) {
      const s = venue.services.find((item) => item.id === initialServiceId);
      if (s) return [s];
    }
    return [venue.services[0]];
  });

  // Étape actuelle : 1: Prestations, 2: Artisan, 3: Date & Heure, 4: Coordonnées & Validation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialServiceId ? 2 : 1);

  // Artisan
  const [selectedArtisan, setSelectedArtisan] = useState<string>("any");

  // Date et Créneau
  const [selectedDay, setSelectedDay] = useState<string>(AVAILABLE_DAYS[0].date);
  const [selectedSlot, setSelectedSlot] = useState<string>("14h00");

  // Formulaire client
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Calculs totaux
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalPrice = selectedServices.reduce((acc, s) => acc + s.priceEuros, 0);

  const toggleService = (service: Service) => {
    const exists = selectedServices.some((s) => s.id === service.id);
    if (exists) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase font-semibold text-primary-700 tracking-wider block mb-2">
          Réservation Confirmée
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-sand-950 mb-3">
          Votre moment est sanctuarisé
        </h1>

        <p className="text-xs sm:text-sm text-sand-600 mb-8 leading-relaxed max-w-md mx-auto">
          Un e-mail de confirmation et un SMS de rappel vous ont été envoyés. {venue.name} vous attend le{" "}
          <strong className="text-sand-950">{selectedDay}</strong> à{" "}
          <strong className="text-sand-950">{selectedSlot}</strong>.
        </p>

        {/* Récapitulatif du rendez-vous */}
        <div className="p-6 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 text-left mb-8 space-y-4">
          <div className="border-b border-sand-200/80 pb-3">
            <h3 className="font-display text-lg text-sand-950">{venue.name}</h3>
            <p className="text-xs text-sand-500">{venue.address}</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-sand-500">Soins réservés :</div>
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between font-medium text-sand-900">
                <span>{s.name} ({s.durationMinutes} min)</span>
                <span className="num">{s.priceEuros} €</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-sand-200/80 flex justify-between text-xs font-semibold text-sand-950">
            <span>Total à régler sur place</span>
            <span className="text-sm num">{totalPrice} €</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/account" className="btn btn-primary btn-sm w-full sm:w-auto">
            Voir mes rendez-vous
          </Link>
          <Link href="/" className="btn btn-outline btn-sm w-full sm:w-auto">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-belora py-10">
      {/* En-tête du tunnel */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-sand-200/80">
        <div>
          <Link
            href={`/venue/${venue.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-sand-500 hover:text-sand-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la maison {venue.name}</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl text-sand-950">
            Réservation chez {venue.name}
          </h1>
        </div>

        {/* Indicateur d'étape */}
        <div className="text-xs text-sand-500 hidden sm:block num">
          Étape <strong className="text-sand-900">{step}</strong> sur 4
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Colonne Gauche : Formulaire par étapes (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Étape 1 : Choix des prestations */}
          <div className={`p-6 rounded-[var(--radius-sm)] bg-sand-50 border transition-all ${step === 1 ? "border-sand-400 shadow-sm" : "border-sand-200/80"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sand-900 text-sand-50 text-xs flex items-center justify-center font-medium">
                  1
                </span>
                <h2 className="font-display text-xl text-sand-950">
                  Sélectionnez vos soins
                </h2>
              </div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  Modifier
                </button>
              )}
            </div>

            {step === 1 ? (
              <div className="space-y-3">
                {venue.services.map((service) => {
                  const isChecked = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-[var(--radius-sm)] border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? "bg-sand-100/70 border-sand-900"
                          : "bg-sand-50 border-sand-200 hover:border-sand-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-[var(--radius-xs)] border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? "bg-sand-950 border-sand-950 text-sand-50"
                              : "border-sand-300 bg-sand-50"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-semibold text-sand-950">
                            {service.name}
                          </h3>
                          <p className="text-xs text-sand-500 flex items-center gap-2 mt-0.5 num">
                            <span>{service.durationMinutes} min</span>
                            <span>•</span>
                            <span>{service.category}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-sand-950 num shrink-0">
                        {service.priceEuros} €
                      </span>
                    </div>
                  );
                })}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                  >
                    <span>Continuer vers le praticien</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-sand-700 space-y-1">
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.name} ({s.durationMinutes} min)</span>
                    <span className="font-semibold text-sand-900 num">{s.priceEuros} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Étape 2 : Choix du praticien */}
          <div className={`p-6 rounded-[var(--radius-sm)] bg-sand-50 border transition-all ${step === 2 ? "border-sand-400 shadow-sm" : "border-sand-200/80"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sand-900 text-sand-50 text-xs flex items-center justify-center font-medium">
                  2
                </span>
                <h2 className="font-display text-xl text-sand-950">
                  Choisissez votre artisan
                </h2>
              </div>
              {step > 2 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  Modifier
                </button>
              )}
            </div>

            {step === 2 && (
              <div className="space-y-3">
                {/* Option Sans Préférence */}
                <div
                  onClick={() => setSelectedArtisan("any")}
                  className={`p-4 rounded-[var(--radius-sm)] border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedArtisan === "any"
                      ? "bg-sand-100/70 border-sand-900"
                      : "bg-sand-50 border-sand-200 hover:border-sand-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-sand-200 text-sand-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-sand-950">
                      Sans préférence
                    </h3>
                    <p className="text-xs text-sand-500">
                      Premier artisan d’excellence disponible
                    </p>
                  </div>
                </div>

                {/* Liste des membres de l'équipe */}
                {venue.team.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedArtisan(member.id)}
                    className={`p-4 rounded-[var(--radius-sm)] border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedArtisan === member.id
                        ? "bg-sand-100/70 border-sand-900"
                        : "bg-sand-50 border-sand-200 hover:border-sand-300"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-sand-200 shrink-0">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-sand-950">
                        {member.name}
                      </h3>
                      <p className="text-xs text-primary-700 font-medium">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                  >
                    <span>Choisir la date & l’heure</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step > 2 && (
              <p className="text-xs text-sand-700">
                Praticien :{" "}
                <strong className="text-sand-900">
                  {selectedArtisan === "any"
                    ? "Sans préférence (premier disponible)"
                    : venue.team.find((m) => m.id === selectedArtisan)?.name}
                </strong>
              </p>
            )}
          </div>

          {/* Étape 3 : Date & Créneau horaire */}
          <div className={`p-6 rounded-[var(--radius-sm)] bg-sand-50 border transition-all ${step === 3 ? "border-sand-400 shadow-sm" : "border-sand-200/80"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sand-900 text-sand-50 text-xs flex items-center justify-center font-medium">
                  3
                </span>
                <h2 className="font-display text-xl text-sand-950">
                  Date & heure du rendez-vous
                </h2>
              </div>
              {step > 3 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-primary-700 hover:underline font-medium"
                >
                  Modifier
                </button>
              )}
            </div>

            {step === 3 && (
              <div className="space-y-6">
                {/* Sélecteur de jour */}
                <div>
                  <span className="text-xs text-sand-500 font-medium block mb-2">
                    Choisissez votre jour :
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {AVAILABLE_DAYS.map((d) => (
                      <button
                        key={d.date}
                        type="button"
                        onClick={() => setSelectedDay(d.date)}
                        className={`p-3 rounded-[var(--radius-sm)] border text-center transition-all cursor-pointer ${
                          selectedDay === d.date
                            ? "bg-sand-950 text-sand-50 border-sand-950"
                            : "bg-sand-50 border-sand-200 text-sand-800 hover:border-sand-400"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider block opacity-75">
                          {d.label}
                        </span>
                        <span className="text-xs font-semibold block mt-0.5">
                          {d.date.split(" ")[0]} {d.date.split(" ")[1]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sélecteur de créneau horaire */}
                <div>
                  <span className="text-xs text-sand-500 font-medium block mb-2">
                    Créneaux disponibles le {selectedDay} :
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-[var(--radius-sm)] border text-xs font-semibold transition-all num cursor-pointer ${
                          selectedSlot === slot
                            ? "bg-primary-600 text-sand-50 border-primary-600 shadow-2xs"
                            : "bg-sand-50 border-sand-200 text-sand-900 hover:border-sand-400"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                  >
                    <span>Confirmer mes coordonnées</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step > 3 && (
              <p className="text-xs text-sand-700">
                Créneau : <strong className="text-sand-900">{selectedDay} à {selectedSlot}</strong>
              </p>
            )}
          </div>

          {/* Étape 4 : Coordonnées & Validation */}
          <div className={`p-6 rounded-[var(--radius-sm)] bg-sand-50 border transition-all ${step === 4 ? "border-sand-400 shadow-sm" : "border-sand-200/80"}`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-sand-900 text-sand-50 text-xs flex items-center justify-center font-medium">
                4
              </span>
              <h2 className="font-display text-xl text-sand-950">
                Vos coordonnées
              </h2>
            </div>

            {step === 4 && (
              <form onSubmit={handleConfirm} className="space-y-4">
                <div>
                  <label className="label mb-1 block">Nom et prénom complet</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Sophie Martin"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label mb-1 block">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="sophie@exemple.fr"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label mb-1 block">Numéro de mobile (SMS de rappel)</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="input"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded bg-sand-100/70 border border-sand-200/80 text-xs text-sand-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Aucun prépaiement requis aujourd’hui. Vous règlerez directement auprès de l’artisan lors de votre venue. Annulation sans frais jusqu’à 24h avant le créneau.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary py-3 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span>Confirmer mon rendez-vous ({totalPrice} €)</span>
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Colonne Droite : Récapitulatif collant (4 cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="p-6 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary-700 block mb-1">
                Récapitulatif de réservation
              </span>
              <h3 className="font-display text-xl text-sand-950">{venue.name}</h3>
              <p className="text-xs text-sand-500">{venue.address}</p>
            </div>

            <div className="pt-4 border-t border-sand-200/80 space-y-3">
              <div className="text-xs font-semibold text-sand-900">
                Prestations choisies ({selectedServices.length}) :
              </div>
              <div className="space-y-2">
                {selectedServices.map((s) => (
                  <div key={s.id} className="text-xs flex justify-between">
                    <span className="text-sand-700">{s.name}</span>
                    <span className="font-semibold text-sand-950 num shrink-0">
                      {s.priceEuros} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200/80 space-y-2 text-xs text-sand-600">
              <div className="flex items-center justify-between">
                <span>Durée estimée</span>
                <span className="font-semibold text-sand-900 num">{totalDuration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Date & heure</span>
                <span className="font-semibold text-sand-900">{selectedDay} · {selectedSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Artisan</span>
                <span className="font-semibold text-sand-900">
                  {selectedArtisan === "any" ? "Sans préférence" : venue.team.find((m) => m.id === selectedArtisan)?.name}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200/80 flex items-center justify-between text-sand-950">
              <span className="text-xs font-semibold">Total à régler</span>
              <span className="font-display text-2xl num">{totalPrice} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
