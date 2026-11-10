"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Store,
  UserCheck,
  MapPin,
  Percent,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface CreateAssistedResponse {
  venue: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
  owner: {
    id: string;
    email: string;
    name: string;
  };
  invitationToken: string;
  invitationUrl: string;
}

export default function CreateAssistedVenuePage() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [createdResult, setCreatedResult] = useState<CreateAssistedResponse | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    proFirstName: "",
    proLastName: "",
    proEmail: "",
    proPhone: "",
    commissionRatePercent: 1.8,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post<CreateAssistedResponse>(
        "/api/admin/venues/assisted",
        payload
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "venues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      setCreatedResult(data);
      toast.success("Salon partenaire créé avec succès !");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Erreur lors de la création du salon");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      tagline: formData.tagline || undefined,
      description: formData.description || undefined,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      proFirstName: formData.proFirstName,
      proLastName: formData.proLastName,
      proEmail: formData.proEmail,
      proPhone: formData.proPhone,
      commissionRate: formData.commissionRatePercent / 100,
    });
  };

  const handleCopyLink = () => {
    if (!createdResult) return;
    const fullUrl = `${window.location.origin}${createdResult.invitationUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Lien d'invitation copié !");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setCreatedResult(null);
    setFormData({
      name: "",
      tagline: "",
      description: "",
      address: "",
      city: "",
      postalCode: "",
      proFirstName: "",
      proLastName: "",
      proEmail: "",
      proPhone: "",
      commissionRatePercent: 1.8,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Retour et En-tête */}
      <div>
        <Link
          href="/admin/venues"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la liste des établissements
        </Link>
        <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-tight">
          Création Assistée d&apos;Établissement
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Enregistrez les informations d&apos;un nouveau salon partenaire pour son compte et générez son lien d&apos;invitation exclusif pour prise en main.
        </p>
      </div>

      {/* Résultat succès après création */}
      {createdResult ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-xs space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-emerald-900">
                Salon &laquo; {createdResult.venue.name} &raquo; créé avec succès
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Le compte professionnel pour <strong>{createdResult.owner.email}</strong> a été initialisé.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Lien d&apos;invitation et prise en main pro (Valide 7 jours)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}${createdResult.invitationUrl}`
                    : createdResult.invitationUrl
                }
                className="flex-1 px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-800"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copier le lien
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Transmettez ce lien au responsable pour lui permettre de définir son mot de passe et finaliser sa configuration.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            <Link
              href={`/salons/${createdResult.venue.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900"
            >
              Prévisualiser la fiche salon <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Créer un autre salon
            </button>
          </div>
        </div>
      ) : (
        /* Formulaire de saisie */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-neutral-200/80 p-8 shadow-xs space-y-6">
          {/* Section 1 : Informations Salon */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 text-neutral-900 font-semibold text-sm">
              <Store className="w-4 h-4 text-neutral-500" />
              <span>Identité de l&apos;Établissement</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nom commercial du salon *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : L'Atelier Botanique Marais"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Accroche / Slogan
                </label>
                <input
                  type="text"
                  placeholder="Ex : Soins capillaires &amp; rituels holistiques"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Taux de commission appliqué (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.commissionRatePercent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commissionRatePercent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">
                    %
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Description succincte
                </label>
                <textarea
                  rows={2}
                  placeholder="Brève présentation pour la fiche vitrine..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Adresse */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 text-neutral-900 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-neutral-500" />
              <span>Localisation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Adresse postale *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : 14 Rue de Bretagne"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Paris"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : 75003"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3 : Responsable Pro */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200 text-neutral-900 font-semibold text-sm">
              <UserCheck className="w-4 h-4 text-neutral-500" />
              <span>Contact Responsable Professionnel</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Hélène"
                  value={formData.proFirstName}
                  onChange={(e) => setFormData({ ...formData, proFirstName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Vaneau"
                  value={formData.proLastName}
                  onChange={(e) => setFormData({ ...formData, proLastName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Adresse e-mail professionnelle *
                </label>
                <input
                  type="email"
                  required
                  placeholder="pro@salon.fr"
                  value={formData.proEmail}
                  onChange={(e) => setFormData({ ...formData, proEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Téléphone direct *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01 42 77 00 00"
                  value={formData.proPhone}
                  onChange={(e) => setFormData({ ...formData, proPhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>

          {/* Validation */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <Link
              href="/admin/venues"
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
            >
              {mutation.isPending ? "Création en cours..." : "Créer le Salon & Générer l'Invitation"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
