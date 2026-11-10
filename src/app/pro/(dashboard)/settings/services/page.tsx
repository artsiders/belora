"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Edit2,
  SlidersHorizontal,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ServiceEditModal } from "@/components/pro-dashboard/settings/service-edit-modal";
import { MassPriceModal } from "@/components/pro-dashboard/settings/mass-price-modal";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput } from "@/components/pro-dashboard/ui/form-controls";
import {
  ProService,
  ProServiceCategory,
  ProStaffMember,
  ProResource,
} from "@/lib/data/pro-mock-data";

export default function ServicesSettingsPage() {
  const queryClient = useQueryClient();

  // Modale édition / création de prestation
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProService | null>(null);

  // Modale édition de prix en masse
  const [isMassPriceModalOpen, setIsMassPriceModalOpen] = useState(false);

  // Modale ajout de catégorie
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Modale confirmation suppression
  const [categoryToDelete, setCategoryToDelete] = useState<ProServiceCategory | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  // 1. Récupération des prestations et catégories
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pro", "services"],
    queryFn: async () => {
      const res = await apiClient.get<{
        services: ProService[];
        categories: ProServiceCategory[];
      }>("/pro/services");
      return res.data;
    },
    staleTime: 30_000,
  });

  // 2. Récupération des collaborateurs et ressources pour les modales
  const { data: staffData } = useQuery({
    queryKey: ["pro", "staff"],
    queryFn: async () => {
      const res = await apiClient.get<{ staff: ProStaffMember[] }>("/pro/staff");
      return res.data;
    },
    staleTime: 60_000,
  });

  const { data: resourcesData } = useQuery({
    queryKey: ["pro", "resources"],
    queryFn: async () => {
      const res = await apiClient.get<{ resources: ProResource[] }>(
        "/pro/resources"
      );
      return res.data;
    },
    staleTime: 60_000,
  });

  const categories = data?.categories || [];
  const services = data?.services || [];
  const staffList = staffData?.staff || [];
  const resourceList = resourcesData?.resources || [];

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (payload: Partial<ProService>) => {
      const res = await apiClient.post<{ service: ProService }>("/pro/services", payload);
      return res.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success(`Prestation "${resData.service.name}" créée avec succès.`);
      setIsServiceModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Erreur lors de la création.";
      toast.error(msg);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<ProService> }) => {
      const res = await apiClient.patch<{ service: ProService }>(`/pro/services/${id}`, payload);
      return res.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success(`Prestation "${resData.service.name}" mise à jour.`);
      setIsServiceModalOpen(false);
      setEditingService(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Erreur lors de la modification.";
      toast.error(msg);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/pro/services/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success("Prestation supprimée.");
      setServiceToDeleteId(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Impossible de supprimer la prestation.";
      toast.error(msg);
    },
  });

  const duplicateServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await apiClient.post<{ service: ProService }>("/pro/services/duplicate", {
        serviceId,
      });
      return res.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success(`Prestation "${resData.service.name}" dupliquée.`);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Échec de la duplication.";
      toast.error(msg);
    },
  });

  const massPriceMutation = useMutation({
    mutationFn: async ({
      targetCategoryId,
      deltaPercent,
      deltaFixed,
    }: {
      targetCategoryId: string;
      deltaPercent: number;
      deltaFixed: number;
    }) => {
      const res = await apiClient.post<{ count: number; message: string }>("/pro/services/mass-price", {
        categoryId: targetCategoryId,
        deltaPercent,
        deltaFixed,
      });
      return res.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success(resData.message || "Tarifs mis à jour en masse avec succès.");
      setIsMassPriceModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Échec de la mise à jour des tarifs.";
      toast.error(msg);
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient.post<{ category: ProServiceCategory }>("/pro/services/categories", {
        name,
      });
      return res.data;
    },
    onSuccess: (resData) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success(`Catégorie "${resData.category.name}" ajoutée.`);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Échec de l'ajout de la catégorie.";
      toast.error(msg);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/pro/services/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "services"] });
      toast.success("Catégorie supprimée.");
      setCategoryToDelete(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Échec de la suppression de la catégorie.";
      toast.error(msg);
    },
  });

  // Gestion des actions formulaires
  const handleSaveService = (savedService: ProService) => {
    if (editingService) {
      updateServiceMutation.mutate({
        id: editingService.id,
        payload: savedService,
      });
    } else {
      createServiceMutation.mutate(savedService);
    }
  };

  const handleApplyMassEdit = (
    targetCategoryId: string,
    deltaPercent: number,
    deltaFixed: number
  ) => {
    massPriceMutation.mutate({
      targetCategoryId,
      deltaPercent,
      deltaFixed,
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategoryMutation.mutate(newCategoryName.trim());
  };

  const hasError = isError || Boolean(error);

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl">
      {/* Titre & Description */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
          Gestion des prestations
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
          Organisez vos tarifs, temps de pose, rituels et catégories de soins.
        </p>
      </div>

      {/* État d'erreur explicite avec réessai */}
      {hasError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Impossible de charger le catalogue des prestations. Veuillez vérifier votre connexion.</span>
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

      {/* Barre d'actions supérieures */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-200 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          className="btn btn-outline btn-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une catégorie</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMassPriceModalOpen(true)}
          className="btn btn-outline btn-xs flex items-center gap-1.5 text-primary-800 border-primary-200 bg-primary-50/50 hover:bg-primary-50"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Éditer les prix en masse</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingService(null);
            setIsServiceModalOpen(true);
          }}
          className="btn btn-primary btn-xs flex items-center gap-1.5 ms-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une prestation</span>
        </button>
      </div>

      {/* Indicateur de chargement chirurgical (Inline) */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3">
            <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ) : categories.length === 0 ? (
        /* État vide si aucune catégorie */
        <div className="p-8 text-center rounded-xl bg-white border border-neutral-200 space-y-3">
          <p className="text-sm sm:text-base text-neutral-600 font-medium">
            Aucune prestation enregistrée pour le moment.
          </p>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            Créer votre première catégorie
          </button>
        </div>
      ) : (
        /* Groupes de Catégories & Prestations */
        <div className="space-y-6">
          {categories.map((cat) => {
            const categoryServices = services.filter(
              (s) => s.categoryId === cat.id
            );

            return (
              <div
                key={cat.id}
                className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-2xs"
              >
                {/* Header de la Catégorie */}
                <div className="p-4 sm:p-4.5 bg-neutral-50/90 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950">
                    {cat.name}{" "}
                    <span className="text-sm font-normal text-neutral-400">
                      ({categoryServices.length})
                    </span>
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsServiceModalOpen(true);
                      }}
                      className="btn btn-outline btn-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter une prestation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="btn btn-ghost btn-xs text-neutral-400 hover:text-rose-700 hover:bg-rose-50 p-1.5"
                      title="Supprimer la catégorie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Liste des Prestations dans la Catégorie */}
                <div className="divide-y divide-neutral-100">
                  {categoryServices.length === 0 ? (
                    <div className="p-6 text-center text-sm text-neutral-400 italic">
                      Aucune prestation dans cette catégorie.
                    </div>
                  ) : (
                    categoryServices.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors"
                      >
                        {/* Côté Gauche : Nom + Durée + Prix */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <h4 className="text-sm sm:text-base font-normal text-neutral-950">
                                {srv.name}
                              </h4>
                              <span className="text-sm text-neutral-500 tabular-nums font-medium">
                                {srv.durationMinutes >= 60
                                  ? `${Math.floor(srv.durationMinutes / 60)} h ${
                                      srv.durationMinutes % 60 > 0
                                        ? `${srv.durationMinutes % 60}min`
                                        : ""
                                    }`
                                  : `${srv.durationMinutes}min`}{" "}
                                &bull;{" "}
                                <strong className="text-neutral-900 font-bold">
                                  {srv.priceEuros.toFixed(2)} €
                                </strong>
                              </span>
                            </div>

                            {srv.breakDurationMinutes && srv.breakDurationMinutes > 0 ? (
                              <span className="text-xs text-primary-700 font-medium block mt-0.5">
                                Temps de pose autonome : {srv.breakDurationMinutes} min
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Côté Droit : Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => duplicateServiceMutation.mutate(srv.id)}
                            disabled={duplicateServiceMutation.isPending}
                            className="btn btn-outline btn-xs flex items-center gap-1.5"
                            title="Dupliquer cette prestation"
                          >
                            <Copy className="w-3 h-3 text-neutral-500" />
                            <span>Dupliquer</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingService(srv);
                              setIsServiceModalOpen(true);
                            }}
                            className="btn btn-primary btn-xs flex items-center gap-1.5"
                            title="Modifier les détails et tarifs"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Modifier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setServiceToDeleteId(srv.id)}
                            className="btn btn-ghost btn-xs text-neutral-400 hover:text-rose-700 hover:bg-rose-50 p-1.5"
                            title="Supprimer la prestation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modale d'Édition / Création de Prestation */}
      <ServiceEditModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        categories={categories}
        staffList={staffList}
        resourceList={resourceList}
        onSave={handleSaveService}
      />

      {/* Modale Édition des prix en masse */}
      <MassPriceModal
        isOpen={isMassPriceModalOpen}
        onClose={() => setIsMassPriceModalOpen(false)}
        categories={categories}
        services={services}
        onApplyMassEdit={handleApplyMassEdit}
      />

      {/* Modale Ajout de Catégorie */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Ajouter une catégorie"
        description="Créez un regroupement pour ordonner vos rituels et prestations."
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="btn btn-outline btn-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={addCategoryMutation.isPending}
              className="btn btn-primary btn-sm"
            >
              Créer la catégorie
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddCategory}>
          <FormInput
            label="Nom de la catégorie"
            placeholder="Ex : Soins Signature & Rituels"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            autoFocus
          />
        </form>
      </Modal>

      {/* Modale de Confirmation de Suppression de Prestation */}
      <Modal
        isOpen={Boolean(serviceToDeleteId)}
        onClose={() => setServiceToDeleteId(null)}
        title="Confirmer la suppression"
        description="Êtes-vous certain de vouloir retirer cette prestation du catalogue ?"
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setServiceToDeleteId(null)}
              className="btn btn-outline btn-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                if (serviceToDeleteId) {
                  deleteServiceMutation.mutate(serviceToDeleteId);
                }
              }}
              disabled={deleteServiceMutation.isPending}
              className="btn btn-primary btn-sm bg-rose-600 hover:bg-rose-700 border-rose-600 text-white"
            >
              Supprimer
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600">
          Cette action retirera la prestation des nouvelles réservations. L&apos;historique des rendez-vous passés reste préservé.
        </p>
      </Modal>

      {/* Modale de Confirmation de Suppression de Catégorie */}
      <Modal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        title="Supprimer la catégorie"
        description={`Confirmez la suppression de "${categoryToDelete?.name || ""}".`}
        maxWidth="sm"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setCategoryToDelete(null)}
              className="btn btn-outline btn-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                if (categoryToDelete) {
                  deleteCategoryMutation.mutate(categoryToDelete.id);
                }
              }}
              disabled={deleteCategoryMutation.isPending}
              className="btn btn-primary btn-sm bg-rose-600 hover:bg-rose-700 border-rose-600 text-white"
            >
              Supprimer
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600">
          Toutes les prestations associées à cette catégorie seront archivées.
        </p>
      </Modal>
    </div>
  );
}
