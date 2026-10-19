import Link from "next/link";
import { Smartphone, ShieldCheck, Lock, ArrowRight } from "lucide-react";

export function ReassuranceBanner() {
  return (
    <section className="relative overflow-hidden bg-[#281E17] text-white py-14 sm:py-20">
      <div className="container-belora relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Colonne Gauche : Titre et bouton d'action */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-sand-400">
              Pour les amateurs de belle peau et de moments authentiques
            </p>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-sand-50 leading-[1.12]">
              Votre rendez-vous beauté{" "}
              <span className="font-display  block text-sand-200">
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
                className="btn btn-primary rounded-xl px-6 py-3.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider shadow-md cursor-pointer"
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
              <div className="w-12 h-12 rounded-full border border-sand-600/70 flex items-center justify-center shrink-0 text-sand-200">
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
              <div className="w-12 h-12 rounded-full border border-sand-600/70 flex items-center justify-center shrink-0 text-sand-200">
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
              <div className="w-12 h-12 rounded-full border border-sand-600/70 flex items-center justify-center shrink-0 text-sand-200">
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

          {/* Colonne Droite : Arches graphiques décoratives comme dans la référence */}
          <div className="hidden lg:flex lg:col-span-3 justify-end items-end relative h-72">
            {/* Arche 1 : Olive */}
            <div className="w-28 h-60 arch-t rounded-b-2xl bg-[#757045] opacity-90 shadow-lg mr-2" />
            {/* Arche 2 : Terracotta */}
            <div className="w-32 h-44 arch-t rounded-b-2xl bg-[#C77C63] shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
