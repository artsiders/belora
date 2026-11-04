"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
  SearchX,
  X,
} from "lucide-react";
import { VENUES, Venue, CITY_COORDINATES } from "@/lib/data/venues";
import { SearchVenueCard } from "@/components/search/search-venue-card";
import { SearchMap } from "@/components/search/search-map";

const CATEGORY_OPTIONS = [
  { slug: "all", label: "Toutes prestations" },
  { slug: "hair", label: "Coiffeur" },
  { slug: "facial", label: "Soins Visage" },
  { slug: "barber", label: "Barbier" },
  { slug: "massage", label: "Massage & Spa" },
  { slug: "nails", label: "Manucure & Ongles" },
];

const SUB_FILTERS: Record<string, string[]> = {
  hair: ["Tous", "Coiffure femme", "Coiffure homme", "Balayage", "Coupe à sec", "Coloration végétale"],
  facial: ["Tous", "Kobido", "Soin hydratant", "Gua Sha", "Diagnostic de peau"],
  barber: ["Tous", "Barbe sculptée", "Rasage traditionnel", "Coupe homme"],
  massage: ["Tous", "Massage relaxant", "Massage profond", "Rituel aux huiles"],
  nails: ["Tous", "Manucure russe", "Semi-permanent", "Beauté des pieds"],
  all: ["Tous", "Coiffure", "Soins Visage", "Barbier", "Massage", "Ongles"],
};

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";
  const locationParam = searchParams.get("location") || "";
  const queryParam = searchParams.get("q") || "";

  // États du formulaire de recherche
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [locationInput, setLocationInput] = useState(locationParam);
  const [queryInput, setQueryInput] = useState(queryParam);
  const [activeSubFilter, setActiveSubFilter] = useState("Tous");

  // Synchronisation avec les searchParams lors de la navigation
  const [prevParams, setPrevParams] = useState({
    category: categoryParam,
    location: locationParam,
    q: queryParam,
  });

  if (
    prevParams.category !== categoryParam ||
    prevParams.location !== locationParam ||
    prevParams.q !== queryParam
  ) {
    setPrevParams({
      category: categoryParam,
      location: locationParam,
      q: queryParam,
    });
    setSelectedCategory(categoryParam);
    setLocationInput(locationParam);
    setQueryInput(queryParam);
    setActiveSubFilter("Tous");
  }

  // État de sélection et de survol pour lier la liste et la carte
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Vue mobile (liste vs carte)
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const toggleFavorite = (venueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  // Déterminer les coordonnées et le zoom de la ville active
  const mapCenterConfig = useMemo(() => {
    const loc = (locationParam || locationInput || "paris").toLowerCase().trim();
    for (const [cityKey, cfg] of Object.entries(CITY_COORDINATES)) {
      if (loc.includes(cityKey) || cityKey.includes(loc)) {
        return cfg;
      }
    }
    return CITY_COORDINATES["paris"];
  }, [locationParam, locationInput]);

  // Filtrage des résultats
  const filteredVenues = useMemo(() => {
    return VENUES.filter((venue: Venue) => {
      // 1. Filtre catégorie
      if (categoryParam !== "all" && venue.category !== categoryParam && venue.id !== categoryParam) {
        return false;
      }

      // 2. Filtre localisation
      if (locationParam.trim()) {
        const loc = locationParam.toLowerCase().trim();
        const matchesCity = venue.city.toLowerCase().includes(loc);
        const matchesDistrict = (venue.district || "").toLowerCase().includes(loc);
        const matchesAddress = venue.address.toLowerCase().includes(loc);
        if (!matchesCity && !matchesDistrict && !matchesAddress) {
          return false;
        }
      }

      // 3. Filtre texte libre (q)
      if (queryParam.trim()) {
        const q = queryParam.toLowerCase().trim();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesTagline = venue.tagline.toLowerCase().includes(q);
        const matchesCategory = venue.categoryLabel.toLowerCase().includes(q);
        const matchesCity = venue.city.toLowerCase().includes(q);
        const matchesService = venue.services?.some((s) => s.name.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesCategory && !matchesCity && !matchesService) {
          return false;
        }
      }

      // 4. Sous-filtre interactif
      if (activeSubFilter !== "Tous") {
        const filter = activeSubFilter.toLowerCase();
        const matchesService = venue.services?.some((s) =>
          s.name.toLowerCase().includes(filter) || s.category.toLowerCase().includes(filter)
        );
        const matchesTagline = venue.tagline.toLowerCase().includes(filter);
        const matchesCategory = venue.categoryLabel.toLowerCase().includes(filter);
        if (!matchesService && !matchesTagline && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [categoryParam, locationParam, queryParam, activeSubFilter]);

  // Déclencher la recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (locationInput.trim()) {
      params.set("location", locationInput.trim());
    }
    if (queryInput.trim()) {
      params.set("q", queryInput.trim());
    }
    router.push(`/search?${params.toString()}`);
  };

  // Sélection d'un établissement depuis la carte : scroll doux vers la carte gauche
  const handleSelectVenueFromMap = (venueId: string) => {
    setSelectedVenueId(venueId);
    if (venueId) {
      const el = document.getElementById(`venue-card-${venueId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Sous-filtres selon la catégorie courante
  const subFilterList = SUB_FILTERS[categoryParam] || SUB_FILTERS["all"];

  // Libellé dynamique de la catégorie pour le titre
  const categoryTitleLabel = useMemo(() => {
    switch (categoryParam) {
      case "hair":
        return "un salon de coiffure";
      case "facial":
        return "un institut de soin visage";
      case "barber":
        return "un maître barbier";
      case "massage":
        return "un sanctuaire spa & massage";
      case "nails":
        return "un nail bar d'exception";
      default:
        return "un havre de soin & beauté";
    }
  }, [categoryParam]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/40">
      {/* 1. Barre de recherche Planity-style en haut */}
      <section className="bg-white border-b border-neutral-200/90 py-3.5 sticky top-0 z-30 shadow-2xs">
        <div className="container-belora">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-1.5 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs"
          >
            {/* Prestation / Catégorie */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-xl border border-neutral-200/70">
              <Search className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Prestation
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-hidden cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ville / Localisation */}
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-xl border border-neutral-200/70">
              <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Où
                </span>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Paris, Londres, Milan..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-hidden placeholder:text-neutral-400"
                />
              </div>
              {locationInput && (
                <button
                  type="button"
                  onClick={() => setLocationInput("")}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Moment / Date */}
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 bg-white rounded-xl border border-neutral-200/70 w-52 shrink-0">
              <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Quand
                </span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 block truncate">
                  À tout moment
                </span>
              </div>
            </div>

            {/* Bouton Rechercher */}
            <button
              type="submit"
              className="btn btn-dark text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shrink-0 font-bold shadow-2xs cursor-pointer"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Rechercher</span>
            </button>
          </form>

          {/* 2. Sous-filtres rapides style Planity */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200/80 bg-white text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <span>Filtres</span>
            </button>

            {subFilterList.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSubFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeSubFilter === filter
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "bg-white border border-neutral-200/80 text-neutral-700 hover:text-neutral-950 shadow-2xs"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Corps principal : Layout 2 colonnes (Liste à gauche + Carte sticky à droite) */}
      <main className="flex-1 container-belora py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* COLONNE GAUCHE : Liste des salons (affichée selon mobileView sur mobile) */}
          <div
            className={`lg:col-span-7 flex flex-col space-y-4 ${
              mobileView === "map" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* En-tête des résultats */}
            <div className="pb-3 border-b border-neutral-200/80">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-950">
                Sélectionnez {categoryTitleLabel}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                Les meilleurs salons et instituts aux alentours de{" "}
                <span className="font-semibold text-neutral-900">
                  {locationParam || "toutes métropoles"}
                </span>{" "}
                : Réservation en ligne
              </p>
              <span className="text-xs text-neutral-500 num block mt-1">
                {filteredVenues.length}{" "}
                {filteredVenues.length > 1 ? "établissements disponibles" : "établissement disponible"}
              </span>
            </div>

            {/* Liste des cartes ou état vide */}
            {filteredVenues.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/80 space-y-3">
                <SearchX className="w-10 h-10 text-neutral-300 mx-auto" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                  Aucun établissement trouvé
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                  Aucun salon ne correspond exactement à vos critères. Essayez d&apos;élargir vos filtres ou de choisir une autre métropole européenne.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setLocationInput("");
                      setQueryInput("");
                      setActiveSubFilter("Tous");
                      router.push("/search");
                    }}
                    className="btn btn-outline text-xs px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Réinitialiser la recherche
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVenues.map((venue) => (
                  <SearchVenueCard
                    key={venue.id}
                    venue={venue}
                    isFavorite={Boolean(favorites[venue.id])}
                    isSelected={selectedVenueId === venue.id}
                    onToggleFavorite={toggleFavorite}
                    onHover={setHoveredVenueId}
                    onSelect={(id) => setSelectedVenueId(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* COLONNE DROITE : Carte interactive sticky (style Planity) */}
          <div
            className={`lg:col-span-5 ${
              mobileView === "list" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="sticky top-36 h-[calc(100vh-10rem)] min-h-[460px] rounded-2xl overflow-hidden border border-neutral-200/90 shadow-xs bg-white">
              <SearchMap
                venues={filteredVenues}
                initialCenter={{ lat: mapCenterConfig.lat, lng: mapCenterConfig.lng }}
                initialZoom={mapCenterConfig.zoom}
                selectedVenueId={selectedVenueId}
                hoveredVenueId={hoveredVenueId}
                onSelectVenue={handleSelectVenueFromMap}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bouton flottant de bascule Carte / Liste sur mobile (style Planity / Airbnb) */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
          className="btn btn-dark text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl font-bold cursor-pointer"
        >
          {mobileView === "list" ? (
            <>
              <MapIcon className="w-4 h-4 text-white" />
              <span>Voir la carte</span>
            </>
          ) : (
            <>
              <ListIcon className="w-4 h-4 text-white" />
              <span>Voir la liste</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
