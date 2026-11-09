"use client";

import React, { useState } from "react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
  Checkbox,
} from "@/components/pro-dashboard/ui/form-controls";
import {
  ProService,
  ProServiceCategory,
  ProStaffMember,
  ProResource,
} from "@/lib/data/pro-mock-data";

interface ServiceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ProService | null;
  categories: ProServiceCategory[];
  staffList: ProStaffMember[];
  resourceList: ProResource[];
  onSave: (service: ProService) => void;
}

interface InnerFormProps {
  service?: ProService | null;
  categories: ProServiceCategory[];
  staffList: ProStaffMember[];
  resourceList: ProResource[];
  onSave: (service: ProService) => void;
  onClose: () => void;
}

function ServiceEditInnerForm({
  service,
  categories,
  staffList,
  resourceList,
  onSave,
  onClose,
}: InnerFormProps) {
  const [name, setName] = useState(service?.name || "");
  const [categoryId, setCategoryId] = useState(
    service?.categoryId || categories[0]?.id || ""
  );
  const [durationMinutes, setDurationMinutes] = useState(
    service?.durationMinutes || 45
  );
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(
    service?.breakDurationMinutes || 0
  );
  const [priceEuros, setPriceEuros] = useState(service?.priceEuros || 50);
  const [depositRequired, setDepositRequired] = useState(
    service ? service.depositRequired : true
  );
  const [depositAmountEuros, setDepositAmountEuros] = useState(
    service ? service.depositAmountEuros : 15
  );
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>(
    service?.assignedStaffIds || staffList.map((s) => s.id)
  );
  const [requiredResourceId, setRequiredResourceId] = useState<string>(
    service?.requiredResourceId || ""
  );
  const [description, setDescription] = useState(service?.description || "");

  const handleToggleStaff = (staffId: string) => {
    setAssignedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanSlug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 15);
    const savedService: ProService = {
      id: service?.id || `srv-${cleanSlug}`,
      name: name.trim(),
      categoryId: categoryId || categories[0]?.id || "cat-1",
      durationMinutes: Number(durationMinutes),
      breakDurationMinutes: Number(breakDurationMinutes) || undefined,
      priceEuros: Number(priceEuros),
      depositRequired,
      depositAmountEuros: depositRequired ? Number(depositAmountEuros) : 0,
      assignedStaffIds,
      requiredResourceId: requiredResourceId || undefined,
      description: description.trim(),
    };

    onSave(savedService);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom & Catégorie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInput
          label="Nom de la prestation"
          placeholder="Ex : Balayage Végétal & Brushing"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormSelect
          label="Catégorie"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          required
        />
      </div>

      {/* Durée, Temps de pose, Prix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormInput
          type="number"
          label="Durée totale (min)"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          min={5}
          step={5}
          required
        />

        <FormInput
          type="number"
          label="Temps de pose autonome (min)"
          helper="Libère le coiffeur pendant la pose"
          value={breakDurationMinutes}
          onChange={(e) => setBreakDurationMinutes(Number(e.target.value))}
          min={0}
          step={5}
        />

        <FormInput
          type="number"
          label="Prix TTC (€)"
          value={priceEuros}
          onChange={(e) => setPriceEuros(Number(e.target.value))}
          min={0}
          step={1}
          required
        />
      </div>

      {/* Acompte en ligne Stripe Connect */}
      <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
        <FormCheckbox
          label="Exiger un acompte à la réservation en ligne"
          description="Sécurise le créneau contre les no-shows via Stripe Connect."
          checked={depositRequired}
          onChange={(e) => setDepositRequired(e.target.checked)}
        />

        {depositRequired && (
          <div className="max-w-xs ps-7">
            <FormInput
              type="number"
              label="Montant de l'acompte (€)"
              value={depositAmountEuros}
              onChange={(e) => setDepositAmountEuros(Number(e.target.value))}
              min={1}
              max={priceEuros}
            />
          </div>
        )}
      </div>

      {/* Praticiens habilités */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-800 uppercase tracking-wider block">
          Collaborateurs habilités
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {staffList.map((st) => (
            <label
              key={st.id}
              className="group flex items-center gap-2.5 p-2 rounded-lg border border-neutral-200 bg-white text-sm cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <Checkbox
                checked={assignedStaffIds.includes(st.id)}
                onChange={() => handleToggleStaff(st.id)}
              />
              <span className="truncate font-medium text-neutral-800">
                {st.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Ressource / Cabine requise */}
      <FormSelect
        label="Cabine ou matériel requis (optionnel)"
        value={requiredResourceId}
        onChange={(e) => setRequiredResourceId(e.target.value)}
        options={[
          { value: "", label: "Aucun équipement dédié requis" },
          ...resourceList.map((r) => ({
            value: r.id,
            label: r.name,
          })),
        ]}
      />

      {/* Description de la prestation */}
      <FormTextarea
        label="Description détaillée (visible sur la fiche publique)"
        placeholder="Détails du rituel, étapes de soin, produits utilisés..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Footer Boutons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline btn-sm"
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          {service ? "Enregistrer les modifications" : "Créer la prestation"}
        </button>
      </div>
    </form>
  );
}

export function ServiceEditModal({
  isOpen,
  onClose,
  service,
  categories,
  staffList,
  resourceList,
  onSave,
}: ServiceEditModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? "Modifier la prestation" : "Ajouter une prestation"}
      description="Définissez les détails, la durée, le tarif et les conditions de réservation en ligne."
      maxWidth="lg"
    >
      <ServiceEditInnerForm
        key={service?.id || "new"}
        service={service}
        categories={categories}
        staffList={staffList}
        resourceList={resourceList}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}
