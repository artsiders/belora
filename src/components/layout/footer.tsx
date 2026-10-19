import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sand-50 border-t border-sand-200/80 pt-16 pb-12 text-sand-600">
      <div className="container-belora">
        {/* Grille principale 4 colonnes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Colonne 1 : Identité & Manifeste (2 cols sur desktop) */}
          <div className="col-span-2 pr-6">
            <Link
              href="/"
              className="font-display text-3xl tracking-tight text-sand-950 hover:text-primary-600 transition-colors inline-block mb-3"
            >
              Belora
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-sand-600 mb-6 font-normal">
              La plateforme de référence dédiée aux artisans indépendants du soin,
              de la coiffure et du bien-être. Sélection rigoureuse, rituels
              sur-mesure et réservation garantie sans attente.
            </p>
            <div className="flex items-center gap-2 text-xs text-sand-700 font-medium">
              <ShieldCheck className="w-4 h-4 text-primary-600" />
              <span>Charte de sélection & établissements vérifiés</span>
            </div>
          </div>

          {/* Colonne 2 : Univers de soins */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-950 mb-4">
              Univers
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search?category=hair" className="hover:text-primary-600 transition-colors">
                  Salons de coiffure
                </Link>
              </li>
              <li>
                <Link href="/search?category=facial" className="hover:text-primary-600 transition-colors">
                  Instituts & Facialistes
                </Link>
              </li>
              <li>
                <Link href="/search?category=massage" className="hover:text-primary-600 transition-colors">
                  Massages & Spas
                </Link>
              </li>
              <li>
                <Link href="/search?category=barber" className="hover:text-primary-600 transition-colors">
                  Barbiers traditionnels
                </Link>
              </li>
              <li>
                <Link href="/search?category=nails" className="hover:text-primary-600 transition-colors">
                  Onglerie de soin
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Espace Professionnel */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-950 mb-4">
              Artisans & Pro
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pro" className="hover:text-primary-600 transition-colors">
                  Belora pour les salons
                </Link>
              </li>
              <li>
                <Link href="/pro#agenda" className="hover:text-primary-600 transition-colors">
                  Logiciel de réservation
                </Link>
              </li>
              <li>
                <Link href="/register?role=pro" className="hover:text-primary-600 transition-colors">
                  Référencer mon atelier
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary-600 transition-colors">
                  Connexion backoffice
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Maison Belora & Légal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sand-950 mb-4">
              Maison Belora
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-primary-600 transition-colors">
                  Notre manifeste
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-600 transition-colors">
                  Conditions générales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  Confidentialité des données
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary-600 transition-colors">
                  Centre d’assistance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div className="pt-8 border-t border-sand-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-500">
          <p>© 2026 Belora. L’exigence du geste d’artisan. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>France (EUR €)</span>
            <span>Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
