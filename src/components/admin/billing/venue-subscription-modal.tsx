"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormCheckbox, FormInput } from "@/components/pro-dashboard/ui/form-controls";
import { Select } from "@/components/ui/select";
import { billingKeys } from "@/components/billing/billing-queries";
import type { AdminPlan, BillingIntervalValue, SubscriptionStatusValue } from "@/modules/billing/types";

export interface AdminVenueSubscription {
  planId: string;
  status: string;
  interval: string;
  trialEndsAt: string | null;
  isComplimentary: boolean;
}

interface VenueSubscriptionModalProps {
  venue: { id: string; name: string; subscription: AdminVenueSubscription | null };
  onClose: () => void;
}

const STATUS_OPTIONS: { value: SubscriptionStatusValue; label: string }[] = [
  { value: "TRIALING", label: "Essai en cours" },
  { value: "ACTIVE", label: "Actif" },
  { value: "PAST_DUE", label: "Paiement en retard" },
  { value: "CANCELED", label: "Résilié" },
];

const INTERVAL_OPTIONS: { value: BillingIntervalValue; label: string }[] = [
  { value: "MONTHLY", label: "Mensuel" },
  { value: "ANNUAL", label: "Annuel" },
];

/**
 * Attribution manuelle d'un forfait : prolongation d'essai, forfait offert, régularisation.
 * Les abonnements payés en ligne sont ensuite resynchronisés automatiquement par la facturation.
 */
export function VenueSubscriptionModal({ venue, onClose }: VenueSubscriptionModalProps) {
  const queryClient = useQueryClient();
  const sub = venue.subscription;
  const [planId, setPlanId] = useState(sub?.planId ?? "");
  const [status, setStatus] = useState<SubscriptionStatusValue>((sub?.status as SubscriptionStatusValue) ?? "TRIALING");
  const [interval, setInterval] = useState<BillingIntervalValue>((sub?.interval as BillingIntervalValue) ?? "MONTHLY");
  const [trialEndsAt, setTrialEndsAt] = useState(sub?.trialEndsAt?.slice(0, 10) ?? "");
  const [isComplimentary, setIsComplimentary] = useState(sub?.isComplimentary ?? false);

  const plans = useQuery<{ plans: AdminPlan[] }>({
    queryKey: billingKeys.adminPlans,
    queryFn: async () => (await apiClient.get<{ plans: AdminPlan[] }>("/admin/plans")).data,
    staleTime: 30_000,
  });

  const save = useMutation({
    mutationFn: async () =>
      (
        await apiClient.put(`/admin/venues/${venue.id}/subscription`, {
          planId,
          status,
          interval,
          trialEndsAt: status === "TRIALING" && trialEndsAt ? new Date(`${trialEndsAt}T23:59:59`).toISOString() : null,
          isComplimentary,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "venues"] });
      queryClient.invalidateQueries({ queryKey: billingKeys.adminMonetization });
      queryClient.invalidateQueries({ queryKey: billingKeys.adminPlans });
      toast.success("Abonnement mis à jour");
      onClose();
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Abonnement de l'établissement"
      description={venue.name}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button
            type="button"
            onClick={() => save.mutate()}
            disabled={!planId || save.isPending}
            className="btn btn-dark"
          >
            {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Select
          label="Forfait"
          required
          options={(plans.data?.plans ?? []).map((p) => ({ value: p.id, label: p.name }))}
          value={planId || undefined}
          onChange={(v) => setPlanId(v)}
          placeholder={plans.isLoading ? "Chargement..." : "Choisir un forfait"}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Statut" options={STATUS_OPTIONS} value={status} onChange={(v) => setStatus(v)} />
          <Select label="Facturation" options={INTERVAL_OPTIONS} value={interval} onChange={(v) => setInterval(v)} />
        </div>
        {status === "TRIALING" && (
          <FormInput
            label="Fin de l'essai"
            type="date"
            value={trialEndsAt}
            onChange={(e) => setTrialEndsAt(e.target.value)}
          />
        )}
        <FormCheckbox
          label="Forfait offert"
          description="L'établissement garde l'accès sans facturation, quel que soit le statut."
          checked={isComplimentary}
          onChange={(e) => setIsComplimentary(e.target.checked)}
        />
      </div>
    </Modal>
  );
}
