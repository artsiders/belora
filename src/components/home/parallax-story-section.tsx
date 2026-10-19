"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface StoryMoment {
  number: string;
  tag: string;
  title: string;
  desc: string;
  image: string;
}

const MOMENTS: StoryMoment[] = [
  {
    number: "01",
    tag: "L’Écoute Préalable",
    title: "Le diagnostic sur-mesure avant chaque coup de ciseau ou application.",
    desc: "Nos maîtres artisans prennent le temps de comprendre la matière de vos cheveux, la nature de votre peau et votre rythme de vie. Aucun protocole standardisé.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "02",
    tag: "L’Atmosphère & Le Silence",
    title: "Des sanctuaires pensés pour suspendre le cours du quotidien.",
    desc: "Baignés de lumière naturelle, débarrassés des bruits parasites. Vous entrez dans un espace où le silence est respecté et le bien-être devient palpable.",
    image:
      "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "03",
    tag: "La Matière Botanique",
    title: "Des formules nobles, végétales et respectueuses du vivant.",
    desc: "Pigments minéraux, huiles de première pression à froid, argiles pures. Le résultat est durable, éclatant et sans agression chimique.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85",
  },
];

export function ParallaxStorySection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#161412] text-sand-50 py-24 lg:py-36 border-y border-sand-800 overflow-hidden"
    >
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Colonne gauche : Panneau Sticky de narration */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 block mb-3">
                Manifeste · Le Geste & Le Temps
              </span>
              <h2 className="font-display text-4xl sm:text-5xl xl:text-6xl text-sand-50 leading-[1.05] tracking-tight text-balance">
                La réconciliation du geste artisanal et de l’instant présent.
              </h2>
            </div>

            <p className="text-base text-sand-300 leading-relaxed max-w-md font-light">
              Dans un monde pressé, Belora sanctuarise le soin. Nous connectons ceux qui recherchent l’excellence aux rares professionnels qui lui consacrent toute leur vie.
            </p>

            <blockquote className="p-6 rounded-2xl bg-sand-900/60 border border-sand-800 text-sand-200">
              <p className="font-display text-xl sm:text-2xl text-sand-100 italic leading-snug mb-3">
                « Chaque chevelure, chaque peau est une matière vivante qui réclame le temps du geste juste. »
              </p>
              <cite className="block text-xs uppercase tracking-wider text-primary-300 font-semibold not-italic">
                Charte des Maisons Partenaires Belora
              </cite>
            </blockquote>

            <div className="pt-4 flex items-center gap-8 text-xs uppercase tracking-wider text-sand-400 font-medium">
              <span>01 / Diagnostic</span>
              <span>02 / Sanctuaire</span>
              <span>03 / Matière</span>
            </div>
          </div>

          {/* Colonne droite : Très grandes photographies verticales défilantes */}
          <div className="lg:col-span-7 space-y-16 lg:space-y-24">
            {MOMENTS.map((moment, idx) => (
              <motion.div
                key={moment.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.2, 0, 0, 1] }}
                className="space-y-6"
              >
                {/* Immense cadre photo 80vh */}
                <div className="relative aspect-[4/5] sm:aspect-[16/11] h-[480px] sm:h-[620px] w-full rounded-2xl overflow-hidden bg-sand-900 border border-sand-800 shadow-2xl">
                  <motion.div style={{ y: backgroundY }} className="absolute -inset-y-10 inset-x-0 w-full h-[120%]">
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-sand-950/80 via-transparent to-transparent" />

                  <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-sand-950/70 backdrop-blur-md border border-sand-700 text-sand-200 text-xs font-display tracking-widest">
                    MOMENT {moment.number}
                  </div>
                </div>

                <div className="max-w-xl pl-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-300 block mb-1">
                    {moment.tag}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-sand-50 mb-2">
                    {moment.title}
                  </h3>
                  <p className="text-sm text-sand-300 leading-relaxed font-light">
                    {moment.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
