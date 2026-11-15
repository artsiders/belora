"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, Phone, Mail, Percent } from "lucide-react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import {
  FormInput,
  FormTextarea,
} from "@/components/pro-dashboard/ui/form-controls";
import { useEstablishment } from "@/contexts/pro-establishment-context";

interface NewEstablishmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewEstablishmentModal({
  isOpen,
  onClose,
}: NewEstablishmentModalProps) {
  const { createEstablishment, isCreating } = useEstablishment();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [depositPercentage, setDepositPercentage] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !postalCode.trim() || !city.trim()) {
      return;
    }

    try {
      await createEstablishment({
        name: name.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        tagline: tagline.trim() || undefined,
        description: description.trim() || undefined,
        depositPercentage: Number(depositPercentage) || 30,
      });

      onClose();
      // Reset form
      setName("");
      setAddress("");
      setPostalCode("");
      setCity("");
      setPhone("");
      setEmail("");
      setTagline("");
      setDescription("");
      setDepositPercentage(30);
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un établissement"
      description="Déclarer une nouvelle adresse de salon ou atelier rattachée à votre compte."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
            disabled={isCreating}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary btn-sm"
            disabled={isCreating || !name.trim() || !address.trim() || !city.trim()}
          >
            {isCreating ? "Création en cours..." : "Créer l'établissement"}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Aperçu en direct */}
        <AnimatePresence>
          {name.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-900 font-bold text-sm flex items-center justify-center shrink-0 border border-primary-200/70 shadow-2xs">
                  <Building2 className="w-5 h-5 text-primary-700" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-neutral-950 text-sm truncate block">
                    {name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5 truncate">
                    {(city || address) && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {[address, postalCode, city].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-neutral-400 shrink-0 uppercase tracking-wider">
                Nouvelle adresse
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Nom de l'établissement"
            placeholder="Ex : L'Atelier Botanique — Bordeaux"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            label="Slogan / Signature"
            placeholder="Ex : Maison de Coiffure & Soins Rive Gauche"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <FormInput
          label="Adresse postale"
          placeholder="Ex : 15 Cours de l'Intendance"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Code postal"
            placeholder="33000"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
          <FormInput
            label="Ville"
            placeholder="Bordeaux"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Téléphone du salon"
            placeholder="05 56 00 00 00"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <FormInput
            label="Adresse e-mail de contact"
            placeholder="contact@atelierbotanique-bordeaux.fr"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            label="Acompte requis à la réservation (%)"
            type="number"
            min={0}
            max={100}
            step={5}
            value={depositPercentage}
            onChange={(e) => setDepositPercentage(Number(e.target.value))}
            helper="Pourcentage prélevé lors de la réservation en ligne"
          />
        </div>

        <FormTextarea
          label="Description de l'établissement"
          placeholder="Histoire du salon, rituels d'accueil, ambiance de l'atelier..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </Modal>
  );
}
