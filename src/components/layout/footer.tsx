import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-sand-200/80 pt-14 pb-10 text-sand-600">
      <div className="container-belora">
        {/* Grille principale 4 colonnes aérées et équilibrées */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Colonne Marque */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5 pr-0 md:pr-8">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-sand-950 hover:text-primary-600 transition-colors inline-block mb-3"
            >
              Belora
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-sand-600 mb-4 font-normal">
              La maison de réservation des artisans indépendants de la coiffure,
              du soin et du bien-être d’exception.
            </p>
            <p className="text-xs text-sand-500 font-normal">
              Chaque établissement partenaire est audité et certifié sur place.
            </p>
          </div>

          {/* Colonne Univers */}
          <div className="md:col-span-3 lg:col-span-2">
            <p className="eyebrow mb-3.5 text-sand-900 font-semibold">
              Univers
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/search?category=hair" className="hover:text-sand-950 transition-colors">
                  Coiffure d’auteur
                </Link>
              </li>
              <li>
                <Link href="/search?category=facial" className="hover:text-sand-950 transition-colors">
                  Soins du visage
                </Link>
              </li>
              <li>
                <Link href="/search?category=massage" className="hover:text-sand-950 transition-colors">
                  Massages & Spas
                </Link>
              </li>
              <li>
                <Link href="/search?category=barber" className="hover:text-sand-950 transition-colors">
                  Barbiers traditionnels
                </Link>
              </li>
              <li>
                <Link href="/search?category=nails" className="hover:text-sand-950 transition-colors">
                  Onglerie de soin
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Professionnels */}
          <div className="md:col-span-3 lg:col-span-3">
            <p className="eyebrow mb-3.5 text-sand-900 font-semibold">
              Professionnels
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pro" className="hover:text-sand-950 transition-colors">
                  Belora Pro pour les salons
                </Link>
              </li>
              <li>
                <Link href="/register?role=pro" className="hover:text-sand-950 transition-colors">
                  Rejoindre la sélection
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-sand-950 transition-colors">
                  Espace praticien
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Maison & Légal */}
          <div className="md:col-span-2 lg:col-span-2">
            <p className="eyebrow mb-3.5 text-sand-900 font-semibold">
              Maison
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-sand-950 transition-colors">
                  Notre charte
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-sand-950 transition-colors">
                  Assistance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne inférieure sobre et alignée */}
        <div className="pt-6 border-t border-sand-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sand-500">
          <p>© 2026 Belora — L’artisanat du soin d’exception.</p>
          <div className="flex items-center gap-4">
            <span>France</span>
            <span>•</span>
            <span>EUR (€)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
