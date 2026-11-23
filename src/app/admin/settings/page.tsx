"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Activity,
  Database,
  Server,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";

interface SettingsData {
  health: {
    databaseStatus: "healthy" | "degraded" | "down";
    latencyMs: number;
    tablesCount: {
      users: number;
      venues: number;
      bookings: number;
      reviews: number;
    };
    serverUptimeSeconds: number;
    nodeVersion: string;
    environment: string;
  };
}

export default function AdminSettingsPage() {
  const { data, isLoading, isError, refetch } = useQuery<SettingsData>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await apiClient.get<SettingsData>("/admin/settings");
      return res.data;
    },
    staleTime: 15_000,
  });

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8 container mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Santé système
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Inspectez l&apos;état de l&apos;infrastructure de la plateforme.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
          <span>Rafraîchir Diagnostic</span>
        </button>
      </div>

      {isError && (
        <Alert
          variant="error"
          title="Erreur de chargement"
          description="Impossible d'accéder aux paramètres système."
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
          }}
        />
      )}

      {/* Infrastructure Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Base de Données
            </span>
            <Database className="w-4 h-4 text-primary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : data?.health.databaseStatus === "healthy" ? (
              <div className="flex items-center gap-2">
                <Badge variant="success">Opérationnelle</Badge>
                <span className="text-xs text-neutral-500 font-mono">
                  {data.health.latencyMs} ms
                </span>
              </div>
            ) : (
              <Badge variant="danger">Problème détecté</Badge>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Uptime Serveur
            </span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-20" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900 font-mono">
                {formatUptime(data?.health.serverUptimeSeconds || 0)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Environnement
            </span>
            <Activity className="w-4 h-4 text-secondary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : (
              <span className="text-sm font-bold text-neutral-800 uppercase tracking-wider font-mono">
                {data?.health.environment} ({data?.health.nodeVersion})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Les règles commerciales ont une page dédiée : une seule source de vérité */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sliders className="w-5 h-5 text-neutral-700 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-neutral-900">Commissions, forfaits et maintenance</h3>
            <p className="text-sm text-neutral-500">
              Les règles de commission, les frais de paiement, la durée d&apos;essai et le mode maintenance se règlent dans
              Monétisation. Les forfaits se gèrent dans Forfaits.
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/admin/plans" className="btn btn-outline btn-sm">
            Forfaits
          </Link>
          <Link href="/admin/monetization" className="btn btn-dark btn-sm">
            Monétisation
          </Link>
        </div>
      </div>
    </div>
  );
}
