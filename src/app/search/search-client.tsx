"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VENUES } from "@/lib/data/venues";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowRight,
  Compass,
  Check,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "Toutes les disciplines" },
  { id: "hair", label: "Coiffure d’auteur" },
  { id: "facial", label: "Soins Visage" },
  { id: "massage", label: "Massages & Spas" },
  { id: "barber", label: "Barbiers & Homme" },
];

const CITIES = ["Toutes les villes", "Paris", "Lyon", "Bordeaux", "Marseille"];

export function SearchClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialCity = searchParams.get("location") || "Toutes les villes";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price">("recommended");

  const filteredVenues = useMemo(() => {
    return VENUES.filter((venue) => {
      // Filtre catégorie
      if (selectedCategory !== "all" && venue.category !== selectedCategory) {
        return false;
      }
      // Filtre ville
      if (
        selectedCity !== "Toutes les villes" &&
        !venue.city.toLowerCase().includes(selectedCity.toLowerCase())
      ) {
        return false;
      }
      // Filtre recherche texte
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesTagline = venue.tagline.toLowerCase().includes(q);
        const matchesSpecialty = venue.categoryLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesSpecialty) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") {
        return parseFloat(b.rating.replace(",", ".")) - parseFloat(a.rating.replace(",", "."));
      }
      if (sortBy === "price") {
        return parseInt(a.startingPrice) - parseInt(b.startingPrice);
      }
      return 0; // "recommended"
    });
  }, [selectedCategory, selectedCity, searchQuery, sortBy]);

  return (
    <div className="container-belora py-8">
      {/* 1. Barre de recherche contextuelle */}
      <div className="mb-8 p-4 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Champ Soin / Salon */}
          <div className="md:col-span-5 flex items-center gap-2 px-3 py-2 rounded bg-sand-100/70 border border-sand-200">
            <Search className="w-4 h-4 text-sand-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Soin, salon ou artisan..."
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none"
            />
          </div>

          {/* Champ Ville */}
          <div className="md:col-span-4 flex items-center gap-2 px-3 py-2 rounded bg-sand-100/70 border border-sand-200">
            <MapPin className="w-4 h-4 text-sand-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 focus:outline-none cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="md:col-span-3 flex items-center gap-2 px-3 py-2 rounded bg-sand-100/70 border border-sand-200">
            <SlidersHorizontal className="w-4 h-4 text-sand-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recommended" | "rating" | "price")
              }
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommandés</option>
              <option value="rating">Mieux notés</option>
              <option value="price">Tarif croissant</option>
            </select>
          </div>
        </div>

        {/* Chips de filtres par disciplines */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-sand-200/80">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-medium transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-sand-950 text-sand-50 border-sand-950"
                    : "bg-sand-50 text-sand-700 border-sand-300 hover:bg-sand-200/60"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Résumé des résultats et comptage */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-sand-200/80 text-xs text-sand-500">
        <div>
          <span className="font-semibold text-sand-900 num">
            {filteredVenues.length}
          </span>{" "}
          {filteredVenues.length > 1 ? "maisons trouvées" : "maison trouvée"}
          {selectedCity !== "Toutes les villes" && ` à ${selectedCity}`}
        </div>
        <div className="flex items-center gap-2 text-sand-600">
          <Compass className="w-3.5 h-3.5 text-primary-600" />
          <span>Établissements audités sur place</span>
        </div>
      </div>

      {/* 3. Disposition Split : Liste de fiches + Aperçu géographique */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne gauche : Liste des salons (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {filteredVenues.length === 0 ? (
            <div className="p-12 text-center rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300/80 space-y-4">
              <Compass className="w-8 h-8 text-sand-400 mx-auto" />
              <h3 className="font-display text-2xl text-sand-950">
                Aucun établissement ne correspond à cette recherche
              </h3>
              <p className="text-xs text-sand-600 max-w-md mx-auto">
                Essayez d’élargir vos filtres ou de sélectionner une autre métropole.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedCity("Toutes les villes");
                  setSearchQuery("");
                }}
                className="btn btn-outline btn-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group p-5 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300/80 hover:border-sand-400 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5"
              >
                {/* Photo de l'atelier */}
                <div className="relative aspect-[4/3] sm:aspect-square sm:w-48 rounded-[var(--radius-sm)] overflow-hidden bg-sand-200 shrink-0">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[var(--radius-xs)] bg-sand-950/75 text-sand-50 text-[9px] uppercase font-semibold tracking-wider backdrop-blur-xs">
                    {venue.badge}
                  </span>
                </div>

                {/* Métadonnées & prestations phares */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1 text-[11px] text-sand-500">
                        <MapPin className="w-3 h-3 text-sand-400" />
                        <span>
                          {venue.district}, {venue.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-sand-900 num">
                        <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                        <span>{venue.rating}</span>
                        <span className="text-sand-400 font-normal">
                          ({venue.reviewCount})
                        </span>
                      </div>
                    </div>

                    <h2 className="font-display text-xl text-sand-950 group-hover:text-primary-600 transition-colors mb-1">
                      <Link href={`/venue/${venue.slug}`}>{venue.name}</Link>
                    </h2>
                    <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed mb-3 font-normal">
                      {venue.tagline}
                    </p>

                    {/* Extrait de 2 prestations */}
                    <div className="space-y-1.5 pt-2 border-t border-sand-200/60 mb-3">
                      {venue.services.slice(0, 2).map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between text-[11px] text-sand-700"
                        >
                          <span className="truncate pr-2">{srv.name}</span>
                          <span className="font-semibold text-sand-900 num shrink-0">
                            {srv.priceEuros} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between gap-3">
                    <span className="text-xs text-sand-500 font-normal">
                      dès <strong className="text-sand-950 num">{venue.startingPrice}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/venue/${venue.slug}`}
                        className="btn btn-outline btn-xs"
                      >
                        Voir la fiche
                      </Link>
                      <Link
                        href={`/book/${venue.slug}`}
                        className="btn btn-primary btn-xs inline-flex items-center gap-1"
                      >
                        <span>Réserver</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Colonne droite : Carte & Adresses certifiées (5 cols - sticky) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="rounded-[var(--radius-sm)] border border-sand-300 overflow-hidden bg-sand-50 shadow-sm">
            {/* Simulation de carte stylisée monochrome */}
            <div className="relative h-72 w-full bg-sand-200/90 p-6 flex flex-col justify-between overflow-hidden">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(var(--sand-500) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-sand-50/90 backdrop-blur-xs text-[10px] uppercase font-semibold text-sand-800 tracking-wider shadow-2xs">
                  Repères géographiques
                </span>
                <span className="text-xs text-sand-600 bg-sand-50/80 px-2 py-0.5 rounded num">
                  {filteredVenues.length} adresses
                </span>
              </div>

              {/* Pins décoratifs interactifs */}
              <div className="relative z-10 space-y-2">
                {filteredVenues.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded bg-sand-50/95 backdrop-blur-xs border border-sand-200/80 flex items-center justify-between text-xs shadow-2xs hover:bg-sand-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MapPin className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                      <span className="font-medium text-sand-900 truncate">
                        {v.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-sand-500 shrink-0">
                      {v.district}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-sand-50 text-xs text-sand-600 border-t border-sand-200/80 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-sand-800">
                <Check className="w-3.5 h-3.5 text-primary-600" />
                <span>Accueil garanti sans file d’attente</span>
              </div>
              <p className="text-[11px] leading-relaxed text-sand-500">
                Chaque salon certifié Belora respecte scrupuleusement les horaires de
                ses créneaux pour sanctuariser votre pause de soin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
