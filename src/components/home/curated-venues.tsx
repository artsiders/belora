import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowRight } from "lucide-react";

interface Venue {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  city: string;
  district: string;
  distance: string;
  rating: string;
  reviewCount: number;
  startingPrice: string;
  image: string;
}

const CURATED_VENUES: Venue[] = [
  {
    slug: "atelier-botanique-paris",
    name: "L’Atelier Botanique",
    category: "Haute Coiffure",
    tags: ["Coiffure", "Coloration", "Brushing"],
    city: "Paris",
    district: "Paris 3e (Marais)",
    distance: "1,2 km",
    rating: "4,9",
    reviewCount: 142,
    startingPrice: "dès 55 €",
    image: "/images/venues/atelier-botanique.jpg",
  },
  {
    slug: "maison-albar-soins",
    name: "Pure & Sens — Maison Albar",
    category: "Soin Visage & Spa",
    tags: ["Massage", "Soins visage", "Corps"],
    city: "Lyon",
    district: "Presqu’île",
    distance: "2,4 km",
    rating: "5,0",
    reviewCount: 96,
    startingPrice: "dès 80 €",
    image: "/images/venues/maison-albar.jpg",
  },
  {
    slug: "bain-de-vapeur-sequoia",
    name: "Nail & Glow Studio",
    category: "Onglerie & Beauté",
    tags: ["Manucure", "Pédicure", "Pose de vernis"],
    city: "Marseille",
    district: "Vieux-Port",
    distance: "3,1 km",
    rating: "4,8",
    reviewCount: 88,
    startingPrice: "dès 45 €",
    image: "/images/venues/studio-sequoia.jpg",
  },
  {
    slug: "barbier-saint-germain",
    name: "Le Salon Saint-Germain",
    category: "Barbier Traditionnel",
    tags: ["Barbe", "Coupe", "Soin vapeur"],
    city: "Bordeaux",
    district: "Triangle d’Or",
    distance: "1,8 km",
    rating: "4,9",
    reviewCount: 218,
    startingPrice: "dès 38 €",
    image: "/images/venues/salon-saint-germain.jpg",
  },
];

export function CuratedVenues() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-sand-200/80" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* En-tête avec titre et lien "Voir tous les salons" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2
              id="venues-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl text-sand-950 mb-1"
            >
              Nos salons populaires près de chez vous
            </h2>
            <p className="text-xs sm:text-sm text-sand-500 font-normal">
              Une sélection d’adresses indépendantes auditées pour l’excellence de leurs praticiens.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-sand-700 hover:text-primary-600 transition-colors shrink-0"
          >
            <span>Voir tous les salons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grille des cartes salons inspirée de la référence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_VENUES.map((venue) => (
            <div
              key={venue.slug}
              className="group flex flex-col bg-white rounded-2xl border border-sand-200/80 p-3.5 shadow-2xs hover:shadow-md hover:border-sand-300 transition-all duration-300"
            >
              {/* Photo avec coins arrondis, pastille de note et favori */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-sand-200 mb-3.5">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />

                {/* Bouton favori cœur discret */}
                <button
                  type="button"
                  aria-label={`Ajouter ${venue.name} aux favoris`}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-sand-950/40 hover:bg-sand-950/70 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4" />
                </button>

                {/* Pastille de note en bas à gauche de la photo */}
                <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-sand-900 num flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-primary-600 text-primary-600" />
                  <span>
                    {venue.rating} ({venue.reviewCount})
                  </span>
                </div>
              </div>

              {/* Titre et détails de l'établissement */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl text-sand-950 group-hover:text-primary-600 transition-colors mb-1">
                    {venue.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-sand-500 mb-3">
                    <MapPin className="w-3 h-3 text-sand-400 shrink-0" />
                    <span>
                      {venue.district} · {venue.distance}
                    </span>
                  </div>

                  {/* Badges / Chips de prestations */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {venue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-sand-100 text-[10px] text-sand-700 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Lien d'action "Voir les prestations →" */}
                <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
                  <Link
                    href={`/venue/${venue.slug}`}
                    className="text-xs font-semibold text-primary-700 group-hover:text-primary-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Voir les prestations</span>
                    <span>→</span>
                  </Link>

                  <span className="text-[11px] font-semibold text-sand-600 num">
                    {venue.startingPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
