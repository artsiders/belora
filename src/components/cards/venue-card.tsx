"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";

export interface VenueCardData {
  id?: string;
  slug: string;
  name: string;
  image: string;
  rating: string;
  reviewCount: number;
  city: string;
  district?: string;
  distance?: string;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  tags?: string[];
  startingPrice: string;
  services?: { name: string }[];
}

export interface VenueCardProps {
  venue: VenueCardData;
  isFavorite?: boolean;
  onToggleFavorite?: (venueIdOrSlug: string) => void;
  priority?: boolean;
}

export function VenueCard({
  venue,
  isFavorite = false,
  onToggleFavorite,
  priority = false,
}: VenueCardProps) {
  const [internalFavorite, setInternalFavorite] = useState(isFavorite);
  const isFav = onToggleFavorite !== undefined ? isFavorite : internalFavorite;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite(venue.id || venue.slug);
    } else {
      setInternalFavorite((prev) => !prev);
    }
  };

  // Récupérer les tags de prestations (soit définis explicitement, soit extraits des services)
  const displayTags =
    venue.tags && venue.tags.length > 0
      ? venue.tags.slice(0, 3)
      : venue.services && venue.services.length > 0
      ? venue.services.slice(0, 3).map((s) => s.name)
      : [venue.categoryLabel || venue.category || "Soin"];

  // Construction de l'indication de localisation
  const locationLabel = venue.district
    ? `${venue.district}${venue.distance ? ` · ${venue.distance}` : ""}`
    : `${venue.city}${venue.distance ? ` · ${venue.distance}` : ""}`;

  return (
    <article className="group relative flex flex-col bg-white rounded-3xl border border-neutral-200/90 hover:border-neutral-300 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full">
      {/* 1. Lien invisible occupant toute la carte pour rendre l'ensemble cliquable directement */}
      <Link
        href={`/venue/${venue.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Découvrir ${venue.name} à ${locationLabel}`}
      >
        <span className="sr-only">Découvrir {venue.name}</span>
      </Link>

      {/* 2. Photographie haute définition avec zoom doux au survol */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
        <Image
          src={venue.image}
          alt={venue.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {/* Bouton favori interactif en z-20 pour ne pas déclencher le lien de carte */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute z-20 top-2.5 right-2.5 w-8 h-8 rounded-full bg-neutral-950/40 hover:bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Pastille de note en bas à gauche de la photo */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-bold text-neutral-900 num flex items-center gap-1.5 shadow-xs pointer-events-none">
          <Star className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
          <span>{venue.rating}</span>
          <span className="text-neutral-400 font-normal">({venue.reviewCount})</span>
        </div>
      </div>

      {/* 3. Contenu textuel soigné et hiérarchisé */}
      <div className="flex flex-col flex-1 justify-between p-4 sm:p-5">
        <div>
          {/* Nom du sanctuaire */}
          <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-primary-600 transition-colors leading-snug mb-1 line-clamp-1">
            {venue.name}
          </h3>

          {/* Localisation & distance */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{locationLabel}</span>
          </div>

          {/* Badges de prestations */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-xs text-neutral-700 font-medium truncate max-w-[130px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Pied de carte : CTA 'Voir les prestations' et prix d'appel */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-primary-700 group-hover:text-primary-800 transition-colors inline-flex items-center gap-1.5">
            <span>Voir les prestations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>

          <span className="font-bold text-neutral-900 num">
            {venue.startingPrice.startsWith("dès")
              ? venue.startingPrice
              : `dès ${venue.startingPrice}`}
          </span>
        </div>
      </div>
    </article>
  );
}
