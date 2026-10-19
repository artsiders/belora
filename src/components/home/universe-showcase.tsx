"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Universe {
  index: string;
  slug: string;
  name: string;
  tagline: string;
  count: string;
  image: string;
  locationLabel: string;
}

const UNIVERSES: Universe[] = [
  {
    index: "01",
    slug: "hair",
    name: "Coiffure & Coloration",
    tagline: "Coupes d’auteur, balayages minéraux et rituels botaniques personnalisés.",
    count: "420 salons",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Atelier Studio · Paris Marais",
  },
  {
    index: "02",
    slug: "facial",
    name: "Soins Visage & Institut",
    tagline: "Traitements holistiques, drainage lymphatique et éclat sur-mesure.",
    count: "310 adresses",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Institut Botanique · Lyon Presqu’île",
  },
  {
    index: "03",
    slug: "massage",
    name: "Massages & Spas",
    tagline: "Massages californiens, rituels ayurvédiques et bains apaisants.",
    count: "195 havres",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Espace Bains & Rituels · Marseille",
  },
  {
    index: "04",
    slug: "barber",
    name: "Barbiers & Homme",
    tagline: "Coupes classiques, taille de barbe au coupe-chou et serviette chaude.",
    count: "180 ateliers",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Salon Traditionnel · Bordeaux",
  },
  {
    index: "05",
    slug: "nails",
    name: "Manucure & Ongles",
    tagline: "Manucure japonaise soignée, poses semi-permanentes et soins des cuticules.",
    count: "260 studios",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Studio Ongles & Mains · Nantes",
  },
  {
    index: "06",
    slug: "wellness",
    name: "Rituels & Bien-être",
    tagline: "Réflexologie, sophrologie et soins énergétiques pour reconnecter corps et esprit.",
    count: "140 praticiens",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=85",
    locationLabel: "Maison du Bien-Être · Lille",
  },
];

export function UniverseShowcase() {
  const [activeUniverse, setActiveUniverse] = useState<Universe>(UNIVERSES[0]);

  return (
    <section className="section bg-bg" aria-labelledby="showcase-heading">
      <div className="container-belora">
        {/* En-tête de section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-5 hairline-b">
          <div>
            <p className="eyebrow mb-2">L’atelier des savoir-faire</p>
            <h2 id="showcase-heading" className="display-md text-sand-900">
              Explorer par univers de soins
            </h2>
          </div>
          <Link
            href="/search"
            className="btn btn-editorial self-start sm:self-auto group"
          >
            <span>Tous les univers ({UNIVERSES.length})</span>
            <svg
              className="w-3.5 h-3.5 btn-icon-slide"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Layout interactif bureau : liste typographique à gauche + grande image immersive à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Liste des univers */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            {UNIVERSES.map((universe) => {
              const isActive = activeUniverse.slug === universe.slug;
              return (
                <div
                  key={universe.slug}
                  onMouseEnter={() => setActiveUniverse(universe)}
                  onClick={() => setActiveUniverse(universe)}
                  className={`group p-4 sm:p-5 rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                    isActive
                      ? "bg-sand-50 border-sand-400 shadow-sm"
                      : "bg-transparent border-transparent hover:border-line hover:bg-sand-50/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`font-display text-sm ${
                          isActive ? "text-primary-600 font-semibold" : "text-fg-subtle"
                        }`}
                      >
                        {universe.index}
                      </span>
                      <h3
                        className={`font-display text-xl sm:text-2xl tracking-tight transition-colors ${
                          isActive
                            ? "text-sand-900"
                            : "text-sand-700 group-hover:text-sand-900"
                        }`}
                      >
                        {universe.name}
                      </h3>
                    </div>

                    <span className="text-[11px] uppercase tracking-wider text-sand-500 font-medium shrink-0">
                      {universe.count}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2 pl-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <p className="text-xs text-fg-muted leading-relaxed max-w-sm">
                        {universe.tagline}
                      </p>
                      <Link
                        href={`/search?category=${universe.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700 self-start sm:self-auto shrink-0"
                      >
                        <span>Découvrir</span>
                        <svg
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grande Photographie Immersive Dynamique */}
          <div className="lg:col-span-7 relative min-h-[420px] sm:min-h-[540px] rounded-[var(--radius-photo)] overflow-hidden border border-line bg-sand-200 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeUniverse.slug}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeUniverse.image}
                  alt={activeUniverse.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                {/* Voile photographique éditorial subtil */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-sand-950/75 via-transparent to-sand-950/20"
                  aria-hidden="true"
                />

                {/* Légende architecturale en bas de la photo */}
                <div className="absolute bottom-6 inset-x-6 flex items-end justify-between gap-4 text-sand-50">
                  <div>
                    <span className="block text-[11px] uppercase tracking-widest text-sand-300 font-semibold mb-1">
                      {activeUniverse.locationLabel}
                    </span>
                    <p className="font-display text-2xl sm:text-3xl text-sand-50">
                      {activeUniverse.name}
                    </p>
                  </div>

                  <Link
                    href={`/search?category=${activeUniverse.slug}`}
                    className="btn btn-editorial-light btn-sm shrink-0"
                  >
                    <span>Explorer le catalogue</span>
                    <svg
                      className="w-3.5 h-3.5 btn-icon-slide"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
