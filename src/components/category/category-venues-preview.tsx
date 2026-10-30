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
    <section className="py-10 sm:py-14 bg-white border-b border-primary-200/80" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* En-tête de section avec titre harmonisé et mots en text-primary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9">
          <div>
            <span className="eyebrow text-neutral-500 font-semibold block mb-1">
              Sélection d&apos;exception
            </span>
            <h2 id="venues-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950">
              Nos havres recommandés,{" "}
              <span className="text-primary-600 font-bold">
                l&apos;artisanat du geste.
              </span>
            </h2>
            <p className="mt-1 text-sm sm:text-base text-neutral-600 font-normal">
              Adresses indépendantes auditées pour l&apos;excellence de leurs artisans.
            </p>
          </div>

          <Link
            href={`/search?category=${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-700 hover:text-primary-600 transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Voir tous les salons ({matchingVenues.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille des salons épurée et photo-first : pas de sur-encadrement, l'image respire */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayVenues.map((venue: Venue) => (
            <Link
              key={venue.id}
              href={`/venue/${venue.slug}`}
              className="group flex flex-col"
            >
              {/* Photo pleine largeur de la colonne avec coins arrondis et badges flottants discrets */}
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

                {/* Bouton favori visuel en haut à droite */}
                <div
                  aria-hidden="true"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 group-hover:text-primary-600 transition-colors shadow-2xs"
                >
                  <Heart className="w-4 h-4" />
                </div>

                {/* Badge de prix en bas à droite */}
                <div className="absolute bottom-3 right-3 bg-neutral-950/85 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md num shadow-2xs">
                  dès {venue.startingPrice}
                </div>
              </div>

              {/* Contenu textuel sans padding encadré, aligné au millimètre avec la photo */}
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
                  {venue.name}
                </h3>

                <p className="text-xs text-neutral-600 line-clamp-1 mt-1 font-normal leading-relaxed">
                  {venue.tagline}
                </p>

                <div className="mt-3 flex items-center text-xs font-semibold text-primary-700 group-hover:text-primary-900 transition-colors">
                  <span>Réserver un créneau</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
