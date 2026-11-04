"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Edit2,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { ServiceEditModal } from "@/components/pro-dashboard/settings/service-edit-modal";
import { MassPriceModal } from "@/components/pro-dashboard/settings/mass-price-modal";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput } from "@/components/pro-dashboard/ui/form-controls";
import {
  MOCK_CATEGORIES,
  MOCK_SERVICES,
  MOCK_STAFF,
  MOCK_RESOURCES,
  ProService,
  ProServiceCategory,
} from "@/lib/data/pro-mock-data";

export default function ServicesSettingsPage() {
  const [categories, setCategories] =
    useState<ProServiceCategory[]>(MOCK_CATEGORIES);
  const [services, setServices] = useState<ProService[]>(MOCK_SERVICES);

  // Modale édition / création de prestation
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ProService | null>(null);

  // Modale édition de prix en masse
  const [isMassPriceModalOpen, setIsMassPriceModalOpen] = useState(false);

  // Modale ajout de catégorie
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Dupliquer une prestation
  const handleDuplicateService = (srv: ProService) => {
    setServices((prev) => [
      ...prev,
      {
        ...srv,
        id: `${srv.id}-copy-${prev.length + 1}`,
        name: `${srv.name} (Copie)`,
      },
    ]);
    showNotification(`Prestation "${srv.name} (Copie)" dupliquée.`);
  };

  // Supprimer une prestation
  const handleDeleteService = (srvId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== srvId));
    showNotification("Prestation supprimée.");
  };

  // Enregistrer (créer ou modifier) une prestation
  const handleSaveService = (savedService: ProService) => {
    if (editingService) {
      setServices((prev) =>
        prev.map((s) => (s.id === savedService.id ? savedService : s))
      );
      showNotification(`Prestation "${savedService.name}" modifiée.`);
    } else {
      setServices((prev) => [...prev, savedService]);
      showNotification(`Prestation "${savedService.name}" créée.`);
    }
  };

  // Édition des prix en masse
  const handleApplyMassEdit = (
    targetCategoryId: string,
    deltaPercent: number,
    deltaFixed: number
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (targetCategoryId === "all" || s.categoryId === targetCategoryId) {
          const updatedPrice =
            deltaPercent !== 0
              ? Math.round(s.priceEuros * (1 + deltaPercent / 100))
              : Math.max(0, s.priceEuros + deltaFixed);
          return { ...s, priceEuros: updatedPrice };
        }
        return s;
      })
    );
    showNotification("Tarifs mis à jour en masse avec succès.");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${prev.length + 1}`,
        name: newCategoryName.trim(),
        order: prev.length + 1,
        colorIndicator: "border-l-primary-600",
      },
    ]);
    const addedName = newCategoryName.trim();
    setNewCategoryName("");
    setIsCategoryModalOpen(false);
    showNotification(`Catégorie "${addedName}" ajoutée.`);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl">
      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Titre & Description */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
          Gestion des prestations
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Organisez vos tarifs, temps de pose, rituels et catégories de soins.
        </p>
      </div>

      {/* Barre d'actions supérieures (Exact Planity Screenshot 2) */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setIsCategoryModalOpen(true)}
          className="btn btn-outline btn-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une catégorie de prestations</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMassPriceModalOpen(true)}
          className="btn btn-outline btn-xs flex items-center gap-1.5 text-primary-800 border-primary-200 bg-primary-50/50 hover:bg-primary-50"
        >
          <DollarSign className="w-3.5 h-3.5" />
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

      {/* Groupes de Catégories & Prestations (Screenshot 2) */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const categoryServices = services.filter(
            (s) => s.categoryId === cat.id
          );

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-2xs"
            >
              {/* Header de la Catégorie (Style Planity) */}
              <div className="p-4 sm:p-4.5 bg-neutral-50/90 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-sm sm:text-base text-neutral-950">
                  {cat.name}{" "}
                  <span className="text-xs font-normal text-neutral-400">
                    ({categoryServices.length})
                  </span>
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingService(null);
                      setIsServiceModalOpen(true);
                    }}
                    className="hover:text-neutral-950 font-semibold cursor-pointer underline decoration-neutral-300 underline-offset-2"
                  >
                    Ajouter une prestation
                  </button>
                  <span className="text-neutral-300">&bull;</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCategories((prev) =>
                        prev.filter((c) => c.id !== cat.id)
                      );
                      showNotification(`Catégorie "${cat.name}" supprimée.`);
                    }}
                    className="hover:text-rose-700 cursor-pointer"
                  >
                    Supprimer catégorie
                  </button>
                </div>
              </div>

              {/* Liste des Prestations dans la Catégorie */}
              <div className="divide-y divide-neutral-100">
                {categoryServices.length === 0 ? (
                  <div className="p-6 text-center text-xs text-neutral-400 italic">
                    Aucune prestation dans cette catégorie.
                  </div>
                ) : (
                  categoryServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50/60 transition-colors"
                    >
                      {/* Côté Gauche : Barre d'accent + Nom + Durée + Prix */}
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-1 h-8 rounded-full bg-primary-600 shrink-0" />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-xs sm:text-sm font-semibold text-neutral-950">
                              {srv.name}
                            </h4>
                            <span className="text-xs text-neutral-500 tabular-nums font-medium">
                              {srv.durationMinutes >= 60
                                ? `${Math.floor(srv.durationMinutes / 60)} h ${
                                    srv.durationMinutes % 60 > 0
                                      ? `${srv.durationMinutes % 60}min`
                                      : ""
                                  }`
                                : `${srv.durationMinutes}min`}{" "}
                              -{" "}
                              <strong className="text-neutral-900 font-bold">
                                {srv.priceEuros.toFixed(2)} €
                              </strong>
                            </span>
                          </div>

                          {srv.breakDurationMinutes && srv.breakDurationMinutes > 0 ? (
                            <span className="text-[11px] text-primary-700 font-medium">
                              Temps de pose autonome : {srv.breakDurationMinutes} min
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Côté Droit : Actions (Dupliquer, Modifier, Supprimer) */}
                      <div className="flex items-center gap-4 text-xs font-medium self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDuplicateService(srv)}
                          className="text-neutral-600 hover:text-neutral-950 cursor-pointer underline decoration-neutral-200 underline-offset-2 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Dupliquer</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(srv);
                            setIsServiceModalOpen(true);
                          }}
                          className="text-neutral-600 hover:text-neutral-950 cursor-pointer underline decoration-neutral-200 underline-offset-2 flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv.id)}
                          className="text-rose-600 hover:text-rose-800 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Supprimer</span>
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

      {/* Modale d'Édition / Création de Prestation */}
      <ServiceEditModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setEditingService(null);
        }}
        service={editingService}
        categories={categories}
        staffList={MOCK_STAFF}
        resourceList={MOCK_RESOURCES}
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
    </div>
  );
}
