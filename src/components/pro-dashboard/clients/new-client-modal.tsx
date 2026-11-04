"use client";

import React, { useState } from "react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import {
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pro-dashboard/ui/form-controls";
import { ProClient } from "@/lib/data/pro-mock-data";

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: ProClient) => void;
}

export function NewClientModal({
  isOpen,
  onClose,
  onClientCreated,
}: NewClientModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

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

        <FormTextarea
          label="Notes d'accueil & préférences"
          placeholder="Boisson préférée, sensibilité au chaud, habitudes particulières..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
}
