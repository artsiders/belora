import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";
import { VENUES, Venue } from "@/lib/data/venues";
import { CategoryData } from "@/lib/data/categories";

interface CategoryVenuesPreviewProps {
  category: CategoryData;
}

export function CategoryVenuesPreview({ category }: CategoryVenuesPreviewProps) {
  // Trouver les salons qui correspondent à cette catégorie
  const matchingVenues = VENUES.filter(
    (v: Venue) => v.category === category.slug || v.category === category.id
  );

  const displayVenues = matchingVenues.length > 0 ? matchingVenues.slice(0, 4) : VENUES.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-primary-200/80" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* En-tête de section avec titre harmonisé et mots en text-primary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="eyebrow text-sand-500 font-semibold block mb-1.5">
              Sélection d&apos;exception
            </span>
            <h2 id="venues-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950">
              Nos havres recommandés,{" "}
              <span className="text-primary-600 font-bold">
                l&apos;artisanat du geste.
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-sand-600 font-normal">
              Une sélection d&apos;adresses indépendantes auditées pour l&apos;excellence technique et l&apos;accueil attentionné de leurs praticiens.
            </p>
          </div>

          <Link
            href={`/search?category=${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-sand-700 hover:text-primary-600 transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Voir tous les salons ({matchingVenues.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille des cartes salons inspirée directement de CuratedVenues sur la Home */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayVenues.map((venue: Venue) => (
            <Link
              key={venue.id}
              href={`/venue/${venue.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-primary-200/80 shadow-2xs hover:shadow-md hover:border-primary-300 transition-all duration-300 overflow-hidden"
            >
              {/* Photo avec coins arrondis, pastille de note et favori */}
              <div className="relative aspect-4/3 w-full bg-sand-200">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-300"
                />
                {/* Note en haut à gauche */}
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-2xs text-xs font-bold text-sand-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{venue.rating}</span>
                  <span className="text-sand-400 font-normal">({venue.reviewCount})</span>
                </div>

                {/* Bouton favori visuel en haut à droite */}
                <div
                  aria-hidden="true"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-sand-700 hover:text-primary-600 transition-colors shadow-2xs"
                >
                  <Heart className="w-4 h-4" />
                </div>

                {/* Badge de prix en bas à droite */}
                <div className="absolute bottom-3 right-3 bg-sand-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md num shadow-2xs">
                  dès {venue.startingPrice}
                </div>
              </div>

              {/* Contenu textuel */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                    {venue.categoryLabel}
                  </span>

                  <h3 className="text-base font-bold text-sand-950 group-hover:text-primary-600 transition-colors mt-1">
                    {venue.name}
                  </h3>

                  <p className="text-xs text-sand-600 line-clamp-2 mt-1 leading-relaxed">
                    {venue.tagline}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-sand-500 mt-2.5">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span className="truncate">{venue.district || venue.city}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Réserver un créneau &rarr;
                  </span>
                  <span className="text-sand-400 font-medium">{venue.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
