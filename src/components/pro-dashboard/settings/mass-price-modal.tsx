"use client";

import React, { useState } from "react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput, FormSelect } from "@/components/pro-dashboard/ui/form-controls";
import { ProService, ProServiceCategory } from "@/lib/data/pro-mock-data";

interface MassPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ProServiceCategory[];
  services: ProService[];
  onApplyMassEdit: (targetCategoryId: string, deltaPercent: number, deltaFixed: number) => void;
}

export function MassPriceModal({
  isOpen,
  onClose,
  categories,
  services,
  onApplyMassEdit,
}: MassPriceModalProps) {
  const [selectedCatId, setSelectedCatId] = useState<string>("all");
  const [editType, setEditType] = useState<"percent" | "fixed">("percent");
  const [percentValue, setPercentValue] = useState<number>(5);
  const [fixedValue, setFixedValue] = useState<number>(2);

  const targetedServices = services.filter((s) =>
    selectedCatId === "all" ? true : s.categoryId === selectedCatId
  );

  const handleApply = () => {
    const deltaPercent = editType === "percent" ? percentValue : 0;
    const deltaFixed = editType === "fixed" ? fixedValue : 0;
    onApplyMassEdit(selectedCatId, deltaPercent, deltaFixed);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Édition des prix en masse"
      description="Ajustez l’ensemble des tarifs de vos prestations d’un coup selon un pourcentage ou une valeur fixe."
      maxWidth="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="btn btn-primary btn-sm"
          >
            Appliquer à {targetedServices.length} prestation{targetedServices.length > 1 ? "s" : ""}
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Catégories ciblées */}
        <FormSelect
          label="Catégories de prestations à modifier"
          value={selectedCatId}
          onChange={(e) => setSelectedCatId(e.target.value)}
          options={[
            { value: "all", label: "Toutes les catégories du salon" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        {/* Type de modification */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-800 uppercase tracking-wider block">
            Mode d&apos;ajustement
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEditType("percent")}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                editType === "percent"
                  ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                  : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Pourcentage (%)
            </button>
            <button
              type="button"
              onClick={() => setEditType("fixed")}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                editType === "fixed"
                  ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                  : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              Montant fixe (€)
            </button>
          </div>
        </div>

        {/* Valeur */}
        {editType === "percent" ? (
          <FormInput
            type="number"
            label="Variation en pourcentage (%)"
            value={percentValue}
            onChange={(e) => setPercentValue(Number(e.target.value))}
            helper="Exemple : 5 pour augmenter de +5%, -5 pour baisser de 5%"
            step={1}
          />
        ) : (
          <FormInput
            type="number"
            label="Variation fixe en euros (€)"
            value={fixedValue}
            onChange={(e) => setFixedValue(Number(e.target.value))}
            helper="Exemple : 2 pour ajouter 2,00 € à chaque prestation"
            step={0.5}
          />
        )}

        {/* Aperçu */}
        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
          <span className="font-semibold text-neutral-900 block">
            Aperçu sur vos prestations :
          </span>
          <div className="divide-y divide-neutral-200/60 max-h-36 overflow-y-auto">
            {targetedServices.slice(0, 4).map((s) => {
              const newPrice =
                editType === "percent"
                  ? Math.round(s.priceEuros * (1 + percentValue / 100))
                  : Math.max(0, s.priceEuros + fixedValue);
              return (
                <div key={s.id} className="py-1.5 flex justify-between text-neutral-600">
                  <span className="truncate pr-2">{s.name}</span>
                  <span className="tabular-nums font-semibold shrink-0">
                    <span className="line-through text-neutral-400 mr-1.5">
                      {s.priceEuros} €
                    </span>
                    &rarr; <span className="text-primary-800 font-bold">{newPrice} €</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
