import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface Venue {
  slug: string;
  name: string;
  specialty: string;
  badge: string;
  city: string;
  district: string;
  rating: string;
  reviewCount: number;
  startingPrice: string;
  image: string;
}

const CURATED_VENUES: Venue[] = [
  {
    slug: "atelier-botanique-paris",
    name: "L’Atelier Botanique",
    specialty: "Coiffure végétale, coupe à sec & balayage minéral",
    badge: "Maison d’artisan",
    city: "Paris",
    district: "Le Marais (3e)",
    rating: "4,9",
    reviewCount: 142,
    startingPrice: "dès 55 €",
    image: "/images/venues/atelier-botanique.jpg",
  },
  {
    slug: "maison-albar-soins",
    name: "Maison Albar Institut",
    specialty: "Soin visage holistique, diagnostic & Kobido",
    badge: "Signature",
    city: "Lyon",
    district: "Presqu’île",
    rating: "5,0",
    reviewCount: 96,
    startingPrice: "dès 80 €",
    image: "/images/venues/maison-albar.jpg",
  },
  {
    slug: "barbier-saint-germain",
    name: "Le Salon Saint-Germain",
    specialty: "Taille de barbe traditionnelle & serviette chaude",
    badge: "Atelier Barbier",
    city: "Bordeaux",
    district: "Triangle d’Or",
    rating: "4,9",
    reviewCount: 218,
    startingPrice: "dès 38 €",
    image: "/images/venues/salon-saint-germain.jpg",
  },
  {
    slug: "bain-de-vapeur-sequoia",
    name: "Studio Séquoia",
    specialty: "Massage relaxant & rituel corporel aux huiles",
    badge: "Espace Spa",
    city: "Marseille",
    district: "Vieux-Port",
    rating: "4,8",
    reviewCount: 88,
    startingPrice: "dès 75 €",
    image: "/images/venues/studio-sequoia.jpg",
  },
];

export function CuratedVenues() {
  return (
    <section className="section bg-sand-100" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* En-tête typographique */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-5 border-b border-sand-200/80">
          <div>
            <p className="eyebrow mb-2">Sélection Rigoureuse</p>
            <h2 id="venues-heading" className="display-md text-sand-950">
              Maisons & ateliers{" "}
              <span className="font-display italic text-primary-600">recommandés</span>
            </h2>
          </div>
          <Link
            href="/search?filter=curated"
            className="btn btn-outline btn-sm self-start sm:self-auto"
          >
            <span>Voir toute la sélection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grille des 4 établissements audités */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {CURATED_VENUES.map((venue) => (
            <Link
              key={venue.slug}
              href={`/venue/${venue.slug}`}
              className="group flex flex-col bg-sand-50 rounded-[var(--radius-sm)] border border-sand-300/80 overflow-hidden hover:border-sand-400 shadow-2xs hover:shadow-md transition-all duration-300"
            >
              {/* Photographie de façade/intérieur avec étiquette */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-200">
                <Image
                  src={venue.image}
                  alt={`Intérieur de ${venue.name}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Étiquette d'artisan */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-sand-950/75 text-sand-50 text-[10px] tracking-wider uppercase font-semibold backdrop-blur-xs">
                  {venue.badge}
                </span>

                {/* Note moyenne en haut à droite */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-[var(--radius-xs)] bg-sand-50/90 backdrop-blur-xs text-[11px] font-semibold text-sand-900 num flex items-center gap-1 shadow-2xs">
                  <Star className="w-3 h-3 fill-primary-600 text-primary-600" />
                  <span>{venue.rating}</span>
                </div>
              </div>

              {/* Métadonnées de l'établissement */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-sand-500 mb-1">
                    <MapPin className="w-3 h-3 text-sand-400" />
                    <span>
                      {venue.district}, {venue.city}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-sand-950 group-hover:text-primary-600 transition-colors mb-2 leading-snug">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed mb-4">
                    {venue.specialty}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-sand-200/80 flex items-center justify-between text-xs">
                  <span className="text-sand-500 font-normal">
                    {venue.reviewCount} avis certifiés
                  </span>
                  <span className="font-semibold text-sand-950 num">
                    {venue.startingPrice}
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
