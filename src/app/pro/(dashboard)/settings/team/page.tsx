"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, Plus, AlertCircle, RefreshCw, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput, Checkbox } from "@/components/pro-dashboard/ui/form-controls";
import { FormattedStaffWithSchedules } from "@/modules/pro/settings.service";

export default function TeamSettingsPage() {
  const queryClient = useQueryClient();

  const [editingStaff, setEditingStaff] = useState<FormattedStaffWithSchedules | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffColor, setNewStaffColor] = useState("#82385a");

  const {
    data: staffList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pro", "settings", "team"],
    queryFn: async () => {
      const res = await apiClient.get<{ team: FormattedStaffWithSchedules[] }>(
        "/pro/settings/team"
      );
      return res.data.team;
    },
    staleTime: 60_000,
  });

  const updateScheduleMutation = useMutation({
    mutationFn: async ({
      staffId,
      schedules,
    }: {
      staffId: string;
      schedules: FormattedStaffWithSchedules["schedules"];
    }) => {
      const res = await apiClient.patch<{ staffMember: FormattedStaffWithSchedules }>(
        `/pro/settings/team/${staffId}`,
        { schedules }
      );
      return res.data.staffMember;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "settings", "team"] });
      toast.success(`Planning de ${updated.name} mis à jour avec succès.`);
      setEditingStaff(null);
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la mise à jour.";
      toast.error(msg);
    },
  });

  const createStaffMutation = useMutation({
    mutationFn: async (payload: { name: string; role: string; color: string }) => {
      const res = await apiClient.post<{ staffMember: FormattedStaffWithSchedules }>(
        "/pro/settings/team",
        payload
      );
      return res.data.staffMember;
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "settings", "team"] });
      toast.success(`Collaborateur ${created.name} ajouté.`);
      setIsInviteModalOpen(false);
      setNewStaffName("");
      setNewStaffRole("");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la création.";
      toast.error(msg);
    },
  });

  const handleDayScheduleChange = (
    dayOfWeek: number,
    field: "isActive" | "plannedStart" | "plannedEnd",
    val: boolean | string
  ) => {
    if (!editingStaff) return;
    setEditingStaff({
      ...editingStaff,
      schedules: editingStaff.schedules.map((sch) =>
        sch.dayOfWeek === dayOfWeek ? { ...sch, [field]: val } : sch
      ),
    });
  };

  const handleSaveStaffSchedule = () => {
    if (!editingStaff) return;
    updateScheduleMutation.mutate({
      staffId: editingStaff.id,
      schedules: editingStaff.schedules,
    });
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffRole.trim()) return;
    createStaffMutation.mutate({
      name: newStaffName.trim(),
      role: newStaffRole.trim(),
      color: newStaffColor,
    });
  };

  const hasError = isError || Boolean(error);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      {/* Titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Gestion du Temps de Travail & Équipe
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Plannings individuels, horaires hebdomadaires et congés des collaborateurs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un collaborateur</span>
        </button>
      </div>

      {/* État d'erreur */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger l&apos;équipe. Veuillez vérifier votre connexion.</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="btn btn-outline btn-xs flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réessayer</span>
          </button>
        </div>
      )}

      {/* Chargement chirurgical inline */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white border border-neutral-200 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-white border border-neutral-200 space-y-3">
          <p className="text-neutral-600 font-medium text-sm sm:text-base">
            Aucun membre d&apos;équipe configuré.
          </p>
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            Ajouter un collaborateur
          </button>
        </div>
      ) : (
        /* Grille des Membres d'Équipe */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.map((staff) => {
            const activeDays = staff.schedules
              .filter((sch) => sch.isActive)
              .map((sch) => sch.dayName.slice(0, 3))
              .join(", ");

            return (
              <div
                key={staff.id}
                className="p-5 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                      <Image
                        src={staff.avatar}
                        alt={staff.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-neutral-950">
                        {staff.name}
                      </h3>
                      <p className="text-sm text-neutral-500 font-medium">
                        {staff.role}
                      </p>
                      <p className="text-sm text-neutral-400 mt-0.5">
                        {staff.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 mt-1 border border-white shadow-2xs"
                    style={{ backgroundColor: staff.color }}
                    title="Couleur d'agenda"
                  />
                </div>

                {/* Horaires et Présence */}
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>
                      Plage habituelle :{" "}
                      <strong>
                        {staff.presenceToday.plannedStart} -{" "}
                        {staff.presenceToday.plannedEnd}
                      </strong>
                    </span>
                  </div>
                  <Badge
                    variant={staff.presenceToday.clockedIn ? "success" : "neutral"}
                    size="sm"
                  >
                    {staff.presenceToday.clockedIn ? "Présent(e)" : "Non pointé"}
                  </Badge>
                </div>

                {/* Jours travaillés & Bouton modifier */}
                <div className="flex items-center justify-between pt-1 text-sm text-neutral-600">
                  <span className="truncate max-w-[200px]">
                    Jours : <strong>{activeDays || "Aucun jour actif"}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingStaff(staff)}
                    className="btn btn-outline btn-xs flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>Modifier planning</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale d'Édition du Planning d'un Collaborateur */}
      {editingStaff && (
        <Modal
          isOpen={Boolean(editingStaff)}
          onClose={() => setEditingStaff(null)}
          title={`Planning hebdomadaire de ${editingStaff.name}`}
          description="Configurez les jours travaillés et plages horaires planifiées."
          maxWidth="md"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="btn btn-outline btn-sm"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveStaffSchedule}
                disabled={updateScheduleMutation.isPending}
                className="btn btn-primary btn-sm"
              >
                {updateScheduleMutation.isPending
                  ? "Enregistrement..."
                  : "Enregistrer le planning"}
              </button>
            </div>
          }
        >
          <div className="divide-y divide-neutral-100 space-y-3">
            {editingStaff.schedules.map((sch) => (
              <div
                key={sch.dayOfWeek}
                className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
              >
                <label
                  htmlFor={`sch-${editingStaff.id}-${sch.dayOfWeek}`}
                  className="flex items-center gap-2 cursor-pointer select-none w-32"
                >
                  <Checkbox
                    id={`sch-${editingStaff.id}-${sch.dayOfWeek}`}
                    checked={sch.isActive}
                    onChange={(e) =>
                      handleDayScheduleChange(
                        sch.dayOfWeek,
                        "isActive",
                        e.target.checked
                      )
                    }
                  />
                  <span className="font-semibold text-neutral-800">
                    {sch.dayName}
                  </span>
                </label>

                {sch.isActive ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={sch.plannedStart}
                      onChange={(e) =>
                        handleDayScheduleChange(
                          sch.dayOfWeek,
                          "plannedStart",
                          e.target.value
                        )
                      }
                      className="input input-sm font-semibold"
                    />
                    <span className="text-neutral-400 font-medium">à</span>
                    <input
                      type="time"
                      value={sch.plannedEnd}
                      onChange={(e) =>
                        handleDayScheduleChange(
                          sch.dayOfWeek,
                          "plannedEnd",
                          e.target.value
                        )
                      }
                      className="input input-sm font-semibold"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400 italic">Repos</span>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modale d'Ajout de Collaborateur */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Ajouter un collaborateur"
        description="Créez la fiche d'un nouvel artisan coiffeur ou membre de l'équipe."
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleCreateStaff}
              disabled={createStaffMutation.isPending}
              className="btn btn-primary btn-sm"
            >
              {createStaffMutation.isPending ? "Ajout..." : "Créer le collaborateur"}
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <FormInput
            label="Nom & Prénom"
            placeholder="Ex : Maxime Morel"
            value={newStaffName}
            onChange={(e) => setNewStaffName(e.target.value)}
            required
            autoFocus
          />
          <FormInput
            label="Titre / Rôle"
            placeholder="Ex : Artisan Coloriste & Soins"
            value={newStaffRole}
            onChange={(e) => setNewStaffRole(e.target.value)}
            required
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-neutral-800 uppercase tracking-wider block">
              Couleur sur l&apos;agenda
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newStaffColor}
                onChange={(e) => setNewStaffColor(e.target.value)}
                className="w-10 h-10 rounded border border-neutral-300 p-0.5 cursor-pointer"
              />
              <span className="text-sm text-neutral-600 font-mono">
                {newStaffColor}
              </span>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
