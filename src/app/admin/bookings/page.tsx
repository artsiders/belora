"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Store,
  CreditCard,
  User,
  X,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

interface AdminBookingItem {
  id: string;
  reference: string;
  venueId: string;
  venueName: string;
  venueSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING_PAYMENT" | "NO_SHOW";
  totalPriceEuros: number;
  depositEuros: number;
  remainingEuros: number;
  paymentStatus: string;
  commissionRate: number;
  commissionEuros: number;
  stripePaymentIntentId: string | null;
  servicesSummary: string;
  scheduledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<AdminBookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, isError, refetch } = useQuery<{
    bookings: AdminBookingItem[];
    error?: string;
  }>({
    queryKey: ["admin", "bookings", statusFilter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await apiClient.get<{ bookings: AdminBookingItem[] }>(
        `/admin/bookings?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 30_000,
  });

  const bookings = data?.bookings || [];
  const hasError = isError || Boolean(data?.error);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
    const completed = bookings.filter((b) => b.status === "COMPLETED").length;
    const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
    return { total, confirmed, completed, cancelled };
  }, [bookings]);

  // Mutation to update booking status
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      cancellationReason,
    }: {
      id: string;
      status: string;
      cancellationReason?: string;
    }) => {
      const res = await apiClient.patch(`/admin/bookings/${id}`, {
        status,
        cancellationReason,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Statut de la réservation mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      setSelectedBooking(null);
      setCancelModalBooking(null);
      setCancelReason("");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Erreur lors de la mise à jour.";
      toast.error(msg);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Terminée</Badge>;
      case "CONFIRMED":
        return <Badge variant="info">Confirmée</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Annulée</Badge>;
      case "NO_SHOW":
        return <Badge variant="warning">Non présenté</Badge>;
      default:
        return <Badge variant="neutral">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Supervision des Réservations
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Suivez toutes les transactions, supervisez les acomptes en ligne et gérez les litiges.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Réservations
            </span>
            <CalendarCheck className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.total}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Confirmées (À venir)
            </span>
            <Clock className="w-4 h-4 text-primary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.confirmed}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Terminées avec succès
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.completed}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Annulées
            </span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-16" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {stats.cancelled}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
          {[
            { id: "ALL", label: "Toutes" },
            { id: "CONFIRMED", label: "Confirmées" },
            { id: "COMPLETED", label: "Terminées" },
            { id: "CANCELLED", label: "Annulées" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Réf #BEL-..., client, salon..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      {/* Error Alert */}
      {hasError && (
        <Alert
          variant="error"
          title="Erreur de chargement"
          description="Impossible de récupérer la liste des réservations."
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
          }}
        />
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-neutral-100">
                <InlineSkeleton width="w-24" height="h-4" />
                <InlineSkeleton width="w-32" height="h-4" />
                <InlineSkeleton width="w-20" height="h-4" />
                <InlineSkeleton width="w-20" height="h-6" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={CalendarCheck}
              title="Aucune réservation trouvée"
              description="Aucun rendez-vous ne correspond aux critères de recherche actuels."
              action={
                search || statusFilter !== "ALL"
                  ? {
                      label: "Réinitialiser les filtres",
                      onClick: () => {
                        setSearch("");
                        setStatusFilter("ALL");
                      },
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Référence & Date</th>
                  <th className="py-3 px-4">Établissement</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Prestations</th>
                  <th className="py-3 px-4">Montant & Acompte</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-neutral-900 text-xs">
                        {booking.reference}
                      </div>
                      <div className="text-neutral-500 text-xs mt-0.5">
                        {new Date(booking.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900">
                        {booking.venueName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900">
                        {booking.clientName}
                      </div>
                      <div className="text-neutral-500 text-xs mt-0.5">
                        {booking.clientPhone}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-neutral-700">
                      {booking.servicesSummary}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">
                        {booking.totalPriceEuros.toFixed(2)} €
                      </div>
                      <div className="text-xs text-emerald-700 font-medium">
                        Acompte: {booking.depositEuros.toFixed(2)} €
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800">
                        {booking.commissionEuros.toFixed(2)} €
                      </span>
                      <span className="text-xs text-neutral-400 ml-1">
                        ({(booking.commissionRate * 100).toFixed(1)}%)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(booking.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-neutral-200 relative animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute right-4 top-4 p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary-50 text-secondary-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    Réservation {selectedBooking.reference}
                  </h3>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <p className="text-xs text-neutral-500">
                  Salon : {selectedBooking.venueName}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Financial Summary */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Montant Total Prestation(s) TTC</span>
                  <span className="font-bold text-neutral-900">{selectedBooking.totalPriceEuros.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Acompte Séquestré en ligne</span>
                  <span>{selectedBooking.depositEuros.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Reste à régler au salon</span>
                  <span>{selectedBooking.remainingEuros.toFixed(2)} €</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                  <span>Commission Belora ({(selectedBooking.commissionRate * 100).toFixed(1)}%)</span>
                  <span>{selectedBooking.commissionEuros.toFixed(2)} €</span>
                </div>
              </div>

              {/* Client & Prestation info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                  <span className="text-neutral-400 uppercase font-semibold text-xs">Client</span>
                  <div className="font-semibold text-neutral-900">{selectedBooking.clientName}</div>
                  <div className="text-neutral-500">{selectedBooking.clientPhone}</div>
                  {selectedBooking.clientEmail && (
                    <div className="text-neutral-500">{selectedBooking.clientEmail}</div>
                  )}
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                  <span className="text-neutral-400 uppercase font-semibold text-xs">Paiement Stripe</span>
                  <div className="font-mono text-neutral-700 break-all">
                    {selectedBooking.stripePaymentIntentId || "Non renseigné"}
                  </div>
                  <div className="text-neutral-500">
                    Statut : {selectedBooking.paymentStatus}
                  </div>
                </div>
              </div>

              {selectedBooking.cancellationReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  <span className="font-bold block">Motif d'annulation :</span>
                  <span>{selectedBooking.cancellationReason}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                {selectedBooking.status === "CONFIRMED" && (
                  <button
                    onClick={() => {
                      setCancelModalBooking(selectedBooking);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Annuler la réservation
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedBooking.status === "CONFIRMED" && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedBooking.id,
                        status: "COMPLETED",
                      })
                    }
                    disabled={updateStatusMutation.isPending}
                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Marquer comme terminée
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900 mb-2">
              Annuler la réservation {cancelModalBooking.reference}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Veuillez spécifier la raison de l'annulation administrative.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex : Demande du client suite à imprévu, fermeture salon..."
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: cancelModalBooking.id,
                    status: "CANCELLED",
                    cancellationReason: cancelReason || "Annulé par l'administration Belora",
                  })
                }
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? "Annulation..." : "Confirmer l'annulation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
