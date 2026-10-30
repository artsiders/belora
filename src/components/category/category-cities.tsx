"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CategoryData, InternationalCity } from "@/lib/data/categories";
import { CityCard } from "@/components/cards";

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

        {/* Grille de cartes épurées */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedCities.map((city: InternationalCity) => (
            <CityCard
              key={city.id}
              city={city}
              categorySlug={category.slug}
              categoryShortName={category.shortName}
            />
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
