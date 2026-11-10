"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Map as MapIcon,
  List as ListIcon,
  SearchX,
  X,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { Venue, CITY_COORDINATES } from "@/lib/data/venues";
import { SearchVenueCard } from "@/components/search/search-venue-card";
import { SearchMap } from "@/components/search/search-map";
import { apiClient } from "@/lib/api-client";

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

function SearchCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-neutral-200/90 p-4 gap-4 sm:gap-5">
      <div className="shrink-0 w-full sm:w-56 md:w-60 aspect-4/3 sm:aspect-square rounded-xl bg-neutral-200 animate-pulse" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 w-48 bg-neutral-200 rounded-md animate-pulse" />
        <div className="h-4 w-64 bg-neutral-100 rounded-md animate-pulse" />
        <div className="h-4 w-32 bg-neutral-100 rounded-md animate-pulse" />
        <div className="pt-4 flex gap-2">
          <div className="h-8 w-24 bg-neutral-100 rounded-lg animate-pulse" />
          <div className="h-8 w-24 bg-neutral-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

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

  // Requête API via React Query & apiClient (règles 16 & 17)
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["venues", { categoryParam, locationParam, queryParam }],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (categoryParam && categoryParam !== "all") params.category = categoryParam;
      if (locationParam.trim()) params.location = locationParam.trim();
      if (queryParam.trim()) params.q = queryParam.trim();

      const res = await apiClient.get<{ venues: Venue[]; pagination: { total: number } }>("/venues", {
        params,
      });
      return res.data;
    },
    staleTime: 60_000,
    gcTime: 600_000,
    placeholderData: keepPreviousData,
  });

  const venues: Venue[] = data?.venues || [];

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

  // Sous-filtrage interactif côté client (règle 17 : pas de refetch sur sous-filtres visuels)
  const filteredVenues = useMemo(() => {
    if (activeSubFilter === "Tous") return venues;

    const filter = activeSubFilter.toLowerCase();
    return venues.filter((venue) => {
      const matchesService = venue.services?.some(
        (s) =>
          s.name.toLowerCase().includes(filter) ||
          (s.category && s.category.toLowerCase().includes(filter))
      );
      const matchesTagline = (venue.tagline || "").toLowerCase().includes(filter);
      const matchesCategory = (venue.categoryLabel || "").toLowerCase().includes(filter);
      return matchesService || matchesTagline || matchesCategory;
    });
  }, [venues, activeSubFilter]);

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
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 rounded-2xl"
          >
            {/* Prestation / Catégorie */}
            <div className="flex-1 flex items-center gap-2 px-4 py-4 h-16 bg-white rounded-xl border border-neutral-200/70">
              <Search className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Prestation
                </span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-neutral-900 focus:outline-hidden cursor-pointer"
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
            <div className="flex-1 flex items-center gap-2 px-4 py-4 h-16 bg-white rounded-xl border border-neutral-200/70">
              <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Où
                </span>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Paris, Lyon, Marseille..."
                  className="w-full bg-transparent text-sm sm:text-base font-semibold text-neutral-900 focus:outline-hidden placeholder:text-neutral-400"
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
            <div className="hidden lg:flex items-center gap-2 px-4 py-4 h-16 bg-white rounded-xl border border-neutral-200/70 w-52 shrink-0">
              <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm uppercase font-bold text-neutral-400 block tracking-wider leading-none">
                  Quand
                </span>
                <span className="text-sm sm:text-base font-semibold text-neutral-900 block truncate">
                  À tout moment
                </span>
              </div>
            </div>

            {/* Bouton Rechercher */}
            <button
              type="submit"
              className="btn btn-primary py-4 h-16"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Rechercher</span>
            </button>
          </form>

          {/* 2. Sous-filtres rapides style Planity */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-neutral-200/80 bg-white text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <span>Filtres</span>
            </button>

            {subFilterList.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSubFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
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

      {/* 3. Corps principal : Layout 2 colonnes pleine largeur */}
      <main className="flex-1 w-full flex flex-col lg:flex-row items-stretch">
        {/* COLONNE GAUCHE : Liste des salons */}
        <div
          className={`w-full lg:w-[54%] xl:w-[50%] 2xl:w-[46%] px-4 sm:px-6 lg:px-8 py-6 flex flex-col space-y-4 shrink-0 ${
            mobileView === "map" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* En-tête des résultats (toujours stable, avec squelette inline sur le nombre selon Règle 15) */}
          <div className="pb-3 border-b border-neutral-200/80">
            <h1 className="text-lg sm:text-xl font-bold text-neutral-950">
              Sélectionnez {categoryTitleLabel}
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-0.5">
              Les meilleurs salons et instituts aux alentours de{" "}
              <span className="font-semibold text-neutral-900">
                {locationParam || "toutes métropoles"}
              </span>{" "}
              : Réservation en ligne
            </p>
            <div className="mt-1 text-sm text-neutral-500">
              {isLoading ? (
                <span className="inline-block h-4 w-28 rounded-md bg-neutral-200 animate-pulse align-middle" />
              ) : (
                <span className="num">
                  {filteredVenues.length}{" "}
                  {filteredVenues.length > 1
                    ? "établissements disponibles"
                    : "établissement disponible"}
                </span>
              )}
            </div>
          </div>

          {/* Gestion des états : Erreur vs Chargement vs Vide vs Liste (Règles 15 et 16) */}
          {isError ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                Impossible de charger les établissements
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 max-w-sm mx-auto">
                Un problème de connexion est survenu lors de la recherche. Veuillez vérifier votre réseau et réessayez.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="btn btn-outline text-sm px-4 py-2 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réessayer</span>
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              <SearchCardSkeleton />
              <SearchCardSkeleton />
              <SearchCardSkeleton />
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-neutral-200/80 space-y-3">
              <SearchX className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                Aucun établissement trouvé
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 max-w-sm mx-auto">
                Aucun salon ne correspond exactement à vos critères. Essayez d&apos;élargir vos filtres ou de choisir une autre métropole.
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
                  className="btn btn-outline text-sm px-4 py-2 rounded-xl cursor-pointer"
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

        {/* COLONNE DROITE : Carte interactive sticky pleine hauteur */}
        <div
          className={`w-full lg:flex-1 lg:min-w-0 sticky top-[73px] h-[calc(100vh-73px)] border-l border-neutral-200/90 ${
            mobileView === "list" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="w-full h-full relative bg-neutral-100">
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
      </main>

      {/* 4. Bouton flottant de bascule Carte / Liste sur mobile */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
          className="btn btn-dark text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl font-bold cursor-pointer"
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
