import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CityCardData {
  id?: string;
  name: string;
  country?: string;
  count: string;
  image?: string;
  href?: string;
}

export interface CityCardProps {
  city: CityCardData;
  categorySlug?: string;
  categoryShortName?: string;
}

export function CityCard({ city, categorySlug, categoryShortName }: CityCardProps) {
  const targetHref =
    city.href ||
    (categorySlug
      ? `/search?category=${categorySlug}&location=${encodeURIComponent(city.name)}`
      : `/search?location=${encodeURIComponent(city.name)}`);

  // Variante avec photographie si l'image est fournie (ex: category-cities)
  if (city.image) {
    return (
      <Link
        href={targetHref}
        className="group flex flex-col bg-white rounded-3xl border border-neutral-200/90 hover:border-neutral-300 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer h-full"
      >
        {/* Photographie de la métropole avec zoom au survol */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-neutral-100">
          <Image
            src={city.image}
            alt={categoryShortName ? `${categoryShortName} à ${city.name}` : `Salons à ${city.name}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/15 group-hover:bg-transparent transition-colors duration-300" />

          {city.country && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-xs font-semibold text-neutral-900 shadow-2xs">
              {city.country}
            </span>
          )}

          <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-900 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Détails textuels sous la photo */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-primary-600 transition-colors">
              {categoryShortName ? `${categoryShortName} ${city.name}` : city.name}
            </h3>
            <span className="text-xs text-neutral-500 num block mt-0.5">
              {city.count}
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>
      </Link>
    );
  }

  // Variante compacte sans photo (ex: city-directory)
  return (
    <Link
      href={targetHref}
      className="p-3.5 rounded-2xl border border-neutral-200/90 bg-white hover:border-neutral-300 hover:shadow-xs transition-all text-neutral-900 font-medium flex items-center justify-between group cursor-pointer"
    >
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-neutral-950 group-hover:text-primary-600 transition-colors">
          {city.name}
        </span>
        <span className="text-xs text-neutral-500 num mt-0.5">
          {city.count}
        </span>
      </div>
      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
    </Link>
  );
}
