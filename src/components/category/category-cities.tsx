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
    <section className="py-14 sm:py-20 bg-white border-b border-primary-200/80" aria-labelledby="cities-heading">
      <div className="container-belora">
        {/* En-tête avec titre standardisé et mots en text-primary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 pb-5 border-b border-primary-200/80">
          <div>
            <span className="eyebrow text-sand-500 font-semibold block mb-1.5">
              Métropoles mondiales
            </span>
            <h2 id="cities-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950">
              Trouver un artisan{" "}
              <span className="text-primary-600 font-bold">
                dans les grandes capitales
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-sand-600 font-normal max-w-2xl">
              Nos ateliers partenaires en {category.shortName.toLowerCase()} vous accueillent au cœur des douze métropoles culturelles et de mode les plus prestigieuses.
            </p>
          </div>

          {/* Filtres par continent (International) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sand-100 border border-primary-200/80 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedRegion("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "all"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-950"
              }`}
            >
              Toutes ({category.cities.length})
            </button>
            <button
              onClick={() => setSelectedRegion("Europe")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Europe"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-950"
              }`}
            >
              Europe
            </button>
            <button
              onClick={() => setSelectedRegion("Americas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Americas"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-950"
              }`}
            >
              Amériques
            </button>
            <button
              onClick={() => setSelectedRegion("Asia & Middle East")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedRegion === "Asia & Middle East"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-950"
              }`}
            >
              Asie & Moyen-Orient
            </button>
          </div>
        </div>

        {/* Grille de cartes des métropoles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedCities.map((city: InternationalCity) => (
            <Link
              key={city.id}
              href={`/search?category=${category.slug}&location=${encodeURIComponent(city.name)}`}
              className="group flex flex-col rounded-2xl border border-primary-200/80 bg-white overflow-hidden hover:border-primary-400 hover:shadow-md transition-all duration-300"
            >
              {/* Photo avec coins arrondis et badge pays */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-sand-200">
                <Image
                  src={city.image}
                  alt={`${category.shortName} à ${city.name}, ${city.country}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-300" />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-xs font-semibold text-sand-900 shadow-2xs">
                  {city.country}
                </span>
                <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-sand-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5 text-sand-900" />
                </span>
              </div>

              {/* Contenu textuel sous la photo */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-sand-950 group-hover:text-primary-600 transition-colors">
                    {category.shortName} {city.name}
                  </h3>
                  <span className="text-xs text-sand-500 num block mt-0.5">
                    {city.count}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-sand-600">
                  <span className="font-medium text-primary-700">Adresses certifiées</span>
                  <span className="text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all">
                    Explorer &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bouton pour afficher plus de villes */}
        {filteredCities.length > 8 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn btn-secondary px-6 py-2.5 rounded-xl inline-flex items-center gap-2 text-xs font-semibold cursor-pointer"
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
