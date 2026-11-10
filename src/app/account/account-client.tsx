"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  RotateCcw,
  Star,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X,
  ShieldCheck,
  Store,
  MapPin,
  Phone,
  Mail,
  Award,
  ArrowUpRight,
  Lock,
  Bell,
  Compass,
  Check,
  CreditCard,
  Users,
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

const CURATED_FAVORITE_VENUES = [
  {
    id: "v-belza",
    name: "L'Atelier de Beauté Belza",
    slug: "latelier-de-beaute-belza",
    address: "18 Rue de la Paix, 75002 Paris",
    category: "Coiffure & Coloration Végétale",
    rating: 4.95,
    reviewsCount: 128,
    image: "/images/salons/salon-1.jpg",
    tags: ["Coloration Minérale", "Coupe sur cheveux secs", "Thés bio"],
  },
  {
    id: "v-saint-germain",
    name: "Maison Botanique Saint-Germain",
    slug: "maison-botanique-saint-germain",
    address: "42 Boulevard Saint-Germain, 75005 Paris",
    category: "Rituels Capillaires & Spa",
    rating: 4.92,
    reviewsCount: 94,
    image: "/images/salons/salon-2.jpg",
    tags: ["Shirodhara", "Diagnostic cuir chevelu", "Cabine privative"],
  },
  {
    id: "v-marais",
    name: "Institut Minéral du Marais",
    slug: "institut-mineral-du-marais",
    address: "15 Rue Vieille du Temple, 75004 Paris",
    category: "Soins Visage & Onglerie Haute Précision",
    rating: 4.88,
    reviewsCount: 76,
    image: "/images/salons/salon-3.jpg",
    tags: ["Manucure japonaise", "Soins kobido", "Éco-certifié"],
  },
];

const SIGNATURE_CATEGORIES = [
  { label: "Coiffure & Balayage", href: "/category/hair" },
  { label: "Soins & Massages", href: "/category/massage" },
  { label: "Soins du Visage", href: "/category/facial" },
  { label: "Onglerie d'Art", href: "/category/nails" },
  { label: "Barbier Traditionnel", href: "/category/barber" },
  { label: "Assistance Belora", href: "/help" },
];

export function AccountClient() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "favorites" | "profile">("upcoming");

  // Synchronisation automatique de l'onglet actif avec les query params (ex: ?tab=upcoming ou ?tab=past)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "upcoming" || tabParam === "past" || tabParam === "favorites" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Modale d'annulation
  const [bookingToCancel, setBookingToCancel] = useState<FormattedAccountBooking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Modale de dépôt d'avis
  const [bookingToReview, setBookingToReview] = useState<FormattedAccountBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Préférences utilisateur (stockées localement)
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailConfirmations, setEmailConfirmations] = useState(true);

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
      toast.success("Vos coordonnées ont été mises à jour avec succès.");
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

  const handleAddToCalendar = (app: FormattedAccountBooking) => {
    toast.success(`Rappel enregistré pour votre rendez-vous chez ${app.venueName} le ${app.date} à ${app.time}.`);
  };

  const upcomingBookings = bookingsData?.upcoming || [];
  const pastBookings = bookingsData?.past || [];
  const counts = bookingsData?.counts || {
    upcoming: 0,
    past: 0,
    total: 0,
  };

  const hasBookingsError = isErrorBookings || Boolean(bookingsError);

  const role = (session?.user as { role?: string })?.role || profileData?.role || "CUSTOMER";

  const userInitials = profileData
    ? `${profileData.firstName?.[0] || ""}${profileData.lastName?.[0] || ""}`.toUpperCase() || "MB"
    : (session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "MB");

  const memberYear = profileData?.createdAt
    ? new Date(profileData.createdAt).getFullYear()
    : 2026;

  const nextAppointment = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  return (
    <div className="container-belora py-8 sm:py-12 space-y-8">
      {/* 1. Fil d'Ariane épuré */}
      <nav aria-label="Fil d'Ariane" className="text-xs text-neutral-500 flex items-center gap-2">
        <Link href="/" className="hover:text-neutral-900 transition-colors">
          Accueil
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-semibold">Mon Espace Belora</span>
      </nav>

      {/* 2. Hero Card Profil Utilisateur & Raccourcis Principaux */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Bloc Identité */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-900 text-white flex items-center justify-center font-display text-2xl font-normal shrink-0 border border-primary-700/80 shadow-xs relative">
              <span>{userInitials}</span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                  {profileData
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : session?.user?.name || "Mon Espace Membre"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {role === "ADMIN"
                      ? "Super-Administrateur"
                      : role === "PRO"
                      ? "Partenaire Belora Pro"
                      : "Membre Privilège"}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{profileData?.email || session?.user?.email || "chargement..."}</span>
                </span>
                {profileData?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{profileData.phone}</span>
                  </span>
                )}
                <span>&bull; Adhérent depuis {memberYear}</span>
              </div>
            </div>
          </div>

          {/* Boutons d'Action selon le Rôle */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
            {role === "PRO" && (
              <Link
                href="/pro/agenda"
                className="btn btn-primary btn-sm inline-flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Accéder à l&apos;Agenda Pro</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                className="btn btn-dark btn-sm inline-flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Console Super-Admin</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href="/search"
              className="btn btn-outline btn-sm inline-flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>Prendre un rendez-vous</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Métriques Clés & KPI Utilisateur (Cartes Élégantes Sans Dégradé) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Prochain Rituel */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Prochain Rituel
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-900 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary-700" />
            </div>
          </div>
          {isLoadingBookings ? (
            <div className="h-6 w-36 bg-neutral-200 rounded animate-pulse" />
          ) : nextAppointment ? (
            <div>
              <p className="text-base font-bold text-neutral-950">
                {nextAppointment.date}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                à {nextAppointment.time} chez {nextAppointment.venueName}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-neutral-900">Aucun rituel prévu</p>
              <Link
                href="/search"
                className="text-xs text-primary-700 hover:text-primary-800 font-semibold underline"
              >
                Planifier un créneau
              </Link>
            </div>
          )}
        </div>

        {/* KPI 2 : Rituels Honorés */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Rituels Réalisés
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Award className="w-4 h-4 text-neutral-700" />
            </div>
          </div>
          {isLoadingBookings ? (
            <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
          ) : (
            <div>
              <p className="text-2xl font-bold text-neutral-950">{counts.past}</p>
              <p className="text-xs text-neutral-500">Expériences beauté & bien-être</p>
            </div>
          )}
        </div>

        {/* KPI 3 : Total Réservations */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Total Rendez-vous
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-neutral-700" />
            </div>
          </div>
          {isLoadingBookings ? (
            <div className="h-6 w-16 bg-neutral-200 rounded animate-pulse" />
          ) : (
            <div>
              <p className="text-2xl font-bold text-neutral-950">{counts.total}</p>
              <p className="text-xs text-neutral-500">Créneaux réservés sur Belora</p>
            </div>
          )}
        </div>

        {/* KPI 4 : Sécurité & Paiement */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Protection & Statut
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">Compte Certifié</p>
            <p className="text-xs text-neutral-500">Paiements & acomptes sécurisés</p>
          </div>
        </div>
      </div>

      {/* 4. Raccourcis Rapides vers les Univers Belora */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary-700 shrink-0" />
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-700">
            Univers & Découvertes :
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SIGNATURE_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-primary-700 hover:border-primary-300 transition-colors shadow-2xs"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Navigation par Onglets Raffinée */}
      <div className="border-b border-neutral-200">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto text-sm scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 font-semibold transition-colors cursor-pointer relative shrink-0 ${
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
            className={`pb-3 font-semibold transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "past"
                ? "text-neutral-950 border-b-2 border-primary-600"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Historique & Avis ({counts.past})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`pb-3 font-semibold transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "favorites"
                ? "text-neutral-950 border-b-2 border-primary-600"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Maisons Recommandées
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 font-semibold transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "profile"
                ? "text-neutral-950 border-b-2 border-primary-600"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Mes informations & Sécurité
          </button>
        </div>
      </div>

      {/* État d'erreur explicite */}
      {hasBookingsError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger vos réservations. Veuillez vérifier votre connexion.</span>
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
        <div className="space-y-4 max-w-4xl">
          {isLoadingBookings ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3"
                >
                  <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-5 w-64 bg-neutral-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="p-10 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Calendar className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl sm:text-2xl text-neutral-950 font-normal">
                  Aucun rendez-vous à venir
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto">
                  Explorez nos maisons de beauté partenaires et sanctuarisez votre prochain rituel de soin.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <Link href="/search?category=hair" className="btn btn-outline btn-xs">
                  Coiffure Haute Précision
                </Link>
                <Link href="/search?category=massage" className="btn btn-outline btn-xs">
                  Massages & Spas
                </Link>
                <Link href="/search" className="btn btn-primary btn-sm ml-1">
                  Explorer tous les salons
                </Link>
              </div>
            </div>
          ) : (
            upcomingBookings.map((app) => (
              <div
                key={app.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                    <Image
                      src={app.venueImage}
                      alt={app.venueName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {app.reference} &bull; Confirmé
                      </span>
                      <span className="text-xs text-neutral-400">
                        Paiement sécurisé
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-neutral-950">
                      {app.serviceName}
                    </h3>

                    <p className="text-sm text-neutral-700 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{app.venueName} &bull; avec {app.artisanName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-neutral-900">
                        <Calendar className="w-3.5 h-3.5 text-primary-700" />
                        <span>{app.date}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-neutral-900">
                        <Clock className="w-3.5 h-3.5 text-primary-700" />
                        <span>{app.time}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="font-display text-xl text-neutral-950 font-bold block">
                      {app.price.toFixed(2)} €
                    </span>
                    {app.depositAmount > 0 ? (
                      <span className="text-xs text-emerald-700 font-medium block">
                        Acompte réglé : {app.depositAmount.toFixed(2)} €
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-500 block">
                        Règlement sur place
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(app)}
                      className="btn btn-outline btn-xs"
                      title="Ajouter un rappel"
                    >
                      <Bell className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Rappel</span>
                    </button>

                    <Link
                      href={`/venue/${app.venueSlug}`}
                      className="btn btn-outline btn-xs"
                    >
                      Fiche salon
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
        <div className="space-y-4 max-w-4xl">
          {isLoadingBookings ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3"
                >
                  <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-5 w-64 bg-neutral-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : pastBookings.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
              <p className="text-base text-neutral-700 font-medium">
                Aucun historique de réservation pour l&apos;instant.
              </p>
              <p className="text-sm text-neutral-500">
                Vos rendez-vous honorés et vos avis certifiés apparaîtront ici.
              </p>
            </div>
          ) : (
            pastBookings.map((app) => (
              <div
                key={app.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4"
              >
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                      <Image
                        src={app.venueImage}
                        alt={app.venueName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                            app.status === "cancelled"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}
                        >
                          {app.status === "cancelled" ? "Annulé" : "Rituel Honoré"}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {app.reference}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-neutral-950">
                        {app.serviceName}
                      </h3>
                      <p className="text-sm text-neutral-600 font-medium">
                        {app.venueName} &bull; {app.date}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Réalisé par {app.artisanName}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 shrink-0">
                    <span className="font-display text-lg font-bold text-neutral-900">
                      {app.price.toFixed(2)} €
                    </span>

                    <div className="flex items-center gap-2">
                      {app.status === "completed" && !app.hasReview && (
                        <button
                          type="button"
                          onClick={() => setBookingToReview(app)}
                          className="btn btn-primary btn-xs flex items-center gap-1.5"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>Déposer un avis</span>
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
                  <div className="mt-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx < app.review!.rating
                                ? "fill-current text-amber-500"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-neutral-900 ml-1.5">
                          {app.review.rating}/5
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        Avis vérifié Belora
                      </span>
                    </div>

                    <p className="text-neutral-700 italic">
                      &laquo; {app.review.comment} &raquo;
                    </p>

                    {app.review.reply && (
                      <div className="mt-2 pl-3 border-l-2 border-primary-600 text-xs text-neutral-600 space-y-0.5">
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
          ONGLET 3 : MAISONS RECOMMANDÉES & FAVORIS
          ======================================================================= */}
      {activeTab === "favorites" && (
        <div className="space-y-4 max-w-4xl">
          <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100 text-xs sm:text-sm text-primary-900 flex items-center justify-between">
            <span>
              Maisons d&apos;artisanat d&apos;art sélectionnées pour l&apos;excellence de leurs rituels et leur charte d&apos;accueil Belora.
            </span>
            <Link href="/search" className="font-semibold underline ml-3 shrink-0">
              Voir tout l&apos;annuaire
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CURATED_FAVORITE_VENUES.map((venue) => (
              <div
                key={venue.id}
                className="rounded-2xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-neutral-200">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/95 text-neutral-900 text-xs font-bold flex items-center gap-1 shadow-2xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{venue.rating}</span>
                      <span className="text-neutral-400 font-normal">({venue.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-primary-700">
                      {venue.category}
                    </span>
                    <h3 className="font-display text-base font-semibold text-neutral-950">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span>{venue.address}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {venue.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/venue/${venue.slug}`}
                    className="btn btn-outline btn-xs flex-1 text-center"
                  >
                    Découvrir
                  </Link>
                  <Link
                    href={`/book/${venue.slug}`}
                    className="btn btn-primary btn-xs flex-1 text-center"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =======================================================================
          ONGLET 4 : INFORMATIONS PERSONNELLES & SÉCURITÉ
          ======================================================================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
          {/* Formulaire Coordonnées Personnelles */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6">
            <div>
              <h2 className="font-display text-xl text-neutral-950 font-normal">
                Coordonnées personnelles
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ces informations sont transmises aux établissements lors de vos réservations pour confirmer votre venue.
              </p>
            </div>

            {isLoadingProfile ? (
              <div className="space-y-4">
                <div className="h-10 bg-neutral-100 rounded animate-pulse" />
                <div className="h-10 bg-neutral-100 rounded animate-pulse" />
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
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="label mb-1 block">Nom</label>
                    <input
                      type="text"
                      value={profileLastName}
                      onChange={(e) => setProfileLastName(e.target.value)}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label mb-1 block">Adresse e-mail sécurisée</label>
                  <input
                    type="email"
                    value={profileData?.email || ""}
                    disabled
                    className="input w-full bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                  <span className="text-xs text-neutral-400 mt-1 block">
                    Votre adresse e-mail constitue votre identifiant unique de compte Belora.
                  </span>
                </div>

                <div>
                  <label className="label mb-1 block">Numéro de téléphone mobile</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="input w-full"
                    placeholder="06 12 34 56 78"
                  />
                  <span className="text-xs text-neutral-400 mt-1 block">
                    Requis pour la réception des SMS de rappel 24h avant chaque rituel.
                  </span>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Modifications sauvegardées instantanément.
                  </span>
                  <button
                    type="submit"
                    disabled={profileMutation.isPending}
                    className="btn btn-primary btn-sm"
                  >
                    {profileMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Panneau latéral Sécurité & Outils selon le rôle */}
          <div className="space-y-6">
            {/* Boîte Préférences & Notifications */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-sm">
              <h3 className="font-semibold text-neutral-950 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-700" />
                <span>Rappels & Alertes</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-700">Rappels par SMS (24h avant)</span>
                  <input
                    type="checkbox"
                    checked={smsReminders}
                    onChange={(e) => {
                      setSmsReminders(e.target.checked);
                      toast.success(
                        e.target.checked
                          ? "Rappels SMS activés."
                          : "Rappels SMS désactivés."
                      );
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-700">Confirmations par e-mail</span>
                  <input
                    type="checkbox"
                    checked={emailConfirmations}
                    onChange={(e) => {
                      setEmailConfirmations(e.target.checked);
                      toast.success(
                        e.target.checked
                          ? "Confirmations e-mail activées."
                          : "Confirmations e-mail désactivées."
                      );
                    }}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>

            {/* Boîte Sécurité */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-sm">
              <h3 className="font-semibold text-neutral-950 flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700" />
                <span>Sécurité du Compte</span>
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Votre session utilise un jeton chiffré JWT conforme aux normes bancaires de sécurité.
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mot de passe protégé</span>
                </span>
              </div>
            </div>

            {/* Raccourcis Pro si rôle PRO */}
            {role === "PRO" && (
              <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-2xs space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-neutral-100">Outils Professionnels</span>
                </div>
                <p className="text-xs text-neutral-300">
                  Pilotez votre établissement, votre équipe et vos encaissements en temps réel.
                </p>
                <div className="space-y-1.5 pt-2">
                  <Link
                    href="/pro/agenda"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold"
                  >
                    <span>Agenda & Calendrier</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
                  </Link>
                  <Link
                    href="/pro/checkout"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold"
                  >
                    <span>Caisse & Vente</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
                  </Link>
                  <Link
                    href="/pro/clients"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold"
                  >
                    <span>Fichier Clients CRM</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
                  </Link>
                </div>
              </div>
            )}
          </div>
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
                Garder mon créneau
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
                Votre avis sera certifié &laquo; Avis vérifié Belora &raquo; car il est rattaché à un créneau honoré.
              </span>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
