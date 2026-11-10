"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Venue, Service } from "@/lib/data/venues";
import { apiClient } from "@/lib/api-client";
import {
  Check,
  ChevronRight,
  ArrowLeft,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";

interface BookClientProps {
  venue: Venue;
}

// Générateur de dates dynamiques pour les 10 prochains jours
function generateUpcomingDays() {
  const days: { label: string; dateLabel: string; dayCode: string }[] = [];
  const dayNames = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const monthNames = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

  const now = new Date();
  for (let i = 1; i <= 10; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dayCode = d.toISOString().split("T")[0];
    const isTomorrow = i === 1;

    days.push({
      label: isTomorrow ? "Demain" : dayNames[d.getDay()],
      dateLabel: `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`,
      dayCode,
    });
  }
  return days;
}

export function BookClient({ venue }: BookClientProps) {
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get("service");

  const upcomingDays = useMemo(() => generateUpcomingDays(), []);

  // 1. Sélection des prestations
  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    if (initialServiceId) {
      const s = venue.services.find((item) => item.id === initialServiceId);
      if (s) return [s];
    }
    return venue.services.length > 0 ? [venue.services[0]] : [];
  });

  // Étape actuelle : 1: Prestations, 2: Artisan, 3: Date & Heure, 4: Coordonnées & Validation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialServiceId ? 2 : 1);

  // 2. Choix de l'artisan
  const [selectedArtisan, setSelectedArtisan] = useState<string>("any");

  // 3. Date et créneau sélectionnés
  const [selectedDayCode, setSelectedDayCode] = useState<string>(upcomingDays[0]?.dayCode || "");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // 4. Coordonnées client
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // États de soumission et confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    depositCents: number;
    remainingCents: number;
    startTime: string;
    staffName?: string;
  } | null>(null);

  // Requête API vers le moteur de disponibilité en temps réel (Sprint 3 /api/availability)
  const serviceIdsParam = selectedServices.map((s) => s.id).join(",");
  const {
    data: availabilityData,
    isLoading: isLoadingSlots,
    isError: isSlotsError,
    refetch: refetchSlots,
  } = useQuery({
    queryKey: [
      "availability",
      venue.id,
      selectedDayCode,
      serviceIdsParam,
      selectedArtisan,
    ],
    queryFn: async () => {
      if (!selectedDayCode || !serviceIdsParam) return { slots: [] };
      const params: Record<string, string> = {
        venueId: venue.id,
        date: selectedDayCode,
        serviceIds: serviceIdsParam,
      };
      if (selectedArtisan !== "any") {
        params.staffId = selectedArtisan;
      }
      const res = await apiClient.get<{ slots: string[]; date: string }>("/availability", {
        params,
      });
      return res.data;
    },
    enabled: step === 3 && Boolean(selectedDayCode && serviceIdsParam),
    staleTime: 30_000,
  });

  const availableSlots = availabilityData?.slots || [];

  // Calculs financiers
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

  const selectedDayInfo = upcomingDays.find((d) => d.dayCode === selectedDayCode) || upcomingDays[0];

  // Soumission finale de la réservation vers /api/bookings
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      setSubmitError("Veuillez sélectionner un horaire de rendez-vous.");
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Construction du timestamp ISO UTC complet
      const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
      const bookingDate = new Date(`${selectedDayCode}T00:00:00Z`);
      bookingDate.setUTCHours(hours, minutes, 0, 0);

      const payload = {
        venueId: venue.id,
        serviceIds: selectedServices.map((s) => s.id),
        staffId: selectedArtisan !== "any" ? selectedArtisan : null,
        startTime: bookingDate.toISOString(),
        clientName: customerName.trim(),
        clientEmail: customerEmail.trim() || undefined,
        clientPhone: customerPhone.trim(),
        notes: customerNotes.trim() || undefined,
      };

      const res = await apiClient.post<{
        booking: {
          id: string;
          reference: string;
          startTime: string;
          staff?: { name: string };
        };
        depositCents: number;
        remainingCents: number;
      }>("/bookings", payload);

      setConfirmedBooking({
        reference: res.data.booking.reference,
        depositCents: res.data.depositCents,
        remainingCents: res.data.remainingCents,
        startTime: res.data.booking.startTime,
        staffName: res.data.booking.staff?.name,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        "Impossible de finaliser la réservation. Veuillez vérifier vos informations et réessayer.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Écran de confirmation de rendez-vous
  if (confirmedBooking) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-sm uppercase font-bold text-primary-700 tracking-wider block mb-2">
          Réservation Confirmée
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-3">
          Votre moment est sanctuarisé
        </h1>

        <div className="inline-block px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-sm font-bold text-neutral-900 mb-6 num">
          Référence : {confirmedBooking.reference}
        </div>

        <p className="text-sm sm:text-base text-neutral-600 mb-8 leading-relaxed max-w-md mx-auto">
          Un e-mail de confirmation vous a été envoyé. {venue.name} vous attend le{" "}
          <strong className="text-neutral-950">{selectedDayInfo?.dateLabel}</strong> à{" "}
          <strong className="text-neutral-950">{selectedTimeSlot}</strong>.
        </p>

        {/* Récapitulatif du rendez-vous */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 text-left mb-8 space-y-4 shadow-2xs">
          <div className="border-b border-neutral-200/80 pb-3">
            <h3 className="text-lg font-bold text-neutral-950">{venue.name}</h3>
            <p className="text-sm text-neutral-500">{venue.address}, {venue.city}</p>
            {confirmedBooking.staffName && (
              <p className="text-sm text-primary-700 font-semibold mt-1">
                Artisan : {confirmedBooking.staffName}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="text-neutral-500 font-medium">Prestations réservées :</div>
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between font-medium text-neutral-900">
                <span>{s.name} ({s.durationMinutes} min)</span>
                <span className="num font-bold">{s.priceEuros} €</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-200/80 space-y-1.5 text-sm">
            {confirmedBooking.depositCents > 0 && (
              <div className="flex justify-between text-neutral-600">
                <span>Acompte réservé en ligne :</span>
                <span className="num font-semibold text-neutral-900">
                  {Math.round(confirmedBooking.depositCents / 100)} €
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold text-neutral-950 text-base pt-1">
              <span>Total à régler sur place :</span>
              <span className="num text-primary-600">
                {confirmedBooking.remainingCents > 0
                  ? `${Math.round(confirmedBooking.remainingCents / 100)} €`
                  : `${totalPrice} €`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/account" className="btn btn-primary w-full sm:w-auto">
            Voir mes rendez-vous
          </Link>
          <Link href="/" className="btn btn-outline w-full sm:w-auto">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-belora py-10">
      {/* En-tête du tunnel */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200/80">
        <div>
          <Link
            href={`/venue/${venue.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la maison {venue.name}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950">
            Réservation chez {venue.name}
          </h1>
        </div>

        {/* Indicateur d'étape */}
        <div className="text-sm text-neutral-500 hidden sm:block num">
          Étape <strong className="text-neutral-900">{step}</strong> sur 4
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Colonne Gauche : Formulaire par étapes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Étape 1 : Choix des prestations */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              step === 1 ? "border-primary-600 shadow-sm" : "border-neutral-200/90"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-sm flex items-center justify-center font-bold">
                  1
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-950">
                  Sélectionnez vos soins
                </h2>
              </div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-primary-600 hover:underline font-semibold cursor-pointer"
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
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? "bg-neutral-50 border-primary-600 ring-1 ring-primary-600/20"
                          : "bg-white border-neutral-200/80 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? "bg-neutral-950 border-neutral-950 text-white"
                              : "border-neutral-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-neutral-950">
                            {service.name}
                          </h3>
                          <p className="text-sm text-neutral-500 flex items-center gap-2 mt-0.5 num">
                            <span>{service.durationMinutes} min</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-sm sm:text-base font-bold text-neutral-950 num shrink-0">
                        {service.priceEuros} €
                      </span>
                    </div>
                  );
                })}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={selectedServices.length === 0}
                    className="btn btn-primary inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continuer vers le praticien</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-neutral-700 space-y-1">
                {selectedServices.map((s) => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.name} ({s.durationMinutes} min)</span>
                    <span className="font-bold text-neutral-900 num">{s.priceEuros} €</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Étape 2 : Choix du praticien */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              step === 2 ? "border-primary-600 shadow-sm" : "border-neutral-200/90"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-sm flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-950">
                  Choisissez votre artisan
                </h2>
              </div>
              {step > 2 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm text-primary-600 hover:underline font-semibold cursor-pointer"
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
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedArtisan === "any"
                      ? "bg-neutral-50 border-primary-600 ring-1 ring-primary-600/20"
                      : "bg-white border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-neutral-950">
                      Sans préférence
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Premier artisan d’excellence disponible
                    </p>
                  </div>
                </div>

                {/* Liste des membres de l'équipe */}
                {venue.team.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedArtisan(member.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedArtisan === member.id
                        ? "bg-neutral-50 border-primary-600 ring-1 ring-primary-600/20"
                        : "bg-white border-neutral-200/80 hover:border-neutral-300"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 shrink-0">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-950">
                        {member.name}
                      </h3>
                      <p className="text-sm text-primary-600 font-medium">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-primary inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Choisir la date & l’heure</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step > 2 && (
              <p className="text-sm text-neutral-700">
                Praticien :{" "}
                <strong className="text-neutral-900">
                  {selectedArtisan === "any"
                    ? "Sans préférence (premier disponible)"
                    : venue.team.find((m) => m.id === selectedArtisan)?.name}
                </strong>
              </p>
            )}
          </div>

          {/* Étape 3 : Date & Créneau horaire dynamiques */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              step === 3 ? "border-primary-600 shadow-sm" : "border-neutral-200/90"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-sm flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-950">
                  Date & heure du rendez-vous
                </h2>
              </div>
              {step > 3 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-sm text-primary-600 hover:underline font-semibold cursor-pointer"
                >
                  Modifier
                </button>
              )}
            </div>

            {step === 3 && (
              <div className="space-y-6">
                {/* Sélecteur de jour */}
                <div>
                  <span className="text-sm text-neutral-500 font-semibold block mb-2">
                    Choisissez votre jour :
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {upcomingDays.map((d) => (
                      <button
                        key={d.dayCode}
                        type="button"
                        onClick={() => {
                          setSelectedDayCode(d.dayCode);
                          setSelectedTimeSlot("");
                        }}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedDayCode === d.dayCode
                            ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs"
                            : "bg-white border-neutral-200/80 text-neutral-800 hover:border-neutral-300"
                        }`}
                      >
                        <span className="text-xs uppercase font-bold tracking-wider block opacity-75">
                          {d.label}
                        </span>
                        <span className="text-sm font-semibold block mt-0.5">
                          {d.dateLabel.split(" ")[1]} {d.dateLabel.split(" ")[2]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sélecteur de créneau horaire en direct */}
                <div>
                  <span className="text-sm text-neutral-500 font-semibold block mb-2">
                    Créneaux disponibles le {selectedDayInfo?.dateLabel} :
                  </span>

                  {isLoadingSlots ? (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      <span className="h-10 rounded-xl bg-neutral-200 animate-pulse" />
                      <span className="h-10 rounded-xl bg-neutral-200 animate-pulse" />
                      <span className="h-10 rounded-xl bg-neutral-200 animate-pulse" />
                    </div>
                  ) : isSlotsError ? (
                    <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center space-y-2">
                      <p className="text-sm text-neutral-600">
                        Impossible de charger les créneaux pour cette date.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchSlots()}
                        className="btn btn-outline text-sm px-3 py-1.5 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Réessayer</span>
                      </button>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-center text-sm text-neutral-600">
                      Aucun créneau libre à cette date. Veuillez choisir un autre jour.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all num cursor-pointer ${
                            selectedTimeSlot === slot
                              ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                              : "bg-white border-neutral-200/80 text-neutral-900 hover:border-neutral-300"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!selectedTimeSlot}
                    className="btn btn-primary inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Confirmer mes coordonnées</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step > 3 && (
              <p className="text-sm text-neutral-700">
                Créneau :{" "}
                <strong className="text-neutral-900">
                  {selectedDayInfo?.dateLabel} à {selectedTimeSlot}
                </strong>
              </p>
            )}
          </div>

          {/* Étape 4 : Coordonnées & Validation */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              step === 4 ? "border-primary-600 shadow-sm" : "border-neutral-200/90"
            }`}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-sm flex items-center justify-center font-bold">
                4
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-950">
                Vos coordonnées
              </h2>
            </div>

            {step === 4 && (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-neutral-900 mb-1 block">
                    Nom et prénom complet *
                  </label>
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
                    <label className="text-sm font-semibold text-neutral-900 mb-1 block">
                      Adresse e-mail (confirmation)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="sophie@exemple.fr"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-neutral-900 mb-1 block">
                      Numéro de mobile (SMS de rappel) *
                    </label>
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

                <div>
                  <label className="text-sm font-semibold text-neutral-900 mb-1 block">
                    Remarques ou besoins particuliers (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Allergies, longueur de cheveux, demande particulière..."
                    className="input"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-sm text-neutral-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Règlement sur place auprès de l’artisan. Annulation sans frais possible jusqu’à 24h avant le rendez-vous.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmation en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer mon rendez-vous ({totalPrice} €)</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Colonne Droite : Récapitulatif collant */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-5">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-primary-600 block mb-1">
                Récapitulatif de réservation
              </span>
              <h3 className="text-xl font-bold text-neutral-950">{venue.name}</h3>
              <p className="text-sm text-neutral-500">{venue.address}, {venue.city}</p>
            </div>

            <div className="pt-4 border-t border-neutral-200/80 space-y-3">
              <div className="text-sm font-semibold text-neutral-900">
                Prestations choisies ({selectedServices.length}) :
              </div>
              <div className="space-y-2">
                {selectedServices.map((s) => (
                  <div key={s.id} className="text-sm flex justify-between">
                    <span className="text-neutral-700">{s.name}</span>
                    <span className="font-bold text-neutral-950 num shrink-0">
                      {s.priceEuros} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200/80 space-y-2 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Durée estimée</span>
                <span className="font-semibold text-neutral-900 num">{totalDuration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Date & heure</span>
                <span className="font-semibold text-neutral-900">
                  {selectedDayInfo?.dateLabel} · {selectedTimeSlot || "À sélectionner"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Artisan</span>
                <span className="font-semibold text-neutral-900">
                  {selectedArtisan === "any"
                    ? "Sans préférence"
                    : venue.team.find((m) => m.id === selectedArtisan)?.name}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200/80 flex items-center justify-between text-neutral-950">
              <span className="text-sm font-semibold">Total à régler</span>
              <span className="text-2xl font-bold num">{totalPrice} €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
