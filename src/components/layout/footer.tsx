"use client";
import Link from "next/link";
import Image from "next/image";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-secondary-950 text-sand-300 border-t border-white/10 pt-16 pb-12">
      {/* Arches graphiques décoratives collées au bas du footer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-32 md:bottom-0 right-4 lg:right-16 flex items-end opacity-85 select-none z-0"
      >
        <div className="w-24 lg:w-32 h-44 lg:h-56 rounded-t-3xl rounded-b-none bg-primary-700" />
        <div className="w-32 lg:w-40 h-32 lg:h-40 rounded-t-3xl rounded-b-none bg-secondary-500" />
      </div>

      <div className="container-belora relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-14">
          
          {/* Colonne Marque */}
          <div className="col-span-2 md:col-span-5 lg:col-span-4 space-y-4 pr-0 md:pr-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-sand-50 inline-block hover:text-white transition-colors"
            >
              <Image
                src="/images/logos/belora.svg"
                alt="Belora"
                width={120}
                height={40}
                className="w-auto h-7 filter brightness-0 invert"
                priority
              />
            </Link>
      

            <p className="text-sm sm:text-base text-sand-300 leading-relaxed max-w-sm">
              La maison de réservation des artisans indépendants de la coiffure,
              du soin et du bien-être d’exception.
            </p>
          </div>

          {/* Colonne Univers */}
          <div className="col-span-1 md:col-span-3 lg:col-span-3 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-200">
              Univers
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search?category=hair" className="hover:text-white transition-colors">
                  Coiffure d’auteur
                </Link>
              </li>
              <li>
                <Link href="/search?category=facial" className="hover:text-white transition-colors">
                  Soins du visage
                </Link>
              </li>
              <li>
                <Link href="/search?category=massage" className="hover:text-white transition-colors">
                  Massages & Spas
                </Link>
              </li>
              <li>
                <Link href="/search?category=barber" className="hover:text-white transition-colors">
                  Barbiers traditionnels
                </Link>
              </li>
              <li>
                <Link href="/search?category=nails" className="hover:text-white transition-colors">
                  Onglerie de soin
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Professionnels */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-200">
              Professionnels
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/pro" className="hover:text-white transition-colors">
                  Belora Pro pour les salons
                </Link>
              </li>
              <li>
                <Link href="/register?role=pro" className="hover:text-white transition-colors">
                  Rejoindre la sélection
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Espace praticien
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Maison & Suivi */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-sand-200">
              Maison
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Notre charte
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Assistance
                </Link>
              </li>
            </ul>

            <div className="pt-4 space-y-2">
              <p className="text-sm uppercase tracking-wider text-sand-400">
                Suivez-nous
              </p>
              <div className="flex items-center gap-3 text-sand-300">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Ligne inférieure */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-sand-400">
          <p>© 2026 Belora - L’artisanat du soin d’exception.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Conditions
            </Link>
            <span className="text-white/20">|</span>
            <span>France • EUR (€)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}