import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowRight, MapPin, Quote } from "lucide-react";

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
    city: "Paris Marais",
    quote: "La coloration végétale sublime le cheveu en respectant sa matière vivante.",
    experience: "14 ans de métier",
    image: "/images/artisans/artisan-helene.jpg",
    venueSlug: "atelier-botanique-paris",
  },
  {
    id: "marc",
    name: "Marc Sémard",
    role: "Maître Barbier Traditionnel",
    salon: "Le Salon Saint-Germain",
    city: "Bordeaux",
    quote: "Un rasage d’époque exige le geste calme du coupe-choux et une écoute totale.",
    experience: "18 ans de métier",
    image: "/images/artisans/artisan-marc.jpg",
    venueSlug: "barbier-saint-germain",
  },
  {
    id: "nour",
    name: "Nour Kaddour",
    role: "Praticienne Facialiste & Kobido",
    salon: "Maison Albar Institut",
    city: "Lyon",
    quote: "Le rituel Kobido délie chaque tension et réveille la lumière du teint.",
    experience: "11 ans de métier",
    image: "/images/artisans/artisan-nour.jpg",
    venueSlug: "maison-albar-soins",
  },
];

export function ArtisanSpotlight() {
  return (
    <section className="section bg-white border-b border-sand-200/80" aria-labelledby="artisans-heading">
      <div className="container-belora">
        {/* En-tête de section unifié et épuré */}
        <SectionHeader
          eyebrow="Artisans"
          title={
            <>
              Rencontrez les artisans,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                passionnés du geste.
              </span>
            </>
          }
          subtitle="Des praticiens indépendants reconnus pour leur savoir-faire et leur exigence."
          id="artisans-heading"
        />

        {/* 3 Cartes Artisans pixel-perfect, sans débordement ni badges coupés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="group flex flex-col justify-between bg-white arch-t border border-sand-200/80 p-4 shadow-2xs hover:shadow-md hover:border-sand-300 transition-all duration-300"
            >
              <div>
                {/* Photographie portrait avec arche douce élégante */}
                <div className="relative aspect-[4/5] w-full arch-t rounded-b-xl overflow-hidden bg-sand-100 mb-4">
                  <Image
                    src={artisan.image}
                    alt={`Portrait de ${artisan.name}, ${artisan.role}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />

                  {/* Pastille expérience sécurisée en bas à droite (aucun risque de rognage par l'arche) */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-sand-900 text-xs font-semibold num shadow-xs">
                    {artisan.experience}
                  </div>
                </div>

                {/* Identité typographique propre et parfaitement alignée */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-sand-950">
                    {artisan.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary-600">
                    {artisan.role}
                  </p>
                  <p className="text-xs text-sand-500 flex items-center gap-1.5 pb-3 border-b border-sand-100">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span>{artisan.salon} · {artisan.city}</span>
                  </p>
                </div>

                {/* Citation courte et percutante */}
                <div className="pt-3">
                  <Quote className="w-4 h-4 text-primary-500 mb-1 opacity-70" />
                  <p className="text-xs text-sand-700 font-normal leading-relaxed">
                    « {artisan.quote} »
                  </p>
                </div>
              </div>

              {/* Bouton d'action concis, ne débordera jamais */}
              <div className="pt-4 mt-5 border-t border-sand-100">
                <Link
                  href={`/venue/${artisan.venueSlug}`}
                  className="w-full btn btn-outline btn-sm flex items-center justify-center gap-2 rounded-xl text-xs font-semibold tracking-wider uppercase"
                >
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
