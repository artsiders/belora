import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import {
  Calendar,
  ShieldCheck,
  CreditCard,
  Users,
  ArrowRight,
  Check,
  Sparkles,
  Smartphone,
  TrendingUp,
} from "lucide-react";

export default function ProPage() {
  const PRO_FEATURES = [
    {
      title: "Agenda pro ultra-réactif",
      description:
        "Vue jour et semaine fluide par membre d'équipe. Glisser-déposer instantané, gestion des pauses et des temps de pose de coloration.",
    },
    {
      title: "Fin des rendez-vous non honorés",
      description:
        "Rappels automatiques par e-mail et SMS. Sécurisation par empreinte de carte bancaire ou acompte en ligne Stripe Connect.",
    },
    {
      title: "Clientèle valorisant le savoir-faire",
      description:
        "Votre établissement est exposé à des clients à la recherche d’artisanat d'exception, prêts à payer le juste prix du geste.",
    },
    {
      title: "Paiements directs sans intermédiaire",
      description:
        "Chaque recette est versée directement sur votre compte bancaire. Aucun délai de rétention injustifié ni trésorerie bloquée.",
    },
  ];

  const PRICING_PLANS = [
    {
      name: "Atelier Solo",
      price: "39 €",
      period: "/mois",
      description: "Pour les artisans indépendants et créateurs de havres privés.",
      features: [
        "1 agenda praticien illimité",
        "Réservation en ligne 24h/24",
        "Rappels e-mails et SMS illimités",
        "Profil audité sur la marketplace Belora",
        "Paiements Stripe Connect sécurisés",
      ],
      highlighted: false,
    },
    {
      name: "Maison & Équipe",
      price: "69 €",
      period: "/mois",
      description: "Pour les salons de coiffure, instituts et spas avec collaborateurs.",
      features: [
        "Jusqu'à 6 membres d'équipe",
        "Gestion des plannings et congés",
        "Réservation avec choix du praticien",
        "Statistiques de chiffre d'affaires et fidélité",
        "Accompagnement et shooting photo initial",
      ],
      highlighted: true,
    },
    {
      name: "Grand Sanctuaire",
      price: "119 €",
      period: "/mois",
      description: "Pour les établissements multi-espaces et spas d'hôtels d'exception.",
      features: [
        "Membres d'équipe illimités",
        "Multi-cabines et gestion des ressources",
        "Gestionnaire de compte dédié 6j/7",
        "Mise en avant prioritaire sur la marketplace",
        "Export comptable automatisé",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-sand-100 text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        {/* 1. Hero Section Pro */}
        <section className="relative py-16 sm:py-24 border-b border-sand-200/80 bg-sand-50/70 overflow-hidden">
          <div className="container-belora">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="eyebrow text-primary-700 font-semibold tracking-widest block">
                  Belora Pro · Pour les Maisons & Salons
                </span>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-sand-950 leading-[1.08] text-balance">
                  L’artisanat mérite un logiciel à la hauteur de son exigence.
                </h1>

                <p className="text-sm sm:text-base text-sand-600 max-w-xl leading-relaxed font-normal text-pretty">
                  Libérez-vous de la gestion administrative. Belora Pro réunit un agenda d’une fluidité absolue, la sécurisation des créneaux par acompte et la mise en avant de votre atelier auprès d’une clientèle qualifiée.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/register?role=pro"
                    className="btn btn-primary py-3 px-6 text-xs sm:text-sm inline-flex items-center gap-2"
                  >
                    <span>Référencer mon atelier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/login"
                    className="btn btn-outline py-3 px-6 text-xs sm:text-sm"
                  >
                    <span>Connexion praticien</span>
                  </Link>
                </div>

                <div className="pt-4 flex items-center gap-6 text-xs text-sand-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-primary-600" />
                    14 jours d’essai offert
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-primary-600" />
                    Sans engagement
                  </span>
                </div>
              </div>

              {/* Photo d'ambiance professionnelle soignée */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300 shadow-xl">
                  <Image
                    src="/images/pro/pro-hero.jpg"
                    alt="Artisan coiffeur en plein geste dans son atelier partenaire Belora"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-sand-950/20" aria-hidden="true" />

                  {/* Cartouche démonstratif de l'agenda */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-xs border border-sand-200 text-sand-900 shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-primary-700">
                        Agenda en direct
                      </span>
                      <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded num">
                        +18% de remplissage
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-sand-950">
                      Remplissage intelligent & zéro no-show garanti
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Simulation de l'Agenda Pro Interactif en Couleurs Terres */}
        <section className="py-16 sm:py-20 border-b border-sand-200/80 bg-sand-100">
          <div className="container-belora">
            <div className="max-w-2xl mb-12">
              <p className="eyebrow mb-2">Simplicité Quotidienne</p>
              <h2 className="font-display text-3xl sm:text-4xl text-sand-950 mb-3">
                Un agenda clair, silencieux et pensé pour le rythme du salon.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Conçu avec des artisans pour supprimer les clics superflus. Vos membres d'équipe visualisent leurs rituels d'un seul coup d'œil.
              </p>
            </div>

            {/* Mockup de planning de salon multi-collaborateurs */}
            <div className="rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 shadow-sm overflow-hidden">
              {/* En-tête de la journée */}
              <div className="p-4 bg-sand-200/60 border-b border-sand-300 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sand-950 font-display text-base">
                    Mardi 21 Octobre 2026
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sand-50 border border-sand-300 text-sand-700 text-[11px]">
                    Vue Journalière
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sand-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>3 praticiens en poste · 14 rendez-vous confirmés</span>
                </div>
              </div>

              {/* Grille des colonnes praticiens */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand-200/80 p-4 gap-4">
                {/* Praticien 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-sand-200/80">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-sand-300">
                      <Image
                        src="/images/artisans/artisan-helene.jpg"
                        alt="Hélène"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-sand-950">Hélène (Coloriste)</h4>
                      <span className="text-[10px] text-sand-500">5 créneaux</span>
                    </div>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[#ebd3cf] border-l-4 border-[#b0584a] text-sand-950 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Balayage Minéral</span>
                      <span className="num">10h00 - 12h00</span>
                    </div>
                    <p className="text-[11px] text-sand-700 mt-0.5">Sophie M. · Acompte versé</p>
                  </div>

                  {/* Rendez-vous 2 */}
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[#f0e1bf] border-l-4 border-[#b98a2a] text-sand-950 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Coupe Signature à Sec</span>
                      <span className="num">14h00 - 15h00</span>
                    </div>
                    <p className="text-[11px] text-sand-700 mt-0.5">Camille D. · Nouveau client Belora</p>
                  </div>
                </div>

                {/* Praticien 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-sand-200/80">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-sand-300">
                      <Image
                        src="/images/artisans/artisan-marc.jpg"
                        alt="Clément"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-sand-950">Clément (Coupe)</h4>
                      <span className="text-[10px] text-sand-500">6 créneaux</span>
                    </div>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[#d8e0d0] border-l-4 border-[#5f7a58] text-sand-950 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Rituel Coupe & Soin Végétal</span>
                      <span className="num">11h00 - 12h00</span>
                    </div>
                    <p className="text-[11px] text-sand-700 mt-0.5">Alexandre G. · Client fidèle</p>
                  </div>

                  {/* Rendez-vous 2 */}
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[#d5dee3] border-l-4 border-[#4f6f82] text-sand-950 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Coupe sur Cheveux Secs</span>
                      <span className="num">15h30 - 16h30</span>
                    </div>
                    <p className="text-[11px] text-sand-700 mt-0.5">Jeanne R. · Réservation en ligne</p>
                  </div>
                </div>

                {/* Praticien 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-sand-200/80">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-sand-300">
                      <Image
                        src="/images/artisans/artisan-nour.jpg"
                        alt="Nour"
                        fill
                        sizes="28px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-sand-950">Nour (Facialiste)</h4>
                      <span className="text-[10px] text-sand-500">4 créneaux</span>
                    </div>
                  </div>

                  {/* Rendez-vous 1 */}
                  <div className="p-3 rounded-[var(--radius-xs)] bg-[#e6d2dc] border-l-4 border-[#8e4a68] text-sand-950 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Grand Rituel Kobido</span>
                      <span className="num">14h00 - 15h15</span>
                    </div>
                    <p className="text-[11px] text-sand-700 mt-0.5">Élodie B. · Cabine 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Les 4 Piliers Fondamentaux pour les Salons */}
        <section className="py-16 sm:py-24 border-b border-sand-200/80 bg-sand-50/50">
          <div className="container-belora">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRO_FEATURES.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-200/80 space-y-3"
                >
                  <span className="font-display text-xl text-primary-700 block font-normal">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-sm font-semibold text-sand-950">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Tarifs Transparents et Sans Engagement */}
        <section className="py-16 sm:py-24 bg-sand-100" id="pricing">
          <div className="container-belora">
            <div className="max-w-xl mx-auto text-center mb-14">
              <p className="eyebrow mb-2">Abonnements Clairs</p>
              <h2 className="font-display text-3xl sm:text-4xl text-sand-950 mb-3">
                Des forfaits fixes, sans commission abusive.
              </h2>
              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                Conservez 100% du fruit de votre travail sur vos clients habituels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-8 rounded-[var(--radius-sm)] flex flex-col justify-between border transition-all ${
                    plan.highlighted
                      ? "bg-sand-50 border-sand-950 shadow-md ring-1 ring-sand-950"
                      : "bg-sand-50 border-sand-300 shadow-2xs"
                  }`}
                >
                  <div>
                    {plan.highlighted && (
                      <span className="px-2.5 py-0.5 rounded bg-primary-600 text-sand-50 text-[10px] uppercase font-bold tracking-wider inline-block mb-3">
                        Recommandé
                      </span>
                    )}
                    <h3 className="font-display text-2xl text-sand-950 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-sand-600 mb-6 font-normal">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-sand-200/80">
                      <span className="font-display text-4xl text-sand-950 num font-normal">
                        {plan.price}
                      </span>
                      <span className="text-xs text-sand-500 font-normal">
                        {plan.period}
                      </span>
                    </div>

                    <ul className="space-y-3 text-xs text-sand-700 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/register?role=pro"
                    className={`w-full btn btn-sm py-2.5 text-center ${
                      plan.highlighted ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    Démarrer l’essai gratuit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
