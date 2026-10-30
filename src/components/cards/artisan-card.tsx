import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export interface ArtisanCardData {
  id: string;
  name: string;
  role: string;
  salon: string;
  city: string;
  image: string;
  venueSlug: string;
}

export interface ArtisanCardProps {
  artisan: ArtisanCardData;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Link
      href={`/venue/${artisan.venueSlug}`}
      className="group w-64 sm:w-72 shrink-0 snap-start flex flex-col justify-between bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-neutral-300 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Photographie portrait de l'artisan */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
        <Image
          src={artisan.image}
          alt={`Portrait de ${artisan.name}, ${artisan.role}`}
          fill
          sizes="(max-width: 640px) 260px, 280px"
          className="object-cover"
        />
      </div>

      {/* Détails et coordonnées */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 mb-1">
            {artisan.role}
          </p>
          <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-primary-600 transition-colors">
            {artisan.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>
              {artisan.salon} · {artisan.city}
            </span>
          </p>
        </div>

        {/* CTA en bas de carte */}
        <div className="pt-3 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm text-primary-700 font-semibold group-hover:text-primary-800 transition-colors">
          <span>Prendre rendez-vous</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
