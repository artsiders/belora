"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Percent,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { VenueStatus } from "@prisma/client";

interface AdminVenueItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  status: VenueStatus;
  commissionRate: number;
  ownerName: string;
  ownerEmail: string;
  bookingsCount: number;
  totalRevenueEuros: number;
  createdAt: string;
}

interface VenuesResponse {
  venues: AdminVenueItem[];
}

export default function AdminVenuesPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingVenue, setEditingVenue] = useState<AdminVenueItem | null>(null);
  const [newRatePercent, setNewRatePercent] = useState<number>(1.8);

  const { data, isLoading, isError, error, refetch } = useQuery<VenuesResponse>({
    queryKey: ["admin", "venues", selectedStatus, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await apiClient.get<VenuesResponse>(`/api/admin/venues?${params.toString()}`);
      return res.data;
    },
  });

  const venues = data?.venues || [];

  // Mutation pour changer le statut (Validation / Suspension)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ venueId, status }: { venueId: string; status: VenueStatus }) => {
      const res = await apiClient.patch(`/api/admin/venues/${venueId}`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "venues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      if (variables.status === "PUBLISHED") {
        toast.success("Établissement validé et publié en ligne");
      } else if (variables.status === "SUSPENDED") {
        toast.success("Établissement suspendu de la marketplace");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la mise à jour");
    },
  });

  // Mutation pour modifier le taux de commission
  const updateCommissionMutation = useMutation({
    mutationFn: async ({ venueId, rate }: { venueId: string; rate: number }) => {
      const res = await apiClient.patch(`/api/admin/venues/${venueId}`, {
        commissionRate: rate,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "venues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "monetization"] });
      toast.success("Taux de commission mis à jour");
      setEditingVenue(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la mise à jour du taux");
    },
  });

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusBadge = (status: VenueStatus) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Publié
          </span>
        );
      case "PENDING_VALIDATION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            En attente
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Suspendu
          </span>
        );
      case "DRAFT":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            Brouillon
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Gestion &amp; Validation des Salons
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Supervisez les établissements partenaires, validez les demandes d&apos;inscription et ajustez les commissions.
          </p>
        </div>
        <Link
          href="/admin/venues/create-assisted"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          Création Assistée
        </Link>
      </div>

      {/* Barre d'outils et filtres */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Onglets de Statut */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: "Tous", value: "ALL" },
            { label: "En attente", value: "PENDING_VALIDATION" },
            { label: "Publiés", value: "PUBLISHED" },
            { label: "Suspendus", value: "SUSPENDED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedStatus === tab.value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Barre de Recherche */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Gestion d'erreur */}
      {isError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900">
              Erreur lors du chargement des salons
            </h4>
            <p className="text-xs text-red-700 mt-1">
              {error instanceof Error ? error.message : "Erreur de connexion serveur."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Réessayer
            </button>
          </div>
        </div>
      )}

      {/* Table des Établissements */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3.5">Établissement</th>
                <th className="px-6 py-3.5">Localisation</th>
                <th className="px-6 py-3.5">Responsable</th>
                <th className="px-6 py-3.5">Statut</th>
                <th className="px-6 py-3.5">Commission</th>
                <th className="px-6 py-3.5">Revenus Plateforme</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-36 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 bg-neutral-200 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-7 w-20 bg-neutral-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : venues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-500">
                    Aucun établissement ne correspond aux filtres appliqués.
                  </td>
                </tr>
              ) : (
                venues.map((venue) => (
                  <tr key={venue.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-900">{venue.name}</div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">/{venue.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-600 text-xs">
                      <div>{venue.city} ({venue.postalCode})</div>
                      <div className="text-neutral-400 truncate max-w-xs">{venue.address}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-neutral-800">{venue.ownerName}</div>
                      <div className="text-neutral-500">{venue.ownerEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(venue.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditingVenue(venue);
                          setNewRatePercent((venue.commissionRate ?? 0.018) * 100);
                        }}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded transition-colors"
                        title="Modifier la commission"
                      >
                        {((venue.commissionRate ?? 0.018) * 100).toFixed(1)} %
                        <Percent className="w-3 h-3 text-neutral-400" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-neutral-900">
                        {formatEuro(venue.totalRevenueEuros)}
                      </div>
                      <div className="text-neutral-400">
                        {venue.bookingsCount} résa(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {venue.status === "PENDING_VALIDATION" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                venueId: venue.id,
                                status: "PUBLISHED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                          >
                            Valider
                          </button>
                        )}
                        {venue.status === "PUBLISHED" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                venueId: venue.id,
                                status: "SUSPENDED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                            className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
                          >
                            Suspendre
                          </button>
                        )}
                        {venue.status === "SUSPENDED" && (
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                venueId: venue.id,
                                status: "PUBLISHED",
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                            className="px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors"
                          >
                            Réactiver
                          </button>
                        )}
                        <Link
                          href={`/salons/${venue.slug}`}
                          target="_blank"
                          className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                          title="Voir la fiche publique"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'ajustement du taux de commission */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">
                Ajuster la Commission
              </h3>
              <button
                onClick={() => setEditingVenue(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Modifiez le taux de commission Belora appliqué aux réservations de{" "}
              <strong className="text-neutral-800">{editingVenue.name}</strong>.
            </p>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Taux de commission (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={newRatePercent}
                  onChange={(e) => setNewRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                  %
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingVenue(null)}
                className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() =>
                  updateCommissionMutation.mutate({
                    venueId: editingVenue.id,
                    rate: newRatePercent / 100,
                  })
                }
                disabled={updateCommissionMutation.isPending}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {updateCommissionMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
