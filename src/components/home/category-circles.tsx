import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryCircle {
  id: string;
  label: string;
  count: string;
  href: string;
  image: string;
}

const CATEGORIES: CategoryCircle[] = [
  {
    id: "hair",
    label: "Coiffure d’auteur",
    count: "420+ salons",
    href: "/search?category=hair",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "facial",
    label: "Soins Visage",
    count: "310+ instituts",
    href: "/search?category=facial",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "massage",
    label: "Massages & Spas",
    count: "195+ havres",
    href: "/search?category=massage",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "barber",
    label: "Barbiers & Homme",
    count: "180+ ateliers",
    href: "/search?category=barber",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "nails",
    label: "Onglerie de soin",
    count: "140+ studios",
    href: "/search?category=nails",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "wellness",
    label: "Rituels & Bains",
    count: "85+ sanctuaires",
    href: "/search?category=massage",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
  },
];

export function CategoryCircles() {
  return (
    <section className="section bg-sand-50/70 border-b border-sand-200/80" aria-labelledby="categories-heading">
      <div className="container-belora">
        {/* En-tête typographique éditorial à double nuance */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-5 border-b border-sand-200/80">
          <div>
            <p className="eyebrow mb-2">Univers & Spécialités</p>
            <h2 id="categories-heading" className="display-md text-sand-950">
              Explorer par univers{" "}
              <span className="font-display italic text-primary-600">de soin</span>
            </h2>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sand-700 hover:text-primary-600 transition-colors"
          >
            <span>Toutes les catégories</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
        </div>

        {/* Grille de vignettes circulaires & arches photographiques */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {CATEGORIES.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              {/* Cercle photographique avec fine bordure et zoom fluide au hover */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-sand-300 group-hover:border-primary-600 transition-all duration-300 p-1 mb-3.5 shadow-2xs group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-sand-200">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 bg-sand-950/15 group-hover:bg-sand-950/0 transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Titre & Compteur d'adresses */}
              <h3 className="text-xs sm:text-sm font-semibold text-sand-900 group-hover:text-primary-600 transition-colors tracking-tight">
                {item.label}
              </h3>
              <span className="text-[11px] text-sand-500 font-normal mt-0.5 num">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
