"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  RotateCcw,
  Star,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  FormattedAccountBooking,
  CustomerBookingsResult,
  CancelBookingResult,
  AccountUser,
} from "@/modules/account/account.service";
import { Modal } from "@/components/pro-dashboard/ui/modal";

export function AccountClient() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "profile">("upcoming");

  // Modale d'annulation
  const [bookingToCancel, setBookingToCancel] = useState<FormattedAccountBooking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Modale de dépôt d'avis
  const [bookingToReview, setBookingToReview] = useState<FormattedAccountBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 1. Récupération des réservations
  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["account", "bookings"],
    queryFn: async () => {
      const res = await apiClient.get<CustomerBookingsResult>("/account/bookings");
      return res.data;
    },
    staleTime: 30_000,
  });

  // 2. Récupération du profil
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["account", "profile"],
    queryFn: async () => {
      const res = await apiClient.get<{ user: AccountUser }>("/account/profile");
      return res.data.user;
    },
    staleTime: 60_000,
  });

  // État local formulaire profil
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [isProfileInitialized, setIsProfileInitialized] = useState(false);

  if (profileData && !isProfileInitialized) {
    setProfileFirstName(profileData.firstName || "");
    setProfileLastName(profileData.lastName || "");
    setProfilePhone(profileData.phone || "");
    setIsProfileInitialized(true);
  }

  // Mutation Annulation
  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await apiClient.post<CancelBookingResult>(
        `/account/bookings/${id}/cancel`,
        { reason }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["account", "bookings"] });
      toast.success(data.message);
      setBookingToCancel(null);
      setCancelReason("");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'annulation de la réservation.";
      toast.error(msg);
    },
  });

  // Mutation Dépôt d'Avis
  const reviewMutation = useMutation({
    mutationFn: async (payload: { bookingId: string; rating: number; comment: string }) => {
      const res = await apiClient.post("/account/reviews", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "bookings"] });
      toast.success("Votre avis certifié a été publié. Merci pour votre retour !");
      setBookingToReview(null);
      setComment("");
      setRating(5);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la publication de votre avis.";
      toast.error(msg);
    },
  });

  // Mutation Mise à jour Profil
  const profileMutation = useMutation({
    mutationFn: async (payload: { firstName: string; lastName: string; phone: string }) => {
      const res = await apiClient.patch<{ user: AccountUser }>("/account/profile", payload);
      return res.data.user;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["account", "profile"], updated);
      toast.success("Vos coordonnées ont été mises à jour.");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour de vos informations.";
      toast.error(msg);
    },
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate({
      firstName: profileFirstName,
      lastName: profileLastName,
      phone: profilePhone,
    });
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;
    cancelMutation.mutate({
      id: bookingToCancel.id,
      reason: cancelReason.trim() || undefined,
    });
  };

  const handleConfirmReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingToReview || !comment.trim()) return;
    reviewMutation.mutate({
      bookingId: bookingToReview.id,
      rating,
      comment: comment.trim(),
    });
  };

  const upcomingBookings = bookingsData?.upcoming || [];
  const pastBookings = bookingsData?.past || [];
  const counts = bookingsData?.counts || {
    upcoming: 0,
    past: 0,
    total: 0,
  };

  const hasBookingsError = isErrorBookings || Boolean(bookingsError);

  const userInitials = profileData
    ? `${profileData.firstName?.[0] || ""}${profileData.lastName?.[0] || ""}`.toUpperCase() || "CL"
    : "CL";

  const memberYear = profileData?.createdAt
    ? new Date(profileData.createdAt).getFullYear()
    : 2026;

  return (
    <div className="container-belora py-10 sm:py-12">
      {/* En-tête profil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-200 border border-neutral-300 text-neutral-800 flex items-center justify-center font-display text-xl font-normal">
            {userInitials}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-neutral-950">
              {profileData
                ? `${profileData.firstName} ${profileData.lastName}`
                : "Mon Espace Belora"}
            </h1>
            <p className="text-sm text-neutral-500">
              {profileData?.email || "Chargement..."} &bull; Membre depuis {memberYear}
            </p>
          </div>
        </div>

        <Link
          href="/search"
          className="btn btn-outline btn-sm self-start sm:self-auto"
        >
          <span>Prendre un nouveau rendez-vous</span>
        </Link>
      </div>

      {/* Navigation par onglets */}
      <div className="flex items-center gap-6 border-b border-neutral-200 mb-8 overflow-x-auto text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 font-semibold transition-colors cursor-pointer relative ${
            activeTab === "upcoming"
              ? "text-neutral-950 border-b-2 border-primary-600"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          À venir ({counts.upcoming})
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
          Historique ({counts.past})
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

      {/* État d'erreur explicite */}
      {hasBookingsError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger vos réservations. Veuillez réessayer.</span>
          </div>
          <button
            type="button"
            onClick={() => refetchBookings()}
            className="btn btn-outline btn-xs flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* =======================================================================
          ONGLET 1 : RENDEZ-VOUS À VENIR
          ======================================================================= */}
      {activeTab === "upcoming" && (
        <div className="space-y-4 max-w-3xl">
          {isLoadingBookings ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white border border-neutral-200 space-y-3"
                >
                  <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-64 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-white border border-neutral-200 space-y-3">
              <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="font-display text-xl text-neutral-950">
                Aucun rendez-vous à venir
              </h3>
              <p className="text-sm text-neutral-600">
                Explorez nos maisons recommandées et sanctuarisez votre prochain rituel.
              </p>
              <Link href="/search" className="btn btn-primary btn-sm inline-block mt-2">
                Réserver un soin
              </Link>
            </div>
          ) : (
            upcomingBookings.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
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
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block mb-1">
                      {app.reference} &bull; Confirmé
                    </span>
                    <h3 className="text-base font-semibold text-neutral-950">
                      {app.serviceName}
                    </h3>
                    <p className="text-sm text-neutral-600 font-medium">
                      chez {app.venueName} &bull; avec {app.artisanName}
                    </p>
                    <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{app.date} à {app.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="text-right">
                    <span className="font-display text-xl text-neutral-950 font-bold">
                      {app.price.toFixed(2)} €
                    </span>
                    {app.depositAmount > 0 && (
                      <span className="block text-xs text-neutral-500">
                        Acompte réglé : {app.depositAmount.toFixed(2)} €
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/venue/${app.venueSlug}`}
                      className="btn btn-outline btn-xs"
                    >
                      Détails
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBookingToCancel(app)}
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

      {/* =======================================================================
          ONGLET 2 : HISTORIQUE & AVIS CERTIFIÉS
          ======================================================================= */}
      {activeTab === "past" && (
        <div className="space-y-4 max-w-3xl">
          {isLoadingBookings ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-white border border-neutral-200 space-y-3"
                >
                  <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-64 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : pastBookings.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white border border-neutral-200 space-y-2">
              <p className="text-sm sm:text-base text-neutral-600 font-medium">
                Aucun historique de réservation pour l&apos;instant.
              </p>
            </div>
          ) : (
            pastBookings.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
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
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            app.status === "cancelled"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}
                        >
                          {app.status === "cancelled" ? "Annulé" : "Honoré"}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {app.reference}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-neutral-950">
                        {app.serviceName}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {app.venueName} &bull; {app.date}
                      </p>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        Réalisé par {app.artisanName}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 w-full sm:w-auto self-end sm:self-auto">
                    <span className="text-sm sm:text-base font-bold text-neutral-900">
                      {app.price.toFixed(2)} €
                    </span>

                    <div className="flex items-center gap-2">
                      {app.status === "completed" && !app.hasReview && (
                        <button
                          type="button"
                          onClick={() => setBookingToReview(app)}
                          className="btn btn-primary btn-xs flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>Laisser un avis</span>
                        </button>
                      )}

                      <Link
                        href={`/book/${app.venueSlug}`}
                        className="btn btn-outline btn-xs inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Réserver à nouveau</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Avis déjà déposé */}
                {app.review && (
                  <div className="mt-2 pt-3 border-t border-neutral-100 p-3 rounded-lg bg-neutral-50 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < app.review!.rating
                                ? "fill-current text-amber-500"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        Avis vérifié
                      </span>
                    </div>
                    <p className="text-neutral-700 italic">
                      &laquo; {app.review.comment} &raquo;
                    </p>
                    {app.review.reply && (
                      <div className="mt-2 pl-3 border-l-2 border-primary-600 text-xs text-neutral-600">
                        <strong className="text-neutral-900 font-semibold block">
                          Réponse de l&apos;établissement :
                        </strong>
                        <span>{app.review.reply}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* =======================================================================
          ONGLET 3 : INFORMATIONS PERSONNELLES
          ======================================================================= */}
      {activeTab === "profile" && (
        <div className="max-w-xl p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-5">
          <h2 className="font-display text-xl text-neutral-950 mb-4">
            Coordonnées personnelles
          </h2>

          {isLoadingProfile ? (
            <div className="space-y-4">
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
              <div className="h-10 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label mb-1 block">Prénom</label>
                  <input
                    type="text"
                    value={profileFirstName}
                    onChange={(e) => setProfileFirstName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="label mb-1 block">Nom</label>
                  <input
                    type="text"
                    value={profileLastName}
                    onChange={(e) => setProfileLastName(e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label mb-1 block">Adresse e-mail</label>
                <input
                  type="email"
                  value={profileData?.email || ""}
                  disabled
                  className="input bg-neutral-100 text-neutral-500 cursor-not-allowed"
                />
                <span className="text-xs text-neutral-400 mt-1 block">
                  L&apos;adresse e-mail est liée à votre compte de connexion sécurisé.
                </span>
              </div>

              <div>
                <label className="label mb-1 block">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="input"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  Utilisé pour vos SMS de rappels et confirmations de rendez-vous.
                </span>
                <button
                  type="submit"
                  disabled={profileMutation.isPending}
                  className="btn btn-primary btn-sm"
                >
                  {profileMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =======================================================================
          MODALE D'ANNULATION AVEC POLITIQUE DU SALON
          ======================================================================= */}
      {bookingToCancel && (
        <Modal
          isOpen={Boolean(bookingToCancel)}
          onClose={() => setBookingToCancel(null)}
          title="Annuler votre rendez-vous"
          description={`Réservation ${bookingToCancel.reference} chez ${bookingToCancel.venueName}`}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="btn btn-outline btn-sm"
              >
                Garder mon rendez-vous
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelMutation.isPending}
                className="btn btn-primary btn-sm bg-rose-600 hover:bg-rose-700 border-rose-600 text-white"
              >
                {cancelMutation.isPending ? "Annulation..." : "Confirmer l'annulation"}
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-sm">
            {/* Condition d'annulation et remboursement */}
            <div
              className={`p-3.5 rounded-xl border ${
                bookingToCancel.isEligibleForRefund
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <h4 className="font-bold mb-1">
                {bookingToCancel.isEligibleForRefund
                  ? "Remboursement garanti de votre acompte"
                  : "Délai de prévenance dépassé"}
              </h4>
              <p className="text-xs leading-relaxed">
                {bookingToCancel.isEligibleForRefund
                  ? `Vous annulez plus de ${bookingToCancel.cancellationDelayHours}h avant votre créneau. Votre acompte de ${bookingToCancel.depositAmount.toFixed(2)} € vous sera intégralement recrédité sur votre carte bancaire.`
                  : `La politique de cet établissement prévoit un délai minimum de prévenance de ${bookingToCancel.cancellationDelayHours}h. L'acompte de ${bookingToCancel.depositAmount.toFixed(2)} € sera conservé pour compenser l'immobilisation du créneau de l'artisan.`}
              </p>
            </div>

            <div>
              <label className="label mb-1 block">Motif de votre annulation (optionnel)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Ex : Empêchement professionnel imprévu..."
                className="input w-full"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* =======================================================================
          MODALE DE DÉPÔT D'AVIS VÉRIFIÉ (1-5 ÉTOILES)
          ======================================================================= */}
      {bookingToReview && (
        <Modal
          isOpen={Boolean(bookingToReview)}
          onClose={() => setBookingToReview(null)}
          title="Partager votre expérience"
          description={`Votre avis sur votre rituel chez ${bookingToReview.venueName}`}
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setBookingToReview(null)}
                className="btn btn-outline btn-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                disabled={reviewMutation.isPending || !comment.trim()}
                className="btn btn-primary btn-sm"
              >
                {reviewMutation.isPending ? "Publication..." : "Publier mon avis certifié"}
              </button>
            </div>
          }
        >
          <form onSubmit={handleConfirmReview} className="space-y-4 text-sm">
            <div>
              <label className="label mb-2 block font-semibold text-neutral-800">
                Note globale
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className="p-1 cursor-pointer focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        starValue <= rating
                          ? "fill-amber-400 text-amber-500"
                          : "text-neutral-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-neutral-900 ml-2">
                  {rating} / 5 étoiles
                </span>
              </div>
            </div>

            <div>
              <label className="label mb-1 block font-semibold text-neutral-800">
                Votre commentaire
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                placeholder="Racontez votre expérience : accueil, qualité des soins, savoir-faire de l'artisan..."
                className="input w-full"
              />
              <span className="text-xs text-neutral-400 mt-1 block">
                Votre avis sera estampillé &laquo; Avis vérifié &raquo; car il est rattaché à un rendez-vous honoré.
              </span>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
