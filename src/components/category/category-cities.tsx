"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { CategoryData, InternationalCity } from "@/lib/data/categories";

interface CategoryCitiesProps {
  category: CategoryData;
}

export function CategoryCities({ category }: CategoryCitiesProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const filteredCities = useMemo(() => {
    let list = category.cities;
    if (selectedRegion !== "all") {
      list = list.filter((c) => c.region === selectedRegion);
    }
    return list;
  }, [category.cities, selectedRegion]);

  const displayedCities = showAll ? filteredCities : filteredCities.slice(0, 8);

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-primary-200/80" aria-labelledby="cities-heading">
      <div className="container-belora">
        {/* En-tête sobre sans trait de séparation superflu */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 sm:mb-9 pb-4 border-b border-neutral-100">
          <div>
            <span className="eyebrow text-neutral-500 font-semibold block mb-1">
              Métropoles mondiales
            </span>
            <h2 id="cities-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950">
              Trouver un artisan{" "}
              <span className="text-primary-600 font-bold">
                dans les grandes capitales
              </span>
            </h2>
            <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
              Les meilleures adresses sélectionnées dans 12 capitales culturelles.
            </p>
          </div>

          {/* Filtres par continent (International) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200/70 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedRegion("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "all"
                  ? "bg-white text-neutral-950 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Toutes ({category.cities.length})
            </button>
            <button
              onClick={() => setSelectedRegion("Europe")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Europe"
                  ? "bg-white text-neutral-950 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Europe
            </button>
            <button
              onClick={() => setSelectedRegion("Americas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Americas"
                  ? "bg-white text-neutral-950 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Amériques
            </button>
            <button
              onClick={() => setSelectedRegion("Asia & Middle East")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Asia & Middle East"
                  ? "bg-white text-neutral-950 shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-950"
              }`}
            >
              Asie & Moyen-Orient
            </button>
          </div>
        </div>

        {/* Grille de cartes épurées sans sur-encadrement : l'image respire et prend toute la largeur */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedCities.map((city: InternationalCity) => (
            <Link
              key={city.id}
              href={`/search?category=${category.slug}&location=${encodeURIComponent(city.name)}`}
              className="group flex flex-col"
            >
              {/* Photo pleine largeur de la colonne avec coins soignés */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-neutral-200 mb-3">
                <Image
                  src={city.image}
                  alt={`${category.shortName} à ${city.name}, ${city.country}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-xs font-semibold text-neutral-900 shadow-2xs">
                  {city.country}
                </span>
                <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-900" />
                </span>
              </div>

              {/* Texte direct sous l'image, sans bordure ni padding gaspillé */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-primary-600 transition-colors">
                    {category.shortName} {city.name}
                  </h3>
                  <span className="text-xs text-neutral-500 num block mt-0.5">
                    {city.count}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bouton pour afficher plus de villes */}
        {filteredCities.length > 8 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-secondary"
            >
              {showAll ? (
                <>
                  <span>Réduire la liste</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Voir toutes les métropoles ({filteredCities.length})</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
