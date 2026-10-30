import { CategoryData } from "@/lib/data/categories";
import { CheckCircle2 } from "lucide-react";

interface CategoryGuideProps {
  category: CategoryData;
}

export function CategoryGuide({ category }: CategoryGuideProps) {
  const { guide } = category;

  return (
    <section className="py-12 sm:py-16 bg-neutral-50/60 border-b border-primary-200/80" aria-labelledby="guide-heading">
      <div className="container-belora">
        {/* En-tête sobre sans trait superflu */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 sm:mb-9 pb-4 border-b border-neutral-200/80">
          <div>
            <span className="eyebrow text-neutral-500 font-semibold block mb-1">
              Conseils d&apos;artisans
            </span>
            <h2 id="guide-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950">
              Guide pratique,{" "}
              <span className="text-primary-600 font-bold">
                {guide.mainTitle.toLowerCase()}
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 font-normal">
              {guide.intro}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold num shadow-2xs shrink-0 self-start sm:self-auto">
            Audit bien-être
          </span>
        </div>

        {/* Colonnes éditoriales aérées : zéro encadrement artificiel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {guide.sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-primary-600">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Savoir-faire artisanal
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-2 leading-snug">
                  {sec.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {sec.content}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-primary-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Recommandé par nos maîtres artisans certifiés</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bandeau d'engagement épuré et horizontal (zéro boîte épaisse) */}
        <div className="mt-9 pt-5 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-xs">B</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-950">
                La Charte Sanctuaire Belora
              </h4>
              <p className="text-xs text-neutral-500 font-normal">
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
