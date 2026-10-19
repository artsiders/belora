"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCard {
  index: string;
  slug: string;
  name: string;
  subtitle: string;
  count: string;
  image: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    index: "01",
    slug: "hair",
    name: "Coiffure & Coloration",
    subtitle: "Balayages minéraux, coupes géométriques & rituels botaniques",
    count: "420 ateliers",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=85",
  },
  {
    index: "02",
    slug: "facial",
    name: "Soins Visage & Institut",
    subtitle: "Traitements holistiques, éclat cellulaire & drainage signature",
    count: "310 adresses",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85",
  },
  {
    index: "03",
    slug: "massage",
    name: "Massages & Bains",
    subtitle: "Massages ayurvédiques, pierres chaudes & hydrothérapie",
    count: "195 havres",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=85",
  },
  {
    index: "04",
    slug: "barber",
    name: "Barbiers & Homme",
    subtitle: "Coupe au ciseau, rasage au coupe-chou & soins du cuir chevelu",
    count: "180 maîtres",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=85",
  },
  {
    index: "05",
    slug: "nails",
    name: "Manucure & Mains",
    subtitle: "Manucure japonaise pure, soins à la cire tiède & cuticules",
    count: "260 studios",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85",
  },
  {
    index: "06",
    slug: "wellness",
    name: "Rituels & Bien-être",
    subtitle: "Sophrologie, réflexologie plantaire & bains sonores",
    count: "140 praticiens",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85",
  },
];

export function HorizontalPeekGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  return (
    <section className="section bg-white border-b border-sand-300 overflow-hidden py-20 lg:py-28" aria-labelledby="gallery-heading">
      {/* En-tête aligné dans la grille */}
      <div className="container-belora mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-sand-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 block mb-2">
              Collections de Gestes
            </span>
            <h2 id="gallery-heading" className="font-display text-4xl sm:text-5xl text-sand-950">
              Explorer par univers artisanal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-sand-300 hover:border-sand-900 bg-sand-50 hover:bg-sand-900 hover:text-sand-50 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Faire défiler vers la gauche"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-sand-300 hover:border-sand-900 bg-sand-50 hover:bg-sand-900 hover:text-sand-50 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Faire défiler vers la droite"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Galerie horizontale débordant jusqu'au bord extrême droit de l'écran */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pl-6 sm:pl-12 lg:pl-[max(2rem,calc((100vw-1360px)/2))] pr-12 pb-6"
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/search?category=${cat.slug}`}
            className="group relative flex-none w-[320px] sm:w-[380px] h-[520px] sm:h-[580px] rounded-2xl overflow-hidden bg-sand-900 text-sand-50 shadow-xl transition-transform duration-500 hover:-translate-y-2 cursor-pointer"
          >
            {/* Image de très grande dimension */}
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 320px, 380px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Voile sculptural : lumière en haut, encre en bas */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-sand-950/90 via-sand-950/20 to-sand-950/30"
              aria-hidden="true"
            />

            {/* Chiffre d'atelier en haut */}
            <div className="absolute top-6 inset-x-6 flex items-center justify-between text-sand-200">
              <span className="font-display text-2xl tracking-wider text-sand-100/90">
                {cat.index}
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-sand-950/60 backdrop-blur-sm border border-sand-700/60">
                {cat.count}
              </span>
            </div>

            {/* Contenu textuel en bas */}
            <div className="absolute bottom-6 inset-x-6">
              <h3 className="font-display text-2xl sm:text-3xl text-sand-50 mb-2 group-hover:text-primary-300 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-sand-300 line-clamp-2 leading-relaxed mb-4">
                {cat.subtitle}
              </p>

              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sand-100 group-hover:gap-3 transition-all">
                <span>Découvrir les artisans</span>
                <svg className="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
