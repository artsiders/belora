import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryData, FrequentSearch, SanctuaryPillar } from "@/lib/data/categories";

interface CategoryEditorialProps {
  category: CategoryData;
}

export function CategoryEditorial({ category }: CategoryEditorialProps) {
  const { story, frequentSearches, pillars } = category;

  // Découper le titre en préfixe et highlight
  const titleParts = story.title.split(",");
  const prefixTitle = titleParts[0] || story.title;
  const highlightTitle = titleParts.slice(1).join(",").trim() || "l'exigence du geste.";

  return (
    <>
      {/* 1. Section Récit Éditorial & Philosophie inspirée de PhilosophySection & SanctuaryExperience */}
      <section className="py-12 sm:py-16 bg-neutral-50 border-b border-primary-200/80" aria-labelledby="editorial-story-heading">
        <div className="container-belora">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne Gauche : Manifeste & 3 Piliers d'Excellence */}
            <div className="lg:col-span-7">
              {/* Eyebrow sobre sans trait décoratif */}
              <span className="eyebrow text-primary-700 font-semibold block mb-1.5 sm:mb-2">
                Philosophie du soin &bull; {category.name}
              </span>

              {/* Titre avec mots en text-primary */}
              <h2
                id="editorial-story-heading"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950 leading-tight mb-3"
              >
                {prefixTitle},{" "}
                <span className="block sm:inline text-primary-600 font-bold">
                  {highlightTitle}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium mb-3">
                {story.lead}
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-5">
                {story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* 3 Piliers en colonnes aérées et horizontales : zéro boîte encadrée */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-primary-200/70">
                {pillars.map((pillar: SanctuaryPillar) => (
                  <div key={pillar.num} className="flex flex-col">
                    <span className="text-2xl font-bold text-primary-600 mb-1">
                      {pillar.num}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-950 mb-0.5 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Droite : Visuel éditorial architectural grand format, sans cadre artificiel */}
            <div className="lg:col-span-5 relative w-full aspect-4/4 rounded-3xl overflow-hidden shadow-xl bg-neutral-200">
              <Image
                src={story.image}
                alt={story.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              {story.caption && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-neutral-950/80 backdrop-blur-xs text-white text-xs">
                  <span className="text-primary-300 block text-xs uppercase font-bold tracking-wider mb-0.5">
                    Engagement Belora
                  </span>
                  <p className="font-normal text-white/90">{story.caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Recherches Fréquentes & Rituels Prisés (Style Planity aéré et typographique) */}
      <section className="py-12 sm:py-16 bg-white border-b border-primary-200/80" aria-labelledby="frequent-searches-heading">
        <div className="container-belora">
          {/* En-tête sobre et direct */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9 pb-4 border-b border-neutral-100">
            <div>
              <span className="eyebrow text-neutral-500 font-semibold block mb-1">
                Tendances & Techniques
              </span>
              <h2 id="frequent-searches-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950">
                Recherches fréquentes,{" "}
                <span className="text-primary-600 font-bold">
                  les rituels les plus demandés.
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-normal">
                Les protocoles et soins signatures les plus plébiscités en {category.shortName.toLowerCase()}.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
              10 spécialités phares
            </span>
          </div>

          {/* Grille typographique épurée sans double boîte ni paddings gaspillés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-6">
            {/* Colonne 1 : Soins signatures */}
            <div>
              <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-neutral-900/10">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Soins signatures & rituels doux
                </h3>
                <span className="text-xs font-semibold text-primary-600">
                  {frequentSearches.col1.length} rituels
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {frequentSearches.col1.map((item: FrequentSearch, idx: number) => (
                  <Link
                    key={idx}
                    href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                    className="group flex items-center justify-between py-2.5 hover:pl-1 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold shrink-0">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-neutral-950 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Colonne 2 : Techniques de haute précision */}
            <div>
              <div className="flex items-center justify-between pb-2.5 mb-1.5 border-b border-neutral-900/10">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
                  Techniques avancées & finitions
                </h3>
                <span className="text-xs font-semibold text-primary-600">
                  {frequentSearches.col2.length} rituels
                </span>
              </div>

              <div className="divide-y divide-neutral-100">
                {frequentSearches.col2.map((item: FrequentSearch, idx: number) => (
                  <Link
                    key={idx}
                    href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                    className="group flex items-center justify-between py-2.5 hover:pl-1 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-semibold shrink-0">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-neutral-950 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
