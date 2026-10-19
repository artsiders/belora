import Image from "next/image";
import Link from "next/link";
import { HeroCentered } from "@/components/home/hero-centered";
import { EditorialMarquee } from "@/components/home/editorial-marquee";
import { UniverseShowcase } from "@/components/home/universe-showcase";
import { FeaturedSanctuary } from "@/components/home/featured-sanctuary";

interface VenuePreview {
  slug: string;
  name: string;
  specialty: string;
  badge: string;
  city: string;
  district: string;
  rating: string;
  reviewCount: number;
  startingPrice: string;
  image: string;
}

const CURATED_VENUES: VenuePreview[] = [
  {
    slug: "atelier-botanique-paris",
    name: "L’Atelier Botanique",
    specialty: "Coiffure végétale & coupe sur-mesure",
    badge: "Maison d’artisan",
    city: "Paris",
    district: "Le Marais",
    rating: "4,9",
    reviewCount: 142,
    startingPrice: "dès 55 €",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "maison-albar-soins",
    name: "Maison Albar Institut",
    specialty: "Soin visage holistique & diagnostic peau",
    badge: "Signature",
    city: "Lyon",
    district: "Presqu’île",
    rating: "5,0",
    reviewCount: 96,
    startingPrice: "dès 80 €",
    image:
      "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "barbier-saint-germain",
    name: "Le Salon Saint-Germain",
    specialty: "Taille de barbe traditionnelle & serviette chaude",
    badge: "Atelier Barbier",
    city: "Bordeaux",
    district: "Triangle d’Or",
    rating: "4,9",
    reviewCount: 218,
    startingPrice: "dès 38 €",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=85",
  },
  {
    slug: "bain-de-vapeur-sequoia",
    name: "Studio Séquoia",
    specialty: "Massage relaxant & rituel corporel",
    badge: "Espace Spa",
    city: "Marseille",
    district: "Vieux-Port",
    rating: "4,8",
    reviewCount: 88,
    startingPrice: "dès 75 €",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
  },
];

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
    <div className="flex flex-col min-h-screen selection:bg-primary-100 selection:text-primary-900">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Header & Navigation Sticky                                        */}
      {/* -------------------------------------------------------------------- */}
      <header className="nav border-b border-line/80 backdrop-blur-md bg-bg/90">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="nav-logo group flex items-baseline gap-1"
            aria-label="Belora - Accueil"
          >
            <span className="font-display text-2xl tracking-tight text-sand-900 transition-colors group-hover:text-primary-600">
              Belora
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" aria-hidden="true" />
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Univers de soins">
            <Link href="/search?category=hair" className="nav-link text-xs tracking-wider uppercase font-medium">
              Coiffure
            </Link>
            <Link href="/search?category=facial" className="nav-link text-xs tracking-wider uppercase font-medium">
              Soins visage
            </Link>
            <Link href="/search?category=massage" className="nav-link text-xs tracking-wider uppercase font-medium">
              Massages & Spas
            </Link>
            <Link href="/search?category=barber" className="nav-link text-xs tracking-wider uppercase font-medium">
              Barbiers
            </Link>
            <Link href="/search?category=nails" className="nav-link text-xs tracking-wider uppercase font-medium">
              Onglerie
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
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

          <span className="hidden sm:inline-block w-px h-4 bg-line-strong" aria-hidden="true" />

          <Link href="/account" className="btn btn-editorial btn-sm">
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
      {/* 2. Hero Centré avec Dégradé Supérieur & Grande Photographie           */}
      {/* -------------------------------------------------------------------- */}
      <HeroCentered />

      {/* -------------------------------------------------------------------- */}
      {/* 3. Bandeau Défilant Typographique (Marquee éditorial)                */}
      {/* -------------------------------------------------------------------- */}
      <EditorialMarquee />

      {/* -------------------------------------------------------------------- */}
      {/* 4. Atelier des Savoir-Faire (Interactif avec très grandes photos)     */}
      {/* -------------------------------------------------------------------- */}
      <UniverseShowcase />

      {/* -------------------------------------------------------------------- */}
      {/* 5. Immersion Salon Partenaire (Pleine Largeur Showcase)              */}
      {/* -------------------------------------------------------------------- */}
      <FeaturedSanctuary />

      {/* -------------------------------------------------------------------- */}
      {/* 6. Sélection d’Établissements Recommandés                             */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-surface hairline-t hairline-b" aria-labelledby="venues-heading">
        <div className="container-belora">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 hairline-b">
            <div>
              <p className="eyebrow mb-2">Sélection indépendante</p>
              <h2 id="venues-heading" className="display-md text-sand-900">
                Maisons & ateliers recommandés
              </h2>
            </div>
            <Link
              href="/search?filter=curated"
              className="btn btn-editorial self-start sm:self-auto group"
            >
              <span>Voir la sélection complète</span>
              <svg
                className="w-3.5 h-3.5 btn-icon-slide"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {CURATED_VENUES.map((venue) => (
              <Link
                key={venue.slug}
                href={`/venue/${venue.slug}`}
                className="venue-card group"
              >
                <div className="venue-media">
                  <Image
                    src={venue.image}
                    alt={venue.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Étiquette d'artisan */}
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-[var(--radius-xs)] bg-sand-950/70 text-sand-50 text-[10px] tracking-wider uppercase font-semibold backdrop-blur-sm z-[1]">
                    {venue.badge}
                  </span>

                  {/* Bouton favori tactile */}
                  <button
                    type="button"
                    className="fav-btn"
                    aria-label={`Ajouter ${venue.name} aux favoris`}
                  >
                    <svg
                      className="w-4 h-4 text-sand-900 transition-colors hover:text-primary-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>

                <div className="venue-meta">
                  <h3 className="venue-name group-hover:text-primary-600 transition-colors">
                    {venue.name}
                  </h3>
                  <div className="venue-rating font-medium flex items-center gap-1 text-xs">
                    <svg
                      className="w-3.5 h-3.5 text-primary-600 fill-current"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{venue.rating}</span>
                    <span className="text-fg-subtle">({venue.reviewCount})</span>
                  </div>
                </div>

                <p className="venue-sub">
                  {venue.specialty}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-line/60 flex items-center justify-between text-xs">
                  <span className="text-fg-muted">
                    {venue.district}, {venue.city}
                  </span>
                  <span className="font-semibold text-sand-900 tracking-wide">
                    {venue.startingPrice}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 7. Le Rituel Belora (Manifeste Geste & Matière)                       */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-bg" aria-labelledby="editorial-heading">
        <div className="container-belora">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-3">L’engagement Belora</p>
              <h2 id="editorial-heading" className="display-lg text-sand-900 mb-6 text-balance">
                La sérénité d’un rendez-vous, <span className="display-italic">sans attente ni incertitude.</span>
              </h2>
              <p className="lead mb-10 text-pretty">
                Parce que votre temps est précieux, Belora réunit l’exigence
                artisanale et la fluidité technologique. Choisissez votre créneau,
                recevez vos confirmations et profitez de votre instant.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-5 pb-6 border-b border-line">
                  <span className="num font-display text-3xl text-primary-600 font-normal leading-none pt-0.5">
                    01
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1.5 tracking-wide">
                      Disponibilités certifiées en direct
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Chaque horaire affiché correspond exactement à l’agenda officiel
                      de l’équipe. Aucune double réservation, jamais de déconvenue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 pb-6 border-b border-line">
                  <span className="num font-display text-3xl text-primary-600 font-normal leading-none pt-0.5">
                    02
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1.5 tracking-wide">
                      Rappels discrets & flexibilité
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Recevez les détails précis de votre soin par e-mail et SMS. Modifiez ou
                      annulez sans devoir appeler pendant vos heures de travail.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <span className="num font-display text-3xl text-primary-600 font-normal leading-none pt-0.5">
                    03
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1.5 tracking-wide">
                      Règlement clair & sans surcoût
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Acompte ou paiement sur place selon les règles propres au salon.
                      Tarifs identiques à ceux affichés sur place, sans commission client.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-line shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Détail d'un rituel de soin apaisant et soigné"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />

                {/* Cartouche d'assurance qualité discrète */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-sm border border-sand-200 shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-sand-500 font-semibold mb-0.5">
                        Indice de ponctualité
                      </p>
                      <p className="font-display text-xl text-sand-900">
                        99,4% des créneaux honorés
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 8. Section Professionnels (Charbon chaud & Typographie d’atelier)     */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-sand-950 text-sand-50 border-y border-sand-800" aria-labelledby="pro-heading">
        <div className="container-belora">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-sand-400 mb-3">
              Belora Pro · Pour les artisans & créateurs
            </p>
            <h2 id="pro-heading" className="display-lg text-sand-50 mb-6 text-balance">
              L’outil d’agenda qui sublime votre maison de beauté.
            </h2>
            <p className="text-base sm:text-lg text-sand-300 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
              Fédérez votre équipe, sécurisez vos revenus grâce aux acomptes en ligne et offrez à votre clientèle une expérience de réservation digne de votre exigence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start mb-14">
              <div className="p-7 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
                <span className="block font-display text-3xl text-primary-300 mb-3 font-normal">
                  01
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                  Agenda multi-collaborateurs
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Vue jour et semaine ultra-fluide, gestion intuitive des pauses, congés et temps de pose par praticien.
                </p>
              </div>

              <div className="p-7 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
                <span className="block font-display text-3xl text-primary-300 mb-3 font-normal">
                  02
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                  Protection contre les no-shows
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Acomptes en ligne sécurisés Stripe Connect et rappels automatiques par SMS pour garantir vos créneaux.
                </p>
              </div>

              <div className="p-7 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-900/60 hover:border-sand-700 transition-colors">
                <span className="block font-display text-3xl text-primary-300 mb-3 font-normal">
                  03
                </span>
                <h3 className="font-semibold text-sm text-sand-100 mb-2 tracking-wide">
                  Visibilité sur la marketplace
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Une vitrine haut de gamme sans publicité intrusive, réservable 24h/24 pour conquérir une clientèle qualifiée.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pro" className="btn btn-primary btn-lg w-full sm:w-auto">
                <span>Rejoindre Belora Pro</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/pro#contact"
                className="btn btn-editorial-light btn-lg w-full sm:w-auto"
              >
                <span>Demander une démonstration</span>
                <svg
                  className="w-3.5 h-3.5 btn-icon-slide"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 9. Maillage SEO par Villes & Footer                                   */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-bg" aria-labelledby="cities-heading">
        <div className="container-belora">
          <div className="mb-8">
            <p className="eyebrow mb-2">Présence nationale</p>
            <h2 id="cities-heading" className="display-md text-sand-900">
              Trouver un salon ou institut près de chez vous
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 border-t border-line">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/search?location=${encodeURIComponent(city)}`}
                className="p-3.5 rounded-[var(--radius-sm)] border border-line bg-surface hover:border-sand-400 hover:bg-sand-100 transition-all text-xs text-sand-900 font-medium flex items-center justify-between group"
              >
                <span>{city}</span>
                <svg
                  className="w-3 h-3 text-fg-subtle group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
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
      <footer className="bg-sand-50 border-t border-line py-16 text-fg-muted">
        <div className="container-belora">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
            <div>
              <p className="font-display text-2xl text-sand-900 mb-3">Belora</p>
              <p className="text-xs leading-relaxed max-w-xs text-pretty">
                Plateforme de réservation de soins d’exception. Reliant les passionnés
                de beauté et bien-être aux meilleurs artisans indépendants.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-4">
                Univers
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/search?category=hair" className="hover:text-sand-900 transition-colors">
                    Salons de coiffure
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=facial" className="hover:text-sand-900 transition-colors">
                    Instituts de beauté
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=barber" className="hover:text-sand-900 transition-colors">
                    Barbiers
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=massage" className="hover:text-sand-900 transition-colors">
                    Massages & Spas
                  </Link>
                </li>
                <li>
                  <Link href="/search?category=nails" className="hover:text-sand-900 transition-colors">
                    Manucure & Pédicure
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-4">
                Professionnels
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/pro" className="hover:text-sand-900 transition-colors">
                    Belora pour les salons
                  </Link>
                </li>
                <li>
                  <Link href="/pro/calendar" className="hover:text-sand-900 transition-colors">
                    Logiciel d’agenda
                  </Link>
                </li>
                <li>
                  <Link href="/pro/pricing" className="hover:text-sand-900 transition-colors">
                    Tarifs & Abonnements
                  </Link>
                </li>
                <li>
                  <Link href="/pro/onboarding" className="hover:text-sand-900 transition-colors">
                    Inscrire un établissement
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-900 mb-4">
                Informations
              </p>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/legal/terms" className="hover:text-sand-900 transition-colors">
                    Conditions Générales (CGU)
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-sand-900 transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="hover:text-sand-900 transition-colors">
                    Gestion des cookies
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-sand-900 transition-colors">
                    Contact & Assistance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-subtle">
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
