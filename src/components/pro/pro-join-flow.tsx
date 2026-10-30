"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Scissors,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Check,
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
  specialties: { id: string; label: string }[];
}

const ESTABLISHMENT_OPTIONS: EstablishmentOption[] = [
  {
    id: "hair_barber",
    title: "Salon de coiffure ou barbershop",
    specialties: [
      { id: "hair_salon", label: "Salon de coiffure mixte" },
      { id: "colorist", label: "Coloriste & Soin d'exception" },
      { id: "barbershop", label: "Barbershop & Barbier traditionnel" },
      { id: "hair_studio", label: "Studio privé & Coiffeur créateur" },
    ],
  },
  {
    id: "beauty_spa_nails",
    title: "Institut de beauté, spa ou bar à ongles",
    specialties: [
      { id: "facial", label: "Institut de beauté & Facialiste" },
      { id: "nails", label: "Bar à ongles & Manucure experte" },
      { id: "spa", label: "Spa urbain & Rituels balnéo" },
      { id: "lashes_brows", label: "Beauté du regard & Dermopigmentation" },
    ],
  },
  {
    id: "wellness",
    title: "Professionnels du bien-être",
    specialties: [
      { id: "massage", label: "Massages du monde & Praticien corporel" },
      { id: "reflexo", label: "Réflexologue" },
      { id: "sophro", label: "Sophrologue" },
      { id: "hypno", label: "Hypnothérapeute & Soins holistiques" },
    ],
  },
  {
    id: "independent",
    title: "Artisan indépendant ou à domicile",
    specialties: [
      { id: "home_pro", label: "Soins d'exception à domicile" },
      { id: "private_suite", label: "Cabinet privé & Espace indépendant" },
      { id: "mobile_stylist", label: "Artisan itinérant" },
      { id: "corporate_wellness", label: "Intervention bien-être en entreprise" },
    ],
  },
];

export function ProJoinFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Lecture des query params pour préserver l'état lors de l'actualisation
  const urlStep = searchParams.get("step");
  const urlType = searchParams.get("type") as EstablishmentType | null;
  const urlSpecialty = searchParams.get("specialty") || "";
  const urlView = searchParams.get("v");

  // Mode passerelle (gateway) ou tunnel (wizard)
  const [view, setView] = useState<"gateway" | "wizard">(() => {
    if (urlView === "gateway") return "gateway";
    return "wizard"; // Par défaut sur /pro/join, ouverture directe du tunnel
  });

  // Étape du formulaire (1 à 5)
  const [step, setStep] = useState<number>(() => {
    if (urlStep) {
      const parsed = parseInt(urlStep, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) return parsed;
    }
    return 1;
  });

  // Type d'établissement
  const [selectedType, setSelectedType] = useState<EstablishmentType | null>(() => {
    if (urlType && ESTABLISHMENT_OPTIONS.some((o) => o.id === urlType)) {
      return urlType;
    }
    return null;
  });

  // Spécialité
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(() => {
    return urlSpecialty;
  });

  // Lecture paresseuse du sessionStorage sans effet secondaire
  const getSaved = (field: string, fallback: string = "") => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("belora_pro_lead");
        if (saved) {
          const data = JSON.parse(saved);
          return data[field] || fallback;
        }
      } catch {
        // Ignorer
      }
    }
    return fallback;
  };

  // Données de formulaire initialisées avec les données enregistrées
  const [businessName, setBusinessName] = useState<string>(() => getSaved("businessName"));
  const [city, setCity] = useState<string>(() => getSaved("city"));
  const [teamSize, setTeamSize] = useState<string>(() => getSaved("teamSize", "solo"));
  const [fullName, setFullName] = useState<string>(() => getSaved("fullName"));
  const [phone, setPhone] = useState<string>(() => getSaved("phone"));
  const [email, setEmail] = useState<string>(() => getSaved("email"));

  // Sauvegarde continue des champs saisis
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "belora_pro_lead",
        JSON.stringify({ businessName, city, teamSize, fullName, phone, email })
      );
    } catch {
      // Ignorer
    }
  }, [businessName, city, teamSize, fullName, phone, email]);

  // Synchronisation avec l'URL pour rester sur la bonne étape au rechargement (F5)
  const updateUrl = (
    newStep: number,
    newType: EstablishmentType | null = selectedType,
    newSpecialty: string = selectedSpecialty,
    newView: "gateway" | "wizard" = "wizard"
  ) => {
    const params = new URLSearchParams();
    if (newView === "gateway") {
      params.set("v", "gateway");
    } else {
      params.set("step", String(newStep));
      if (newType) params.set("type", newType);
      if (newSpecialty) params.set("specialty", newSpecialty);
    }
    router.replace(`/pro/join?${params.toString()}`, { scroll: false });
  };

  const activeEstablishment = ESTABLISHMENT_OPTIONS.find(
    (opt) => opt.id === selectedType
  );

  const handleSelectType = (typeId: EstablishmentType) => {
    setSelectedType(typeId);
    setSelectedSpecialty("");
    setStep(2);
    updateUrl(2, typeId, "");
  };

  const handleSelectSpecialty = (specLabel: string) => {
    setSelectedSpecialty(specLabel);
    setStep(3);
    updateUrl(3, selectedType, specLabel);
  };

  const handleBack = () => {
    const prevStep = Math.max(1, step - 1);
    setStep(prevStep);
    updateUrl(prevStep, selectedType, prevStep < 3 ? "" : selectedSpecialty);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !city.trim()) return;
    setStep(4);
    updateUrl(4, selectedType, selectedSpecialty);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;
    setStep(5);
    updateUrl(5, selectedType, selectedSpecialty);
  };

  // ---------------------------------------------------------------------------
  // VUE 1 : AIGUILLAGE INITIAL (GATEWAY - Image 1 épurée)
  // ---------------------------------------------------------------------------
  if (view === "gateway") {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-primary-100 selection:text-primary-900">
        <ProNav showNavLinks={false} />

        <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-5">
          <div className="w-full max-w-xl text-center space-y-8">
            <div className="space-y-3">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary-700 block">
                Programme Partenaires
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-neutral-950 font-normal tracking-tight text-balance">
                Devenir partenaire Belora Pro
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-md mx-auto text-pretty">
                Rejoignez le premier cercle d’artisans et maisons du soin.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-neutral-700 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary-600 stroke-2" />
                  Sans engagement
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary-600 stroke-2" />
                  0% de commission sur vos clients
                </span>
              </div>
            </div>

            <div className="space-y-3.5 pt-2 text-left">
              <button
                type="button"
                onClick={() => {
                  setView("wizard");
                  setStep(1);
                  updateUrl(1, null, "", "wizard");
                }}
                className="w-full group p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-primary-600/80 hover:bg-neutral-50/50 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 border border-primary-100 group-hover:scale-105 transition-transform">
                    <Scissors className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-primary-700 transition-colors">
                      Je suis gérant d’un établissement
                    </h2>
                    <p className="text-sm text-neutral-500 font-normal mt-0.5">
                      Coiffure, esthétique, barbier, bien-être, spa...
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>

              <Link
                href="/search"
                className="w-full group p-5 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-300 hover:bg-neutral-50/50 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-200/70 group-hover:scale-105 transition-transform">
                    <Calendar className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-neutral-950 group-hover:text-neutral-900 transition-colors">
                      Je ne suis pas un professionnel
                    </h2>
                    <p className="text-sm text-neutral-500 font-normal mt-0.5">
                      Je souhaite prendre un rendez-vous beauté ou bien-être
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-950 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </Link>
            </div>

            <p className="text-sm text-neutral-500 font-normal pt-2">
              Déjà partenaire ?{" "}
              <Link
                href="/login"
                className="font-semibold text-neutral-900 hover:text-primary-700 underline underline-offset-4"
              >
                Connexion Belora Pro
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VUE 2 : TUNNEL INTERACTIF SPLIT-SCREEN (Épuré & Haute Fidélité)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-primary-100 selection:text-primary-900">
      <ProNav
        showNavLinks={true}
        onStartDemo={() => {
          setView("wizard");
          setStep(1);
          updateUrl(1, null, "", "wizard");
        }}
      />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4.5rem)]">
        {/* ===================================================================
            PANNEAU GAUCHE : SOMBRE & ÉDITORIAL (Texte allégé & 3 belles photos)
            =================================================================== */}
        <section className="lg:col-span-5 bg-primary-900 text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-900">
          <div className="space-y-6 max-w-lg">
            {/* Tag marque épuré */}
            <div className="inline-flex items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-primary-300">
                Belora Pro
              </span>
            </div>

            {/* Titre fort & concis */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.14] text-balance">
              La plateforme des maisons et artisans du soin.
            </h1>

            {/* Paragraphe court */}
            <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed text-pretty">
              Plus de 450 ateliers d’exception nous confient leur agenda, leurs encaissements et leur clientèle.
            </p>

            {/* 3 points forts concis */}
            <ul className="space-y-2.5 pt-1 text-sm sm:text-base text-neutral-200">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Agenda haute précision sans no-show</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Acomptes & paiements en direct</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-900/80 border border-primary-700/80 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-primary-200 stroke-[2.5]" />
                </div>
                <span>Sans engagement ni commission</span>
              </li>
            </ul>
          </div>

          {/* Collage des 3 belles photos conservées intactes */}
          <div className="pt-8 grid grid-cols-3 gap-3">
            <div className="relative aspect-3/4 rounded-xl overflow-hidden border border-neutral-800">
              <Image
                src="/images/about/about-craft.jpg"
                alt="Geste d'artisanat"
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
                alt="Expertise coiffure"
                fill
                sizes="(max-width: 1024px) 30vw, 15vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ===================================================================
            PANNEAU DROIT : QUESTIONNAIRE ÉPURÉ (Sans textes encombrants)
            =================================================================== */}
        <section className="lg:col-span-7 bg-white p-6 sm:p-12 lg:p-14 flex flex-col justify-between">
          <div className="w-full max-w-xl mx-auto space-y-7">
            {/* Barre de progression segmentée */}
            {step < 5 && (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        step >= seg ? "bg-primary-700" : "bg-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-500 font-medium">
                  <span>Étape {step} sur 4</span>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 hover:text-neutral-950 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Retour</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 1 : QUEL ÉTABLISSEMENT ? (Cartes nettes sans sous-titres)
                ------------------------------------------------------------- */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Quel établissement souhaitez-vous équiper ?
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {ESTABLISHMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectType(opt.id)}
                      className={`w-full group p-4 sm:p-4.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        selectedType === opt.id
                          ? "border-primary-600 bg-primary-50/20"
                          : "border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50/60"
                      }`}
                    >
                      <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {opt.title}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </button>
                  ))}
                </div>

                {/* Lien particulier épuré */}
                <div className="pt-3 text-center sm:text-left">
                  <Link
                    href="/"
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors font-medium inline-flex items-center gap-1"
                  >
                    <span>Je souhaite prendre un rendez-vous beauté ou bien-être</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 2 : SPÉCIALITÉ PRINCIPALE DYNAMIQUE
                ------------------------------------------------------------- */}
            {step === 2 && activeEstablishment && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Quelle est votre spécialité principale ?
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {activeEstablishment.specialties.map((spec) => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => handleSelectSpecialty(spec.label)}
                      className={`w-full group p-4 sm:p-4.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                        selectedSpecialty === spec.label
                          ? "border-primary-600 bg-primary-50/20"
                          : "border-neutral-200/90 hover:border-neutral-300 hover:bg-neutral-50/60"
                      }`}
                    >
                      <span className="text-sm sm:text-base font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                        {spec.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm font-semibold text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Modifier la catégorie d&apos;établissement</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 3 : VOTRE ATELIER
                ------------------------------------------------------------- */}
            {step === 3 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleStep3Submit}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Votre atelier
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Spécialité : <strong className="text-neutral-900">{selectedSpecialty}</strong>
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Nom de l&apos;établissement *
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="businessName"
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex : Atelier Botanique, Studio Saint-Honoré..."
                        className="input pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Ville ou métropole *
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

                  <div>
                    <span className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Taille de l&apos;équipe
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "solo", label: "1 solo" },
                        { id: "2-5", label: "2 à 5" },
                        { id: "6+", label: "6 ou +" },
                      ].map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setTeamSize(size.id)}
                          className={`py-2 px-3 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
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
                    onClick={handleBack}
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
                ÉTAPE 4 : COORDONNÉES
                ------------------------------------------------------------- */}
            {step === 4 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleStep4Submit}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Vos coordonnées
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Pour organiser votre démonstration privée.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Prénom et nom *
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

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      Téléphone portable professionnel *
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

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-1.5"
                    >
                      E-mail professionnel *
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
                    onClick={handleBack}
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
              </motion.form>
            )}

            {/* -------------------------------------------------------------
                ÉTAPE 5 : CONFIRMATION & SUCCÈS
                ------------------------------------------------------------- */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 text-center py-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 border border-primary-200/80 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 stroke-2" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-semibold uppercase tracking-widest text-primary-700 block">
                    Demande transmise
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-neutral-950 font-normal">
                    Merci {fullName.split(" ")[0] || ""} !
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 max-w-sm mx-auto leading-relaxed">
                    Votre demande pour <strong>{businessName}</strong> ({selectedSpecialty} à {city}) a bien été enregistrée.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-1.5 text-sm text-neutral-700 max-w-sm mx-auto">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Rappel sous 24h ouvrées :</span>
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    Un conseiller dédié vous contactera au <strong>{phone}</strong> pour préparer votre essai personnalisé.
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <Link href="/pro#pricing" className="btn btn-outline text-sm w-full sm:w-auto">
                    Voir les tarifs
                  </Link>
                  <Link href="/" className="btn btn-dark text-sm w-full sm:w-auto">
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Chiffres clés sobres au bas du formulaire */}
          <div className="pt-8 border-t border-neutral-100 mt-6">
            <div className="flex items-center justify-center gap-8 sm:gap-12 text-center text-sm text-neutral-500">
              <div>
                <span className="block font-bold text-neutral-900 text-sm">4,9 / 5</span>
                <span>Note artisans</span>
              </div>
              <div className="w-px h-5 bg-neutral-200" />
              <div>
                <span className="block font-bold text-neutral-900 text-sm">0%</span>
                <span>Commission</span>
              </div>
              <div className="w-px h-5 bg-neutral-200" />
              <div>
                <span className="block font-bold text-neutral-900 text-sm">450+</span>
                <span>Ateliers</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
