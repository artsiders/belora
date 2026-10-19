import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
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
    <section className="section bg-white border-b border-sand-200/80" aria-labelledby="gallery-heading">
      <div className="container-belora">
        {/* En-tête de section unifié */}
        <SectionHeader
          eyebrow="Portfolio"
          title={
            <>
              Le geste en image,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                résultats d’ateliers.
              </span>
            </>
          }
          subtitle="Parce que la beauté du geste se mesure à la finesse du détail : coupes vivantes, teints repulpés et finitions d’une précision sans compromis."
          id="gallery-heading"
        />

        {/* Mosaïque asymétrique moderne (1 grand visuel + 4 visuels secondaires) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Grand visuel vedette à gauche (7 colonnes) */}
          <div className="lg:col-span-7">
            <div className="group relative aspect-[4/3] sm:aspect-[16/11] lg:h-full w-full rounded-2xl overflow-hidden bg-sand-200 border border-sand-200/80 shadow-sm">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div
                className="absolute inset-0 bg-sand-950/20 group-hover:bg-sand-950/10 transition-colors"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 bg-sand-950/85 backdrop-blur-xs flex items-end justify-between gap-4 text-sand-50 border-t border-sand-50/10">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-primary-300 block mb-1">
                    {featured.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-sand-50 mb-1">
                    {featured.title}
                  </h3>
                  <p className="text-xs text-sand-200 font-normal">
                    Réalisé par {featured.salon} · {featured.city}
                  </p>
                </div>

                <Link
                  href="/search"
                  className="shrink-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label={`En savoir plus sur ${featured.title}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Grille de 4 visuels secondaires à droite (5 colonnes) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {rest.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-sand-200 border border-sand-200/80 shadow-2xs hover:shadow-md transition-all duration-300"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  className="absolute inset-0 bg-sand-950/20 group-hover:bg-sand-950/10 transition-colors"
                  aria-hidden="true"
                />

                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-sand-950/80 backdrop-blur-xs text-sand-50 border-t border-sand-50/10">
                  <span className="text-xs uppercase font-bold tracking-wider text-primary-300 block mb-0.5">
                    {item.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-sand-50 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-sand-300 font-normal mt-0.5 line-clamp-1">
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
