import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  salon: string;
  city: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Balayage miel & reflets dorés",
    category: "Coiffure végétale",
    salon: "L’Atelier Botanique",
    city: "Paris Marais",
    image: "/images/gallery/gallery-hair.jpg",
  },
  {
    id: "g2",
    title: "Éclat cutané après rituel Kobido",
    category: "Facialisme holistique",
    salon: "Maison Albar Institut",
    city: "Lyon",
    image: "/images/gallery/gallery-facial.jpg",
  },
  {
    id: "g3",
    title: "Manucure japonaise sur ongles naturels",
    category: "Soin des mains",
    salon: "L’Écrin Onglerie",
    city: "Paris 6e",
    image: "/images/gallery/gallery-nails.jpg",
  },
  {
    id: "g4",
    title: "Taille de barbe millimétrée au coupe-choux",
    category: "Barbier d'époque",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux",
    image: "/images/gallery/gallery-barber.jpg",
  },
  {
    id: "g5",
    title: "Détente musculaire & huiles pressées à froid",
    category: "Massages & Spas",
    salon: "Studio Séquoia",
    city: "Marseille",
    image: "/images/gallery/gallery-massage.jpg",
  },
];

export function ResultsGallery() {
  const [featured, ...rest] = GALLERY_ITEMS;

  return (
    <section className="section bg-sand-50 border-b border-sand-200/80" aria-labelledby="gallery-heading">
      <div className="container-belora">
        {/* En-tête typographique */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-5 border-b border-sand-200/80">
          <div className="max-w-xl">
            <p className="eyebrow mb-2">Portfolio & Précision</p>
            <h2 id="gallery-heading" className="display-lg text-sand-950 text-balance">
              Le geste en image,{" "}
              <span className="font-display italic text-primary-600 block sm:inline">
                résultats d’ateliers.
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-sand-600 max-w-sm leading-relaxed">
            Parce que la beauté du geste se mesure à la finesse du détail : coupes
            vivantes, teints repulpés et finitions d’une précision sans compromis.
          </p>
        </div>

        {/* Mosaïque asymétrique moderne (1 grand visuel + 4 visuels secondaires) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Grand visuel vedette à gauche (7 colonnes) */}
          <div className="lg:col-span-7">
            <div className="group relative aspect-[4/3] sm:aspect-[16/11] lg:h-full w-full rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300 shadow-sm">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div
                className="absolute inset-0 bg-gradient-to-t from-sand-950/80 via-sand-950/20 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-sand-50">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary-300 block mb-1">
                    {featured.category}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-sand-50 mb-1">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-sand-200">
                    Réalisé par {featured.salon} · {featured.city}
                  </p>
                </div>

                <Link
                  href="/search?category=hair"
                  className="w-10 h-10 rounded-full bg-sand-50/90 text-sand-900 group-hover:bg-primary-600 group-hover:text-sand-50 flex items-center justify-center shrink-0 transition-colors shadow-md"
                  aria-label="Voir les soins de coiffure"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Grille de 4 visuels secondaires à droite (5 colonnes) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {rest.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-[var(--radius-sm)] overflow-hidden bg-sand-200 border border-sand-300 shadow-2xs"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-sand-950/85 via-sand-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"
                  aria-hidden="true"
                />

                <div className="absolute bottom-3 left-3 right-3 text-sand-50">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-primary-300 block">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-semibold text-sand-50 line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-sand-300 mt-0.5 truncate">
                    {item.salon}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
