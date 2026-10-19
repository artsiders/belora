"use client";

import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "L’art du geste juste",
  "Matières botaniques & naturelles",
  "Salons & ateliers indépendants",
  "Coiffure d’auteur & coloration",
  "Soins holistiques & rituels",
  "Réservation certifiée 24h/24",
  "Écoute & exigence artisanale",
];

export function EditorialMarquee() {
  return (
    <div className="w-full overflow-hidden border-y border-line bg-sand-50 py-4 select-none" aria-hidden="true">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 32,
        }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
          <div key={index} className="flex items-center gap-10">
            <span className="font-display text-lg sm:text-xl tracking-wide text-sand-900/80">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600/70" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
