"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, Tag } from "lucide-react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { Badge } from "@/components/ui/badge";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pro-dashboard/ui/form-controls";
import { ProClient } from "@/lib/data/pro-mock-data";

const QUICK_PREFERENCES = [
  "Boisson : Thé vert",
  "Boisson : Café court",
  "Sensibilité cuir chevelu",
  "Préfère le silence",
  "Toujours ponctuel(le)",
];

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: ProClient) => void;
  isCreating?: boolean;
  onCreateClientAction?: (payload: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    isVip: boolean;
    notes: string;
  }) => Promise<ProClient>;
}

export function NewClientModal({
  isOpen,
  onClose,
  onClientCreated,
  isCreating = false,
  onCreateClientAction,
}: NewClientModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    if (onCreateClientAction) {
      try {
        const created = await onCreateClientAction({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim() || "06 00 00 00 00",
          email: email.trim(),
          isVip,
          notes: notes.trim(),
        });
        onClientCreated(created);
        onClose();
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setIsVip(false);
        setNotes("");
      } catch {
        // Handled in mutation onError
      }
      return;
    }

    const newClient: ProClient = {
      id: `cli-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || "06 00 00 00 00",
      email: email.trim() || `${firstName.toLowerCase()}@client.fr`,
      createdAt: new Date().toISOString().split("T")[0],
      lastVisit: "Jamais venu",
      totalVisits: 0,
      totalSpent: 0,
      isVip,
      notes: notes.trim(),
      techSheet: {
        hairType: "Non renseigné",
        sensitivities: "Aucune",
        lastFormulas: [],
      },
    };

    onClientCreated(newClient);
    onClose();
    // Reset
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setIsVip(false);
    setNotes("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer une fiche client"
      description="Ajouter un nouveau client au fichier CRM de l'atelier."
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
            onClick={handleSubmit}
            className="btn btn-primary btn-sm"
          >
            Créer la fiche client
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Live Client Preview Card */}
        <AnimatePresence>
          {(firstName.trim() || lastName.trim()) && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-900 font-bold text-sm flex items-center justify-center shrink-0 border border-primary-200/70">
                  {firstName.trim() ? firstName.trim()[0].toUpperCase() : ""}
                  {lastName.trim() ? lastName.trim()[0].toUpperCase() : ""}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-950 text-sm truncate">
                      {firstName || "Prénom"} {lastName || "Nom"}
                    </span>
                    {isVip && (
                      <Badge variant="gold" size="sm">
                        VIP
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5 truncate">
                    {phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        {phone}
                      </span>
                    )}
                    {email && (
                      <span className="inline-flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        {email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-neutral-400 shrink-0 uppercase tracking-wider">
                Aperçu
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Prénom"
            placeholder="Ex : Camille"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <FormInput
            label="Nom"
            placeholder="Ex : Bernard"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Téléphone mobile"
            placeholder="06 12 34 56 78"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormInput
            label="Adresse e-mail"
            placeholder="client@exemple.fr"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <FormCheckbox
          label="Statut Client Privilégié / VIP"
          description="Affiche un indicateur discret sur l'agenda et la caisse."
          checked={isVip}
          onChange={(e) => setIsVip(e.target.checked)}
        />

        <div className="space-y-1.5">
          <FormTextarea
            label="Notes d'accueil & préférences"
            placeholder="Boisson préférée, sensibilité au chaud, habitudes particulières..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-neutral-400 font-medium">Suggestions rapides :</span>
            {QUICK_PREFERENCES.map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => {
                  setNotes((prev) => (prev ? `${prev}, ${pref}` : pref));
                }}
                className="px-2 py-0.5 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 text-xs transition-colors cursor-pointer"
              >
                + {pref}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
