import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";
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

  // Si pas assez de salons directs, on prend les plus renommés
  const displayVenues = matchingVenues.length > 0 ? matchingVenues.slice(0, 3) : VENUES.slice(0, 3);

  return (
    <section className="section bg-sand-50/50 border-b border-primary-200/80" aria-labelledby="curated-venues-heading">
      <div className="container-belora">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-primary-200/80">
          <div>
            <span className="eyebrow text-primary-700 font-semibold block mb-1">
              Sélection Belora
            </span>
            <h2 id="curated-venues-heading" className="text-2xl sm:text-3xl font-bold text-sand-950">
              Havres & salons certifiés en {category.name}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-sand-600">
              Des établissements audités pour leur savoir-faire artisanal et leur hospitalité attentive.
            </p>
          </div>

          <Link
            href={`/search?category=${category.slug}`}
            className="btn-outline px-4 py-2 rounded-xl text-xs font-semibold shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Voir tous les résultats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVenues.map((venue: Venue) => (
            <Link
              key={venue.id}
              href={`/venue/${venue.slug}`}
              className="group flex flex-col rounded-2xl border border-neutral-200/80 bg-white overflow-hidden hover:border-primary-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Image principale */}
              <div className="relative w-full aspect-16/10 overflow-hidden bg-sand-100">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-xs font-semibold text-sand-900 shadow-2xs">
                  {venue.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-sand-950/80 backdrop-blur-xs text-xs font-semibold text-white num">
                  À partir de {venue.startingPrice}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-primary-700 tracking-wide uppercase">
                      {venue.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-sand-900">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                      <span className="text-sand-400 font-normal">({venue.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-sand-950 mt-1.5 group-hover:text-primary-700 transition-colors">
                    {venue.name}
                  </h3>

                  <p className="text-xs text-sand-600 line-clamp-2 mt-1 leading-relaxed">
                    {venue.tagline}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-sand-500 mt-2.5">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span className="truncate">{venue.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-sand-500">
                    {venue.city}
                  </span>
                  <span className="text-xs font-semibold text-primary-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Réserver un créneau &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
