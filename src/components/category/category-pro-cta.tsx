import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck, Lock } from "lucide-react";
import { CategoryData } from "@/lib/data/categories";

interface CategoryProCtaProps {
  category: CategoryData;
}

export function CategoryProCta({ category }: CategoryProCtaProps) {
  const { pro } = category;

  return (
    <section className="relative overflow-hidden bg-secondary-950 text-white py-14 sm:py-20" aria-labelledby="pro-cta-heading">
      {/* Visuel d'ambiance plein écran en arrière-plan immersif */}
      <div className="absolute inset-0 z-0">
        <Image
          src={pro.image}
          alt={pro.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Aplat solide sombre pour contraste et lisibilité sans dégradé */}
        <div className="absolute inset-0 bg-linear-to-r from-secondary-950/90 via-secondary-950/90 to-transparent" />
      </div>

      <div className="container-belora relative z-10">
        <div className="max-w-2xl">
          <h2
            id="pro-cta-heading"
            className="text-xl sm:text-3xl lg:text-4xl font-bold text-neutral-50 leading-tight mb-3"
          >
            Vous dirigez un salon de {category.shortName.toLowerCase()} ?{" "}
            <span className="block text-primary-500 font-bold">
              Rejoignez l&apos;élite Belora Pro.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-200/90 leading-relaxed font-normal mb-6">
            {pro.description}
          </p>

          {/* 3 piliers d'engagement en ligne aérée avec séparateur minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-5 border-t border-white/15 mb-6">
            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                Réservations 24h/24
              </h3>
              <p className="text-sm text-neutral-300/80 leading-relaxed">
                Synchronisation en temps réel sans commissions abusives.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                Visibilité certifiée
              </h3>
              <p className="text-sm text-neutral-300/80 leading-relaxed">
                Attirez une clientèle haut de gamme locale et voyageuse.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                Zéro no-show
              </h3>
              <p className="text-sm text-neutral-300/80 leading-relaxed">
                Acomptes sécurisés et rappels automatiques par SMS.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href={pro.ctaHref}
              className="btn btn-primary btn-lg rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{pro.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-sm text-neutral-300/80">
              Adhésion sur candidature &bull; 100% vérifié
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
