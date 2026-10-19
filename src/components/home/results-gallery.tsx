import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  salon: string;
  city: string;
  image: string;
  slug: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Balayage miel & reflets dorés",
    category: "Coiffure végétale",
    salon: "L’Atelier Botanique",
    city: "Paris Marais",
    image: "/images/gallery/gallery-hair.jpg",
    slug: "atelier-botanique-paris",
  },
  {
    id: "g2",
    title: "Soin éclat & rituel Kobido",
    category: "Facialisme holistique",
    salon: "Maison Albar Institut",
    city: "Lyon",
    image: "/images/gallery/gallery-facial.jpg",
    slug: "maison-albar-soins",
  },
  {
    id: "g3",
    title: "Manucure sur ongles naturels",
    category: "Soin des mains",
    salon: "Studio Séquoia",
    city: "Marseille",
    image: "/images/gallery/gallery-nails.jpg",
    slug: "bain-de-vapeur-sequoia",
  },
  {
    id: "g4",
    title: "Taille de barbe au coupe-choux",
    category: "Barbier d’époque",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux",
    image: "/images/gallery/gallery-barber.jpg",
    slug: "barbier-saint-germain",
  },
];

export function ResultsGallery() {
  return (
    <section className="section bg-white border-b border-sand-200/80" aria-labelledby="gallery-heading">
      <div className="container-belora">
        {/* En-tête de section unifié et épuré */}
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
          subtitle="Des matières vivantes sublimées et des finitions soignées par nos artisans partenaires."
          action={
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-sand-700 hover:text-primary-600 transition-colors"
            >
              <span>Explorer les soins</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          }
          id="gallery-heading"
        />

        {/* Grille de 4 réalisations en arches : aérée, sans blocs noirs superposés ni textes tronqués */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/venue/${item.slug}`}
              className="group flex flex-col bg-white rounded-2xl border border-sand-200/80 p-3.5 shadow-2xs hover:shadow-md hover:border-sand-300 transition-all duration-300 focus:outline-none"
            >
              {/* Photographie avec arche douce supérieure (écho à la nouvelle DA) */}
              <div className="relative aspect-[4/5] w-full rounded-t-[72px] rounded-b-xl overflow-hidden bg-sand-100 mb-3.5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />

                {/* Pastille discrète de catégorie en haut de l'image */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-sand-900 shadow-xs">
                  {item.category}
                </div>
              </div>

              {/* Informations textuelles lisibles en dessous, sans rognage */}
              <div className="flex flex-col flex-1 justify-between pt-1">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-sand-950 group-hover:text-primary-600 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-sand-500 mt-1 font-normal">
                    {item.salon} · {item.city}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-sand-100 flex items-center justify-between text-xs text-primary-700 font-semibold group-hover:text-primary-800 transition-colors">
                  <span>Découvrir la maison</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
