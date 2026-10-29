import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Calendar, Users } from "lucide-react";
import { CategoryData } from "@/lib/data/categories";

interface CategoryProCtaProps {
  category: CategoryData;
}

export function CategoryProCta({ category }: CategoryProCtaProps) {
  const { pro } = category;

  return (
    <section className="section bg-white" aria-labelledby="pro-cta-title">
      <div className="container-belora">
        <div className="rounded-3xl border border-primary-200/90 bg-sand-50/70 p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne de gauche : Argumentaire pro */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="eyebrow text-primary-700 font-semibold block mb-2">
                Espace Professionnel
              </span>
              <h2 id="pro-cta-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-950 tracking-tight leading-tight mb-4">
                {pro.title}
              </h2>
              <p className="text-sm sm:text-base text-sand-600 leading-relaxed mb-6">
                {pro.description}
              </p>

              {/* Arguments clés sobres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full">
                <div className="flex items-center gap-2.5 text-xs text-sand-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Audité & certifié sans frais cachés</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-sand-700 font-medium">
                  <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Agenda synchronisé en temps réel</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-sand-700 font-medium">
                  <Users className="w-4 h-4 text-primary-600 shrink-0" />
                  <span>Visibilité internationale premium</span>
                </div>
              </div>

              <Link
                href={pro.ctaHref}
                className="btn-dark min-h-12 px-7 rounded-xl inline-flex items-center gap-2 text-xs font-semibold"
              >
                <span>{pro.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Colonne de droite : Image pro */}
            <div className="lg:col-span-5 relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-2xl overflow-hidden border border-neutral-200/80 shadow-md bg-sand-100">
              <Image
                src={pro.image}
                alt={pro.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
