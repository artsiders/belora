import Link from "next/link";
import { Calendar, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";

export function ProBanner() {
  return (
    <section className="section bg-sand-950 text-sand-50 border-y border-sand-800" aria-labelledby="pro-heading">
      <div className="container-belora">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-[var(--radius-xs)] bg-sand-900 border border-sand-800 text-[10px] uppercase tracking-widest text-primary-300 font-semibold mb-4">
            Espace Professionnel · Salons, Instituts & Spas
          </span>

          <h2 id="pro-heading" className="display-lg text-sand-50 mb-6 text-balance">
            L’agenda en ligne qui sublime{" "}
            <span className="font-display italic text-primary-300 block sm:inline">
              votre maison de beauté.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-sand-300 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty font-normal">
            Fédérez votre équipe, éradiquez les rendez-vous manqués grâce aux
            acomptes en ligne et offrez à votre clientèle une expérience de
            réservation à la hauteur de votre savoir-faire.
          </p>

          {/* 3 Atouts majeurs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start mb-12">
            <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
              <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-sand-800 text-primary-300 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                Agenda collaboratif fluide
              </h3>
              <p className="text-xs text-sand-400 leading-relaxed font-normal">
                Synchronisation temps réel, pauses automatiques et gestion des
                temps de pose spécifiques à chaque prestation.
              </p>
            </div>

            <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
              <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-sand-800 text-primary-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                Protection anti no-show
              </h3>
              <p className="text-xs text-sand-400 leading-relaxed font-normal">
                Acomptes sécurisés par carte bancaire et rappels SMS automatiques
                pour garantir le remplissage de vos fauteuils.
              </p>
            </div>

            <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
              <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-sand-800 text-primary-300 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                Clientèle qualifiée & fidèle
              </h3>
              <p className="text-xs text-sand-400 leading-relaxed font-normal">
                Une vitrine éditoriale sobre sans publicité invasive, qui valorise
                vos créations et attire des clients exigeants.
              </p>
            </div>
          </div>

          {/* Boutons d'action Pro */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pro" className="btn btn-primary btn-lg w-full sm:w-auto">
              <span>Rejoindre le collectif Pro</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pro#demo"
              className="btn btn-outline btn-lg w-full sm:w-auto text-sand-100 border-sand-700 hover:bg-sand-900 hover:text-sand-50"
            >
              <span>Demander une démonstration</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
