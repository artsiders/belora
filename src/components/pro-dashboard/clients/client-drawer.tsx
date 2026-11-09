"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Plus,
  Save,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Drawer } from "@/components/pro-dashboard/ui/drawer";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { FormInput, FormTextarea } from "@/components/pro-dashboard/ui/form-controls";
import { ProClient, ProAppointment } from "@/lib/data/pro-mock-data";

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: ProClient | null;
  appointments: ProAppointment[];
  onUpdateClient: (updated: ProClient) => void;
}

interface InnerContentProps {
  client: ProClient;
  appointments: ProAppointment[];
  onUpdateClient: (updated: ProClient) => void;
  onClose: () => void;
}

function ClientDrawerInner({
  client,
  appointments,
  onUpdateClient,
}: Omit<InnerContentProps, "onClose">) {

  const [activeTab, setActiveTab] = useState<
    "profile" | "tech" | "history"
  >("profile");

  // Initialisation directe sans useEffect
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email);
  const [notes, setNotes] = useState(client.notes || "");

  // Fiche technique
  const [hairType, setHairType] = useState(
    client.techSheet?.hairType || "Cheveux ondulés, texture fine"
  );
  const [sensitivities, setSensitivities] = useState(
    client.techSheet?.sensitivities || "Sensibilité cuir chevelu"
  );
  const [isAddingFormula, setIsAddingFormula] = useState(false);
  const [newFormulaService, setNewFormulaService] = useState("");
  const [newFormulaText, setNewFormulaText] = useState("");
  const [newFormulaTime, setNewFormulaTime] = useState("");
  const [newFormulaColorist, setNewFormulaColorist] = useState("");

  const [feedbackSaved, setFeedbackSaved] = useState(false);

  const clientAppointments = appointments.filter(
    (a) => a.clientId === client.id || a.clientName.includes(client.lastName)
  );

  const averageBasket =
    client.totalVisits > 0
      ? (client.totalSpent / client.totalVisits).toFixed(2)
      : "0.00";

  // Sauvegarder modifications coordonnées
  const handleSaveProfile = () => {
    const updated: ProClient = {
      ...client,
      phone,
      email,
      notes,
      techSheet: {
        ...client.techSheet,
        hairType,
        sensitivities,
        lastFormulas: client.techSheet?.lastFormulas || [],
      },
    };
    onUpdateClient(updated);
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2500);
  };

  // Ajouter une formule de coloration technique
  const handleAddFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormulaText.trim()) return;

    const newFormulaItem = {
      date: new Date().toLocaleDateString("fr-FR"),
      service: newFormulaService || "Rituel Coloration",
      formula: newFormulaText.trim(),
      leaveInTime: newFormulaTime || "35 min",
      colorist: newFormulaColorist || "Hélène de Valois",
    };

    const updated: ProClient = {
      ...client,
      techSheet: {
        ...client.techSheet,
        hairType,
        sensitivities,
        lastFormulas: [
          newFormulaItem,
          ...(client.techSheet?.lastFormulas || []),
        ],
      },
    };

    onUpdateClient(updated);
    setIsAddingFormula(false);
    setNewFormulaService("");
    setNewFormulaText("");
    setNewFormulaTime("");
    setNewFormulaColorist("");
  };

  return (
    <div className="space-y-6">
      {/* KPI Synthèse Client */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200">
        <div>
          <span className="text-neutral-500 text-sm block mb-0.5">
            Visites totales
          </span>
          <span className="font-bold text-base text-neutral-950 tabular-nums">
            {client.totalVisits}
          </span>
        </div>

        <div>
          <span className="text-neutral-500 text-sm block mb-0.5">
            Panier moyen
          </span>
          <span className="font-bold text-base text-neutral-950 tabular-nums">
            {averageBasket} €
          </span>
        </div>

        <div>
          <span className="text-neutral-500 text-sm block mb-0.5">
            CA cumulé
          </span>
          <span className="font-bold text-base text-primary-800 tabular-nums">
            {client.totalSpent} €
          </span>
        </div>
      </div>

      {/* Navigation par Onglets */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-primary-600 text-neutral-950 font-bold"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Profil & Coordonnées
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tech")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "tech"
              ? "border-primary-600 text-neutral-950 font-bold"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Fiche Technique Beauté ({client.techSheet?.lastFormulas?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "history"
              ? "border-primary-600 text-neutral-950 font-bold"
              : "border-transparent text-neutral-500 hover:text-neutral-900"
          }`}
        >
          Historique Visites ({clientAppointments.length})
        </button>
      </div>

      {/* Onglet 1 : Profil & Coordonnées */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          {feedbackSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Modifications enregistrées avec succès.</span>
            </div>
          )}

          <div className="flex items-center gap-2 pb-2">
            {client.isVip && (
              <Badge variant="primary" size="sm">
                Client Privilégié / VIP
              </Badge>
            )}
            <span className="text-sm text-neutral-500">
              Dernière visite au salon : {client.lastVisit}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormInput
              label="Téléphone"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FormInput
              label="Adresse e-mail"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <FormTextarea
            label="Notes d'accueil & préférences"
            placeholder="Boissons préférées, température de rinçage, rythme de conversation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les coordonnées</span>
            </button>
          </div>
        </div>
      )}

      {/* Onglet 2 : Fiche Technique Capillaire / Soin */}
      {activeTab === "tech" && (
        <div className="space-y-5">
          {/* Diagnostic de base */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
              Diagnostic morphologique & capillaire
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Nature & texture du cheveu"
                value={hairType}
                onChange={(e) => setHairType(e.target.value)}
              />
              <FormInput
                label="Sensibilités & contre-indications"
                value={sensitivities}
                onChange={(e) => setSensitivities(e.target.value)}
              />
            </div>
          </div>

          {/* Historique des Formules Techniques */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-900">
                Historique des formules & mélanges
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingFormula(!isAddingFormula)}
                className="text-sm font-semibold text-primary-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une formule</span>
              </button>
            </div>

            {/* Formulaire ajout formule */}
            {isAddingFormula && (
              <form
                onSubmit={handleAddFormulaSubmit}
                className="p-4 rounded-xl border border-primary-200 bg-primary-50/30 space-y-3"
              >
                <h5 className="font-bold text-sm text-primary-950">
                  Nouvelle formule technique
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <FormInput
                    label="Prestation"
                    placeholder="Ex : Bain Végétal"
                    value={newFormulaService}
                    onChange={(e) => setNewFormulaService(e.target.value)}
                    required
                  />
                  <FormInput
                    label="Temps de pose"
                    placeholder="Ex : 40 min"
                    value={newFormulaTime}
                    onChange={(e) => setNewFormulaTime(e.target.value)}
                  />
                  <FormInput
                    label="Coloriste"
                    placeholder="Ex : Hélène de Valois"
                    value={newFormulaColorist}
                    onChange={(e) => setNewFormulaColorist(e.target.value)}
                  />
                </div>
                <FormTextarea
                  label="Détail du dosage et formule"
                  placeholder="Ex : 60g Henné châtain chaud + 20g Garance + eau à 50°C..."
                  value={newFormulaText}
                  onChange={(e) => setNewFormulaText(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingFormula(false)}
                    className="btn btn-outline btn-xs"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary btn-xs">
                    Enregistrer la formule
                  </button>
                </div>
              </form>
            )}

            {/* Liste des formules antérieures */}
            <div className="space-y-3">
              {client.techSheet?.lastFormulas &&
              client.techSheet.lastFormulas.length > 0 ? (
                client.techSheet.lastFormulas.map((form, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-neutral-900">
                        {form.service}
                      </span>
                      <span className="text-neutral-500 tabular-nums">
                        {form.date} &bull; Par {form.colorist}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 font-mono bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                      {form.formula}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 pt-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Temps de pose : {form.leaveInTime}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-400 italic py-4 text-center">
                  Aucune formule technique enregistrée pour ce client.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Onglet 3 : Historique des Visites */}
      {activeTab === "history" && (
        <div className="space-y-3">
          {clientAppointments.length > 0 ? (
            clientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3.5 rounded-xl border border-neutral-200 bg-white flex items-center justify-between gap-3 text-sm"
              >
                <div className="space-y-1">
                  <span className="font-bold text-neutral-900 block">
                    {apt.serviceName}
                  </span>
                  <p className="text-neutral-500">
                    {apt.date} à {apt.startTime} &bull; Réalisé par{" "}
                    {apt.staffName}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-sm tabular-nums text-neutral-950 block">
                    {apt.price} €
                  </span>
                  <Badge
                    variant={
                      apt.status === "completed"
                        ? "success"
                        : apt.status === "confirmed"
                        ? "primary"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {apt.status === "completed"
                      ? "Honoré"
                      : apt.status === "confirmed"
                      ? "Confirmé"
                      : apt.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-400 italic py-6 text-center">
              Aucun rendez-vous antérieur répertorié.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function ClientDrawer({
  isOpen,
  onClose,
  client,
  appointments,
  onUpdateClient,
}: ClientDrawerProps) {
  const router = useRouter();

  if (!client) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${client.firstName} ${client.lastName}`}
      subtitle={`Client #${client.id.toUpperCase()} • Membre depuis ${client.createdAt}`}
      width="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Fermer
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(`/pro/agenda`);
              }}
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Prendre un RDV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(`/pro/checkout`);
              }}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>Encaisser</span>
            </button>
          </div>
        </div>
      }
    >
      <ClientDrawerInner
        key={client.id}
        client={client}
        appointments={appointments}
        onUpdateClient={onUpdateClient}
      />
    </Drawer>
  );
}
