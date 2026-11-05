"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, Calendar, Gift, ChevronRight } from "lucide-react";
import { Venue } from "@/lib/data/venues";

interface SearchVenueCardProps {
  venue: Venue;
  isFavorite: boolean;
  isSelected?: boolean;
  onToggleFavorite: (id: string) => void;
  onHover?: (id: string | null) => void;
  onSelect?: (id: string) => void;
}

export function SearchVenueCard({
  venue,
  isFavorite,
  isSelected,
  onToggleFavorite,
  onHover,
  onSelect,
}: SearchVenueCardProps) {
  return (
    <article
      id={`venue-card-${venue.id}`}
      onMouseEnter={() => onHover?.(venue.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onSelect?.(venue.id)}
      className={`group relative flex flex-col sm:flex-row bg-white rounded-2xl border transition-all duration-200 p-4 gap-4 sm:gap-5 ${
        isSelected
          ? "border-primary-600 shadow-md ring-1 ring-primary-600/30"
          : "border-neutral-200/90 hover:border-neutral-300 hover:shadow-md"
      }`}
    >
      {/* Colonne gauche : Photo avec favori et lien plus d'informations */}
      <div className="flex flex-col items-center sm:items-start shrink-0 w-full sm:w-56 md:w-60">
        <div className="relative aspect-4/3 sm:aspect-square w-full rounded-xl overflow-hidden bg-neutral-100">
          <Image
            src={venue.image}
            alt={venue.name}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-transparent transition-colors duration-200" />

          {/* Bouton favori */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(venue.id);
            }}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-neutral-600 hover:text-primary-600 shadow-2xs transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite
                  ? "fill-primary-600 text-primary-600"
                  : "text-neutral-600"
              }`}
            />
          </button>

          {/* Indicateur de badge discret */}
          {venue.badge && (
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 text-sm font-semibold text-neutral-900 shadow-2xs">
              {venue.badge}
            </span>
          )}
        </div>

        {/* Lien sous la photo style Planity */}
        <div className="w-full mt-2.5 text-center sm:text-left">
          <Link
            href={`/venue/${venue.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
          >
            <span>Plus d&apos;informations</span>
            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>

      {/* Colonne droite : En-tête, avis, créneaux disponibles et boutons d'action */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Titre et type de salon */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/venue/${venue.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-base sm:text-lg text-neutral-950 hover:text-primary-600 transition-colors block"
              >
                {venue.name}
              </Link>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">
                {venue.categoryLabel}
              </p>
            </div>
            <span className="text-sm font-bold text-neutral-900 num shrink-0">
              {venue.startingPrice}
            </span>
          </div>

          {/* Adresse avec icône */}
          <p className="text-sm text-neutral-600 flex items-center gap-1.5 mt-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{venue.address}</span>
          </p>

          {/* Note et avis */}
          <div className="flex items-center gap-2 mt-1.5 text-sm text-neutral-700">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="font-bold text-neutral-900 num">{venue.rating}</span>
            </div>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-500 font-normal num">
              ({venue.reviewCount} avis)
            </span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-500 font-medium">
              {venue.district || venue.city}
            </span>
          </div>

          {/* Disponibilités (signature Planity) */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100">
            {venue.slots ? (
              <div className="space-y-2">
                {/* Ligne Matin */}
                {venue.slots.morning && venue.slots.morning.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase font-bold text-neutral-500 tracking-wider w-20 shrink-0">
                      Matin
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {venue.slots.morning.map((slot, idx) => (
                        <Link
                          key={idx}
                          href={`/book/${venue.slug}?slot=${encodeURIComponent(slot)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg text-sm font-semibold border border-primary-300 text-primary-700 bg-primary-50/60 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                          {slot}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ligne Après-midi */}
                {venue.slots.afternoon && venue.slots.afternoon.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm uppercase font-bold text-neutral-500 tracking-wider w-20 shrink-0">
                      Après-midi
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {venue.slots.afternoon.map((slot, idx) => (
                        <Link
                          key={idx}
                          href={`/book/${venue.slug}?slot=${encodeURIComponent(slot)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 rounded-lg text-sm font-semibold border border-primary-300 text-primary-700 bg-primary-50/60 hover:bg-primary-600 hover:text-white transition-colors cursor-pointer shrink-0"
                        >
                          {slot}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Bloc Prochaine disponibilité */
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                <div className="text-sm leading-tight">
                  <span className="text-neutral-500 font-semibold uppercase tracking-wider block text-sm">
                    Prochaine disponibilité
                  </span>
                  <span className="font-semibold text-primary-700 text-sm">
                    {venue.nextAvailability || "Demain à 10h00"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action en bas à droite */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
          <Link
            href={`/book/${venue.slug}?gift=true`}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-outline text-sm px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold text-neutral-700 hover:text-neutral-950"
          >
            <Gift className="w-3.5 h-3.5 text-neutral-500" />
            <span>Offrir</span>
          </Link>

          <Link
            href={`/book/${venue.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="btn btn-dark text-sm px-4 py-1.5 rounded-xl font-semibold shadow-2xs"
          >
            Prendre RDV
          </Link>
        </div>
      </div>
    </article>
  );
}
