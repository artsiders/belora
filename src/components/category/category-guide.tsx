import { CategoryData } from "@/lib/data/categories";

interface CategoryGuideProps {
  category: CategoryData;
}

export function CategoryGuide({ category }: CategoryGuideProps) {
  const { guide } = category;

  return (
    <section className="section bg-sand-50/50 border-b border-primary-200/80" aria-labelledby="guide-title">
      <div className="container-belora">
        <div className="max-w-3xl">
          {/* Titre principal du guide */}
          <span className="eyebrow text-sand-500 font-semibold block mb-2">
            Guide & Conseils d&apos;experts
          </span>
          <h2 id="guide-title" className="text-2xl sm:text-3xl font-bold text-sand-950 tracking-tight mb-4">
            {guide.mainTitle}
          </h2>
          <p className="text-sm sm:text-base text-sand-700 leading-relaxed mb-10 font-normal">
            {guide.intro}
          </p>

          {/* Sous-sections détaillées */}
          <div className="space-y-8">
            {guide.sections.map((sec, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs">
                <h3 className="text-base sm:text-lg font-bold text-sand-950 mb-2.5">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
