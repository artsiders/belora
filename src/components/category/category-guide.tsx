import { CategoryData } from "@/lib/data/categories";
import { CheckCircle2 } from "lucide-react";

interface CategoryGuideProps {
  category: CategoryData;
}

export function CategoryGuide({ category }: CategoryGuideProps) {
  const { guide } = category;

  return (
    <section className="section bg-sand-50/60 border-b border-primary-200/80" aria-labelledby="guide-heading">
      <div className="container-belora">
        {/* En-tête harmonisé avec mots en text-primary */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12 pb-5 border-b border-primary-200/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase font-semibold tracking-widest text-primary-700">
                Conseils d&apos;artisans
              </span>
              <span className="h-px w-10 bg-primary-400/80" aria-hidden="true" />
            </div>
            <h2 id="guide-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950">
              Guide pratique,{" "}
              <span className="text-primary-600 font-bold">
                {guide.mainTitle.toLowerCase()}
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-sand-600 font-normal max-w-2xl">
              {guide.intro}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-sand-100 text-sand-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
            Audit bien-être
          </span>
        </div>

        {/* Grille créative des sections du guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {guide.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-primary-200/80 shadow-2xs hover:border-primary-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary-50 text-primary-700 font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-sand-400">
                    Savoir-faire
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-sand-950 mb-3 leading-snug">
                  {sec.title}
                </h3>

                <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal">
                  {sec.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-primary-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                <span>Recommandé par nos maîtres artisans</span>
              </div>
            </div>
          ))}
        </div>

        {/* Encadré d'engagement qualité créatif */}
        <div className="p-6 rounded-2xl bg-white border border-primary-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-primary-100/70 text-primary-700 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-base">B</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-sand-950">
                La Charte Sanctuaire Belora
              </h4>
              <p className="text-xs text-sand-500 font-normal">
                Tous les établissements référencés sont visités et réévalués chaque trimestre.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
            100% Vérifié & Garanti
          </span>
        </div>
      </div>
    </section>
  );
}
