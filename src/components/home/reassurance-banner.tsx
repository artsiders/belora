import Link from "next/link";
import Image from "next/image";
import { Smartphone, ShieldCheck, Lock, ArrowRight } from "lucide-react";

export function ReassuranceBanner() {
  return (
    <section className="relative overflow-hidden bg-secondary-950 text-white py-14 sm:py-20 border-b border-primary-800">
      <div className="container-belora relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Colonne Gauche : Titre et bouton d'action */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs uppercase tracking-wider font-semibold text-sand-400">
              Pour les amateurs de belle peau et de moments authentiques
            </p>

            <h2 className="text-2xl sm:text-4xl font-semibold text-sand-50 leading-tight">
              Votre rendez-vous beauté{" "}
              <span className="block text-sand-200 font-bold">
                en toute simplicité.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-sand-300 leading-relaxed font-normal max-w-md pt-1">
              Un large choix de salons et professionnels de confiance, près de chez vous.
              Réservez, payez en ligne, et profitez de votre soin l’esprit libre.
            </p>

            <div className="pt-2">
              <Link
                href="/search"
                className="btn btn-primary btn-lg rounded-xl"
              >
                <span>Découvrir tous les salons</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Colonne Milieu : 3 engagements avec icônes fines circulaires */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. Réservation en ligne */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-primary-600/70 flex items-center justify-center shrink-0 text-sand-200">
                <Smartphone className="w-5 h-5" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sand-100">
                  Réservation en ligne
                </h3>
                <p className="text-xs text-sand-400 font-normal">
                  24h/24 et 7j/7 sans attente
                </p>
              </div>
            </div>

            {/* 2. Professionnels vérifiés */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-primary-600/70 flex items-center justify-center shrink-0 text-sand-200">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sand-100">
                  Professionnels vérifiés
                </h3>
                <p className="text-xs text-sand-400 font-normal">
                  Qualité et avis 100% réels
                </p>
              </div>
            </div>

            {/* 3. Paiement sécurisé */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-primary-600/70 flex items-center justify-center shrink-0 text-sand-200">
                <Lock className="w-5 h-5" strokeWidth={1.4} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-sand-100">
                  Paiement sécurisé
                </h3>
                <p className="text-xs text-sand-400 font-normal">
                  100% confiance & tranquillité
                </p>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Formes décoratives en arches parcourues par une seule image continue */}
          <div className="hidden lg:flex lg:col-span-3 justify-end items-end self-end lg:-mb-20 relative">
            <div className="relative w-80 xl:w-96 h-80 xl:h-96 flex items-end gap-2.5">
              {/* Arche 1 : Gauche (Haute) */}
              <div className="relative w-[155px] xl:w-[187px] h-80 xl:h-96 rounded-t-3xl rounded-b-none overflow-hidden border border-white/15 shadow-2xl shrink-0 bg-sand-900">
                <div className="absolute bottom-0 left-0 w-80 xl:w-96 h-80 xl:h-96">
                  <Image
                    src="/images/heroes/reassurance-salon.jpg"
                    alt="Salons et professionnels de confiance Belora"
                    fill
                    sizes="(max-width: 1280px) 320px, 384px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>

              {/* Arche 2 : Droite (Basse) - Le décalage négatif garantit la parfaite continuité de l'image */}
              <div className="relative w-[155px] xl:w-[187px] h-60 xl:h-72 rounded-t-3xl rounded-b-none overflow-hidden border border-white/15 shadow-2xl shrink-0 bg-sand-900">
                <div className="absolute bottom-0 -left-[165px] xl:-left-[197px] w-80 xl:w-96 h-80 xl:h-96">
                  <Image
                    src="/images/heroes/reassurance-salon.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 1280px) 320px, 384px"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}