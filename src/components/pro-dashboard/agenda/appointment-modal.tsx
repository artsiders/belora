"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  CreditCard,
  Phone,
  Mail,
  ShieldCheck,
  UserPlus,
  CalendarCheck,
  User,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { FormInput } from "@/components/pro-dashboard/ui/form-controls";
import { Select, SelectOption } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ProAppointment,
  ProStaffMember,
  ProResource,
  ProService,
  ProClient,
} from "@/lib/data/pro-mock-data";

import { toast } from "sonner";

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
  // Liste locale des clients pour création instantanée
  const [localClients, setLocalClients] = useState<ProClient[]>(clientsList);
  const [isQuickAddClientOpen, setIsQuickAddClientOpen] = useState(false);
  const [quickClientFirstName, setQuickClientFirstName] = useState("");
  const [quickClientLastName, setQuickClientLastName] = useState("");
  const [quickClientPhone, setQuickClientPhone] = useState("");

  // État formulaire nouveau RDV
  const [selectedClientId, setSelectedClientId] = useState(clientsList[0]?.id || "");
  const [selectedServiceId, setSelectedServiceId] = useState(servicesList[0]?.id || "");
  const [selectedStaffId, setSelectedStaffId] = useState(defaultStaffId || staffList[0]?.id || "");
  const [selectedResourceId, setSelectedResourceId] = useState(defaultResourceId || resourceList[0]?.id || "");
  const [startTime, setStartTime] = useState(defaultTime);
  const [customNotes, setCustomNotes] = useState("");

  React.useEffect(() => {
    setLocalClients(clientsList);
  }, [clientsList]);

  React.useEffect(() => {
    if (isOpen) {
      if (localClients[0]?.id && !selectedClientId) setSelectedClientId(localClients[0].id);
      if (servicesList[0]?.id && !selectedServiceId) setSelectedServiceId(servicesList[0].id);
      if (defaultStaffId) setSelectedStaffId(defaultStaffId);
      else if (staffList[0]?.id && !selectedStaffId) setSelectedStaffId(staffList[0].id);
      if (defaultResourceId) setSelectedResourceId(defaultResourceId);
      else if (resourceList[0]?.id && !selectedResourceId) setSelectedResourceId(resourceList[0].id);
      if (defaultTime) setStartTime(defaultTime);
      setIsQuickAddClientOpen(false);
    }
  }, [isOpen, localClients, servicesList, staffList, resourceList, defaultStaffId, defaultResourceId, defaultTime, selectedClientId, selectedServiceId, selectedStaffId, selectedResourceId]);

  const activeService = servicesList.find((s) => s.id === selectedServiceId);
  const activeClient = localClients.find((c) => c.id === selectedClientId);
  const activeStaff = staffList.find((st) => st.id === selectedStaffId);
  const activeResource = resourceList.find((r) => r.id === selectedResourceId);

  // Calcul dynamique de l'heure de fin
  let calculatedEndTime = "--:--";
  if (startTime && activeService) {
    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + activeService.durationMinutes;
    const endH = String(Math.floor(endMinutes / 60)).padStart(2, "0");
    const endM = String(endMinutes % 60).padStart(2, "0");
    calculatedEndTime = `${endH}:${endM}`;
  }

  const handleStartQuickClient = (query: string) => {
    const parts = query.trim().split(" ");
    setQuickClientFirstName(parts[0] || "");
    setQuickClientLastName(parts.slice(1).join(" ") || "");
    setQuickClientPhone("");
    setIsQuickAddClientOpen(true);
  };

  const handleConfirmQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickClientFirstName.trim() || !quickClientPhone.trim()) {
      toast.error("Veuillez renseigner au moins le prénom et le téléphone.");
      return;
    }

    const newClient: ProClient = {
      id: `client-quick-${Date.now()}`,
      firstName: quickClientFirstName.trim(),
      lastName: quickClientLastName.trim() || "Client",
      phone: quickClientPhone.trim(),
      email: `${quickClientFirstName.toLowerCase().replace(/[^a-z0-9]/g, "")}@belora.temp`,
      isVip: false,
      totalVisits: 1,
      totalSpent: 0,
      lastVisit: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setLocalClients((prev) => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
    setIsQuickAddClientOpen(false);
    toast.success(`Client ${newClient.firstName} ${newClient.lastName} créé et sélectionné !`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService || !activeClient || !activeStaff) return;

    onSaveNewAppointment({
      clientId: activeClient.id,
      clientName: `${activeClient.firstName} ${activeClient.lastName}`,
      clientPhone: activeClient.phone,
      clientEmail: activeClient.email,
      serviceId: activeService.id,
      serviceName: activeService.name,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      resourceId: activeResource?.id,
      resourceName: activeResource?.name,
      startTime,
      endTime: calculatedEndTime,
      price: activeService.priceEuros,
      depositPaid: activeService.depositRequired ? activeService.depositAmountEuros : 0,
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
        {/* Création Express de client en ligne */}
        <AnimatePresence>
          {isQuickAddClientOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-primary-50/60 border border-primary-200/80 rounded-2xl space-y-3 overflow-hidden shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary-950 font-bold text-xs uppercase tracking-wider">
                  <UserPlus className="w-4 h-4 text-primary-600" />
                  <span>Nouveau Client Express</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickAddClientOpen(false)}
                  className="text-xs text-neutral-500 hover:text-neutral-800"
                >
                  Fermer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={quickClientFirstName}
                    onChange={(e) => setQuickClientFirstName(e.target.value)}
                    placeholder="Ex : Camille"
                    className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={quickClientLastName}
                    onChange={(e) => setQuickClientLastName(e.target.value)}
                    placeholder="Ex : Dupont"
                    className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={quickClientPhone}
                    onChange={(e) => setQuickClientPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full h-9 px-3 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsQuickAddClientOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmQuickClient}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors shadow-2xs"
                >
                  Créer et Sélectionner
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choix du client avec recherche et création rapide */}
        <Select
          label="Client"
          required
          searchable
          searchPlaceholder="Rechercher par prénom, nom ou 06..."
          creatable
          createPrompt="Créer le client express"
          onCreateNew={handleStartQuickClient}
          value={selectedClientId}
          onChange={(val) => setSelectedClientId(val)}
          options={localClients.map((c) => ({
            value: c.id,
            label: `${c.firstName} ${c.lastName}`.trim(),
            sublabel: c.phone,
            badge: c.isVip ? "VIP" : undefined,
            badgeVariant: "gold",
            avatarInitials: `${c.firstName[0] || ""}${c.lastName[0] || ""}`.toUpperCase(),
          }))}
        />

        {/* Choix de la prestation avec badges de prix et durée */}
        <Select
          label="Prestation"
          required
          searchable
          searchPlaceholder="Rechercher une prestation (coupe, soin, balayage...)"
          value={selectedServiceId}
          onChange={(val) => setSelectedServiceId(val)}
          options={servicesList.map((s) => ({
            value: s.id,
            label: s.name,
            sublabel: `${s.durationMinutes} min${
              s.breakDurationMinutes ? ` • Pause pose : ${s.breakDurationMinutes} min` : ""
            }`,
            badge: `${s.priceEuros} €`,
            badgeVariant: "info",
          }))}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Choix du collaborateur */}
          <Select
            label="Collaborateur"
            required
            searchable
            searchPlaceholder="Rechercher un membre de l'équipe..."
            value={selectedStaffId}
            onChange={(val) => setSelectedStaffId(val)}
            options={staffList.map((st) => ({
              value: st.id,
              label: st.name,
              sublabel: st.role,
              avatarInitials: st.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
              badge: st.role,
            }))}
          />

          {/* Choix de la cabine / ressource */}
          <Select
            label="Cabine / Ressource"
            value={selectedResourceId}
            onChange={(val) => setSelectedResourceId(val)}
            options={[
              {
                value: "",
                label: "Sans cabine assignée",
                sublabel: "Attribution automatique selon disponibilité",
              },
              ...resourceList.map((r) => ({
                value: r.id,
                label: r.name,
                sublabel: r.type,
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

          {/* Note sur l'encaissement */}
          <div className="flex flex-col justify-end pb-1 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-800">
              Règlement en salon
            </span>
            <span>Paiement intégral lors de l&apos;encaissement en caisse POS</span>
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

        {/* Synthèse en temps réel du rendez-vous */}
        {activeService && activeClient && activeStaff && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2 text-xs shadow-2xs"
          >
            <div className="flex items-center justify-between text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary-600" />
                <span>
                  {startTime} → {calculatedEndTime} ({activeService.durationMinutes} min)
                </span>
              </span>
              <span className="font-bold text-neutral-950 text-sm">
                {activeService.priceEuros.toFixed(2)} € TTC
              </span>
            </div>

            <div className="flex items-center justify-between text-neutral-600 pt-1.5 border-t border-neutral-200/60">
              <div className="flex items-center gap-2 truncate">
                <span className="text-neutral-500">Avec</span>
                <strong className="text-neutral-900 font-semibold truncate">
                  {activeStaff.name}
                </strong>
                {activeResource && (
                  <>
                    <span className="text-neutral-300">•</span>
                    <span className="text-neutral-600 truncate">{activeResource.name}</span>
                  </>
                )}
              </div>
              <Badge variant="success" size="sm">
                En salon
              </Badge>
            </div>
          </motion.div>
        )}
      </form>
    </Modal>
  );
}
