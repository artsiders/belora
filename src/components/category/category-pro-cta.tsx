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
    <section className="section bg-white" aria-labelledby="pro-cta-heading">
      <div className="container-belora">
        {/* Bannière sombre architecturale inspirée de ReassuranceBanner sur la Home */}
        <div className="relative overflow-hidden bg-secondary-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-primary-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Colonne Gauche : Titre et bouton d'action */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-semibold tracking-widest text-primary-300">
                  Espace Partenaires Pro
                </span>
                <span className="h-px w-10 bg-primary-400/80" aria-hidden="true" />
              </div>

              <h2
                id="pro-cta-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-sand-50 leading-tight"
              >
                Vous dirigez un salon de {category.shortName.toLowerCase()} ?{" "}
                <span className="block text-sand-200 font-bold">
                  Rejoignez l&apos;élite Belora Pro.
                </span>
              </h2>

              <p className="text-xs sm:text-sm lg:text-base text-white/80 leading-relaxed font-normal max-w-xl">
                {pro.description}
              </p>

              {/* 3 Engagements circulaires identiques à ReassuranceBanner */}
              <div className="space-y-4 pt-3">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full border border-gray-600/70 flex items-center justify-center shrink-0 text-white">
                    <Smartphone className="w-5 h-5" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Réservations en ligne 24h/24
                    </h3>
                    <p className="text-xs text-white/70 font-normal">
                      Synchronisation temps réel sans commissions abusives
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full border border-gray-600/70 flex items-center justify-center shrink-0 text-white">
                    <ShieldCheck className="w-5 h-5" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Visibilité internationale certifiée
                    </h3>
                    <p className="text-xs text-white/70 font-normal">
                      Attirez une clientèle locale et voyageuse haut de gamme
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full border border-gray-600/70 flex items-center justify-center shrink-0 text-white">
                    <Lock className="w-5 h-5" strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Garantie zéro no-show
                    </h3>
                    <p className="text-xs text-white/70 font-normal">
                      Acomptes sécurisés et rappels automatiques par SMS
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={pro.ctaHref}
                  className="btn btn-primary btn-lg rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{pro.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Colonne Droite : Visuel gérante / salon pro soigné */}
            <div className="lg:col-span-5 relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-secondary-900">
              <Image
                src={pro.image}
                alt={pro.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/70 backdrop-blur-xs border border-white/10 text-white text-xs">
                <span className="font-semibold block text-primary-200">Adhésion sur candidature</span>
                Sélection stricte des établissements d&apos;artisanat.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
