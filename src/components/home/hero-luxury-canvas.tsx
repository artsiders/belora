"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const QUICK_TAGS = [
  { label: "Balayage sur-mesure", query: "balayage" },
  { label: "Massage californien", query: "massage-californien" },
  { label: "Soin hydrafacial", query: "hydrafacial" },
  { label: "Coupe d’auteur", query: "coupe" },
  { label: "Taille de barbe", query: "barbe" },
];

export function HeroLuxuryCanvas() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#FBF8F3] border-b border-sand-300"
    >
      {/* Mise en page globale asymétrique et débridée (Sort du carcan classique) */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Colonne gauche : Typographie majestueuse & Dock de recherche */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:pl-16 xl:pl-24 py-16 lg:py-24 z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
          >
            {/* Surtitre délicat */}
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-sand-600">
                L’Écrin de Réservation Beauté & Soin
              </span>
            </div>

            {/* Titre monumental qui respire */}
            <h1 className="font-display text-5xl sm:text-7xl xl:text-8xl leading-[0.98] tracking-tight text-sand-950 mb-6 text-balance">
              L’art du geste,{" "}
              <span className="display-italic font-normal text-primary-600 block sm:inline">
                l’éloge du temps.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-sand-600 max-w-lg leading-relaxed font-normal mb-10 text-pretty">
              Réservez les salons de coiffure d’auteur, les rituels du visage et les spas d’exception sélectionnés pour l’absolue maîtrise de leurs artisans.
            </p>
          </motion.div>

          {/* Dock de recherche flottant haut de gamme */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-xl"
          >
            <form
              action="/search"
              method="GET"
              className="p-2 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-sand-300 shadow-2xl shadow-sand-900/10 flex flex-col sm:flex-row items-stretch gap-2"
              role="search"
            >
              <div className="flex-1 px-4 py-2 sm:py-1 border-b sm:border-b-0 sm:border-r border-sand-200">
                <label
                  htmlFor="hero-service"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-sand-500 mb-0.5"
                >
                  Prestation ou salon
                </label>
                <input
                  id="hero-service"
                  name="q"
                  type="text"
                  placeholder="Balayage, soin éclat, massage…"
                  className="w-full bg-transparent border-0 p-0 text-sm font-medium text-sand-900 placeholder:text-sand-400 focus:outline-none"
                  autoComplete="off"
                />
              </div>

              <div className="flex-1 px-4 py-2 sm:py-1 border-b sm:border-b-0 sm:border-r border-sand-200">
                <label
                  htmlFor="hero-location"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-sand-500 mb-0.5"
                >
                  Ville ou quartier
                </label>
                <input
                  id="hero-location"
                  name="location"
                  type="text"
                  placeholder="Paris, Lyon, Bordeaux…"
                  className="w-full bg-transparent border-0 p-0 text-sm font-medium text-sand-900 placeholder:text-sand-400 focus:outline-none"
                  autoComplete="address-level2"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary sm:self-center h-12 px-6 rounded-lg text-xs font-semibold tracking-wider uppercase shrink-0 transition-transform hover:scale-[1.02]"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span>Explorer</span>
              </button>
            </form>

            {/* Nuage de suggestions éditoriales */}
            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-sand-500 font-medium">
                Inspirations :
              </span>
              {QUICK_TAGS.map((tag) => (
                <Link
                  key={tag.query}
                  href={`/search?q=${tag.query}`}
                  className="text-xs px-3 py-1 rounded-full bg-sand-200/60 hover:bg-sand-200 text-sand-800 transition-colors font-medium"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Données d’authenticité en bas de colonne */}
          <div className="mt-12 pt-8 border-t border-sand-200/80 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="font-display text-2xl sm:text-3xl text-sand-900">450+</p>
              <p className="text-[11px] uppercase tracking-wider text-sand-500 font-medium mt-0.5">
                Maisons d’artisan
              </p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl text-sand-900">4,95★</p>
              <p className="text-[11px] uppercase tracking-wider text-sand-500 font-medium mt-0.5">
                Exigence certifiée
              </p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl text-sand-900">24/7</p>
              <p className="text-[11px] uppercase tracking-wider text-sand-500 font-medium mt-0.5">
                Créneaux en direct
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite : Très Grande Photographie Architecturale Débridée (Touche le bord droit) */}
        <div className="lg:col-span-6 xl:col-span-6 relative min-h-[500px] lg:min-h-full overflow-hidden bg-sand-900">
          <motion.div
            style={{ y: photoY, scale: photoScale }}
            className="absolute -inset-y-12 inset-x-0 w-full h-[120%]"
          >
            <Image
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=90"
              alt="Intérieur architectural baigné de lumière naturelle d’un salon d’artisan"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {/* Voile progressif sur le bord gauche pour fondre la lumière */}
            <div
              className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBF8F3] to-transparent z-[1]"
              aria-hidden="true"
            />
          </motion.div>

          {/* Cartouche d’ambiance flottante en bas de photo */}
          <div className="absolute bottom-8 right-8 left-8 sm:left-auto sm:max-w-sm p-5 rounded-2xl bg-sand-950/85 backdrop-blur-md border border-sand-800 text-sand-50 shadow-2xl z-10">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-primary-300">
                Atelier Signature du Mois
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-sand-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                3 créneaux aujourd’hui
              </span>
            </div>
            <p className="font-display text-xl text-sand-100">
              L’Appartement Botanique
            </p>
            <p className="text-xs text-sand-400 mt-1">
              Coloration végétale & architecture minérale · Paris 3e
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
