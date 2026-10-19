import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowUpRight, MapPin, Quote } from "lucide-react";

interface Artisan {
  id: string;
  name: string;
  role: string;
  salon: string;
  city: string;
  quote: string;
  experience: string;
  image: string;
  venueSlug: string;
}

const ARTISANS: Artisan[] = [
  {
    id: "helene",
    name: "Hélène de Valois",
    role: "Artisan Coloriste & Fondatrice",
    salon: "L’Atelier Botanique",
    city: "Paris (Le Marais)",
    quote:
      "La coloration végétale n’est pas un compromis, c’est l’alchimie suprême qui sublime le cheveu en respectant sa matière vivante.",
    experience: "14 ans de métier",
    image: "/images/artisans/artisan-helene.jpg",
    venueSlug: "atelier-botanique-paris",
  },
  {
    id: "marc",
    name: "Marc Sémard",
    role: "Maître Barbier Traditionnel",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux (Triangle d’Or)",
    quote:
      "Un rasage d’époque exige le geste calme du coupe-choux, la chaleur enveloppante de la serviette et une écoute totale de l’homme.",
    experience: "18 ans de métier",
    image: "/images/artisans/artisan-marc.jpg",
    venueSlug: "barbier-saint-germain",
  },
  {
    id: "nour",
    name: "Nour Kaddour",
    role: "Praticienne Facialiste & Kobido",
    salon: "Maison Albar Institut",
    city: "Lyon (Presqu’île)",
    quote:
      "Le visage conserve la mémoire de nos rythmes. Un massage Kobido bien conduit délie chaque tension et réveille la lumière du teint.",
    experience: "11 ans de métier",
    image: "/images/artisans/artisan-nour.jpg",
    venueSlug: "maison-albar-soins",
  },
];

export function ArtisanSpotlight() {
  return (
    <section className="section bg-sand-100" aria-labelledby="artisans-heading">
      <div className="container-belora">
        {/* En-tête de section unifié */}
        <SectionHeader
          eyebrow="Artisans"
          title={
            <>
              Rencontrez les artisans,{" "}
              <span className="font-display italic block sm:inline">
                passionnés du geste.
              </span>
            </>
          }
          subtitle="Derrière chaque adresse sélectionnée, découvrez des praticiens investis et reconnus pour leur savoir-faire."
          id="artisans-heading"
        />

        {/* 3 Cartes Artisans détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="group flex flex-col bg-sand-50 rounded-[var(--radius-sm)] border border-sand-300/80 overflow-hidden shadow-2xs hover:shadow-md hover:border-sand-400 transition-all duration-300"
            >
              {/* Photographie portrait avec badge de spécialité */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand-200">
                <Image
                  src={artisan.image}
                  alt={`Portrait de ${artisan.name}, ${artisan.role}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badge rôle flottant */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-[var(--radius-xs)] bg-sand-950/80 backdrop-blur-xs text-sand-50 text-[10px] font-semibold tracking-wider uppercase">
                  {artisan.role}
                </div>

                {/* Badge expérience */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-[var(--radius-xs)] bg-sand-50/90 backdrop-blur-xs text-sand-900 text-[11px] font-semibold num shadow-2xs">
                  {artisan.experience}
                </div>
              </div>

              {/* Contenu éditorial & Citation */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-2xl text-sand-950 mb-1">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-sand-600 flex items-center gap-1.5 mb-4">
                    <span className="font-medium text-sand-900">{artisan.salon}</span>
                    <span className="text-sand-400">•</span>
                    <span className="flex items-center gap-1 text-sand-500">
                      <MapPin className="w-3 h-3 text-sand-400" />
                      {artisan.city}
                    </span>
                  </p>

                  <div className="relative pt-3 border-t border-sand-200/80">
                    <Quote className="w-4 h-4 text-primary-300 mb-1 opacity-70" />
                    <p className="text-xs text-sand-700 font-normal leading-relaxed">
                      « {artisan.quote} »
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-sand-200/80">
                  <Link
                    href={`/venue/${artisan.venueSlug}`}
                    className="w-full btn btn-outline btn-sm flex items-center justify-between"
                  >
                    <span>Voir les créneaux chez {artisan.salon}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
