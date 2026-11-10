"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Coins,
  Percent,
  AlertTriangle,
  RefreshCw,
  Save,
  CheckCircle2,
  Sliders,
  ShieldAlert,
} from "lucide-react";

interface MonetizationSettingsResponse {
  settings: {
    defaultCommissionRate: number;
    maintenanceMode: boolean;
    totalCommissionsCollectedEuros: number;
    venuesSummary: {
      venueId: string;
      venueName: string;
      commissionRate: number;
      gmvEuros: number;
      commissionCollectedEuros: number;
    }[];
  };
}

export default function AdminMonetizationPage() {
  const queryClient = useQueryClient();
  const [defaultRatePercent, setDefaultRatePercent] = useState<number>(1.8);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);

  const { data, isLoading, isError, error, refetch } = useQuery<MonetizationSettingsResponse>({
    queryKey: ["admin", "monetization"],
    queryFn: async () => {
      const res = await apiClient.get<MonetizationSettingsResponse>("/api/admin/monetization");
      return res.data;
    },
  });

  const settings = data?.settings;

  useEffect(() => {
    if (settings) {
      setDefaultRatePercent(settings.defaultCommissionRate * 100);
      setMaintenanceMode(settings.maintenanceMode);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { defaultCommissionRate: number; maintenanceMode: boolean }) => {
      const res = await apiClient.patch("/api/admin/monetization", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "monetization"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      toast.success("Paramètres de monétisation enregistrés avec succès");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la mise à jour");
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      defaultCommissionRate: defaultRatePercent / 100,
      maintenanceMode,
    });
  };

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
            Monétisation &amp; Commissions Plateforme
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            Gérez les taux de prélèvement appliqués aux réservations et surveillez le chiffre d&apos;affaires généré.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      {/* Erreur */}
      {isError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900">
              Erreur lors du chargement des paramètres
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

      {/* Section Paramétrage Global */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de commission globale */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-2 bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm">
              <Sliders className="w-4 h-4 text-neutral-500" />
              <span>Paramètres Globaux de la Marketplace</span>
            </div>
            {settings?.maintenanceMode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <ShieldAlert className="w-3 h-3" />
                Mode maintenance activé
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Taux de commission par défaut pour les nouveaux salons
              </label>
              <p className="text-xs text-neutral-500 mb-2">
                Ce taux s&apos;applique à tous les salons qui n&apos;ont pas de taux négocié personnalisé.
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-40">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={defaultRatePercent}
                    onChange={(e) => setDefaultRatePercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                    %
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  (soit {(defaultRatePercent / 100).toFixed(4)} en décimal)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200/80">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <div>
                  <span className="text-xs font-semibold text-neutral-800">
                    Mode Maintenance Marketplace
                  </span>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Suspend temporairement la prise de nouvelles réservations grand public tout en laissant l&apos;accès pro ouvert.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {updateMutation.isPending ? "Enregistrement..." : "Enregistrer les Paramètres"}
            </button>
          </div>
        </form>

        {/* Encadré Récapitulatif Global */}
        <div className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-neutral-900 font-semibold text-sm pb-4 border-b border-neutral-200">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Total Récolté Belora</span>
            </div>
            <div className="mt-6">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Commissions cumulées
              </span>
              {isLoading ? (
                <span className="block h-9 w-36 rounded bg-neutral-200 animate-pulse my-2" />
              ) : (
                <div className="text-3xl font-serif font-bold text-amber-700 mt-1">
                  {formatEuro(settings?.totalCommissionsCollectedEuros || 0)}
                </div>
              )}
              <p className="text-xs text-neutral-500 mt-2">
                Montant total net prélevé sur les réservations honorées.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 text-xs text-neutral-500 space-y-1">
            <p className="flex items-center justify-between">
              <span>Salons partenaires :</span>
              <strong className="text-neutral-800 font-semibold">{settings?.venuesSummary?.length || 0}</strong>
            </p>
            <p className="flex items-center justify-between">
              <span>Prélèvement automatique :</span>
              <span className="text-emerald-700 font-medium">Stripe Connect</span>
            </p>
          </div>
        </div>
      </div>

      {/* Détail par Établissement Partenaire */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200/80">
          <h3 className="text-base font-semibold text-neutral-900">
            Commissions Collectées par Établissement
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Ventilation des volumes d&apos;affaires et des prélèvements Belora par salon.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3.5">Établissement</th>
                <th className="px-6 py-3.5">Taux Appliqué</th>
                <th className="px-6 py-3.5">Volume d&apos;Affaires (GMV)</th>
                <th className="px-6 py-3.5">Commissions Belora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-36 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-neutral-200 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-neutral-200 rounded" /></td>
                  </tr>
                ))
              ) : !settings?.venuesSummary || settings.venuesSummary.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-neutral-500">
                    Aucun salon partenaire enregistré.
                  </td>
                </tr>
              ) : (
                settings.venuesSummary.map((item) => (
                  <tr key={item.venueId} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {item.venueName}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-700">
                      {(item.commissionRate * 100).toFixed(1)} %
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {formatEuro(item.gmvEuros)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-amber-700">
                      {formatEuro(item.commissionCollectedEuros)}
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
