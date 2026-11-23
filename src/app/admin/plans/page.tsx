"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { PlanFormModal } from "@/components/admin/billing/plan-form-modal";
import { billingKeys } from "@/components/billing/billing-queries";
import { formatPrice, formatRate } from "@/modules/billing/format";
import type { AdminPlan } from "@/modules/billing/types";

function limit(value: number | null) {
  return value === null ? "Illimité" : String(value);
}

export default function AdminPlansPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [toDelete, setToDelete] = useState<AdminPlan | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<{ plans: AdminPlan[] }>({
    queryKey: billingKeys.adminPlans,
    queryFn: async () => (await apiClient.get<{ plans: AdminPlan[] }>("/admin/plans")).data,
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    placeholderData: keepPreviousData,
  });
  const plans = data?.plans ?? [];
  const hasError = isError || Boolean((data as { error?: string } | undefined)?.error);

  const remove = useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/admin/plans/${id}`)).data,
    onSuccess: () => {
      toast.success("Forfait supprimé");
      queryClient.invalidateQueries({ queryKey: billingKeys.adminPlans });
      queryClient.invalidateQueries({ queryKey: billingKeys.pricing });
      setToDelete(null);
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  const openForm = (plan: AdminPlan | null) => {
    setEditing(plan);
    setFormKey((k) => k + 1);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8 container mx-auto">
      <AdminPageHeader
        title="Forfaits"
        description="Les forfaits affichés sur la page tarifs, leurs prix, leurs limites et leur commission."
        actions={
          <>
            <Link href="/pro#pricing" target="_blank" className="btn btn-outline btn-sm">
              Voir la page tarifs
            </Link>
            <button type="button" onClick={() => openForm(null)} className="btn btn-dark btn-sm">
              <Plus className="w-4 h-4" />
              Nouveau forfait
            </button>
          </>
        }
      />

      {hasError ? (
        <Alert
          variant="error"
          title="Impossible de charger les forfaits"
          description="Vérifiez votre connexion puis réessayez."
          action={{ label: "Réessayer", onClick: () => refetch(), isLoading: isFetching }}
        />
      ) : !isLoading && plans.length === 0 ? (
        <EmptyState
          title="Aucun forfait"
          description="Créez au moins un forfait pour permettre l'inscription des professionnels."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 border-b border-neutral-200/80">
                <th className="px-5 py-3 font-medium">Forfait</th>
                <th className="px-5 py-3 font-medium">Mensuel</th>
                <th className="px-5 py-3 font-medium">Annuel / mois</th>
                <th className="px-5 py-3 font-medium">Collab.</th>
                <th className="px-5 py-3 font-medium">Cabines</th>
                <th className="px-5 py-3 font-medium">Commission</th>
                <th className="px-5 py-3 font-medium">Abonnés</th>
                <th className="px-5 py-3 font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading
                ? [0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td className="px-5 py-4" colSpan={8}>
                        <InlineSkeleton width="w-full" height="h-5" />
                      </td>
                    </tr>
                  ))
                : plans.map((plan) => (
                    <tr key={plan.id} className={plan.isActive ? "" : "text-neutral-400"}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-900">{plan.name}</span>
                          {plan.isPublic ? (
                            <Eye className="w-4 h-4 text-neutral-400" aria-label="Affiché sur la page tarifs" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-neutral-400" aria-label="Masqué de la page tarifs" />
                          )}
                        </div>
                        <span className="text-neutral-500">
                          {plan.slug}
                          {!plan.isActive && " · non souscriptible"}
                          {plan.isContactSales && " · sur devis"}
                        </span>
                      </td>
                      <td className="px-5 py-4 num">
                        {plan.isContactSales ? "—" : formatPrice(plan.monthlyPriceCents, plan.currency)}
                      </td>
                      <td className="px-5 py-4 num">
                        {plan.isContactSales ? "—" : formatPrice(plan.annualPriceCents, plan.currency)}
                      </td>
                      <td className="px-5 py-4">{limit(plan.maxStaff)}</td>
                      <td className="px-5 py-4">{limit(plan.maxResources)}</td>
                      <td className="px-5 py-4">
                        {plan.commissionRate === null ? "Taux plateforme" : formatRate(plan.commissionRate)}
                      </td>
                      <td className="px-5 py-4 num">{plan.subscriberCount}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openForm(plan)}
                            className="btn btn-ghost btn-sm"
                            aria-label={`Modifier ${plan.name}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setToDelete(plan)}
                            disabled={plan.subscriberCount > 0}
                            title={plan.subscriberCount > 0 ? "Forfait avec abonnés : désactivez-le plutôt" : undefined}
                            className="btn btn-ghost btn-sm"
                            aria-label={`Supprimer ${plan.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      <PlanFormModal
        key={formKey}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        plan={editing}
        nextOrder={plans.length}
      />

      <ConfirmModal
        isOpen={Boolean(toDelete)}
        title="Supprimer ce forfait ?"
        description={`Le forfait ${toDelete?.name ?? ""} sera définitivement supprimé. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        tone="danger"
        isPending={remove.isPending}
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
