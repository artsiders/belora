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
      <section className="section bg-sand-warm border-b border-primary-200/80" aria-labelledby="editorial-story-heading">
        <div className="container-belora">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Colonne Gauche : Manifeste & 3 Piliers d'Excellence */}
            <div className="lg:col-span-7">
              {/* Eyebrow sobre sans trait décoratif */}
              <span className="eyebrow text-primary-700 font-semibold block mb-2 sm:mb-3">
                Philosophie du soin &bull; {category.name}
              </span>

              {/* Titre avec mots en text-primary */}
              <h2
                id="editorial-story-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 leading-tight mb-4"
              >
                {prefixTitle},{" "}
                <span className="block sm:inline text-primary-600 font-bold">
                  {highlightTitle}
                </span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-sand-700 leading-relaxed font-medium mb-6">
                {story.lead}
              </p>

              <div className="space-y-3.5 text-xs sm:text-sm text-sand-600 leading-relaxed font-normal mb-8">
                {story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* 3 Piliers du geste (style SanctuaryExperience) */}
              <div className="space-y-4 pt-2 border-t border-primary-200/70">
                {pillars.map((pillar: SanctuaryPillar) => (
                  <div
                    key={pillar.num}
                    className="flex items-start gap-4 pb-4 border-b border-primary-200/60 last:border-b-0 last:pb-0"
                  >
                    <span className="text-base font-bold text-primary-600 shrink-0 pt-0.5">
                      {pillar.num}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-sand-950 mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-sand-600 leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne Droite : Visuel éditorial architectural avec cadre soigné */}
            <div className="lg:col-span-5 relative w-full aspect-4/5 rounded-3xl overflow-hidden border border-primary-200/80 shadow-md bg-sand-200">
              <Image
                src={story.image}
                alt={story.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              {story.caption && (
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-white/95 backdrop-blur-xs text-sand-900 text-xs font-semibold shadow-2xs border border-white/60">
                  <span className="text-primary-700 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Engagement Belora
                  </span>
                  {story.caption}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section Recherches Fréquentes & Rituels Prisés (Style Planity élevé à la DA Belora) */}
      <section className="section bg-white border-b border-primary-200/80" aria-labelledby="frequent-searches-heading">
        <div className="container-belora">
          {/* En-tête harmonisé avec mot en text-primary */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12 pb-5 border-b border-primary-200/80">
            <div>
              <span className="eyebrow text-sand-500 font-semibold block mb-1.5">
                Tendances & Techniques
              </span>
              <h2 id="frequent-searches-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950">
                Recherches fréquentes,{" "}
                <span className="text-primary-600 font-bold">
                  les rituels les plus demandés.
                </span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-sand-600 font-normal">
                Accédez directement aux créneaux des soins et protocoles les plus plébiscités par nos membres en {category.shortName.toLowerCase()}.
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full bg-sand-100 text-sand-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
              10 spécialités phares
            </span>
          </div>

          {/* Grille créative en deux cartes distinctes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Carte 1 : Soins signatures */}
            <div className="p-6 sm:p-8 rounded-2xl bg-sand-50/70 border border-primary-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-primary-200/70">
                <h3 className="text-base font-bold text-sand-950">
                  Soins signatures & rituels doux
                </h3>
                <span className="text-xs uppercase font-semibold text-primary-700">
                  Vol. 1
                </span>
              </div>

              <div className="space-y-2.5">
                {frequentSearches.col1.map((item: FrequentSearch, idx: number) => (
                  <Link
                    key={idx}
                    href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200/70 hover:border-primary-400 hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 text-xs font-semibold">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-sand-950 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Carte 2 : Techniques de haute précision */}
            <div className="p-6 sm:p-8 rounded-2xl bg-sand-50/70 border border-primary-200/80 shadow-2xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-primary-200/70">
                <h3 className="text-base font-bold text-sand-950">
                  Techniques avancées & finitions d&apos;art
                </h3>
                <span className="text-xs uppercase font-semibold text-primary-700">
                  Vol. 2
                </span>
              </div>

              <div className="space-y-2.5">
                {frequentSearches.col2.map((item: FrequentSearch, idx: number) => (
                  <Link
                    key={idx}
                    href={`/search?category=${category.slug}&q=${encodeURIComponent(item.query)}`}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200/70 hover:border-primary-400 hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 text-xs font-semibold">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-sand-950 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
