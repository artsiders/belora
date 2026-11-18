"use client";

import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "L’art du geste juste",
  "Matières botaniques & naturelles",
  "Salons & ateliers indépendants",
  "Coiffure d’auteur & coloration végétale",
  "Soins holistiques & rituels",
  "Réservation certifiée 24h/24",
  "Écoute & exigence artisanale",
];

export function EditorialMarquee() {
  return (
    <div
      className="group w-full overflow-hidden border-y border-neutral-800/80 bg-neutral-950 py-3.5 sm:py-4 select-none"
      aria-hidden="true"
    >
      <motion.div
        className="flex gap-12 sm:gap-16 whitespace-nowrap will-change-transform group-hover:[animation-play-state:paused]"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 36,
        }}
      >
        {/* Quadruple répétition pour garantir une continuité parfaite sur tous les écrans (y compris 4K) */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
          (item, index) => (
            <div key={index} className="flex items-center gap-12 sm:gap-16 shrink-0">
              <span className="text-xs sm:text-sm uppercase tracking-[0.22em] font-medium text-neutral-300/90 transition-colors group-hover:text-neutral-100">
                {item}
              </span>
              <span
                className="w-1.5 h-1.5 rotate-45 bg-primary-400/75 shrink-0"
                aria-hidden="true"
              />
            </div>
          )
        )}
      </motion.div>
    </div>
  );
}
