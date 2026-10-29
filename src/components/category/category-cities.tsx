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
    <section className="section bg-white border-b border-primary-200/80" aria-labelledby="cities-title">
      <div className="container-belora">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-5 border-b border-primary-200/80">
          <div>
            <span className="eyebrow text-sand-500 font-semibold block mb-1">
              Métropoles internationales
            </span>
            <h2 id="cities-title" className="text-2xl sm:text-3xl font-bold text-sand-950">
              Villes & destinations de soin
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-sand-600">
              Découvrez les adresses d&apos;exception sélectionnées pour votre {category.shortName.toLowerCase()} dans les plus grandes capitales.
            </p>
          </div>

          {/* Onglets Régions (International) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-sand-100 border border-neutral-200/70 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setSelectedRegion("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === "all"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-900"
              }`}
            >
              Toutes ({category.cities.length})
            </button>
            <button
              onClick={() => setSelectedRegion("Europe")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === "Europe"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-900"
              }`}
            >
              Europe
            </button>
            <button
              onClick={() => setSelectedRegion("Americas")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === "Americas"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-900"
              }`}
            >
              Amériques
            </button>
            <button
              onClick={() => setSelectedRegion("Asia & Middle East")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRegion === "Asia & Middle East"
                  ? "bg-white text-sand-950 shadow-2xs"
                  : "text-sand-600 hover:text-sand-900"
              }`}
            >
              Asie & Moyen-Orient
            </button>
          </div>
        </div>

        {/* Grille de cartes de villes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedCities.map((city: InternationalCity) => (
            <Link
              key={city.id}
              href={`/search?category=${category.slug}&location=${encodeURIComponent(city.name)}`}
              className="group flex flex-col rounded-2xl border border-neutral-200/80 bg-white overflow-hidden hover:border-primary-400 hover:shadow-md transition-all duration-200"
            >
              {/* Image de la métropole avec composant Next.js Image */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-sand-100">
                <Image
                  src={city.image}
                  alt={`${category.shortName} à ${city.name}, ${city.country}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-200" />
                <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-sand-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-3.5 h-3.5 text-sand-900" />
                </span>
              </div>

              {/* Contenu textuel sous la photo */}
              <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-sand-950 group-hover:text-primary-700 transition-colors">
                    {category.shortName} {city.name}
                  </h3>
                  <p className="text-xs text-sand-500 mt-0.5">
                    {city.country}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-sand-600">
                  <span className="num font-medium text-primary-800">{city.count}</span>
                  <span className="text-sand-400 group-hover:text-primary-600 transition-colors">Explorer &rarr;</span>
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
              className="btn-outline px-6 py-2.5 rounded-xl inline-flex items-center gap-2 text-xs font-semibold"
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
