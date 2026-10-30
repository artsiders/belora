import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface GalleryCardData {
  id: string;
  title: string;
  category: string;
  salon: string;
  city: string;
  image: string;
  slug: string;
}

export interface GalleryCardProps {
  item: GalleryCardData;
}

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <Link
      href={`/venue/${item.slug}`}
      className="group flex flex-col bg-white border border-neutral-200/90 hover:border-neutral-300 p-3 rounded-3xl pt-0 shadow-2xs hover:shadow-md transition-all duration-300 focus:outline-none cursor-pointer h-full"
    >
      {/* Photographie avec arche douce */}
      <div className="relative aspect-4/5 w-full rounded-b-2xl overflow-hidden bg-neutral-100 mb-3.5">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {/* Pastille de catégorie en bas de l'image */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-neutral-900 shadow-xs">
          {item.category}
        </div>
      </div>

      {/* Informations textuelles */}
      <div className="flex flex-col flex-1 justify-between p-1 pt-0">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-primary-600 transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 font-normal">
            {item.salon} · {item.city}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs sm:text-sm text-primary-700 font-semibold group-hover:text-primary-800 transition-colors">
          <span>Découvrir la maison</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
