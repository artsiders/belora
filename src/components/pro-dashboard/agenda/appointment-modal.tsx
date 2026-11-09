"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput, FormSelect } from "@/components/pro-dashboard/ui/form-controls";
import {
  ProAppointment,
  ProStaffMember,
  ProResource,
  ProService,
  ProClient,
} from "@/lib/data/pro-mock-data";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "detail" | "create";
  appointment?: ProAppointment | null;
  defaultTime?: string;
  defaultStaffId?: string;
  defaultResourceId?: string;
  staffList: ProStaffMember[];
  resourceList: ProResource[];
  servicesList: ProService[];
  clientsList: ProClient[];
  onSaveNewAppointment: (newApt: Partial<ProAppointment>) => void;
  onStatusChange: (aptId: string, newStatus: ProAppointment["status"]) => void;
  onNavigateToCheckout: (appointment: ProAppointment) => void;
}

export function AppointmentModal({
  isOpen,
  onClose,
  mode,
  appointment,
  defaultTime = "10:00",
  defaultStaffId,
  defaultResourceId,
  staffList,
  resourceList,
  servicesList,
  clientsList,
  onSaveNewAppointment,
  onStatusChange,
  onNavigateToCheckout,
}: AppointmentModalProps) {
  // État formulaire nouveau RDV
  const [selectedClientId, setSelectedClientId] = useState(clientsList[0]?.id || "");
  const [selectedServiceId, setSelectedServiceId] = useState(servicesList[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState(defaultStaffId || staffList[0]?.id || "");
  const [selectedResourceId, setSelectedResourceId] = useState(defaultResourceId || resourceList[0]?.id || "");
  const [startTime, setStartTime] = useState(defaultTime);
  const [customNotes, setCustomNotes] = useState("");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = servicesList.find((s) => s.id === selectedServiceId);
    const client = clientsList.find((c) => c.id === selectedClientId);
    const staff = staffList.find((st) => st.id === selectedStaffId);
    const resource = resourceList.find((r) => r.id === selectedResourceId);

    if (!service || !client || !staff) return;

    // Calcul de l'heure de fin
    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + service.durationMinutes;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
    const endM = String(endMinutes % 60).padStart(2, "0");
    const endTime = `${endH}:${endM}`;

    onSaveNewAppointment({
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,
      clientEmail: client.email,
      serviceId: service.id,
      serviceName: service.name,
      staffId: staff.id,
      staffName: staff.name,
      resourceId: resource?.id,
      resourceName: resource?.name,
      startTime,
      endTime,
      price: service.priceEuros,
      depositPaid: service.depositRequired ? service.depositAmountEuros : 0,
      status: "confirmed",
      notes: customNotes,
    });
    onClose();
  };

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // MODE DÉTAILS D'UN RENDEZ-VOUS EXISTANT
  // --------------------------------------------------------------------------
  if (mode === "detail" && appointment) {
    const remainingToPay = Math.max(0, appointment.price - appointment.depositPaid);

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Détails du Rendez-vous"
        description={`Référence #${appointment.id.toUpperCase()} • ${appointment.date}`}
        maxWidth="lg"
        footer={
          <div className="flex flex-wrap items-center justify-between w-full gap-2">
            <button
              type="button"
              onClick={() => {
                onStatusChange(appointment.id, "cancelled");
                onClose();
              }}
              className="btn btn-ghost btn-sm text-rose-700 hover:bg-rose-50"
            >
              Annuler le RDV
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onStatusChange(appointment.id, "no_show");
                  onClose();
                }}
                className="btn btn-outline btn-sm"
              >
                Absent (No-show)
              </button>
              <button
                type="button"
                onClick={() => {
                  onStatusChange(appointment.id, "completed");
                  onClose();
                }}
                className="btn btn-secondary btn-sm"
              >
                Marquer honoré
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToCheckout(appointment);
                  onClose();
                }}
                className="btn btn-primary btn-sm flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4" />
                <span>Encaisser ({remainingToPay} €)</span>
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-5 text-sm">
          {/* Fiche Client & Contact */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-900 border border-primary-200/60 font-bold text-sm flex items-center justify-center shrink-0">
                  {appointment.clientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-950 text-base">
                    {appointment.clientName}
                  </h4>
                  <p className="text-sm text-neutral-500">Client habitué</p>
                </div>
              </div>

              <Link
                href={`/pro/clients?search=${encodeURIComponent(
                  appointment.clientName
                )}`}
                className="text-sm text-primary-700 font-semibold hover:underline"
              >
                Voir fiche CRM &rarr;
              </Link>
            </div>

            <div className="pt-2 border-t border-neutral-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{appointment.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{appointment.clientEmail}</span>
              </div>
            </div>
          </div>

          {/* Prestation & Créneau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block">
                Prestation
              </span>
              <p className="font-semibold text-neutral-950 text-sm">
                {appointment.serviceName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block">
                Horaires
              </span>
              <p className="font-semibold text-neutral-950 text-sm tabular-nums flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-700" />
                <span>
                  {appointment.startTime} - {appointment.endTime}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block">
                Collaborateur assigné
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {appointment.staffName}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider block">
                Cabine / Ressource
              </span>
              <p className="font-semibold text-neutral-900 text-sm">
                {appointment.resourceName || "Aucune cabine"}
              </p>
            </div>
          </div>

          {/* Synthèse Financière & Acompte Stripe */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Montant total de la prestation</span>
              <span className="font-semibold text-neutral-950 tabular-nums">
                {appointment.price} € TTC
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-primary-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Acompte sécurisé Stripe Connect déjà perçu</span>
              </span>
              <span className="font-bold tabular-nums">
                - {appointment.depositPaid} €
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-sm font-bold text-neutral-950">
              <span>Solde restant à percevoir au salon</span>
              <span className="text-base tabular-nums text-primary-800">
                {remainingToPay} €
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200/60">
              <strong className="block text-neutral-800 mb-0.5">Notes :</strong>
              {appointment.notes}
            </div>
          )}
        </div>
      </Modal>
    );
  }

  // --------------------------------------------------------------------------
  // MODE CRÉATION D'UN NOUVEAU RENDEZ-VOUS
  // --------------------------------------------------------------------------
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouveau Rendez-vous"
      description="Planifier manuellement un rituel pour un client au salon ou par téléphone."
      maxWidth="lg"
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
            onClick={handleCreateSubmit}
            className="btn btn-primary btn-sm"
          >
            Confirmer le rendez-vous
          </button>
        </div>
      }
    >
      <form onSubmit={handleCreateSubmit} className="space-y-4">
        {/* Choix du client */}
        <FormSelect
          label="Client"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          options={clientsList.map((c) => ({
            value: c.id,
            label: `${c.firstName} ${c.lastName} (${c.phone})`,
          }))}
          required
        />

        {/* Choix de la prestation */}
        <FormSelect
          label="Prestation"
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          options={servicesList.map((s) => ({
            value: s.id,
            label: `${s.name} - ${s.durationMinutes} min (${s.priceEuros} €)`,
          }))}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Choix du collaborateur */}
          <FormSelect
            label="Collaborateur"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            options={staffList.map((st) => ({
              value: st.id,
              label: st.name,
            }))}
            required
          />

          {/* Choix de la cabine */}
          <FormSelect
            label="Cabine / Ressource"
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            options={[
              { value: "", label: "Sans cabine assignée" },
              ...resourceList.map((r) => ({
                value: r.id,
                label: r.name,
              })),
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Heure de début */}
          <FormInput
            type="time"
            label="Heure de début"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          {/* Note sur acompte */}
          <div className="flex flex-col justify-end pb-1 text-sm text-neutral-500">
            <span className="font-semibold text-neutral-800">
              Réservation en salon
            </span>
            <span>Règlement intégral sur place lors de l&apos;encaissement</span>
          </div>
        </div>

        {/* Notes complémentaires */}
        <FormInput
          type="text"
          label="Notes ou consignes particulières (optionnel)"
          placeholder="Ex : demande thé à l'arrivée, allergie amande..."
          value={customNotes}
          onChange={(e) => setCustomNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}
