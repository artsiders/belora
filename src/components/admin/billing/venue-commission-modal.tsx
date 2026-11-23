"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput } from "@/components/pro-dashboard/ui/form-controls";
import { PercentInput } from "@/components/admin/ui/numeric-inputs";
import { billingKeys } from "@/components/billing/billing-queries";

interface VenueCommissionModalProps {
  venue: { id: string; name: string; commissionRate: number | null; commissionRateUntil: string | null };
  onClose: () => void;
}

/** Taux négocié pour un établissement, éventuellement limité dans le temps (offre de lancement). */
export function VenueCommissionModal({ venue, onClose }: VenueCommissionModalProps) {
  const queryClient = useQueryClient();
  const [rate, setRate] = useState<number | null>(venue.commissionRate);
  const [until, setUntil] = useState(venue.commissionRateUntil?.slice(0, 10) ?? "");

  const save = useMutation({
    mutationFn: async () =>
      (
        await apiClient.patch(`/admin/venues/${venue.id}`, {
          commissionRate: rate,
          commissionRateUntil: rate !== null && until ? new Date(`${until}T23:59:59`).toISOString() : null,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "venues"] });
      queryClient.invalidateQueries({ queryKey: billingKeys.adminMonetization });
      toast.success("Commission de l'établissement mise à jour");
      onClose();
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Commission négociée"
      description={`Taux appliqué aux réservations commissionnées de ${venue.name}. Laissez vide pour appliquer le taux du forfait ou de la plateforme.`}
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Annuler
          </button>
          <button type="button" onClick={() => save.mutate()} disabled={save.isPending} className="btn btn-dark">
            {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <PercentInput label="Taux négocié" nullable value={rate} onChange={setRate} />
        <FormInput
          label="Valable jusqu'au"
          type="date"
          value={until}
          disabled={rate === null}
          helper="Vide = sans limite de durée"
          onChange={(e) => setUntil(e.target.value)}
        />
      </div>
    </Modal>
  );
}
