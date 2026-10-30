"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { VENUES, Venue } from "@/lib/data/venues";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { CategorySwitcher } from "@/components/category/category-switcher";
import {
  Search,
  MapPin,
  Star,
  SlidersHorizontal,
  ArrowRight,
  Compass,
  Check,
  ShieldCheck,
  Heart,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const CITIES = [
  "Toutes les métropoles",
  "Paris",
  "New York",
  "Londres",
  "Milan",
  "Tokyo",
  "Dubaï",
  "Los Angeles",
  "Genève",
  "Barcelone",
  "Montréal",
  "Rome",
  "Séoul",
  "Lyon",
  "Bordeaux",
  "Marseille",
];

export function SearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";
  const initialCity = searchParams.get("location") || "Toutes les métropoles";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<"recommended" | "rating" | "price">("recommended");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Mettre à jour l'URL sans rechargement complet
  const updateUrlParams = useCallback(
    (category: string, city: string, q: string) => {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (city && city !== "Toutes les métropoles") params.set("location", city);
      if (q && q.trim()) params.set("q", q.trim());

      const queryStr = params.toString();
      router.replace(`/search${queryStr ? `?${queryStr}` : ""}`, { scroll: false });
    },
    [router]
  );

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    updateUrlParams(catSlug, selectedCity, searchQuery);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    updateUrlParams(selectedCategory, city, searchQuery);
  };

  const handleQueryChange = (q: string) => {
    setSearchQuery(q);
    updateUrlParams(selectedCategory, selectedCity, q);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedCity("Toutes les métropoles");
    setSearchQuery("");
    setSortBy("recommended");
    router.replace("/search", { scroll: false });
  };

  const toggleFavorite = (venueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  // Filtrage et tri des salons
  const filteredVenues = useMemo(() => {
    return VENUES.filter((venue) => {
      if (selectedCategory !== "all" && venue.category !== selectedCategory) {
        return false;
      }
      if (
        selectedCity !== "Toutes les métropoles" &&
        !venue.city.toLowerCase().includes(selectedCity.toLowerCase())
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesTagline = venue.tagline.toLowerCase().includes(q);
        const matchesSpecialty = venue.categoryLabel.toLowerCase().includes(q);
        const matchesCity = venue.city.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesSpecialty && !matchesCity) {
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
      return 0;
    });
  }, [selectedCategory, selectedCity, searchQuery, sortBy]);

  // Données éditoriales de la catégorie active pour harmonisation avec /category/[slug]
  const activeCategoryData = selectedCategory !== "all" ? CATEGORIES_DATA[selectedCategory] : null;

  const editorialTitle = activeCategoryData ? (
    <>
      {activeCategoryData.titlePrefix}{" "}
      <span className="text-primary-600 font-bold">
        {activeCategoryData.titleHighlight}
      </span>
    </>
  ) : (
    <>
      Nos havres recommandés,{" "}
      <span className="text-primary-600 font-bold">
        l&apos;artisanat du geste.
      </span>
    </>
  );

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedCity !== "Toutes les métropoles" ||
    searchQuery.trim() !== "";

  return (
    <div className="flex flex-col">
      {/* 1. Sélecteur circulaire d'univers identique à la Home et aux pages catégories */}
      <CategorySwitcher
        currentSlug={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* 2. En-tête éditorial avec capsule de recherche harmonisée */}
      <section className="bg-sand-warm/40 border-b border-primary-200/80 py-7 sm:py-9">
        <div className="container-belora space-y-5">
          {/* Fil d'ariane sobre */}
          <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-xs text-sand-500">
            <Link href="/" className="hover:text-sand-900 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
            <Link href="/search" className="hover:text-sand-900 transition-colors">
              Univers
            </Link>
            {activeCategoryData && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
                <span className="text-sand-900 font-semibold">{activeCategoryData.name}</span>
              </>
            )}
          </nav>

          {/* Titre éditorial harmonisé */}
          <div className="max-w-3xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-sand-950 leading-snug">
              {editorialTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-sand-600 font-normal">
              {selectedCity !== "Toutes les métropoles"
                ? `Les meilleures adresses sélectionnées à ${selectedCity}.`
                : "Explorez et réservez instantanément les ateliers et maîtres artisans les plus réputés."}
            </p>
          </div>

          {/* Capsule de recherche & filtres unifiée avec la charte */}
          <div className="bg-white rounded-2xl border border-primary-200/90 shadow-2xs p-2 sm:p-2.5 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
              {/* Segment 1 : Prestation / Soin */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50 focus-within:bg-sand-50 rounded-xl transition-colors">
                <Search className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="search-q"
                    className="block text-xs font-semibold text-sand-950 uppercase tracking-wide cursor-pointer"
                  >
                    Prestation
                  </label>
                  <input
                    id="search-q"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    placeholder="Soin, artisan ou rituel..."
                    className="w-full bg-transparent text-xs sm:text-sm text-sand-800 placeholder:text-sand-400 focus:outline-none font-medium truncate"
                  />
                </div>
              </div>

              {/* Séparateur vertical */}
              <div className="hidden md:block w-px h-8 bg-sand-200 shrink-0 mx-1" aria-hidden="true" />

              {/* Segment 2 : Métropole */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50 focus-within:bg-sand-50 rounded-xl transition-colors">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="search-city"
                    className="block text-xs font-semibold text-sand-950 uppercase tracking-wide cursor-pointer"
                  >
                    Métropole
                  </label>
                  <select
                    id="search-city"
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-sand-800 focus:outline-none cursor-pointer font-medium truncate"
                  >
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Séparateur vertical */}
              <div className="hidden md:block w-px h-8 bg-sand-200 shrink-0 mx-1" aria-hidden="true" />

              {/* Segment 3 : Tri */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50 focus-within:bg-sand-50 rounded-xl transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="search-sort"
                    className="block text-xs font-semibold text-sand-950 uppercase tracking-wide cursor-pointer"
                  >
                    Trier par
                  </label>
                  <select
                    id="search-sort"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "recommended" | "rating" | "price")
                    }
                    className="w-full bg-transparent text-xs sm:text-sm text-sand-800 focus:outline-none cursor-pointer font-medium truncate"
                  >
                    <option value="recommended">Recommandés</option>
                    <option value="rating">Mieux notés</option>
                    <option value="price">Tarif croissant</option>
                  </select>
                </div>
              </div>

              {/* Bouton réinitialiser discret si filtres actifs */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Réinitialiser tous les filtres"
                  className="px-3 py-2 text-xs font-semibold text-sand-600 hover:text-sand-950 hover:bg-sand-100 rounded-xl transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer self-end md:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="md:hidden">Effacer les filtres</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contenu principal : Liste des salons & Panneau repères géographiques */}
      <div className="container-belora py-8 sm:py-12">
        {/* Ligne d'état & comptage sobre */}
        <div className="flex items-center justify-between mb-8 pb-3.5 border-b border-neutral-100 text-xs text-sand-600">
          <div>
            <span className="font-bold text-sand-950 num">
              {filteredVenues.length}
            </span>{" "}
            {filteredVenues.length > 1 ? "maisons répertoriées" : "maison répertoriée"}
            {selectedCity !== "Toutes les métropoles" && ` à ${selectedCity}`}
            {selectedCategory !== "all" && activeCategoryData && ` &bull; ${activeCategoryData.name}`}
          </div>
          <div className="flex items-center gap-1.5 text-sand-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
            <span className="hidden sm:inline">Établissements audités sur place</span>
            <span className="sm:hidden">100% vérifié</span>
          </div>
        </div>

        {/* Grille principale : Cartes dé-boxées (Photo-first) + Panneau Concierge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Colonne Gauche : Liste des établissements (7 colonnes) */}
          <div className="lg:col-span-7 space-y-8">
            {filteredVenues.length === 0 ? (
              /* État vide soigné et actionnable */
              <div className="p-10 sm:p-14 text-center rounded-3xl bg-sand-50/60 border border-primary-200/60 space-y-4">
                <Compass className="w-8 h-8 text-primary-600/70 mx-auto" />
                <h3 className="text-lg sm:text-xl font-bold text-sand-950">
                  Aucun établissement ne correspond à votre recherche
                </h3>
                <p className="text-xs sm:text-sm text-sand-600 max-w-md mx-auto font-normal">
                  Essayez d&apos;élargir vos filtres ou de sélectionner une autre métropole culturelle.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-primary btn-sm rounded-xl cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            ) : (
              filteredVenues.map((venue: Venue) => {
                const isFavorite = Boolean(favorites[venue.id]);

                return (
                  <article
                    key={venue.id}
                    id={`venue-${venue.id}`}
                    className="group flex flex-col sm:flex-row gap-5 pb-8 border-b border-neutral-100 last:border-b-0"
                  >
                    {/* Photographie épurée pleine largeur de son conteneur */}
                    <div className="relative aspect-4/3 sm:aspect-16/11 sm:w-64 rounded-2xl overflow-hidden bg-sand-200 shrink-0 shadow-2xs group-hover:shadow-md transition-shadow">
                      <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 256px"
                        className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      />

                      {/* Note en haut à gauche */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-2xs text-xs font-bold text-sand-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{venue.rating}</span>
                        <span className="text-sand-400 font-normal">({venue.reviewCount})</span>
                      </div>

                      {/* Bouton favori visuel & interactif */}
                      <button
                        type="button"
                        onClick={() => toggleFavorite(venue.id)}
                        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-sand-700 hover:text-primary-600 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFavorite ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>

                      {/* Tarif dès... en bas à droite */}
                      <div className="absolute bottom-3 right-3 bg-sand-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md num shadow-2xs">
                        dès {venue.startingPrice}
                      </div>
                    </div>

                    {/* Contenu textuel sans padding de boîte artificielle */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Ligne catégorie & localisation */}
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold uppercase tracking-wider text-primary-700">
                            {venue.categoryLabel}
                          </span>
                          <span className="text-sand-500 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-sand-400 shrink-0" />
                            <span className="truncate">{venue.district || venue.city}</span>
                          </span>
                        </div>

                        {/* Titre du salon avec lien */}
                        <h2 className="text-base sm:text-lg font-bold text-sand-950 group-hover:text-primary-600 transition-colors leading-snug">
                          <Link href={`/venue/${venue.slug}`}>{venue.name}</Link>
                        </h2>

                        {/* Tagline concise */}
                        <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed font-normal mt-1 mb-3">
                          {venue.tagline}
                        </p>

                        {/* 2 Rituels signatures intégrés sobrement */}
                        <div className="space-y-1.5 pt-2.5 border-t border-neutral-100 mb-4">
                          {venue.services.slice(0, 2).map((srv) => (
                            <div
                              key={srv.id}
                              className="flex items-center justify-between text-xs text-sand-700"
                            >
                              <span className="truncate pr-3 font-normal">{srv.name}</span>
                              <span className="font-semibold text-sand-950 num shrink-0">
                                {srv.priceEuros} €
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions & Tarif de départ */}
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                        <span className="text-xs text-sand-500 font-normal">
                          À partir de{" "}
                          <strong className="text-sm font-bold text-sand-950 num">
                            {venue.startingPrice}
                          </strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/venue/${venue.slug}`}
                            className="btn btn-outline btn-sm rounded-xl py-1.5 px-3 text-xs font-semibold"
                          >
                            Découvrir
                          </Link>
                          <Link
                            href={`/book/${venue.slug}`}
                            className="btn btn-primary btn-sm rounded-xl py-1.5 px-3.5 text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <span>Réserver</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Colonne Droite : Panneau Concierge & Repères Géographiques (5 colonnes - sticky) */}
          <aside className="hidden lg:block lg:col-span-5 sticky top-24 space-y-5">
            <div className="rounded-3xl border border-primary-200/80 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-sand-400 block mb-0.5">
                    Conciergerie Belora
                  </span>
                  <h3 className="text-base font-bold text-sand-950">
                    Adresses certifiées
                  </h3>
                </div>
                <span className="text-xs font-bold text-sand-700 bg-sand-100 px-2.5 py-1 rounded-full num">
                  {filteredVenues.length} adresses
                </span>
              </div>

              {/* Liste d'adresses défilante avec survol fluide */}
              <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1 no-scrollbar divide-y divide-neutral-100">
                {filteredVenues.map((v) => (
                  <a
                    key={v.id}
                    href={`#venue-${v.id}`}
                    className="pt-2 first:pt-0 flex items-center justify-between text-xs py-2 hover:pl-1 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <div className="w-7 h-7 rounded-full bg-sand-100 group-hover:bg-primary-100 group-hover:text-primary-700 text-sand-700 flex items-center justify-center shrink-0 transition-colors">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-sand-950 group-hover:text-primary-600 transition-colors truncate">
                          {v.name}
                        </p>
                        <p className="text-sand-400 text-xs truncate">
                          {v.district || v.city} &bull; {v.categoryLabel}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sand-900 num shrink-0">
                      dès {v.startingPrice}
                    </span>
                  </a>
                ))}
              </div>

              {/* Charte Sanctuaire Belora */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sand-950">
                  <Check className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Accueil garanti sans file d’attente</span>
                </div>
                <p className="text-xs text-sand-600 leading-relaxed font-normal">
                  Chaque salon partenaire Belora respecte scrupuleusement l&apos;horaire de votre rendez-vous pour préserver votre quiétude.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
