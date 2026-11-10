"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  TrendingUp,
  Coins,
  CalendarCheck,
  Store,
  Users,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

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
  const { data, isLoading, isError, error, refetch } = useQuery<DashboardMetricsResponse>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await apiClient.get<DashboardMetricsResponse>("/api/admin/dashboard");
      return res.data;
    },
    staleTime: 30_000,
  });

  const kpis = data?.metrics?.kpis;
  const recentBookings = data?.metrics?.recentBookings || [];

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Vue d&apos;ensemble de la Marketplace
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Indicateurs d&apos;activité, revenus consolidés et volume des réservations Belora.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
          <Link
            href="/admin/venues/create-assisted"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            Nouveau Salon Partenaire
          </Link>
        </div>
      </div>

      {/* État d'erreur explicite avec bouton Réessayer */}
      {isError && (
        <div className="p-5 rounded-xl border border-red-200 bg-red-50/70 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900">
              Impossible de charger les indicateurs de la plateforme
            </h3>
            <p className="text-xs text-red-700 mt-1">
              {error instanceof Error ? error.message : "Une erreur réseau est survenue."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Réessayer
            </button>
          </div>
        </div>
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
              <span className="block h-8 w-32 rounded bg-neutral-200 animate-pulse my-1" />
            ) : (
              <div className="text-2xl font-bold font-serif text-neutral-900">
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
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <span className="block h-8 w-28 rounded bg-neutral-200 animate-pulse my-1" />
            ) : (
              <div className="text-2xl font-bold font-serif text-amber-700">
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
              <span className="block h-8 w-20 rounded bg-neutral-200 animate-pulse my-1" />
            ) : (
              <div className="text-2xl font-bold font-serif text-neutral-900">
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
              <span className="block h-8 w-20 rounded bg-neutral-200 animate-pulse my-1" />
            ) : (
              <div className="text-2xl font-bold font-serif text-neutral-900">
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
            className="text-xs font-medium text-neutral-700 hover:text-neutral-900 flex items-center gap-1"
          >
            Voir les établissements <ExternalLink className="w-3.5 h-3.5" />
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
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 bg-neutral-200 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-neutral-200 rounded" /></td>
                  </tr>
                ))
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-500">
                    Aucune réservation enregistrée sur la plateforme pour le moment.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
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
                    <td className="px-6 py-4 font-medium text-amber-700">
                      {formatEuro(b.commissionEuros)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          b.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : b.status === "cancelled"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                        }`}
                      >
                        {b.status}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
