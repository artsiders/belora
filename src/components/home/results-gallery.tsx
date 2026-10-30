import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowRight } from "lucide-react";
import { GalleryCard } from "@/components/cards";

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
    <section className="section bg-white border-b border-primary-200/80" aria-labelledby="gallery-heading">
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-700 hover:text-primary-600 transition-colors"
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
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
