import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VENUES, Venue } from "@/lib/data/venues";
import { CategoryData } from "@/lib/data/categories";
import { VenueCard } from "@/components/cards";

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
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}
