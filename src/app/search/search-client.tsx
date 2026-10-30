"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VENUES, Venue } from "@/lib/data/venues";
import { CATEGORIES_DATA } from "@/lib/data/categories";
import { CategorySwitcher } from "@/components/category/category-switcher";
import { CategoryHero } from "@/components/category/category-hero";
import { CategoryCities } from "@/components/category/category-cities";
import { CategoryVenuesPreview } from "@/components/category/category-venues-preview";
import { CategoryEditorial } from "@/components/category/category-editorial";
import { CategoryGuide } from "@/components/category/category-guide";
import { CategoryProCta } from "@/components/category/category-pro-cta";
import { Star, MapPin, Heart, ArrowRight, Compass, ShieldCheck } from "lucide-react";

export function SearchClient() {
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "all";
  const queryParam = searchParams.get("q") || "";
  const locationParam = searchParams.get("location") || "";

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (venueId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  // Récupérer les données de la catégorie active (ou le dataset global "all")
  const activeCategory =
    CATEGORIES_DATA[categoryParam] || CATEGORIES_DATA["all"] || CATEGORIES_DATA["hair"];

  // Déterminer si une recherche filtrée est en cours
  const hasActiveQuery = queryParam.trim().length > 0;
  const hasActiveLocation = locationParam.trim().length > 0;
  const isSearchActive = hasActiveQuery || hasActiveLocation;

  // Filtrage des salons pour les résultats de recherche
  const searchResults = useMemo(() => {
    if (!isSearchActive) return [];

    return VENUES.filter((venue: Venue) => {
      // Filtre catégorie si spécifiée
      if (categoryParam !== "all" && venue.category !== categoryParam && venue.id !== categoryParam) {
        return false;
      }

      // Filtre localisation
      if (hasActiveLocation) {
        const loc = locationParam.toLowerCase();
        const matchesCity = venue.city.toLowerCase().includes(loc);
        const matchesDistrict = (venue.district || "").toLowerCase().includes(loc);
        if (!matchesCity && !matchesDistrict) return false;
      }

      // Filtre texte libre
      if (hasActiveQuery) {
        const q = queryParam.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesTagline = venue.tagline.toLowerCase().includes(q);
        const matchesCategory = venue.categoryLabel.toLowerCase().includes(q);
        const matchesCity = venue.city.toLowerCase().includes(q);
        const matchesService = venue.services?.some((s) => s.name.toLowerCase().includes(q));

        if (!matchesName && !matchesTagline && !matchesCategory && !matchesCity && !matchesService) {
          return false;
        }
      }

      return true;
    });
  }, [categoryParam, queryParam, locationParam, isSearchActive, hasActiveLocation, hasActiveQuery]);

  return (
    <div className="flex flex-col">
      {/* 1. Sélecteur circulaire d'univers identique à la Home et aux pages catégories */}
      <CategorySwitcher currentSlug={categoryParam} />

      {/* 2. Hero architectural avec visuel d'ambiance plein écran, titre et capsule de recherche */}
      <CategoryHero category={activeCategory} />

      {/* 3. Section dédiée aux résultats de recherche (affichée uniquement lors d'une recherche active) */}
      {isSearchActive && (
        <section
          className="py-12 sm:py-16 bg-neutral-50/30 border-b border-primary-200/80"
          aria-labelledby="search-results-heading"
        >
          <div className="container-belora">
            {/* En-tête des résultats */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-neutral-200/80">
              <div>
                <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                  Résultats de recherche
                </span>
                <h2
                  id="search-results-heading"
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950"
                >
                  <span className="font-bold text-primary-600 num">{searchResults.length}</span>{" "}
                  {searchResults.length > 1 ? "établissements trouvés" : "établissement trouvé"}
                  {hasActiveLocation && ` à ${locationParam}`}
                  {hasActiveQuery && ` pour « ${queryParam} »`}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/search"
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  Effacer les filtres
                </Link>
                <span className="text-neutral-300">|</span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                  <span>100% audités sur place</span>
                </div>
              </div>
            </div>

            {/* Grille des résultats ou état vide */}
            {searchResults.length === 0 ? (
              <div className="p-10 sm:p-14 text-center rounded-3xl bg-white border border-primary-200/70 space-y-4">
                <Compass className="w-8 h-8 text-primary-600 mx-auto" />
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950">
                  Aucun établissement ne correspond à ces critères
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-normal">
                  Essayez d&apos;élargir vos termes de recherche ou de choisir une autre métropole culturelle.
                </p>
                <div className="pt-2">
                  <Link href="/search" className="btn btn-primary btn-sm rounded-xl">
                    Voir toutes les adresses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {searchResults.map((venue: Venue) => {
                  const isFavorite = Boolean(favorites[venue.id]);

                  return (
                    <article key={venue.id} className="group flex flex-col">
                      {/* Photo pleine largeur avec badges flottants */}
                      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-neutral-200 mb-3.5 shadow-2xs group-hover:shadow-md transition-shadow">
                        <Image
                          src={venue.image}
                          alt={venue.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        />

                        {/* Note en haut à gauche */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-2xs text-xs font-bold text-neutral-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{venue.rating}</span>
                          <span className="text-neutral-400 font-normal">({venue.reviewCount})</span>
                        </div>

                        {/* Bouton favori visuel */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(venue.id)}
                          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:text-primary-600 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </button>

                        {/* Badge de prix dès... */}
                        <div className="absolute bottom-3 right-3 bg-neutral-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md num shadow-2xs">
                          dès {venue.startingPrice}
                        </div>
                      </div>

                      {/* Métadonnées alignées sous la photo */}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold uppercase tracking-wider text-primary-700">
                            {venue.categoryLabel}
                          </span>
                          <span className="text-neutral-500 font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{venue.district || venue.city}</span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-neutral-950 group-hover:text-primary-600 transition-colors line-clamp-1">
                          <Link href={`/venue/${venue.slug}`}>{venue.name}</Link>
                        </h3>

                        <p className="text-xs text-neutral-600 line-clamp-1 mt-1 font-normal leading-relaxed">
                          {venue.tagline}
                        </p>

                        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-neutral-100 text-xs">
                          <span className="text-neutral-500">
                            Dès{" "}
                            <strong className="text-neutral-950 font-bold num">{venue.startingPrice}</strong>
                          </span>
                          <Link
                            href={`/book/${venue.slug}`}
                            className="font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1"
                          >
                            <span>Réserver</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Répertoire de Métropoles Internationales avec les 12 visuels haute résolution */}
      <CategoryCities category={activeCategory} />

      {/* 5. Havres & Ateliers Certifiés Recommandés */}
      <CategoryVenuesPreview category={activeCategory} />

      {/* 6. Section Récit Éditorial, Piliers d'Excellence & Recherches Fréquentes */}
      <CategoryEditorial category={activeCategory} />

      {/* 7. Guide Pratique, Conseils d'Artisans & Charte Sanctuaire */}
      <CategoryGuide category={activeCategory} />

      {/* 8. Appel à l'action pour les Établissements Partenaires (visuel immersif en arrière-plan) */}
      <CategoryProCta category={activeCategory} />
    </div>
  );
}
