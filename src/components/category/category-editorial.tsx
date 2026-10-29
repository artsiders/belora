import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryData, FrequentSearch } from "@/lib/data/categories";

interface CategoryEditorialProps {
  category: CategoryData;
}

export function CategoryEditorial({ category }: CategoryEditorialProps) {
  const { story, frequentSearches } = category;

  return (
    <section className="section bg-white border-b border-primary-200/80" aria-labelledby="editorial-story-heading">
      <div className="container-belora">
        {/* 1. Bloc Récit & Tendance (Style Planity élevé à la DA Belora) */}
        <div className="max-w-3xl mb-12">
          <h2 id="editorial-story-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 tracking-tight mb-4">
            {story.title}
          </h2>
          <p className="text-base sm:text-lg font-medium text-sand-800 leading-relaxed mb-6">
            {story.lead}
          </p>
          <div className="space-y-4 text-xs sm:text-sm text-sand-600 leading-relaxed">
            {story.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* 2. Visuel éditorial pleine largeur élégant */}
        <div className="relative w-full max-w-4xl mx-auto aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden border border-neutral-200/80 mb-14 bg-sand-100">
          <Image
            src={story.image}
            alt={story.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />
          {story.caption && (
            <div className="absolute bottom-3 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
              {story.caption}
            </div>
          )}
        </div>

        {/* 3. Recherches fréquentes (Exactement comme sur Planity) */}
        <div className="max-w-4xl mx-auto pt-6 border-t border-neutral-200/80">
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-sand-950">
              Recherches fréquentes en {category.shortName.toLowerCase()}
            </h3>
            <p className="text-xs text-sand-500 mt-1">
              Les prestations et techniques les plus sollicitées par nos membres.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
            {/* Colonne 1 */}
            <div className="flex flex-col space-y-2.5">
              {frequentSearches.col1.map((item: FrequentSearch, i: number) => (
                <Link
                  key={i}
                  href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                  className="group flex items-center justify-between py-1.5 border-b border-neutral-100 text-xs sm:text-sm text-sand-800 hover:text-primary-700 font-medium transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-700 transition-colors" />
                </Link>
              ))}
            </div>

            {/* Colonne 2 */}
            <div className="flex flex-col space-y-2.5">
              {frequentSearches.col2.map((item: FrequentSearch, i: number) => (
                <Link
                  key={i}
                  href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                  className="group flex items-center justify-between py-1.5 border-b border-neutral-100 text-xs sm:text-sm text-sand-800 hover:text-primary-700 font-medium transition-colors"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {item.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-700 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
