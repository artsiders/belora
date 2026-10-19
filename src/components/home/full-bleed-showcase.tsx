"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export function FullBleedShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.8, 1, 1, 0.85]);

  return (
    <section
      ref={ref}
      className="relative w-full h-[70vh] sm:h-[82vh] overflow-hidden bg-sand-950 text-sand-50 border-b border-sand-800"
    >
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=2400&q=90"
          alt="L'intimité architecturale d'un sanctuaire de soin Belora"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-sand-950/90 via-sand-950/30 to-sand-950/40"
          aria-hidden="true"
        />
      </motion.div>

      {/* Contenu éditorial centré ou asymétrique */}
      <div className="container-belora relative h-full flex flex-col justify-end pb-16 sm:pb-24 z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary-600/90 backdrop-blur-md text-sand-50 text-[10px] tracking-[0.2em] uppercase font-semibold mb-4">
            Sanctuaire du Mois
          </span>

          <h2 className="font-display text-4xl sm:text-6xl text-sand-50 leading-[1.05] tracking-tight mb-4">
            Maison Albar · L’eau & la pierre pure
          </h2>

          <p className="text-sm sm:text-base text-sand-200 leading-relaxed font-light mb-8 max-w-xl text-pretty">
            Dans un hôtel particulier du XVIIIe siècle, une parenthèse hors du temps où chaque soin est une ode au relâchement musculaire et à l’équilibre minéral.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/venue/maison-albar-soins"
              className="btn btn-primary px-8 h-12 rounded-lg text-xs font-semibold tracking-wider uppercase"
            >
              <span>Découvrir la Maison</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <span className="text-xs text-sand-300 font-medium">
              Lyon Presqu’île · Soins dès 80 €
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
