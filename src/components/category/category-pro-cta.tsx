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
    <section className="relative overflow-hidden bg-secondary-950 text-white py-20 sm:py-28" aria-labelledby="pro-cta-heading">
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
        <div className="absolute inset-0 bg-secondary-950/90" />
      </div>

      <div className="container-belora relative z-10">
        <div className="max-w-3xl">
          <span className="eyebrow text-primary-300 font-semibold block mb-3">
            Espace Partenaires Pro &bull; {category.name}
          </span>

          <h2
            id="pro-cta-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-sand-50 leading-tight mb-4"
          >
            Vous dirigez un salon de {category.shortName.toLowerCase()} ?{" "}
            <span className="block text-primary-200 font-bold">
              Rejoignez l&apos;élite Belora Pro.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-sand-200/90 leading-relaxed font-normal mb-8 max-w-2xl">
            {pro.description}
          </p>

          {/* 3 piliers d'engagement en ligne aérée avec séparateur minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/15 mb-8">
            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-primary-200 mb-3">
                <Smartphone className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Réservations 24h/24
              </h3>
              <p className="text-xs text-sand-300/80 leading-relaxed">
                Synchronisation en temps réel sans commissions abusives.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-primary-200 mb-3">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Visibilité certifiée
              </h3>
              <p className="text-xs text-sand-300/80 leading-relaxed">
                Attirez une clientèle haut de gamme locale et voyageuse.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-primary-200 mb-3">
                <Lock className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Zéro no-show garanti
              </h3>
              <p className="text-xs text-sand-300/80 leading-relaxed">
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
            <span className="text-xs text-sand-300/80">
              Adhésion sur candidature &bull; 100% vérifié
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
