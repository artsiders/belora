"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  ShieldCheck,
  Store,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { ProNav } from "./pro-nav";

type EstablishmentType =
  | "hair_barber"
  | "beauty_spa_nails"
  | "wellness"
  | "independent";

interface EstablishmentOption {
  id: EstablishmentType;
  title: string;
  subtitle: string;
  specialties: { id: string; label: string }[];
}

const ESTABLISHMENT_OPTIONS: EstablishmentOption[] = [
  {
    id: "hair_barber",
    title: "Salon de coiffure ou barbershop",
    subtitle: "Coiffure mixte, coloration haute couture, barbier traditionnel...",
    specialties: [
      { id: "hair_salon", label: "Salon de coiffure mixte" },
      { id: "colorist", label: "Coloriste & Soins capillaires profonds" },
      { id: "barbershop", label: "Barbershop traditionnel & rasage" },
      { id: "hair_studio", label: "Studio privé & coiffeur créateur" },
    ],
  },
  {
    id: "beauty_spa_nails",
    title: "Institut de beauté, spa ou bar à ongles",
    subtitle: "Facialiste, nail bar, balnéothérapie, regard...",
    specialties: [
      { id: "facial", label: "Institut de beauté & Facialiste" },
      { id: "nails", label: "Bar à ongles & prothésie ongulaire" },
      { id: "spa", label: "Spa urbain, sauna & balnéothérapie" },
      { id: "lashes_brows", label: "Beauté du regard & dermopigmentation" },
    ],
  },
  {
    id: "wellness",
    title: "Professionnels du bien-être",
    subtitle: "Massages du monde, réflexologie, sophrologie, praticien corporel...",
    specialties: [
      { id: "massage", label: "Massages du monde & praticien corporel" },
      { id: "reflexo", label: "Réflexologue" },
      { id: "sophro", label: "Sophrologue" },
      { id: "hypno", label: "Hypnothérapeute & soins holistiques" },
    ],
  },
  {
    id: "independent",
    title: "Artisan indépendant ou à domicile",
    subtitle: "Praticien nomade, atelier privé confidentiel...",
    specialties: [
      { id: "home_pro", label: "Prestations d'exception à domicile" },
      { id: "private_suite", label: "Suite privée & espace indépendant" },
      { id: "mobile_stylist", label: "Coiffeur / Praticien itinérant" },
      { id: "corporate_wellness", label: "Bien-être & soins en entreprise" },
    ],
  },
];

export function ProJoinFlow() {
  // Navigation view: "gateway" (choix initial) ou "wizard" (tunnel interactif)
  const [view, setView] = useState<"gateway" | "wizard">("gateway");

  // Étapes du wizard : 1 (type), 2 (spécialité), 3 (atelier/ville), 4 (contact), 5 (confirmation)
  const [step, setStep] = useState<number>(1);

  // Réponses du formulaire
  const [selectedType, setSelectedType] = useState<EstablishmentType | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("solo");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const activeEstablishment = ESTABLISHMENT_OPTIONS.find(
    (opt) => opt.id === selectedType
  );

  const handleSelectType = (typeId: EstablishmentType) => {
    setSelectedType(typeId);
    setSelectedSpecialty("");
    setStep(2);
  };

  const handleSelectSpecialty = (specLabel: string) => {
    setSelectedSpecialty(specLabel);
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !city.trim()) return;
    setStep(4);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;
    setStep(5);
  };

  // ---------------------------------------------------------------------------
  // VUE 1 : AIGUILLAGE INITIAL (GATEWAY - Image 1)
  // ---------------------------------------------------------------------------
  if (view === "gateway") {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-primary-100 selection:text-primary-900">
        <ProNav showNavLinks={false} />

        <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-5">
          <div className="w-full max-w-xl text-center space-y-8">
            {/* Header du choix */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary-700 block">
                Programme Partenaires
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-neutral-950 font-normal tracking-tight text-balance">
                Devenir partenaire Belora Pro
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-md mx-auto text-pretty">
                Soyez visible auprès d’une clientèle passionnée valorisant le geste artisanal et le sur-mesure.
              </p>

              {/* Arguments clés sobres */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-neutral-700 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary-600 stroke-[2]" />
                  Sans engagement
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary-600 stroke-[2]" />
                  0% de commission sur votre clientèle
                </span>
              </div>
            </div>

            {/* Cartes d'orientation (Exactement comme Image 1) */}
            <div className="space-y-4 pt-4 text-left">
              {/* Carte 1 : Je suis gérant / professionnel */}
              <button
                type="button"
                onClick={() => {
                  setView("wizard");
                  setStep(1);
                }}
                className="w-full group p-5 sm:p-6 rounded-2xl border border-neutral-200/90 bg-white hover:border-primary-600/80 hover:bg-neutral-50/50 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 border border-primary-100 group-hover:scale-105 transition-transform">
                    <Scissors className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-primary-700 transition-colors">
                      Je suis gérant d’un établissement
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-0.5">
                      Coiffure, esthétique, barbier, bien-être, spa...
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>

              {/* Carte 2 : Je ne suis pas un professionnel */}
              <Link
                href="/search"
                className="w-full group p-5 sm:p-6 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-200/70 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-neutral-900 transition-colors">
                      Je ne suis pas un professionnel
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-0.5">
                      Je souhaite prendre un rendez-vous beauté ou bien-être
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>
            </div>

            {/* Note de bas de page */}
            <p className="text-xs text-neutral-500 font-normal pt-4">
              Déjà partenaire ?{" "}
              <Link
                href="/login"
                className="font-semibold text-neutral-900 hover:text-primary-700 underline underline-offset-4"
              >
                Accéder à mon espace Belora Pro
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VUE 2 : TUNNEL INTERACTIF SPLIT-SCREEN (Images 2 & 3)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-primary-100 selection:text-primary-900">
      <ProNav
        showNavLinks={true}
        onStartDemo={() => {
          setView("wizard");
          setStep(1);
        }}
      />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4.5rem)]">
        {/* ===================================================================
            PANNEAU GAUCHE : SOMBRE & ÉDITORIAL (Image 2)
            =================================================================== */}
        <section className="lg:col-span-5 bg-primary-700 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-900">
          <div className="space-y-8 max-w-lg">
            {/* Tag marque */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary-300 bg-primary-950/80 px-2.5 py-1 rounded-full border border-primary-800/60">
                Belora Pro
              </span>
              <span className="text-xs text-neutral-400">· Référence beauté & bien-être</span>
            </div>

            {/* Titre fort */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.12] text-balance">
              La plateforme de référence pour gérer votre salon ou atelier.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed text-pretty">
              Plus de 450 établissements d’exception font confiance à Belora pour sublimer leur agenda, sécuriser leurs encaissements et valoriser leur savoir-faire.
            </p>

            {/* 3 points forts avec coche fine */}
            <ul className="space-y-3.5 pt-2 text-xs sm:text-sm text-neutral-200">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Agenda intelligent haute précision pour gérer vos rituels et temps de pause</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Encaissement simplifié, acomptes sécurisés et zéro no-show garanti</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Sans engagement de durée ni commission prélevée sur votre clientèle</span>
              </li>
            </ul>

            {/* Note d'avis */}
            <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
              <div className="flex items-center text-primary-400">
                <Star className="w-4 h-4 fill-primary-400 stroke-none" />
                <Star className="w-4 h-4 fill-primary-400 stroke-none" />
                <Star className="w-4 h-4 fill-primary-400 stroke-none" />
                <Star className="w-4 h-4 fill-primary-400 stroke-none" />
                <Star className="w-4 h-4 fill-primary-400 stroke-none" />
              </div>
              <span className="font-semibold text-white">4,9 / 5</span>
              <span>note moyenne vérifiée par les artisans</span>
            </div>
          </div>

          {/* Collage de 3 découpes soignées d'images locales */}
          <div className="pt-10 grid grid-cols-3 gap-3">
            <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-neutral-800">
              <Image
                src="/images/about/about-craft.jpg"
                alt="Geste précis d'artisanat"
                fill
                sizes="(max-width: 1024px) 30vw, 15vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-neutral-800 -translate-y-2">
              <Image
                src="/images/editorial/facial-detail.jpg"
                alt="Soin visage délicat"
                fill
                sizes="(max-width: 1024px) 30vw, 15vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-neutral-800">
              <Image
                src="/images/editorial/hair-detail.jpg"
                alt="Expertise de coupe de cheveux"
                fill
                sizes="(max-width: 1024px) 30vw, 15vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===================================================================
            PANNEAU DROIT : QUESTIONNAIRE ADAPTATIF (Images 2 & 3)
            =================================================================== */}
        <section className="lg:col-span-7 bg-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div className="w-full max-w-xl mx-auto space-y-8">
            {/* Barre de progression segmentée */}
            {step < 5 && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        step >= seg ? "bg-neutral-950" : "bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                  <span>Étape {step} sur 4</span>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="inline-flex items-center gap-1 hover:text-neutral-950 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Retour</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 1 : QUEL ÉTABLISSEMENT ? (Image 2)
                ------------------------------------------------------------- */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Quel établissement souhaitez-vous équiper ?
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    Sélectionnez votre univers d&apos;activité pour adapter les fonctionnalités.
                  </p>
                </div>

                <div className="space-y-3">
                  {ESTABLISHMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectType(opt.id)}
                      className="w-full group p-4 sm:p-5 rounded-xl border border-neutral-200 hover:border-primary-600/70 hover:bg-neutral-50/50 text-left transition-all duration-150 flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors block">
                          {opt.title}
                        </span>
                        <span className="text-xs text-neutral-500 font-normal mt-0.5 block">
                          {opt.subtitle}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </button>
                  ))}
                </div>

                {/* Lien particulier */}
                <div className="pt-2 text-center sm:text-left">
                  <Link
                    href="/"
                    className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium inline-flex items-center gap-1"
                  >
                    <span>Je ne suis pas un professionnel de santé ou beauté, je souhaite réserver sur Belora</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 2 : SPÉCIALITÉ PRINCIPALE DYNAMIQUE (Image 3)
                ------------------------------------------------------------- */}
            {step === 2 && activeEstablishment && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Quelle est votre spécialité principale ?
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    Spécialités recommandées pour : {activeEstablishment.title}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeEstablishment.specialties.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => handleSelectSpecialty(spec.label)}
                      className="w-full group p-4 sm:p-5 rounded-xl border border-neutral-200 hover:border-primary-600/70 hover:bg-neutral-50/50 text-left transition-all duration-150 flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {spec.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Changer de catégorie d&apos;établissement</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 3 : INFORMATIONS ÉTABLISSEMENT
                ------------------------------------------------------------- */}
            {step === 3 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleStep3Submit}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Parlez-nous de votre atelier
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    Spécialité : <strong className="text-neutral-900">{selectedSpecialty}</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Nom */}
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Nom de votre établissement ou enseigne *
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="businessName"
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex : Atelier Saint-Honoré, Studio Botanique..."
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  {/* Ville */}
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Ville ou métropole d&apos;implantation *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex : Paris, Lyon, Genève, Milan..."
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  {/* Taille de l'équipe */}
                  <div>
                    <span className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                      Combien de praticiens travaillent dans l&apos;établissement ?
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { id: "solo", label: "1 solo" },
                        { id: "2-5", label: "2 à 5" },
                        { id: "6+", label: "6 ou +" },
                      ].map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setTeamSize(size.id)}
                          className={`py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            teamSize === size.id
                              ? "bg-neutral-950 text-white border-neutral-950"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-outline flex-1 cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 4 : COORDONNÉES DE CONTACT
                ------------------------------------------------------------- */}
            {step === 4 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleStep4Submit}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Où pouvons-nous vous contacter ?
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5">
                    Un conseiller expert prendra contact pour préparer votre démonstration sur-mesure.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Nom complet */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Votre prénom et nom *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ex : Camille Laurent"
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Numéro de téléphone portable professionnel *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+33 6 12 34 56 78"
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Adresse e-mail professionnelle *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@votre-etablissement.com"
                        className="input pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn btn-outline flex-1 cursor-pointer"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Demander ma démo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-neutral-400 text-center leading-normal">
                  En validant votre demande, vous acceptez d&apos;être recontacté par un conseiller Belora. Aucune carte bancaire requise.
                </p>
              </motion.form>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 5 : CONFIRMATION & SUCCÈS
                ------------------------------------------------------------- */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-600 border border-primary-200/80 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 stroke-[2]" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary-700 block">
                    Demande transmise avec succès
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl text-neutral-950 font-normal">
                    Merci {fullName.split(" ")[0] || ""} !
                  </h2>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Votre demande pour <strong>{businessName}</strong> ({selectedSpecialty} à {city}) a bien été transmise à notre équipe partenariats.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-2 text-xs text-neutral-700 max-w-md mx-auto">
                  <div className="flex items-center gap-2 font-semibold text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Ce qui se passe maintenant :</span>
                  </div>
                  <p className="text-neutral-600">
                    Un conseiller expert de votre univers vous contactera au <strong>{phone}</strong> sous 24h ouvrées pour préparer votre essai et vous présenter les outils Belora.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/pro#pricing" className="btn btn-outline w-full sm:w-auto">
                    Consulter la grille des tarifs
                  </Link>
                  <Link href="/" className="btn btn-dark w-full sm:w-auto">
                    Retour à l&apos;accueil Belora
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Social Proof au bas du formulaire (Image 2) */}
          <div className="pt-10 border-t border-neutral-100 mt-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center text-xs text-neutral-500">
              <div>
                <span className="block font-bold text-neutral-900 text-sm">4,9 / 5</span>
                <span>Avis Partenaires</span>
              </div>
              <div className="w-px h-6 bg-neutral-200 hidden sm:block" />
              <div>
                <span className="block font-bold text-neutral-900 text-sm">0%</span>
                <span>Commission récurrente</span>
              </div>
              <div className="w-px h-6 bg-neutral-200 hidden sm:block" />
              <div>
                <span className="block font-bold text-neutral-900 text-sm">450+</span>
                <span>Ateliers certifiés</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
