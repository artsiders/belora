import Link from "next/link";
import { HeroLuxuryCanvas } from "@/components/home/hero-luxury-canvas";
import { EditorialMarquee } from "@/components/home/editorial-marquee";
import { HorizontalPeekGallery } from "@/components/home/horizontal-peek-gallery";
import { ParallaxStorySection } from "@/components/home/parallax-story-section";
import { FullBleedShowcase } from "@/components/home/full-bleed-showcase";
import { InteractiveVenueDirectory } from "@/components/home/interactive-venue-directory";

const POPULAR_CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Nantes",
  "Toulouse",
  "Strasbourg",
  "Nice",
  "Montpellier",
  "Rennes",
  "Aix-en-Provence",
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8F3] text-sand-900 selection:bg-primary-100 selection:text-primary-900 font-sans">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Header & Navigation Haute Horlogerie                               */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full h-[74px] border-b border-sand-300/80 backdrop-blur-md bg-[#FBF8F3]/90 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="group flex items-baseline gap-1"
            aria-label="Belora - Accueil"
          >
            <span className="font-display text-2xl tracking-tight text-sand-950 transition-colors group-hover:text-primary-600">
              Belora
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" aria-hidden="true" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Univers de soins">
            <Link href="/search?category=hair" className="text-xs uppercase tracking-[0.14em] font-medium text-sand-700 hover:text-primary-600 transition-colors">
              Coiffure
            </Link>
            <Link href="/search?category=facial" className="text-xs uppercase tracking-[0.14em] font-medium text-sand-700 hover:text-primary-600 transition-colors">
              Soins visage
            </Link>
            <Link href="/search?category=massage" className="text-xs uppercase tracking-[0.14em] font-medium text-sand-700 hover:text-primary-600 transition-colors">
              Massages & Spas
            </Link>
            <Link href="/search?category=barber" className="text-xs uppercase tracking-[0.14em] font-medium text-sand-700 hover:text-primary-600 transition-colors">
              Barbiers
            </Link>
            <Link href="/search?category=nails" className="text-xs uppercase tracking-[0.14em] font-medium text-sand-700 hover:text-primary-600 transition-colors">
              Onglerie
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/pro"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-sand-700 hover:text-primary-600 transition-colors"
          >
            <span>Espace Pro</span>
            <svg
              className="w-3.5 h-3.5 opacity-60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>

          <span className="hidden sm:inline-block w-px h-4 bg-sand-300" aria-hidden="true" />

          <Link href="/account" className="btn btn-editorial btn-sm rounded-lg">
            <svg
              className="w-3.5 h-3.5 text-sand-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Connexion</span>
          </Link>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* 2. Hero Luxury Canvas (Plein écran asymétrique débridé & Parallaxe)   */}
      {/* -------------------------------------------------------------------- */}
      <HeroLuxuryCanvas />

      {/* -------------------------------------------------------------------- */}
      {/* 3. Ruban Défilant Typographique (Marquee continu éditorial)           */}
      {/* -------------------------------------------------------------------- */}
      <EditorialMarquee />

      {/* -------------------------------------------------------------------- */}
      {/* 4. Galerie Horizontale Débordante (Déborde du max-w-7xl, 100vw peek)  */}
      {/* -------------------------------------------------------------------- */}
      <HorizontalPeekGallery />

      {/* -------------------------------------------------------------------- */}
      {/* 5. Narration Parallaxe au Scroll (Sticky left + Grandes photos 80vh) */}
      {/* -------------------------------------------------------------------- */}
      <ParallaxStorySection />

      {/* -------------------------------------------------------------------- */}
      {/* 6. Showcase Pleine Largeur 100vw (Immersion Sanctuary)                */}
      {/* -------------------------------------------------------------------- */}
      <FullBleedShowcase />

      {/* -------------------------------------------------------------------- */}
      {/* 7. Répertoire Interactif UX (Filtres instantanés & Créneaux réels)   */}
      {/* -------------------------------------------------------------------- */}
      <InteractiveVenueDirectory />

      {/* -------------------------------------------------------------------- */}
      {/* 8. Espace Professionnels (Charbon minéral chaud & Typographie d’art)  */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-[#12100D] text-sand-50 border-t border-sand-800 py-24 sm:py-32" aria-labelledby="pro-heading">
        <div className="container-belora">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-primary-300 block mb-3">
              Belora Professionnel · Maisons & Artisans
            </span>
            <h2 id="pro-heading" className="font-display text-4xl sm:text-6xl text-sand-50 mb-6 text-balance">
              Le logiciel d’agenda pensé pour sublimer votre atelier.
            </h2>
            <p className="text-base sm:text-lg text-sand-300 max-w-2xl mx-auto mb-14 leading-relaxed font-light text-pretty">
              Fédérez votre équipe sur un planning fluide, encaissez vos acomptes en ligne pour éliminer les no-shows et attirez une clientèle qui valorise l’artisanat d’art.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start mb-16">
              <div className="p-8 rounded-2xl border border-sand-800 bg-sand-900/50 hover:border-sand-700 transition-colors">
                <span className="block font-display text-4xl text-primary-300 mb-3 font-normal">
                  01
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide uppercase">
                  Agenda multi-artisans
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed font-light">
                  Vues jour et semaine d’une fluidité absolue, pauses modulables, temps de pose et assignation intelligente des membres.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-sand-800 bg-sand-900/50 hover:border-sand-700 transition-colors">
                <span className="block font-display text-4xl text-primary-300 mb-3 font-normal">
                  02
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide uppercase">
                  Zéro rendez-vous manqué
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed font-light">
                  Acomptes en ligne Stripe Connect configurables et rappels automatiques discrets par SMS et e-mail.
                </p>
              </div>

              <div className="p-8 rounded-2xl border border-sand-800 bg-sand-900/50 hover:border-sand-700 transition-colors">
                <span className="block font-display text-4xl text-primary-300 mb-3 font-normal">
                  03
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide uppercase">
                  Vitrine d’artisan sans bruit
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed font-light">
                  Une présentation fidèle à l’atmosphère de votre lieu, sans bannières publicitaires ni remises dégradantes.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pro" className="btn btn-primary h-13 px-8 rounded-lg text-xs font-semibold tracking-wider uppercase w-full sm:w-auto">
                <span>Rejoindre Belora Pro</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/pro#contact"
                className="btn btn-editorial-light h-13 px-8 rounded-lg text-xs font-semibold tracking-wider uppercase w-full sm:w-auto"
              >
                <span>Demander une présentation</span>
                <svg className="w-3.5 h-3.5 btn-icon-slide" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 9. Maillage National & Footer Architectural                           */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-[#FBF8F3] py-20 border-t border-sand-300" aria-labelledby="cities-heading">
        <div className="container-belora">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 block mb-2">
              Présence Nationale
            </span>
            <h2 id="cities-heading" className="font-display text-3xl sm:text-4xl text-sand-950">
              Trouver un rendez-vous près de chez vous
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 border-t border-sand-300">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/search?location=${encodeURIComponent(city)}`}
                className="p-4 rounded-xl border border-sand-300 bg-white hover:border-sand-900 hover:shadow-md transition-all text-xs text-sand-900 font-medium flex items-center justify-between group"
              >
                <span>{city}</span>
                <svg
                  className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Institutionnel */}
      <footer className="bg-sand-950 text-sand-400 py-20 border-t border-sand-800">
        <div className="container-belora">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <p className="font-display text-3xl text-sand-50 mb-4">Belora</p>
              <p className="text-xs leading-relaxed max-w-xs text-sand-400 font-light">
                Maison de réservation de soins d’artisan. Reliant les passionnés
                de beauté et bien-être aux meilleurs maîtres indépendants de France.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sand-100 mb-5">
                Univers
              </p>
              <ul className="space-y-3 text-xs font-light">
                <li><Link href="/search?category=hair" className="hover:text-sand-100 transition-colors">Salons de coiffure</Link></li>
                <li><Link href="/search?category=facial" className="hover:text-sand-100 transition-colors">Instituts de beauté</Link></li>
                <li><Link href="/search?category=barber" className="hover:text-sand-100 transition-colors">Barbiers</Link></li>
                <li><Link href="/search?category=massage" className="hover:text-sand-100 transition-colors">Massages & Spas</Link></li>
                <li><Link href="/search?category=nails" className="hover:text-sand-100 transition-colors">Manucure & Ongles</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sand-100 mb-5">
                Professionnels
              </p>
              <ul className="space-y-3 text-xs font-light">
                <li><Link href="/pro" className="hover:text-sand-100 transition-colors">Belora pour les salons</Link></li>
                <li><Link href="/pro/calendar" className="hover:text-sand-100 transition-colors">Logiciel d’agenda</Link></li>
                <li><Link href="/pro/pricing" className="hover:text-sand-100 transition-colors">Tarifs & Abonnements</Link></li>
                <li><Link href="/pro/onboarding" className="hover:text-sand-100 transition-colors">Inscrire un établissement</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-sand-100 mb-5">
                Informations
              </p>
              <ul className="space-y-3 text-xs font-light">
                <li><Link href="/legal/terms" className="hover:text-sand-100 transition-colors">Conditions Générales (CGU)</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-sand-100 transition-colors">Politique de confidentialité</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-sand-100 transition-colors">Gestion des cookies</Link></li>
                <li><Link href="/contact" className="hover:text-sand-100 transition-colors">Contact & Conciergerie</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-sand-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-500 font-light">
            <p>© 2026 Belora. Tous droits réservés.</p>
            <div className="flex items-center gap-6">
              <span>France (EUR €)</span>
              <span>Français</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
