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
  ShieldCheck,
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
    <div className="container-belora py-8 sm:py-12">
      {/* 1. Barre de recherche & filtres Apple Pro */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-white border border-primary-200/90 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Champ 1 : Recherche Soin / Salon */}
          <div className="md:col-span-5 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-primary-50/10/80 border border-primary-200/70 focus-within:border-primary-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-sand-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Soin, salon ou artisan..."
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none font-medium"
            />
          </div>

          {/* Champ 2 : Ville */}
          <div className="md:col-span-4 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-primary-50/10/80 border border-primary-200/70 focus-within:border-primary-500 focus-within:bg-white transition-all">
            <MapPin className="w-4 h-4 text-sand-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 focus:outline-none cursor-pointer font-medium"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Champ 3 : Tri */}
          <div className="md:col-span-3 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-primary-50/10/80 border border-primary-200/70 focus-within:border-primary-500 focus-within:bg-white transition-all">
            <SlidersHorizontal className="w-4 h-4 text-sand-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recommended" | "rating" | "price")
              }
              className="w-full bg-transparent text-xs sm:text-sm text-sand-900 focus:outline-none cursor-pointer font-medium"
            >
              <option value="recommended">Recommandés</option>
              <option value="rating">Mieux notés</option>
              <option value="price">Tarif croissant</option>
            </select>
          </div>
        </div>

        {/* Chips de disciplines épurées */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-primary-100">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sand-950 text-white shadow-2xs"
                    : "bg-white text-sand-700 border border-primary-200 hover:border-primary-300 hover:bg-primary-50/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Résumé des résultats et comptage */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-primary-200/80 text-xs text-sand-500">
        <div>
          <span className="font-bold text-sand-900 num">
            {filteredVenues.length}
          </span>{" "}
          {filteredVenues.length > 1 ? "maisons trouvées" : "maison trouvée"}
          {selectedCity !== "Toutes les villes" && ` à ${selectedCity}`}
        </div>
        <div className="flex items-center gap-1.5 text-sand-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-primary-600" />
          <span>Établissements audités sur place</span>
        </div>
      </div>

      {/* 3. Disposition Split : Cartes Apple Pro + Carte Géographique Stylisée */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne gauche : Liste des salons (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {filteredVenues.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-primary-200/80 shadow-2xs space-y-4">
              <Compass className="w-8 h-8 text-sand-400 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-bold text-sand-950">
                Aucun établissement ne correspond à cette recherche
              </h3>
              <p className="text-xs sm:text-sm text-sand-600 max-w-md mx-auto font-normal">
                Essayez d’élargir vos filtres ou de sélectionner une autre ville.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedCity("Toutes les villes");
                  setSearchQuery("");
                }}
                className="btn btn-outline btn-sm rounded-xl cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredVenues.map((venue) => (
              <div
                key={venue.id}
                id={`venue-${venue.id}`}
                className="group p-4 sm:p-5 rounded-3xl bg-white border border-primary-200/80 hover:border-primary-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-5"
              >
                {/* Photographie de l'atelier avec arrondis harmonieux (Apple standard) */}
                <Link
                  href={`/venue/${venue.slug}`}
                  className="relative aspect-[4/3] sm:aspect-square sm:w-52 rounded-2xl overflow-hidden bg-sand-100 shrink-0 block"
                >
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover"
                  />
                </Link>

                {/* Métadonnées & prestations phares */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Eyebrow & Note */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                        {venue.badge}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-sand-900 num">
                        <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
                        <span>{venue.rating}</span>
                        <span className="text-sand-400 font-normal">
                          ({venue.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Nom du sanctuaire */}
                    <h2 className="text-lg sm:text-xl font-bold text-sand-950 group-hover:text-primary-600 transition-colors mb-1">
                      <Link href={`/venue/${venue.slug}`}>{venue.name}</Link>
                    </h2>

                    {/* Localisation & Description */}
                    <p className="text-xs text-sand-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                      <span>
                        {venue.district}, {venue.city}
                      </span>
                    </p>

                    <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed mb-3.5 font-normal">
                      {venue.tagline}
                    </p>

                    {/* Extrait de 2 rituels signatures */}
                    <div className="space-y-2 pt-3 border-t border-primary-100 mb-4">
                      {venue.services.slice(0, 2).map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between text-xs text-sand-700 font-medium"
                        >
                          <span className="truncate pr-3">{srv.name}</span>
                          <span className="font-bold text-sand-950 num shrink-0">
                            {srv.priceEuros} €
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pied de carte avec tarif de départ et actions claires */}
                  <div className="pt-3 border-t border-primary-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-sand-500 font-normal">
                      dès{" "}
                      <strong className="text-sm font-bold text-sand-950 num">
                        {venue.startingPrice}
                      </strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/venue/${venue.slug}`}
                        className="btn btn-outline btn-sm rounded-xl py-2 px-3 text-xs font-semibold"
                      >
                        Découvrir
                      </Link>
                      <Link
                        href={`/book/${venue.slug}`}
                        className="btn btn-primary btn-sm rounded-xl py-2 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <span>Réserver</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Colonne droite : Repères géographiques & Adresses certifiées (5 cols - sticky) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="rounded-3xl border border-primary-200/80 overflow-hidden bg-white space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-500">
                  Repères géographiques
                </p>
                <h3 className="text-base font-bold text-sand-950">
                  Adresses certifiées
                </h3>
              </div>
              <span className="text-xs font-bold text-sand-700 bg-sand-100 px-2.5 py-1 rounded-full num">
                {filteredVenues.length} adresses
              </span>
            </div>

            {/* Liste interactive des adresses */}
            <div className="space-y-2.5">
              {filteredVenues.map((v) => (
                <a
                  key={v.id}
                  href={`#venue-${v.id}`}
                  className="p-3 rounded-2xl bg-primary-50/10/80 border border-primary-200/60 flex items-center justify-between text-xs hover:bg-sand-100/80 hover:border-primary-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-primary-600 shrink-0 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sand-950 group-hover:text-primary-600 transition-colors truncate">
                        {v.name}
                      </p>
                      <p className="text-sand-500 text-xs truncate">
                        {v.district}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sand-900 num shrink-0">
                    dès {v.startingPrice}
                  </span>
                </a>
              ))}
            </div>

            {/* Engagement de quiétude Belora */}
            <div className="p-4 rounded-2xl bg-primary-50/10 border border-primary-200/60 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-sand-950">
                <Check className="w-3.5 h-3.5 text-primary-600" />
                <span>Accueil garanti sans file d’attente</span>
              </div>
              <p className="text-xs text-sand-600 leading-relaxed font-normal">
                Chaque salon certifié Belora respecte scrupuleusement les horaires de ses créneaux pour sanctuariser votre pause de soin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
