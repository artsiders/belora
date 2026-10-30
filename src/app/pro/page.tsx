"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ShieldCheck,
  Store,
  Wallet,
  X,
  Smartphone,
  Lock,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function ProPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedArtisanTab, setSelectedArtisanTab] = useState<"all" | "helene" | "marc" | "nour">("all");

  const PRO_PILLARS = [
    {
      icon: CalendarDays,
      number: "01",
      title: "Agenda pro ultra-réactif",
      description:
        "Vue jour et semaine fluide par collaborateur. Glisser-déposer sans latence, pauses automatiques et gestion précise des temps de pose de coloration.",
    },
    {
      icon: ShieldCheck,
      number: "02",
      title: "Zéro rendez-vous non honoré",
      description:
        "Rappels automatisés par e-mail et SMS personnalisés. Sécurisation de chaque créneau par empreinte bancaire ou acompte Stripe Connect.",
    },
    {
      icon: Store,
      number: "03",
      title: "Clientèle valorisant le geste",
      description:
        "Votre établissement est exposé à des clients en quête d'artisanat d'exception, prêts à honorer le juste prix du savoir-faire sans marchandage.",
    },
    {
      icon: Wallet,
      number: "04",
      title: "Paiements directs sans intermédiaire",
      description:
        "Chaque recette est versée directement sur votre compte bancaire professionnel. 0% de commission prélevée sur vos clients habituels.",
    },
  ];

  const COMPARISONS = [
    {
      topic: "Commission sur vos clients réguliers",
      traditional: "10% à 25% prélevés sur chaque réservation",
      belora: "0% de commission à vie sur tous vos habitués",
    },
    {
      topic: "Sécurisation contre le no-show",
      traditional: "Options rigides ou perte totale en cas de rendez-vous manqué",
      belora: "Acomptes bancaires et empreinte configurables par prestation",
    },
    {
      topic: "Valorisation de votre image",
      traditional: "Mélangé à des chaînes discounts et bourses aux rabais",
      belora: "Curation exclusive d'ateliers d'exception et artisans audités",
    },
    {
      topic: "Ergonomie & Rapidité quotidienne",
      traditional: "Interfaces lourdes, chargements lents et surcharges de clics",
      belora: "Design épuré réactif conçu pour iPad, Mac et smartphone",
    },
    {
      topic: "Accompagnement & Support technique",
      traditional: "Serveur vocal impersonnel ou ticket sans suivi",
      belora: "Conseiller dédié basé en France, joignable 6j/7 directement",
    },
  ];

  const PRICING_PLANS = [
    {
      name: "Atelier Solo",
      monthlyPrice: 39,
      annualPrice: 31,
      description: "Pour les artisans indépendants, barbiers et praticiens en studio privé.",
      features: [
        "1 agenda praticien illimité",
        "Réservation en ligne 24h/24",
        "Rappels e-mails et SMS illimités",
        "Profil audité sur la marketplace Belora",
        "Paiements Stripe Connect sécurisés",
        "Export comptable des recettes",
      ],
      highlighted: false,
      cta: "Commencer l’essai Solo",
    },
    {
      name: "Maison & Équipe",
      monthlyPrice: 69,
      annualPrice: 55,
      description: "Pour les salons de coiffure, instituts et spas avec plusieurs collaborateurs.",
      features: [
        "Jusqu'à 6 praticiens en simultané",
        "Gestion des plannings et congés",
        "Réservation avec choix du praticien",
        "Statistiques de chiffre d'affaires et fidélité",
        "Shooting photo annuel de l'atelier offert",
        "Assistance prioritaire 6j/7",
      ],
      highlighted: true,
      cta: "Commencer l’essai Équipe",
    },
    {
      name: "Grand Sanctuaire",
      monthlyPrice: 119,
      annualPrice: 95,
      description: "Pour les établissements multi-espaces, académies et spas d'hôtels d'exception.",
      features: [
        "Membres d'équipe illimités",
        "Multi-cabines et gestion des ressources",
        "Gestionnaire de compte dédié 6j/7",
        "Mise en avant prioritaire sur la marketplace",
        "Intégration caisse certifiée NF525",
        "Formation personnalisée de l'équipe",
      ],
      highlighted: false,
      cta: "Contacter un conseiller",
    },
  ];

  const FAQS = [
    {
      question: "Puis-je importer mes clients et l'historique depuis mon ancien logiciel ?",
      answer:
        "Absolument. Notre équipe technique s'occupe de migrer gratuitement l'ensemble de votre fichier clients, vos prestations et vos plannings en moins de 24h, sans la moindre interruption pour votre salon.",
    },
    {
      question: "Prenez-vous une commission sur les réservations de mes clients habituels ?",
      answer:
        "Non, jamais. Vous ne payez que votre forfait mensuel fixe. Vous conservez 100% de vos encaissements sur l'ensemble de votre clientèle existante.",
    },
    {
      question: "Comment fonctionnent la sécurisation et les acomptes en ligne ?",
      answer:
        "Vous choisissez librement pour chaque prestation si vous souhaitez demander une simple empreinte bancaire ou un acompte (par exemple 30% ou 50%). Les fonds sont versés immédiatement sur votre compte bancaire via Stripe Connect.",
    },
    {
      question: "Quel matériel informatique est nécessaire dans mon atelier ?",
      answer:
        "Aucun boîtier dédié n'est requis. Belora Pro fonctionne avec une fluidité instantanée sur iPad, Mac, PC, tablette Android et smartphone directement depuis votre navigateur web habituel.",
    },
    {
      question: "L'essai de 14 jours nécessite-t-il une carte bancaire ?",
      answer:
        "Non. Vous créez votre espace en 2 minutes sans carte bancaire. Vous testez l'agenda librement et ne souscrivez que si vous êtes conquis par la simplicité de l'outil.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO IMMERSIF ÉDITORIAL PRO (Inspiré de CategoryHero)
            ========================================================================= */}
        <section className="relative w-full overflow-hidden bg-neutral-950 py-14 sm:py-20 lg:py-24 text-white select-none">
          {/* Visuel d'ambiance plein écran avec masque sombre sobre */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/pro/pro-hero.jpg"
              alt="Artisan d'exception dans son salon partenaire Belora"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-45"
            />
            <div className="absolute inset-0 bg-neutral-950/75 pointer-events-none" />
          </div>

          <div className="container-belora relative z-10 flex flex-col items-start gap-8">
            {/* Fil d'Ariane & Eyebrow sobre */}
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <Link href="/" className="hover:text-white transition-colors">
                Accueil
              </Link>
              <span>/</span>
              <span className="text-primary-300 font-semibold uppercase tracking-wider text-xs">
                Belora Pro &bull; Maisons & Salons
              </span>
            </div>

            {/* Titre et Manifeste Éditorial */}
            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-balance text-white">
                L’artisanat d’exception mérite{" "}
                <span className="text-primary-300 font-normal">
                  un outil à la hauteur de son geste.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-200/95 leading-relaxed font-normal max-w-2xl text-pretty">
                Libérez-vous de la gestion administrative. Belora Pro réunit un agenda d’une fluidité absolue, la sécurisation des créneaux par acompte et la mise en avant de votre atelier auprès d’une clientèle sélective.
              </p>
            </div>

            {/* Boutons d'action modernes arrondis */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pro/join"
                className="btn btn-primary h-13 px-7 rounded-2xl text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
              >
                <span>Demander une démo privée</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#agenda-demo"
                className="btn h-13 px-6 rounded-2xl text-sm font-semibold border border-white/25 text-white hover:bg-white/10 transition-colors"
              >
                <span>Découvrir l’agenda en direct</span>
              </a>
            </div>

            {/* Bandeau de 3 réassurances clés en bas de Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-4 border-t border-white/15 w-full text-sm text-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary-200">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">0% de commission</strong>
                  <span className="text-neutral-400 text-xs">Sur tous vos clients réguliers</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary-200">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Acomptes sécurisés</strong>
                  <span className="text-neutral-400 text-xs">Zéro no-show garanti via Stripe</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-primary-200">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <strong className="block text-white font-semibold">Migration en 24h</strong>
                  <span className="text-neutral-400 text-xs">Prise en charge intégrale gratuite</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. SIMULATION DE L'AGENDA PRO EN DIRECT (Uniformité de section avec /search)
            ========================================================================= */}
        <section
          id="agenda-demo"
          className="py-12 sm:py-16 lg:py-20 bg-neutral-50/60 border-b border-primary-200/80"
          aria-labelledby="agenda-heading"
        >
          <div className="container-belora">
            {/* En-tête de section standardisé */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Interface Praticien &bull; Démonstration
                </span>
                <h2
                  id="agenda-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  Un agenda silencieux,{" "}
                  <span className="text-primary-600 font-bold">
                    conçu pour le tempo de votre salon.
                  </span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
                  Fini les clics superflus. Vos membres d’équipe visualisent leurs rituels, temps de pause et encaissements d’un coup d’œil.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-white border border-neutral-200/80 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0">
                  3 praticiens actifs
                </span>
              </div>
            </div>

            {/* Vue Interactive iPad / Desktop de l'Agenda */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white shadow-md overflow-hidden">
              {/* Barre d'outils supérieure de l'agenda */}
              <div className="p-4 sm:p-5 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary-600" />
                    <span className="font-bold text-neutral-950 text-sm sm:text-base">
                      Mardi 21 Octobre 2026
                    </span>
                  </div>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
                    Vue Journalière
                  </span>
                </div>

                {/* Filtre de vue praticien */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSelectedArtisanTab("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedArtisanTab === "all"
                        ? "bg-white text-neutral-950 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Toute l’équipe
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArtisanTab("helene")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedArtisanTab === "helene"
                        ? "bg-white text-neutral-950 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Hélène
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArtisanTab("marc")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedArtisanTab === "marc"
                        ? "bg-white text-neutral-950 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Marc
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedArtisanTab("nour")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedArtisanTab === "nour"
                        ? "bg-white text-neutral-950 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Nour
                  </button>
                </div>
              </div>

              {/* Colonnes des collaborateurs */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-200/80 p-4 sm:p-6 gap-6 md:gap-0">
                {/* Collaborateur 1 : Hélène de Valois */}
                {(selectedArtisanTab === "all" || selectedArtisanTab === "helene") && (
                  <div className="md:px-4 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                          <Image
                            src="/images/artisans/artisan-1.jpg"
                            alt="Hélène de Valois"
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-neutral-950">
                            Hélène de Valois
                          </h4>
                          <p className="text-xs text-primary-700 font-semibold">
                            Artisan Coloriste
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500 font-medium num">
                        5 créneaux
                      </span>
                    </div>

                    {/* Rendez-vous 1 */}
                    <div className="p-4 rounded-2xl bg-primary-50/40 border border-primary-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Balayage Minéral & Soin
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-primary-200">
                          10h00 - 12h00
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Sophie M. &bull; Acompte versé (45 €)
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-primary-700 font-medium pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Créneau garanti &bull; 185 €</span>
                      </div>
                    </div>

                    {/* Rendez-vous 2 */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Coupe Signature à Sec
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                          14h00 - 15h00
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Camille D. &bull; Client régulier Belora
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium pt-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Temps de coiffage 60 min &bull; 80 €</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collaborateur 2 : Marc Sémard */}
                {(selectedArtisanTab === "all" || selectedArtisanTab === "marc") && (
                  <div className="md:px-4 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                          <Image
                            src="/images/artisans/artisan-2.jpg"
                            alt="Marc Sémard"
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-neutral-950">
                            Marc Sémard
                          </h4>
                          <p className="text-xs text-secondary-700 font-semibold">
                            Maître Barbier
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500 font-medium num">
                        6 créneaux
                      </span>
                    </div>

                    {/* Rendez-vous 1 */}
                    <div className="p-4 rounded-2xl bg-secondary-50/40 border border-secondary-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Rituel Rasage & Serviette
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-secondary-200">
                          11h00 - 12h00
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Alexandre G. &bull; Cabine Barbier Studio
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-secondary-700 font-medium pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Empreinte enregistrée &bull; 65 €</span>
                      </div>
                    </div>

                    {/* Rendez-vous 2 */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Taille de Barbe & Huile
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                          15h30 - 16h15
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Julien R. &bull; Réservation en ligne
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium pt-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Durée 45 min &bull; 45 €</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Collaborateur 3 : Nour Kaddour */}
                {(selectedArtisanTab === "all" || selectedArtisanTab === "nour") && (
                  <div className="md:px-4 space-y-3.5">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200">
                          <Image
                            src="/images/artisans/artisan-3.jpg"
                            alt="Nour Kaddour"
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-neutral-950">
                            Nour Kaddour
                          </h4>
                          <p className="text-xs text-primary-700 font-semibold">
                            Facialiste & Kobido
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-neutral-500 font-medium num">
                        4 créneaux
                      </span>
                    </div>

                    {/* Rendez-vous 1 */}
                    <div className="p-4 rounded-2xl bg-primary-50/40 border border-primary-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Grand Rituel Kobido
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-primary-200">
                          14h00 - 15h15
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Élodie B. &bull; Cabine Sérénité (Acompte 50 €)
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-primary-700 font-medium pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Acompte Stripe versé &bull; 140 €</span>
                      </div>
                    </div>

                    {/* Rendez-vous 2 */}
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-neutral-950 space-y-1.5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-sm font-semibold text-neutral-950">
                          Diagnostic & Soin Visage
                        </span>
                        <span className="num font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded-md border border-neutral-200">
                          16h30 - 17h15
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Thomas V. &bull; Nouveau client Belora
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium pt-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Durée 45 min &bull; 95 €</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pied du simulateur d'agenda : Synthèse comptable en direct */}
              <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <span className="text-neutral-700 font-normal">
                  Chiffre d’affaires de la journée :{" "}
                  <strong className="text-neutral-950 font-bold num text-base">1 420 €</strong>
                </span>
                <span className="text-primary-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                  <span>Acomptes bancaires sécurisés : 480 € garantis sur votre compte</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. LES 4 PILIERS BELORA PRO (Inspiration CategoryEditorial)
            ========================================================================= */}
        <section
          className="py-12 sm:py-16 lg:py-20 bg-white border-b border-primary-200/80"
          aria-labelledby="pillars-heading"
        >
          <div className="container-belora">
            {/* En-tête standardisé */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Piliers d&apos;Excellence &bull; Belora Pro
                </span>
                <h2
                  id="pillars-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  Pourquoi les plus beaux havres{" "}
                  <span className="text-primary-600 font-bold">
                    choisissent Belora Pro.
                  </span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
                  Chaque détail de la plateforme a été pensé pour supprimer les frictions et valoriser votre expertise artisanale.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
                4 engagements
              </span>
            </div>

            {/* 4 Piliers aérés : zéro boîte encadrée artificielle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRO_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div key={pillar.number} className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-primary-600">
                          <Icon className="w-5 h-5 stroke-[1.75]" />
                        </div>
                        <span className="text-2xl font-bold num text-neutral-300">
                          {pillar.number}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-2 leading-snug">
                        {pillar.title}
                      </h3>

                      <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs text-primary-700 font-semibold">
                      <Check className="w-3.5 h-3.5 text-primary-600" />
                      <span>Inclus dans toutes les formules</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. COMPARATIF DEUX VISIONS DU MÉTIER (Épuré & Typographique)
            ========================================================================= */}
        <section
          className="py-12 sm:py-16 lg:py-20 bg-neutral-50/60 border-b border-primary-200/80"
          aria-labelledby="comparison-heading"
        >
          <div className="container-belora">
            {/* En-tête standardisé */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Philosophie du Partenariat
                </span>
                <h2
                  id="comparison-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  Un modèle respectueux de{" "}
                  <span className="text-primary-600 font-bold">
                    votre indépendance.
                  </span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
                  Fini les commissions masquées et les annuaires discounts. Belora restaure la dignité du geste artisanal.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
                0% commission habitués
              </span>
            </div>

            {/* Tableau comparatif moderne et aéré */}
            <div className="rounded-3xl border border-neutral-200/90 bg-white overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200/80">
                {/* Colonne Gauche : Anciens logiciels & annuaires */}
                <div className="md:col-span-6 p-6 sm:p-8 space-y-6 bg-neutral-50/40">
                  <div className="flex items-center gap-2 pb-4 border-b border-neutral-200/80">
                    <div className="w-8 h-8 rounded-full bg-neutral-200/70 text-neutral-600 flex items-center justify-center shrink-0">
                      <X className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-neutral-800">
                        Logiciels & Annuaires Traditionnels
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Modèle basé sur la captation de commission
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {COMPARISONS.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-600">
                        <X className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-neutral-700 font-medium">
                            {comp.topic}
                          </strong>
                          <span className="text-xs text-neutral-500 mt-0.5 block">
                            {comp.traditional}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Colonne Droite : Le standard Belora Pro */}
                <div className="md:col-span-6 p-6 sm:p-8 space-y-6 bg-white">
                  <div className="flex items-center gap-2 pb-4 border-b border-primary-200/80">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                        Le Standard Belora Pro
                      </h3>
                      <p className="text-xs text-primary-700 font-medium">
                        Forfait fixe, liberté totale et respect du savoir-faire
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-5">
                    {COMPARISONS.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-900">
                        <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-neutral-950 font-semibold">
                            {comp.topic}
                          </strong>
                          <span className="text-xs text-primary-800 font-medium mt-0.5 block">
                            {comp.belora}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. TARIFS TRANSPARENTS SANS ENGAGEMENT
            ========================================================================= */}
        <section
          id="pricing"
          className="py-12 sm:py-16 lg:py-20 bg-white border-b border-primary-200/80"
          aria-labelledby="pricing-heading"
        >
          <div className="container-belora">
            {/* En-tête standardisé */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Tarification &bull; Sans Engagement
                </span>
                <h2
                  id="pricing-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  Des forfaits clairs et fixes,{" "}
                  <span className="text-primary-600 font-bold">
                    sans commission masquée.
                  </span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
                  14 jours d’essai offert sans carte bancaire. Modifiez ou résiliez à tout moment en un clic.
                </p>
              </div>

              {/* Sélecteur de cycle de facturation */}
              <div className="inline-flex items-center p-1 rounded-2xl bg-neutral-100 border border-neutral-200/80 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-white text-neutral-950 shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === "annual"
                      ? "bg-white text-neutral-950 shadow-2xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <span>Annuel</span>
                  <span className="text-xs text-primary-700 font-bold uppercase bg-primary-50 px-2 py-0.5 rounded-md">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Cartes de prix avec nos nouveaux boutons arrondis h-13 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {PRICING_PLANS.map((plan) => {
                const price =
                  billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div
                    key={plan.name}
                    className={`p-7 sm:p-8 rounded-3xl flex flex-col justify-between border transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-white border-primary-600 ring-2 ring-primary-600/20 shadow-lg relative"
                        : "bg-white border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300"
                    }`}
                  >
                    <div>
                      {plan.highlighted && (
                        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                          Formule Signature
                        </span>
                      )}

                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-6 font-normal min-h-10 leading-snug">
                        {plan.description}
                      </p>

                      <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-neutral-100">
                        <span className="text-4xl font-bold text-neutral-950 num">
                          {price} €
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-normal">
                          /mois {billingCycle === "annual" ? "(facturé à l'année)" : ""}
                        </span>
                      </div>

                      <ul className="space-y-3.5 text-sm text-neutral-700 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/pro/join"
                      className={`w-full btn h-13 rounded-2xl text-sm font-semibold flex items-center justify-center transition-all ${
                        plan.highlighted
                          ? "btn-primary shadow-sm"
                          : "border border-neutral-300 hover:border-neutral-400 bg-white hover:bg-neutral-50 text-neutral-900"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. FAQ ARTISANS & GÉRANTS
            ========================================================================= */}
        <section
          className="py-12 sm:py-16 lg:py-20 bg-neutral-50/60 border-b border-primary-200/80"
          aria-labelledby="faq-heading"
        >
          <div className="container-belora">
            {/* En-tête standardisé */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Questions Fréquentes &bull; Accompagnement
                </span>
                <h2
                  id="faq-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  Tout ce que vous devez savoir avant{" "}
                  <span className="text-primary-600 font-bold">
                    de débuter votre essai.
                  </span>
                </h2>
                <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
                  Une question spécifique sur votre salon ? Notre équipe d’accompagnement vous répond par téléphone 6j/7.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
                Support 6j/7
              </span>
            </div>

            {/* Accordéon FAQ épuré avec cartes rounded-2xl */}
            <div className="max-w-3xl mx-auto space-y-3.5">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-neutral-950">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-neutral-600 leading-relaxed font-normal border-t border-neutral-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. APPEL À L'ACTION IMMERSIF (Inspiré de CategoryProCta)
            ========================================================================= */}
        <section
          className="relative overflow-hidden bg-secondary-950 text-white py-14 sm:py-20 select-none"
          aria-labelledby="final-pro-cta-heading"
        >
          {/* Visuel d'ambiance plein écran en arrière-plan immersif */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/heroes/hero-hair.jpg"
              alt="Atelier d'exception partenaire Belora"
              fill
              sizes="100vw"
              className="object-cover object-center opacity-40"
            />
            {/* Aplat solide sombre pour contraste et lisibilité sans dégradé */}
            <div className="absolute inset-0 bg-neutral-950/80 pointer-events-none" />
          </div>

          <div className="container-belora relative z-10">
            <div className="max-w-2xl">
              <h2
                id="final-pro-cta-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-50 leading-tight mb-3"
              >
                Vous dirigez un salon ou un institut ?{" "}
                <span className="block text-primary-300 font-normal">
                  Rejoignez l’élite des maisons Belora Pro.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-200/90 leading-relaxed font-normal mb-6">
                Activez votre espace en 2 minutes. Bénéficiez d’un accompagnement personnalisé, d’une migration gratuite de vos données et d’un essai de 14 jours sans engagement.
              </p>

              {/* 3 piliers d'engagement en ligne aérée */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-white/15 mb-8">
                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                    <Smartphone className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                    Réservations 24h/24
                  </h3>
                  <p className="text-xs text-neutral-300/80 leading-relaxed">
                    Synchronisation directe sans commissions sur vos habitués.
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                    <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                    Visibilité sélective
                  </h3>
                  <p className="text-xs text-neutral-300/80 leading-relaxed">
                    Attirez une clientèle respectueuse du savoir-faire.
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                    <Lock className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                    Zéro no-show
                  </h3>
                  <p className="text-xs text-neutral-300/80 leading-relaxed">
                    Acomptes bancaires sécurisés et rappels automatiques.
                  </p>
                </div>
              </div>

              {/* Boutons d'action finaux */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/pro/join"
                  className="btn btn-primary h-13 px-8 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Rejoindre Belora Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="btn h-13 px-6 rounded-2xl text-sm font-semibold border border-white/25 text-white hover:bg-white/10 transition-colors inline-flex items-center justify-center"
                >
                  <span>Connexion praticien</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
