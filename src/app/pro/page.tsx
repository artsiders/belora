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
} from "lucide-react";

export default function ProPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const PRO_PILLARS = [
    {
      icon: CalendarDays,
      number: "01",
      title: "Agenda pro ultra-réactif",
      description:
        "Vue jour et semaine fluide par membre d'équipe. Glisser-déposer sans latence, pauses automatiques et gestion des temps de pose de coloration.",
    },
    {
      icon: ShieldCheck,
      number: "02",
      title: "Zéro rendez-vous non honoré",
      description:
        "Rappels automatiques par e-mail et SMS personnalisés. Sécurisation des réservations par empreinte bancaire ou acompte Stripe Connect.",
    },
    {
      icon: Store,
      number: "03",
      title: "Clientèle valorisant le geste",
      description:
        "Votre atelier est exposé à des clients en quête d'artisanat d'exception, prêts à payer le juste prix du savoir-faire sans marchandage.",
    },
    {
      icon: Wallet,
      number: "04",
      title: "Paiements directs sans intermédiaire",
      description:
        "Chaque recette est versée directement sur votre compte bancaire professionnel. 0% de commission prélevée sur vos clients habituels.",
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
        "Absolument. Notre équipe technique s'occupe de migrer gratuitement l'ensemble de votre fichier clients, vos prestations et vos plannings en moins de 24h, sans interruption de votre activité.",
    },
    {
      question: "Prenez-vous une commission sur les réservations de mes clients habituels ?",
      answer:
        "Non, jamais. Vous ne payez que votre forfait mensuel fixe. Vous conservez 100% de vos encaissements sur l'ensemble de vos clients.",
    },
    {
      question: "Comment fonctionnent la sécurisation et les acomptes en ligne ?",
      answer:
        "Vous choisissez librement pour chaque prestation si vous souhaitez demander une empreinte bancaire ou un acompte (par exemple 30%). Les fonds sont directement versés sur votre compte bancaire via Stripe Connect.",
    },
    {
      question: "Quel matériel est nécessaire dans mon salon ?",
      answer:
        "Aucun boîtier dédié n'est obligatoire. Belora Pro fonctionne avec une fluidité remarquable sur iPad, Mac, PC, tablette Android et smartphone directement depuis votre navigateur.",
    },
    {
      question: "L'essai de 14 jours nécessite-t-il une carte bancaire ?",
      answer:
        "Non. Vous créez votre espace en 2 minutes sans carte bancaire. Vous testez l'agenda librement et ne souscrivez que si vous êtes conquis par la simplicité de l'outil.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        {/* 1. HERO SECTION PRO APPLE-STYLE */}
        <section className="relative py-14 sm:py-20 lg:py-24 border-b border-primary-200/80 bg-white overflow-hidden">
          {/* Filigrane discret d'arche */}
          <div
            className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full border border-primary-200/50 pointer-events-none"
            aria-hidden="true"
          />

          <div className="container-belora">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Colonne gauche : Discours de marque sobre & précis */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-semibold tracking-wider text-sand-500">
                    Belora Pro · Pour les Ateliers & Salons
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-950 leading-tight text-balance">
                  L’artisanat d’exception mérite{" "}
                  <span className="block sm:inline text-primary-600 font-bold">
                    un outil à la hauteur de son geste.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-sand-600 max-w-xl leading-relaxed font-normal">
                  Libérez-vous de la gestion administrative. Belora Pro réunit un agenda d’une fluidité absolue, la sécurisation des créneaux par acompte et la mise en avant de votre atelier auprès d’une clientèle sélective.
                </p>

                {/* Boutons d'action */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/register?role=pro"
                    className="btn btn-primary py-3.5 px-6 text-xs sm:text-sm inline-flex items-center gap-2 rounded-xl"
                  >
                    <span>Démarrer l’essai gratuit</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#agenda-demo"
                    className="btn btn-outline py-3.5 px-6 text-xs sm:text-sm rounded-xl"
                  >
                    <span>Découvrir l’agenda en direct</span>
                  </a>
                </div>
              </div>

              {/* Colonne droite : Composition photographique en arches de la DA */}
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
                  {/* Arche principale photo pro */}
                  <div className="col-span-8 relative h-[360px] sm:h-[440px] arch-t rounded-b-2xl overflow-hidden bg-sand-100 border border-primary-200/80 shadow-sm">
                    <Image
                      src="/images/pro/pro-hero.jpg"
                      alt="Artisan coiffeur en plein geste dans son atelier partenaire Belora"
                      fill
                      priority
                      sizes="(max-width: 1024px) 70vw, 35vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Arches graphiques d'impact */}
                  <div className="col-span-4 flex flex-col gap-3 sm:gap-4 h-[360px] sm:h-[440px]">
                    {/* Arche supérieure Espresso avec indicateur fort */}
                    <div className="flex-1 arch-t rounded-b-2xl bg-secondary-900 p-4 sm:p-5 flex flex-col justify-end gap-2 text-white shadow-2xs">
                      <span className="text-xs uppercase font-semibold text-sand-400">
                        Performance
                      </span>
                      <div>
                        <p className="text-2xl sm:text-3xl font-bold num text-white">
                          +28%
                        </p>
                        <p className="text-xs text-sand-300 font-normal leading-tight mt-0.5">
                          de chiffre d’affaires moyen
                        </p>
                      </div>
                    </div>

                    {/* Arche inférieure Terracotta avec engagement */}
                    <div className="h-32 sm:h-36 arch-r rounded-l-2xl bg-earth-terracotta p-3.5 flex flex-col justify-center text-white shadow-2xs">
                      <p className="text-xs font-semibold leading-tight text-center">
                        Zéro no-show garanti
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SIMULATION DE L'AGENDA PRO EN DIRECT (APPLE PIXEL-PERFECT) */}
        <section
          id="agenda-demo"
          className="py-16 sm:py-24 border-b border-primary-200/80 bg-primary-50/10/60"
        >
          <div className="container-belora">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <p className="eyebrow mb-2">Simplicité Quotidienne</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-3">
                Un agenda silencieux, conçu pour le rythme de votre salon.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Développé avec des artisans pour supprimer les clics superflus. Vos membres d’équipe visualisent leurs rituels d’un seul coup d’œil.
              </p>
            </div>

            {/* Mockup Tablette Apple Pro pour l'agenda */}
            <div className="rounded-3xl border border-primary-200/80 bg-white shadow-lg overflow-hidden">
              {/* Barre supérieure de l'agenda */}
              <div className="p-4 sm:p-5 border-b border-primary-200/80 flex flex-wrap items-center justify-between gap-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary-600" />
                    <span className="font-bold text-sand-950 text-sm sm:text-base">
                      Mardi 21 Octobre 2026
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-sand-700 text-xs font-medium">
                    Vue Journalière
                  </span>
                </div>
              </div>

              {/* Colonnes des collaborateurs */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200/80 p-4 sm:p-6 gap-6 md:gap-0">
                {/* Colonne 1 : Hélène */}
                <div className="md:px-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-primary-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-100">
                        <Image
                          src="/images/artisans/artisan-1.jpg"
                          alt="Hélène de Valois"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-sand-950">
                          Hélène de Valois
                        </h4>
                        <p className="text-xs text-primary-600 font-medium">
                          Artisan Coloriste
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-sand-500 font-medium num">
                      5 créneaux
                    </span>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3.5 bg-primary-50 border-l-4 border-primary-600 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Balayage Minéral & Soin</span>
                      <span className="num font-semibold text-sand-700">10h00 - 12h00</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Sophie M. · Acompte versé (45 €)
                    </p>
                  </div>

                  {/* Rendez-vous 2 */}
                  <div className="p-3.5 bg-sand-100 border-l-4 border-primary-500 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Coupe Signature à Sec</span>
                      <span className="num font-semibold text-sand-700">14h00 - 15h00</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Camille D. · Nouveau client Belora
                    </p>
                  </div>
                </div>

                {/* Colonne 2 : Marc */}
                <div className="md:px-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-primary-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-100">
                        <Image
                          src="/images/artisans/artisan-2.jpg"
                          alt="Marc Sémard"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-sand-950">
                          Marc Sémard
                        </h4>
                        <p className="text-xs text-secondary-600 font-medium">
                          Maître Barbier
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-sand-500 font-medium num">
                      6 créneaux
                    </span>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3.5 bg-secondary-50 border-l-4 border-secondary-600 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Rituel Rasage & Serviette Chaude</span>
                      <span className="num font-semibold text-sand-700">11h00 - 12h00</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Alexandre G. · Client fidèle
                    </p>
                  </div>

                  {/* Rendez-vous 2 */}
                  <div className="p-3.5 bg-sand-100 border-l-4 border-primary-500 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Taille de Barbe & Soin Huile</span>
                      <span className="num font-semibold text-sand-700">15h30 - 16h15</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Jeanne R. · Réservation en ligne
                    </p>
                  </div>
                </div>

                {/* Colonne 3 : Nour */}
                <div className="md:px-4 space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-primary-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-100">
                        <Image
                          src="/images/artisans/artisan-3.jpg"
                          alt="Nour Kaddour"
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-sand-950">
                          Nour Kaddour
                        </h4>
                        <p className="text-xs text-primary-600 font-medium">
                          Facialiste & Kobido
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-sand-500 font-medium num">
                      4 créneaux
                    </span>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3.5 bg-primary-50 border-l-4 border-primary-600 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Grand Rituel Kobido Impérial</span>
                      <span className="num font-semibold text-sand-700">14h00 - 15h15</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Élodie B. · Cabine Sérénité (Acompte 50 €)
                    </p>
                  </div>

                  {/* Rendez-vous 2 */}
                  <div className="p-3.5 bg-sand-100 border-l-4 border-primary-500 text-sand-950 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Consultation & Diagnostic Visage</span>
                      <span className="num font-semibold text-sand-700">16h30 - 17h15</span>
                    </div>
                    <p className="text-xs text-sand-600">
                      Thomas V. · Nouveau client
                    </p>
                  </div>
                </div>
              </div>

              {/* Pied du simulateur */}
              <div className="p-4 bg-primary-50/10 border-t border-primary-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="text-sand-600 font-normal">
                  Chiffre d’affaires de la journée :{" "}
                  <strong className="text-sand-950 font-bold num">1 420 €</strong>
                </span>
                <span className="text-primary-700 font-semibold">
                  Acomptes bancaires sécurisés : 480 € garantis
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. LES 4 PILIERS BELORA PRO */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-white">
          <div className="container-belora">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="eyebrow mb-2">Avantages Concrets</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-3">
                Pourquoi les meilleurs ateliers choisissent Belora Pro.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Chaque fonctionnalité a été pensée pour supprimer les frictions et valoriser votre expertise artisanale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRO_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.number}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-primary-200/80 shadow-2xs hover:shadow-lg hover:border-primary-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-primary-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold num text-sand-400">
                          {pillar.number}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-sand-950 mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-sand-600 leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. COMPARATIF SOBRE : BELORA PRO VS LOGICIELS TRADITIONNELS */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-primary-50/10/50">
          <div className="container-belora">
            <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
              <p className="eyebrow mb-2">La Différence</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-3">
                Un modèle respectueux de votre indépendance.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Fini les commissions masquées et les logiciels complexes. Nous remettons l’artisan au centre.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Carte Logiciels Traditionnels */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-primary-200/80 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sand-500">
                  <X className="w-4 h-4 text-sand-400" />
                  <span>Logiciels traditionnels & annuaires</span>
                </div>
                <ul className="space-y-3 text-xs text-sand-600">
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                    <span>Commission prélevée sur chaque client, même vos habitués</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                    <span>Interface austère et obsolète avec trop de clics</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                    <span>Votre réputation mélangée à des salons de chaîne discount</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                    <span>Support technique impersonnel et peu réactif</span>
                  </li>
                </ul>
              </div>

              {/* Carte Belora Pro */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-primary-600/30 shadow-md space-y-4 relative">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span>Le standard Belora Pro</span>
                </div>
                <ul className="space-y-3 text-xs text-sand-900 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>0% de commission sur vos clients. Forfait fixe et clair.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Design épuré type Apple : 2 fois plus rapide au quotidien</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Marketplace sélective : seuls les ateliers audités sont admis</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <span>Ligne directe avec votre conseiller dédié 6j/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. TARIFS TRANSPARENTS SANS ENGAGEMENT */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-white" id="pricing">
          <div className="container-belora">
            <div className="max-w-xl mx-auto text-center mb-10 sm:mb-12">
              <p className="eyebrow mb-2">Tarification Simple</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-3">
                Des forfaits fixes, sans commission abusive.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                14 jours d’essai offert sur chaque plan. Modifiez ou résiliez à tout moment en un clic.
              </p>

              {/* Sélecteur de cycle de facturation */}
              <div className="inline-flex items-center p-1 rounded-full bg-sand-100 border border-primary-200 mt-6">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-white text-sand-950 shadow-2xs"
                      : "text-sand-600 hover:text-sand-900"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === "annual"
                      ? "bg-white text-sand-950 shadow-2xs"
                      : "text-sand-600 hover:text-sand-900"
                  }`}
                >
                  <span>Annuel</span>
                  <span className="text-xs text-primary-600 font-bold uppercase">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Cartes de prix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {PRICING_PLANS.map((plan) => {
                const price =
                  billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;

                return (
                  <div
                    key={plan.name}
                    className={`p-7 sm:p-8 rounded-3xl flex flex-col justify-between border transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-white border-primary-600 ring-2 ring-primary-600/20 shadow-xl"
                        : "bg-white border-primary-200/80 shadow-2xs hover:shadow-lg hover:border-primary-300"
                    }`}
                  >
                    <div>
                      {plan.highlighted && (
                        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                          Le plus choisi
                        </span>
                      )}

                      <h3 className="text-xl sm:text-2xl font-bold text-sand-950 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-sand-600 mb-6 font-normal min-h-9">
                        {plan.description}
                      </p>

                      <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-primary-100">
                        <span className="text-4xl font-bold text-sand-950 num">
                          {price} €
                        </span>
                        <span className="text-xs text-sand-500 font-normal">
                          /mois {billingCycle === "annual" && "facturé à l'année"}
                        </span>
                      </div>

                      <ul className="space-y-3 text-xs text-sand-700 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/register?role=pro"
                      className={`w-full btn py-3 text-xs sm:text-sm font-semibold rounded-xl text-center ${
                        plan.highlighted ? "btn-primary" : "btn-outline"
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

        {/* 6. FAQ ARTISANS */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-primary-50/10/50">
          <div className="container-belora">
            <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
              <p className="eyebrow mb-2">Vos Questions</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-3">
                Tout ce que vous devez savoir.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Une question spécifique ? Notre équipe d’accompagnement est disponible par téléphone 6j/7.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3.5">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-primary-200/80 bg-white overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base font-bold text-sand-950">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-sand-500 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-primary-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-sand-600 leading-relaxed font-normal border-t border-primary-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. BANNIÈRE FINALE DE CONVERSION */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container-belora">
            <div className="rounded-3xl bg-sand-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
              {/* Arches en filigrane décoratif dans le fond sombre */}
              <div
                className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-primary-800/60 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -right-4 -bottom-4 w-48 h-48 rounded-full border border-primary-700/40 pointer-events-none"
                aria-hidden="true"
              />

              <div className="max-w-xl space-y-3 relative z-10">
                <span className="text-xs uppercase font-semibold tracking-wider text-sand-400">
                  Prêt à transformer votre quotidien ?
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Rejoignez les maisons d’excellence référencées sur Belora.
                </h2>
                <p className="text-xs sm:text-sm text-sand-300 leading-relaxed font-normal">
                  Activation immédiate, 14 jours d’essai offert sans engagement, accompagnement sur-mesure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
                <Link
                  href="/register?role=pro"
                  className="btn btn-primary py-3.5 px-7 text-xs sm:text-sm font-semibold rounded-xl text-center"
                >
                  Créer mon atelier gratuit
                </Link>
                <Link
                  href="/login"
                  className="btn btn-outline py-3.5 px-6 text-xs sm:text-sm rounded-xl text-center text-white border-primary-700 hover:bg-sand-900"
                >
                  Connexion praticien
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
