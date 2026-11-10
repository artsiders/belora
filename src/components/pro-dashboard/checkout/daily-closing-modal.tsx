"use client";

import React, { useState } from "react";
import {
  Printer,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { ProSaleTicket, ProStaffMember } from "@/lib/data/pro-mock-data";

interface DailyClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: ProSaleTicket[];
  staffList: ProStaffMember[];
  isClosed?: boolean;
  isClosingLoading?: boolean;
  onPerformClosing?: (cashCounted: number) => void;
}

export function DailyClosingModal({
  isOpen,
  onClose,
  tickets,
  staffList,
  isClosed: initialClosed = false,
  isClosingLoading = false,
  onPerformClosing,
}: DailyClosingModalProps) {
  const [cashCounted, setCashCounted] = useState<string>("170.00");
  const [isClosed, setIsClosed] = useState(initialClosed);

  React.useEffect(() => {
    setIsClosed(initialClosed);
  }, [initialClosed]);

  // Calculs totaux
  const totalTtc = tickets.reduce((acc, t) => acc + t.totalTtc, 0);
  const totalHt = tickets.reduce((acc, t) => acc + t.subtotalHt, 0);
  const totalVat = tickets.reduce((acc, t) => acc + t.vatAmount, 0);
  const totalStripeDeposits = tickets.reduce(
    (acc, t) => acc + t.depositDeducted,
    0
  );

  // Ventilation par mode de règlement
  const totalCard = tickets
    .filter((t) => t.paymentMethod === "card")
    .reduce((acc, t) => acc + t.totalTtc, 0);
  const totalCash = tickets
    .filter((t) => t.paymentMethod === "cash")
    .reduce((acc, t) => acc + t.totalTtc, 0);
  const totalMixed = tickets.filter((t) => t.paymentMethod === "mixed");
  const mixedCard = totalMixed.reduce((acc, t) => acc + (t.cardAmount || 0), 0);
  const mixedCash = totalMixed.reduce((acc, t) => acc + (t.cashAmount || 0), 0);

  const finalCardTotal = totalCard + mixedCard;
  const finalCashTotal = totalCash + mixedCash;

  // Fond de caisse initial
  const startingFloat = 150.0;
  const expectedCashInDrawer = startingFloat + finalCashTotal;
  const actualCash = parseFloat(cashCounted) || 0;
  const discrepancy = actualCash - expectedCashInDrawer;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clôture de Caisse Journalière (Z de Caisse)"
      description="Rapport fiscal, comptable et contrôle des espèces de la journée."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-outline btn-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le rapport Z</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={() => {
                setIsClosed(true);
                if (onPerformClosing) {
                  onPerformClosing(actualCash);
                }
              }}
              disabled={isClosed || isClosingLoading}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isClosingLoading
                  ? "Clôture en cours..."
                  : isClosed
                  ? "Caisse Clôturée"
                  : "Clôturer la journée"}
              </span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm sm:text-base">
        {isClosed && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block font-bold">
                Clôture de caisse validée avec succès.
              </strong>
              <p className="text-sm text-emerald-700">
                Le journal des ventes a été archivé et les totaux ont été
                verrouillés pour la comptabilité.
              </p>
            </div>
          </div>
        )}

        {/* Synthèse des Recettes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-neutral-500 text-sm block mb-1">
              Chiffre d’Affaires TTC
            </span>
            <span className="font-bold text-lg text-neutral-950 tabular-nums">
              {(totalTtc + totalStripeDeposits).toFixed(2)} €
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-neutral-500 text-sm block mb-1">
              Total Hors Taxes (HT)
            </span>
            <span className="font-bold text-lg text-neutral-950 tabular-nums">
              {totalHt.toFixed(2)} €
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <span className="text-neutral-500 text-sm block mb-1">
              TVA Collectée (20%)
            </span>
            <span className="font-bold text-lg text-neutral-950 tabular-nums">
              {totalVat.toFixed(2)} €
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-primary-50/50 border border-primary-200">
            <span className="text-primary-800 text-sm block mb-1 font-semibold">
              Acomptes Stripe perçus
            </span>
            <span className="font-bold text-lg text-primary-900 tabular-nums">
              {totalStripeDeposits.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Ventilation par Moyen de Règlement */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-50/90 px-4 py-2.5 font-bold text-neutral-900 text-sm uppercase tracking-wider border-b border-neutral-200">
            Ventilation des encaissements en salon
          </div>
          <div className="divide-y divide-neutral-100 p-2">
            <div className="flex justify-between py-2 px-3">
              <span className="text-neutral-700">Carte Bancaire (TPE)</span>
              <strong className="text-neutral-950 tabular-nums font-semibold">
                {finalCardTotal.toFixed(2)} €
              </strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span className="text-neutral-700">Espèces (Tiroir)</span>
              <strong className="text-neutral-950 tabular-nums font-semibold">
                {finalCashTotal.toFixed(2)} €
              </strong>
            </div>
            <div className="flex justify-between py-2 px-3">
              <span className="text-neutral-700">Acomptes en ligne (Stripe)</span>
              <strong className="text-primary-800 tabular-nums font-semibold">
                {totalStripeDeposits.toFixed(2)} €
              </strong>
            </div>
            <div className="flex justify-between py-2.5 px-3 bg-neutral-50/60 font-bold text-neutral-950">
              <span>Total des règlements perçus</span>
              <span className="tabular-nums">
                {(totalTtc + totalStripeDeposits).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Contrôle du Tiroir Caisse & Écart */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 space-y-3">
          <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
            Comptage physique des espèces
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-sm text-neutral-500 block mb-1">
                Fond de caisse initial
              </span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                {startingFloat.toFixed(2)} €
              </span>
            </div>
            <div>
              <span className="text-sm text-neutral-500 block mb-1">
                Espèces théoriques attendues
              </span>
              <span className="font-semibold text-neutral-900 tabular-nums">
                {expectedCashInDrawer.toFixed(2)} €
              </span>
            </div>
            <div>
              <label className="text-sm font-semibold text-neutral-800 block mb-1">
                Montant compté dans le tiroir
              </label>
              <input
                type="number"
                step="0.01"
                value={cashCounted}
                onChange={(e) => setCashCounted(e.target.value)}
                className="input input-sm w-full font-semibold tabular-nums text-neutral-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-sm">
            <span className="text-neutral-600">Écart de caisse :</span>
            <span
              className={`font-bold tabular-nums ${
                discrepancy === 0
                  ? "text-emerald-700"
                  : discrepancy > 0
                  ? "text-primary-700"
                  : "text-rose-700"
              }`}
            >
              {discrepancy === 0
                ? "0.00 € (Caisse exacte)"
                : `${discrepancy > 0 ? "+" : ""}${discrepancy.toFixed(2)} €`}
            </span>
          </div>
        </div>

        {/* Chiffre d'Affaires par Collaborateur */}
        <div className="rounded-xl border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-50/90 px-4 py-2.5 font-bold text-neutral-900 text-sm uppercase tracking-wider border-b border-neutral-200">
            Performance & Recettes par Praticien
          </div>
          <div className="divide-y divide-neutral-100">
            {staffList.map((staff) => {
              const staffTickets = tickets.filter(
                (t) => t.staffId === staff.id
              );
              const staffTotal = staffTickets.reduce(
                (acc, t) => acc + t.totalTtc,
                0
              );
              return (
                <div
                  key={staff.id}
                  className="flex items-center justify-between py-2 px-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: staff.color }}
                    />
                    <span className="font-semibold text-neutral-900">
                      {staff.name}
                    </span>
                    <span className="text-neutral-400">
                      ({staffTickets.length} prestation
                      {staffTickets.length > 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="font-bold tabular-nums text-neutral-950">
                    {staffTotal.toFixed(2)} €
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
