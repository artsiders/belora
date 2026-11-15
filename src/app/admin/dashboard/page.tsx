"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  TrendingUp,
  Coins,
  CalendarCheck,
  Store,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

interface DashboardMetricsResponse {
  metrics: {
    kpis: {
      gmvEuros: number;
      commissionsEuros: number;
      totalBookings: number;
      confirmedBookings: number;
      completedBookings: number;
      activeVenuesCount: number;
      pendingVenuesCount: number;
      totalUsersCount: number;
      customerCount: number;
      proCount: number;
    };
    recentBookings: {
      id: string;
      reference: string;
      clientName: string;
      venueName: string;
      totalPriceEuros: number;
      depositEuros: number;
      commissionEuros: number;
      status: string;
      createdAt: string;
    }[];
  };
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<DashboardMetricsResponse>({
      queryKey: ["admin", "dashboard"],
      queryFn: async () => {
        const res = await apiClient.get<DashboardMetricsResponse>("/admin/dashboard");
        return res.data;
      },
      staleTime: 30_000,
    });

  const hasError = isError || Boolean((data as any)?.error);
  const errorMessage =
    (data as any)?.error ||
    (error instanceof Error ? error.message : "Une erreur réseau est survenue.");

  const kpis = data?.metrics?.kpis;
  const recentBookings = data?.metrics?.recentBookings || [];

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-8 container mx-auto">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Vue d&apos;ensemble de la Marketplace
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Indicateurs d&apos;activité, revenus consolidés et volume des réservations Belora.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-outline text-xs px-3.5 py-2 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
          <Link
            href="/admin/venues/create-assisted"
            className="btn btn-primary text-xs px-4 py-2 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Nouveau Salon Partenaire</span>
          </Link>
        </div>
      </div>

      {/* État d'erreur réutilisable */}
      {hasError && (
        <Alert
          variant="error"
          title="Impossible de charger les indicateurs de la plateforme"
          description={errorMessage}
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
            isLoading: isFetching,
          }}
        />
      )}

      {/* Cartes KPI (Chirurgical inline skeletons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* GMV Total */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Volume d&apos;Affaires (GMV)
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <InlineSkeleton width="w-32" height="h-8" />
            ) : (
              <div className="text-2xl font-bold text-neutral-900">
                {formatEuro(kpis?.gmvEuros || 0)}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              Sur réservations confirmées &amp; honorées
            </p>
          </div>
        </div>

        {/* Commissions Belora */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Commissions Plateforme
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center text-secondary-800">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <InlineSkeleton width="w-28" height="h-8" />
            ) : (
              <div className="text-2xl font-bold text-secondary-900">
                {formatEuro(kpis?.commissionsEuros || 0)}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              Revenu net généré par Belora
            </p>
          </div>
        </div>

        {/* Réservations */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Réservations Totales
            </span>
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <InlineSkeleton width="w-20" height="h-8" />
            ) : (
              <div className="text-2xl font-bold text-neutral-900">
                {kpis?.totalBookings || 0}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              {kpis?.completedBookings || 0} terminées &bull; {kpis?.confirmedBookings || 0} à venir
            </p>
          </div>
        </div>

        {/* Salons Actifs */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Salons Actifs
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <InlineSkeleton width="w-20" height="h-8" />
            ) : (
              <div className="text-2xl font-bold text-neutral-900">
                {kpis?.activeVenuesCount || 0}
              </div>
            )}
            <p className="text-xs text-neutral-500 mt-1">
              {kpis?.pendingVenuesCount || 0} en attente de vérification
            </p>
          </div>
        </div>
      </div>

      {/* Activité Récente (Tableau des réservations) */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-neutral-900">
              Dernières Transactions Plateforme
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Flux des réservations passées en direct à travers toute la France.
            </p>
          </div>
          <Link
            href="/admin/venues"
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
          >
            <span>Voir les établissements</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3.5">Référence</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Salon</th>
                <th className="px-6 py-3.5">Montant TTC</th>
                <th className="px-6 py-3.5">Commission</th>
                <th className="px-6 py-3.5">Statut</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><InlineSkeleton width="w-20" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-28" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-32" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-16" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-16" height="h-4" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-20" height="h-5" /></td>
                    <td className="px-6 py-4"><InlineSkeleton width="w-24" height="h-4" /></td>
                  </tr>
                ))
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <EmptyState
                      icon={CalendarCheck}
                      title="Aucune transaction récente"
                      description="Les réservations effectuées par les clients s'afficheront ici en direct."
                    />
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => {
                  const statusConfig =
                    b.status === "completed"
                      ? { label: "Honorée", variant: "success" as const }
                      : b.status === "confirmed"
                      ? { label: "Confirmée", variant: "info" as const }
                      : b.status === "cancelled"
                      ? { label: "Annulée", variant: "danger" as const }
                      : { label: b.status, variant: "neutral" as const };

                  return (
                    <tr key={b.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-neutral-800 text-xs">
                        {b.reference}
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        {b.clientName}
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {b.venueName}
                      </td>
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        {formatEuro(b.totalPriceEuros)}
                      </td>
                      <td className="px-6 py-4 font-medium text-secondary-800">
                        {formatEuro(b.commissionEuros)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-500">
                        {new Date(b.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
