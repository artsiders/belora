import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VenueCard, VenueCardData } from "@/components/cards";

const CURATED_VENUES: VenueCardData[] = [
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
    name: "Pure & Sens - Maison Albar",
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
    <section className="py-14 sm:py-20 bg-white border-b border-primary-200/80" aria-labelledby="venues-heading">
      <div className="container-belora">
        {/* En-tête avec titre et lien vers la recherche */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <h2
              id="venues-heading"
              className="text-2xl sm:text-3xl font-bold text-neutral-950 mb-1"
            >
              Nos salons populaires près de chez vous
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 font-normal">
              Une sélection d’adresses indépendantes auditées pour l’excellence de leurs praticiens.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-700 hover:text-primary-600 transition-colors shrink-0"
          >
            <span>Voir tous les salons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille des cartes salons : chaque carte est entièrement cliquable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_VENUES.map((venue) => (
            <VenueCard key={venue.slug} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  );
}
