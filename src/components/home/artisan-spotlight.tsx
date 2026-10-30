"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface Artisan {
  id: string;
  name: string;
  role: string;
  salon: string;
  city: string;
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
    image: "/images/artisans/artisan-1.jpg",
    venueSlug: "atelier-botanique-paris",
  },
  {
    id: "marc",
    name: "Marc Sémard",
    role: "Maître Barbier",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux",
    image: "/images/artisans/artisan-2.jpg",
    venueSlug: "barbier-saint-germain",
  },
  {
    id: "nour",
    name: "Nour Kaddour",
    role: "Facialiste & Kobido",
    salon: "Maison Albar Institut",
    city: "Lyon",
    image: "/images/artisans/artisan-3.jpg",
    venueSlug: "maison-albar-soins",
  },
  {
    id: "julien",
    name: "Julien Vaneck",
    role: "Coupe & Balayage Minéral",
    salon: "Studio Séquoia",
    city: "Marseille",
    image: "/images/artisans/artisan-4.jpg",
    venueSlug: "bain-de-vapeur-sequoia",
  },
  {
    id: "elise",
    name: "Élise Moreau",
    role: "Praticienne Massages & Spas",
    salon: "Havres Botaniques",
    city: "Lille",
    image: "/images/artisans/artisan-5.jpg",
    venueSlug: "maison-albar-soins",
  },
  {
    id: "camille",
    name: "Camille Chen",
    role: "Onglerie Japonaise",
    salon: "L’Écrin Minéral",
    city: "Nantes",
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
    <section className="section bg-secondary-100 border-b border-primary-200/80" aria-labelledby="artisans-heading">
      <div className="container-belora">
        {/* En-tête épuré Apple-style */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2
              id="artisans-heading"
              className="section-title text-neutral-950 max-w-xl"
            >
              Rencontrez les artisans,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                passionnés du geste.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-normal">
              Des praticiens indépendants sélectionnés pour leur savoir-faire et leur exigence.
            </p>
          </div>

          {/* Boutons de contrôle du Slider style Apple */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-primary-300 bg-white hover:border-primary-400 hover:bg-primary-50/10 flex items-center justify-center text-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              aria-label="Artisans précédents"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-primary-300 bg-white hover:border-primary-400 hover:bg-primary-50/10 flex items-center justify-center text-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              aria-label="Artisans suivants"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider horizontal Apple Pro : cartes uniformes, bordures parfaites, zéro surcharge */}
        <div
          ref={sliderRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 -mr-5 scrollbar-none focus:outline-none"
        >
          {ARTISANS.map((artisan) => (
            <Link
              key={artisan.id}
              href={`/venue/${artisan.venueSlug}`}
              className="group w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col justify-between bg-white rounded-3xl border border-primary-200/80 overflow-hidden shadow-2xs hover:shadow-lg hover:border-primary-300 transition-all duration-300 cursor-pointer"
            >
              {/* Photographie pleine largeur en haut : arrondis parfaitement harmonisés */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
                <Image
                  src={artisan.image}
                  alt={`Portrait de ${artisan.name}, ${artisan.role}`}
                  fill
                  sizes="(max-width: 640px) 260px, 280px"
                  className="object-cover"
                />
              </div>

              {/* Contenu épuré & hiérarchisé */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-1">
                    {artisan.role}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-primary-600 transition-colors">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{artisan.salon} · {artisan.city}</span>
                  </p>
                </div>

                {/* Lien subtil en bas de carte */}
                <div className="pt-3 mt-3 border-t border-primary-100 flex items-center justify-between text-xs font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors">
                  <span>Voir le sanctuaire</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
