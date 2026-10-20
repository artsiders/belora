"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Quote } from "lucide-react";

interface Artisan {
  id: string;
  name: string;
  role: string;
  salon: string;
  city: string;
  quote: string;
  experience: string;
  image: string;
  venueSlug: string;
}

const ARTISANS: Artisan[] = [
  {
    id: "helene",
    name: "Hélène de Valois",
    role: "Artisan Coloriste",
    salon: "L’Atelier Botanique",
    city: "Paris Marais",
    quote: "La coloration végétale sublime le cheveu en respectant sa matière vivante.",
    experience: "14 ans de métier",
    image: "/images/artisans/artisan-1.jpg",
    venueSlug: "atelier-botanique-paris",
  },
  {
    id: "marc",
    name: "Marc Sémard",
    role: "Maître Barbier",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux",
    quote: "Un rasage d’époque exige le geste calme du coupe-choux et une écoute totale.",
    experience: "18 ans de métier",
    image: "/images/artisans/artisan-2.jpg",
    venueSlug: "barbier-saint-germain",
  },
  {
    id: "nour",
    name: "Nour Kaddour",
    role: "Facialiste & Kobido",
    salon: "Maison Albar Institut",
    city: "Lyon",
    quote: "Le rituel Kobido délie chaque tension et réveille la lumière du teint.",
    experience: "11 ans de métier",
    image: "/images/artisans/artisan-3.jpg",
    venueSlug: "maison-albar-soins",
  },
  {
    id: "julien",
    name: "Julien Vaneck",
    role: "Coupe & Balayage Minéral",
    salon: "Studio Séquoia",
    city: "Marseille",
    quote: "La coupe à sec sculpte le mouvement naturel du cheveu sans artifice.",
    experience: "12 ans de métier",
    image: "/images/artisans/artisan-4.jpg",
    venueSlug: "bain-de-vapeur-sequoia",
  },
  {
    id: "elise",
    name: "Élise Moreau",
    role: "Praticienne Massages & Spas",
    salon: "Havres Botaniques",
    city: "Lille",
    quote: "Dénouer les tensions musculaires avec des huiles pures pressées à froid.",
    experience: "9 ans de métier",
    image: "/images/artisans/artisan-5.jpg",
    venueSlug: "maison-albar-soins",
  },
  {
    id: "camille",
    name: "Camille Chen",
    role: "Onglerie Japonaise",
    salon: "L’Écrin Minéral",
    city: "Nantes",
    quote: "Sublimer la santé et la brillance de l’ongle naturel avec délicatesse.",
    experience: "8 ans de métier",
    image: "/images/artisans/artisan-6.jpg",
    venueSlug: "atelier-botanique-paris",
  },
];

export function ArtisanSpotlight() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const current = sliderRef.current;
    if (current) {
      current.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = 300;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="section bg-white border-b border-sand-200/80" aria-labelledby="artisans-heading">
      <div className="container-belora">
        {/* En-tête avec titre épuré et boutons de navigation du slider */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <p className="eyebrow mb-2">Artisans</p>
            <h2
              id="artisans-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 mb-1"
            >
              Rencontrez les artisans,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                passionnés du geste.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-sand-500 font-normal">
              Des praticiens indépendants reconnus pour leur savoir-faire et leur exigence.
            </p>
          </div>

          {/* Boutons de contrôle du Slider */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-sand-300 bg-white hover:border-sand-400 hover:bg-sand-50 flex items-center justify-center text-sand-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              aria-label="Artisans précédents"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-sand-300 bg-white hover:border-sand-400 hover:bg-sand-50 flex items-center justify-center text-sand-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              aria-label="Artisans suivants"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider horizontal défilant : cards compactes, photos douces et désaturées */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mx-1 scrollbar-none focus:outline-none"
        >
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="group w-[270px] sm:w-[290px] shrink-0 snap-start flex flex-col justify-between bg-white rounded-2xl border border-sand-200/80 p-3.5 shadow-2xs hover:shadow-md hover:border-sand-300 transition-all duration-300"
            >
              <div>
                {/* Photographie portrait douce et désaturée en arche compacte */}
                <div className="relative aspect-[4/5] w-full rounded-t-[54px] rounded-b-xl overflow-hidden bg-sand-100 mb-3.5">
                  <Image
                    src={artisan.image}
                    alt={`Portrait de ${artisan.name}, ${artisan.role}`}
                    fill
                    sizes="(max-width: 640px) 270px, 290px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Identité typographique soignée et compacte */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-sand-950 truncate">
                      {artisan.name}
                    </h3>
                    <span className="text-xs text-sand-500 font-medium shrink-0">
                      {artisan.experience}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-primary-600 truncate">
                    {artisan.role}
                  </p>
                  <p className="text-xs text-sand-500 flex items-center gap-1 pb-2.5 border-b border-sand-100 truncate">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span>{artisan.salon} · {artisan.city}</span>
                  </p>
                </div>

                {/* Citation courte (1 ligne) */}
                <div className="pt-2.5">
                  <Quote className="w-3.5 h-3.5 text-primary-500 mb-1 opacity-70" />
                  <p className="text-xs text-sand-700 font-normal leading-relaxed line-clamp-2">
                    « {artisan.quote} »
                  </p>
                </div>
              </div>

              {/* Bouton d'action concis */}
              <div className="pt-3.5 mt-3.5 border-t border-sand-100">
                <Link
                  href={`/venue/${artisan.venueSlug}`}
                  className="w-full btn btn-outline btn-sm flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider py-2"
                >
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
