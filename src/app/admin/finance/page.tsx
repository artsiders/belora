"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  Wallet,
  Coins,
  CreditCard,
  Download,
  Building2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";

interface FinancialReport {
  kpis: {
    gmvTotalEuros: number;
    commissionsCollectedEuros: number;
    depositsEscrowEuros: number;
    inStoreRemainingEuros: number;
    stripeConnectedVenuesCount: number;
    stripePendingVenuesCount: number;
  };
  venuesFinances: {
    venueId: string;
    venueName: string;
    city: string;
    commissionRate: number;
    gmvEuros: number;
    commissionsEuros: number;
    depositsEuros: number;
    stripeAccountId: string | null;
    stripeChargesEnabled: boolean;
  }[];
  recentTransactions: {
    id: string;
    reference: string;
    venueName: string;
    clientName: string;
    amountEuros: number;
    depositEuros: number;
    commissionEuros: number;
    status: string;
    stripePaymentIntentId: string | null;
    createdAt: string;
  }[];
}

export default function AdminFinancePage() {
  const { data, isLoading, isError, refetch } = useQuery<{
    report: FinancialReport;
    error?: string;
  }>({
    queryKey: ["admin", "finance"],
    queryFn: async () => {
      const res = await apiClient.get<{ report: FinancialReport }>("/admin/finance");
      return res.data;
    },
    staleTime: 30_000,
  });

  const report = data?.report;
  const hasError = isError || Boolean(data?.error);

  const handleExportCsv = () => {
    toast.info("Téléchargement du grand livre comptable...");
    window.location.href = "/api/admin/finance/export";
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Finances & Payouts Stripe
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Supervisez les volumes transigés, la rentabilité de la marketplace et les comptes Stripe Connect.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <Download className="w-4 h-4 text-neutral-300" />
          <span>Exporter CSV Comptable</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              GMV Total Transigé
            </span>
            <TrendingUp className="w-4 h-4 text-primary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {(report?.kpis.gmvTotalEuros || 0).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Commissions Belora Encaissées
            </span>
            <Coins className="w-4 h-4 text-secondary-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {(report?.kpis.commissionsCollectedEuros || 0).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Acomptes Séquestrés (En ligne)
            </span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {(report?.kpis.depositsEscrowEuros || 0).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Solde Réglé en Salon
            </span>
            <Wallet className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <InlineSkeleton width="w-24" height="h-8" />
            ) : (
              <span className="text-2xl font-extrabold text-neutral-900">
                {(report?.kpis.inStoreRemainingEuros || 0).toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Connect Overview Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Statut Déploiement Stripe Connect Custom
            </h3>
            <p className="text-xs text-neutral-500">
              Vérification des comptes de reversement bancaire automatisé pour les salons partenaires.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Badge variant="success">
              {report?.kpis.stripeConnectedVenuesCount || 0} Salons Connectés
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">
              {report?.kpis.stripePendingVenuesCount || 0} En attente d'onboarding
            </Badge>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {hasError && (
        <Alert
          variant="error"
          title="Erreur de chargement"
          description="Impossible de récupérer le rapport financier de la plateforme."
          action={{
            label: "Réessayer",
            onClick: () => refetch(),
          }}
        />
      )}

      {/* Salons Financial Breakdown */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">
              Performance Financière par Établissement
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Détail du chiffre d'affaires, commissions Belora et intégration bancaire.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between py-2 border-b border-neutral-100">
                <InlineSkeleton width="w-40" height="h-4" />
                <InlineSkeleton width="w-20" height="h-4" />
                <InlineSkeleton width="w-24" height="h-4" />
              </div>
            ))}
          </div>
        ) : !report?.venuesFinances || report.venuesFinances.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={FileSpreadsheet}
              title="Aucun établissement enregistré"
              description="Les statistiques financières s'afficheront dès qu'un salon enregistrera des réservations."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Établissement</th>
                  <th className="py-3 px-4">Taux Commission</th>
                  <th className="py-3 px-4">Volume GMV Total</th>
                  <th className="py-3 px-4">Acomptes En Ligne</th>
                  <th className="py-3 px-4">Commissions Belora</th>
                  <th className="py-3 px-4 text-right">Stripe Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report.venuesFinances.map((v) => (
                  <tr key={v.venueId} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 text-sm">
                        {v.venueName}
                      </div>
                      <div className="text-neutral-500 text-xs mt-0.5">{v.city}</div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-neutral-700">
                      {(v.commissionRate * 100).toFixed(1)}%
                    </td>

                    <td className="py-3 px-4 font-bold text-neutral-900">
                      {v.gmvEuros.toFixed(2)} €
                    </td>

                    <td className="py-3 px-4 text-emerald-700 font-medium">
                      {v.depositsEuros.toFixed(2)} €
                    </td>

                    <td className="py-3 px-4 font-bold text-secondary-700">
                      {v.commissionsEuros.toFixed(2)} €
                    </td>

                    <td className="py-3 px-4 text-right">
                      {v.stripeChargesEnabled ? (
                        <Badge variant="success">Paiements Activés</Badge>
                      ) : (
                        <Badge variant="warning">Non Connecté</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions Journal */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200/80">
          <h3 className="text-sm font-bold text-neutral-900">
            Dernières Transactions Encaissées
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Historique temps réel des acomptes et flux financiers.
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <InlineSkeleton key={i} width="w-full" height="h-6" />
            ))}
          </div>
        ) : !report?.recentTransactions || report.recentTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            Aucune transaction enregistrée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/80 text-neutral-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Référence</th>
                  <th className="py-3 px-4">Salon</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Montant Prestation</th>
                  <th className="py-3 px-4">Acompte Séquestré</th>
                  <th className="py-3 px-4">Part Belora</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {report.recentTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">
                      {t.reference}
                    </td>
                    <td className="py-3 px-4 text-neutral-800 font-medium">{t.venueName}</td>
                    <td className="py-3 px-4 text-neutral-600">{t.clientName}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      {t.amountEuros.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-medium">
                      {t.depositEuros.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-secondary-700 font-bold">
                      {t.commissionEuros.toFixed(2)} €
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
