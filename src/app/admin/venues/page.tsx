"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Store,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Percent,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { VenueStatus } from "@prisma/client";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { VenueCommissionModal } from "@/components/admin/billing/venue-commission-modal";
import {
  VenueSubscriptionModal,
  type AdminVenueSubscription,
} from "@/components/admin/billing/venue-subscription-modal";
import { SUBSCRIPTION_STATE_LABELS, formatRate } from "@/modules/billing/format";
import type { EffectiveSubscriptionStateValue } from "@/modules/billing/types";

interface AdminVenueItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  status: VenueStatus;
  commissionRate: number | null;
  commissionRateUntil: string | null;
  subscription: (AdminVenueSubscription & { planName: string; state: EffectiveSubscriptionStateValue }) | null;
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
  const [subscriptionVenue, setSubscriptionVenue] = useState<AdminVenueItem | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<VenuesResponse>({
    queryKey: ["admin", "venues", selectedStatus, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const res = await apiClient.get<VenuesResponse>(`/admin/venues?${params.toString()}`);
      return res.data;
    },
  });

  const venues = data?.venues || [];

  // Mutation pour changer le statut (Validation / Suspension)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ venueId, status }: { venueId: string; status: VenueStatus }) => {
      const res = await apiClient.patch(`/admin/venues/${venueId}`, { status });
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
    onError: (err: ApiErrorResponse) => toast.error(err.error),
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
        return <Badge variant="success" icon={CheckCircle2}>Publié</Badge>;
      case "PENDING_VALIDATION":
        return <Badge variant="warning" icon={AlertTriangle}>En attente</Badge>;
      case "SUSPENDED":
        return <Badge variant="danger" icon={XCircle}>Suspendu</Badge>;
      case "DRAFT":
      default:
        return <Badge variant="neutral">Brouillon</Badge>;
    }
  };

  return (
    <div className="space-y-6 container mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
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
        <Alert
          variant="error"
          title="Erreur lors du chargement des salons"
          description={
            error instanceof Error ? error.message : "Erreur de connexion serveur."
          }
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
            isLoading: isFetching,
          }}
        />
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
                <th className="px-6 py-3.5">Forfait</th>
                <th className="px-6 py-3.5">Commission</th>
                <th className="px-6 py-3.5">Revenus Plateforme</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><InlineSkeleton width="w-36" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-28" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-32" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-20" height="h-5" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-24" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-12" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-20" height="h-4" /></td>
                    <td className="px-6 py-4 text-right"><InlineSkeleton width="w-20" height="h-7" /></td>
                  </tr>
                ))
              ) : venues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <EmptyState
                      icon={Store}
                      title="Aucun établissement trouvé"
                      description="Aucun établissement ne correspond aux filtres ou à la recherche appliquée."
                    />
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
                        type="button"
                        onClick={() => setSubscriptionVenue(venue)}
                        className="text-left text-sm hover:text-primary-700 transition-colors"
                        title="Gérer l'abonnement"
                      >
                        <span className="block font-medium text-neutral-800">
                          {venue.subscription?.planName ?? "Attribuer un forfait"}
                        </span>
                        <span className="block text-neutral-500">
                          {venue.subscription
                            ? venue.subscription.isComplimentary
                              ? "Offert"
                              : SUBSCRIPTION_STATE_LABELS[venue.subscription.state]
                            : SUBSCRIPTION_STATE_LABELS.none}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setEditingVenue(venue)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-primary-700 transition-colors"
                        title="Définir un taux négocié"
                      >
                        {venue.commissionRate === null ? "Standard" : formatRate(venue.commissionRate)}
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
                          href={`/venue/${venue.slug}`}
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

      {editingVenue && (
        <VenueCommissionModal venue={editingVenue} onClose={() => setEditingVenue(null)} />
      )}
      {subscriptionVenue && (
        <VenueSubscriptionModal venue={subscriptionVenue} onClose={() => setSubscriptionVenue(null)} />
      )}
    </div>
  );
}
