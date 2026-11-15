"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Settings,
  Activity,
  Database,
  Server,
  ShieldCheck,
  AlertTriangle,
  Save,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { toast } from "sonner";

interface SettingsData {
  settings: {
    defaultCommissionRate: number;
    maintenanceMode: boolean;
  };
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
  const queryClient = useQueryClient();
  const [commissionRatePercent, setCommissionRatePercent] = useState<number>(1.8);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  const { data, isLoading, isError, refetch } = useQuery<SettingsData>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await apiClient.get<SettingsData>("/admin/settings");
      return res.data;
    },
    staleTime: 15_000,
  });

  useEffect(() => {
    if (data?.settings) {
      setCommissionRatePercent(Number((data.settings.defaultCommissionRate * 100).toFixed(2)));
      setMaintenanceMode(data.settings.maintenanceMode);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      defaultCommissionRate: number;
      maintenanceMode: boolean;
    }) => {
      const res = await apiClient.patch("/admin/settings", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Paramètres système mis à jour avec succès.");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Erreur lors de la sauvegarde.";
      toast.error(msg);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      defaultCommissionRate: commissionRatePercent / 100,
      maintenanceMode,
    });
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Paramètres & Santé Système
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Contrôlez les règles globales, activez le mode maintenance et inspectez l'infrastructure.
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

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General Marketplace Configuration */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <Sliders className="w-5 h-5 text-neutral-700" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Paramètres Monétaires & Commissions
              </h3>
              <p className="text-xs text-neutral-500">
                Définissez la commission plateforme par défaut appliquée aux nouveaux salons créés.
              </p>
            </div>
          </div>

          <div className="max-w-md space-y-2">
            <label className="block text-xs font-semibold text-neutral-700">
              Taux de Commission Plateforme (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="0"
                max="50"
                value={commissionRatePercent}
                onChange={(e) => setCommissionRatePercent(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <span className="text-xs text-neutral-500">
                (Standard Belora : 1.8% sur chaque réservation TTC)
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Mode Toggle */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Mode Maintenance Plateforme
              </h3>
              <p className="text-xs text-neutral-500">
                Désactive l'accès public des clients et affiche un écran d'indisponibilité temporaire.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div>
              <span className="text-sm font-bold text-neutral-900 block">
                Statut du Mode Maintenance
              </span>
              <span className="text-xs text-neutral-500">
                {maintenanceMode
                  ? "Actif — Les clients ne peuvent pas réserver."
                  : "Désactivé — La plateforme est accessible normalement."}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                maintenanceMode
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              }`}
            >
              {maintenanceMode ? "Désactiver la maintenance" : "Activer la maintenance"}
            </button>
          </div>
        </div>

        {/* Compliance and Audit Cards */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Conformité Légale & Données
              </h3>
              <p className="text-xs text-neutral-500">
                Vérifications automatiques de sécurité et archivage fiscal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
              <span className="font-bold text-neutral-900">Clôture Fiscale Z (NF525)</span>
              <p className="text-neutral-500">
                Verrouillage immuable des tickets de caisse POS et clôtures journalières automatisées.
              </p>
              <div className="pt-2">
                <Badge variant="success">Conforme</Badge>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
              <span className="font-bold text-neutral-900">Séquestre Stripe Connect</span>
              <p className="text-neutral-500">
                Fonds clients isolés sous mandat de paiement européen agréé ACPR.
              </p>
              <div className="pt-2">
                <Badge variant="success">Sécurisé</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {updateMutation.isPending ? "Sauvegarde en cours..." : "Enregistrer les paramètres"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
