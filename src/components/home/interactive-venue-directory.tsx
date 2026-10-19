"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface VenueItem {
  slug: string;
  category: "all" | "hair" | "facial" | "massage" | "barber";
  name: string;
  specialty: string;
  badge: string;
  city: string;
  district: string;
  rating: string;
  reviewCount: number;
  startingPrice: string;
  nextSlot: string;
  image: string;
}

const VENUES: VenueItem[] = [
  {
    slug: "atelier-botanique-paris",
    category: "hair",
    name: "L’Atelier Botanique",
    specialty: "Coiffure végétale, coupe d'auteur & diagnostic cuir chevelu",
    badge: "Maison d’artisan",
    city: "Paris",
    district: "Le Marais",
    rating: "4,9",
    reviewCount: 142,
    startingPrice: "dès 55 €",
    nextSlot: "Aujourd’hui 15:30",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "maison-albar-soins",
    category: "facial",
    name: "Maison Albar Institut",
    specialty: "Soin visage holistique, cryothérapie & drainage",
    badge: "Coup de cœur",
    city: "Lyon",
    district: "Presqu’île",
    rating: "5,0",
    reviewCount: 96,
    startingPrice: "dès 80 €",
    nextSlot: "Demain 11:00",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "barbier-saint-germain",
    category: "barber",
    name: "Le Salon Saint-Germain",
    specialty: "Taille de barbe traditionnelle au rasoir & serviette chaude",
    badge: "Maître Barbier",
    city: "Bordeaux",
    district: "Triangle d’Or",
    rating: "4,9",
    reviewCount: 218,
    startingPrice: "dès 38 €",
    nextSlot: "Aujourd’hui 17:15",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "bain-de-vapeur-sequoia",
    category: "massage",
    name: "Studio Séquoia",
    specialty: "Bain japonais, massage relaxant profond & aromathérapie",
    badge: "Havre Zen",
    city: "Marseille",
    district: "Vieux-Port",
    rating: "4,8",
    reviewCount: 88,
    startingPrice: "dès 75 €",
    nextSlot: "Demain 14:00",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "les-loges-coiffure",
    category: "hair",
    name: "Les Loges Studio",
    specialty: "Balayage naturel, ombré subtil et coiffage texturé",
    badge: "Coloriste",
    city: "Paris",
    district: "Saint-Germain-des-Prés",
    rating: "4,9",
    reviewCount: 165,
    startingPrice: "dès 65 €",
    nextSlot: "Aujourd’hui 18:00",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "bains-botaniques-lille",
    category: "massage",
    name: "Bains & Argiles",
    specialty: "Gommage minéral, sauna thermal et massages décontracturants",
    badge: "Sanctuaire",
    city: "Lille",
    district: "Vieux-Lille",
    rating: "5,0",
    reviewCount: 74,
    startingPrice: "dès 90 €",
    nextSlot: "Mercredi 10:30",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85",
  },
];

const FILTER_TABS = [
  { id: "all", label: "Toutes les adresses" },
  { id: "hair", label: "Coiffure d’auteur" },
  { id: "facial", label: "Soins Visage & Institut" },
  { id: "massage", label: "Massages & Bains" },
  { id: "barber", label: "Barbiers & Homme" },
];

export function InteractiveVenueDirectory() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredVenues =
    activeTab === "all"
      ? VENUES
      : VENUES.filter((v) => v.category === activeTab);

  return (
    <section className="section bg-[#FBF8F3] py-24 border-b border-sand-300" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* Titre et onglets de filtrage instantané UX */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 pb-6 border-b border-sand-300">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 block mb-2">
              Sélection Certifiée Belora
            </span>
            <h2 id="venues-heading" className="font-display text-4xl sm:text-5xl text-sand-950">
              Maisons & Ateliers recommandés
            </h2>
          </div>

          {/* Onglets interactifs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTER_TABS.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-sand-900 text-sand-50 shadow-sm"
                      : "bg-sand-200/60 hover:bg-sand-200 text-sand-700 hover:text-sand-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grille de cartes haut de gamme */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredVenues.map((venue) => (
              <motion.article
                layout
                key={venue.slug}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col rounded-2xl bg-white border border-sand-300 overflow-hidden shadow-sm hover:shadow-xl hover:border-sand-400 transition-all"
              >
                {/* Photo 4/5 avec badge et favori */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-sand-950/40 via-transparent to-transparent" />

                  {/* Badge d'artisan */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-sand-950/80 backdrop-blur-md text-sand-50 text-[10px] tracking-wider uppercase font-semibold">
                    {venue.badge}
                  </span>

                  {/* Prochain créneau UX */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-sand-900 text-xs font-medium shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{venue.nextSlot}</span>
                  </div>
                </div>

                {/* Métadonnées & Actions */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <h3 className="font-display text-2xl text-sand-950 group-hover:text-primary-600 transition-colors">
                        {venue.name}
                      </h3>
                      <span className="text-xs font-semibold text-primary-600 flex items-center gap-1 shrink-0">
                        <span>★</span> {venue.rating} ({venue.reviewCount})
                      </span>
                    </div>

                    <p className="text-xs text-sand-500 font-medium uppercase tracking-wider mb-2">
                      {venue.district}, {venue.city}
                    </p>

                    <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed font-light mb-6">
                      {venue.specialty}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-sand-400 font-semibold">
                        Tarif indicatif
                      </span>
                      <span className="font-display text-lg text-sand-950 font-medium">
                        {venue.startingPrice}
                      </span>
                    </div>

                    <Link
                      href={`/venue/${venue.slug}`}
                      className="btn btn-primary btn-sm rounded-lg"
                    >
                      <span>Réserver</span>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
