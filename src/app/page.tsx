import Image from "next/image";
import Link from "next/link";

interface CategoryTile {
  slug: string;
  name: string;
  image: string;
  count: string;
}

interface VenuePreview {
  slug: string;
  name: string;
  type: string;
  city: string;
  district: string;
  rating: string;
  reviewCount: number;
  image: string;
}

const CATEGORIES: CategoryTile[] = [
  {
    slug: "hair",
    name: "Coiffure & Coloration",
    count: "420 adresses",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "barber",
    name: "Barbiers & Soins Homme",
    count: "180 adresses",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "nails",
    name: "Manucure & Ongles",
    count: "260 adresses",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "facial",
    name: "Soins Visage & Institut",
    count: "310 adresses",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "massage",
    name: "Massages & Spas",
    count: "195 adresses",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "wellness",
    name: "Rituels & Bien-être",
    count: "140 adresses",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
  },
];

const CURATED_VENUES: VenuePreview[] = [
  {
    slug: "atelier-botanique-paris",
    name: "L'Atelier Botanique",
    type: "Coiffure naturelle & végétale",
    city: "Paris",
    district: "Le Marais",
    rating: "4,9",
    reviewCount: 142,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "maison-albar-soins",
    name: "Maison Albar Institut",
    type: "Soin visage sur-mesure & spa",
    city: "Lyon",
    district: "Presqu'île",
    rating: "5,0",
    reviewCount: 96,
    image:
      "https://images.unsplash.com/photo-1512290900672-1f55b9a89c8a?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "barbier-saint-germain",
    name: "Le Salon Saint-Germain",
    type: "Taille de barbe & coupe classique",
    city: "Bordeaux",
    district: "Triangle d'Or",
    rating: "4,9",
    reviewCount: 218,
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "bain-de-vapeur-sequoia",
    name: "Studio Séquoia",
    type: "Massage relaxant & rituel corporel",
    city: "Marseille",
    district: "Vieux-Port",
    rating: "4,8",
    reviewCount: 88,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80",
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

const SEARCH_SUGGESTIONS = [
  { label: "Balayage signature", query: "balayage" },
  { label: "Massage californien", query: "massage-californien" },
  { label: "Soin hydrafacial", query: "hydrafacial" },
  { label: "Manucure japonaise", query: "manucure-japonaise" },
  { label: "Taille de barbe", query: "barbe" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* -------------------------------------------------------------------- */}
      {/* 1. Header / Navigation                                                */}
      {/* -------------------------------------------------------------------- */}
      <header className="nav">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="nav-logo hover:opacity-85 transition-opacity"
            aria-label="Belora - Accueil"
          >
            Belora
          </Link>
          <nav className="hidden lg:flex items-center gap-6" aria-label="Univers">
            <Link href="/search?category=hair" className="nav-link">
              Coiffure
            </Link>
            <Link href="/search?category=facial" className="nav-link">
              Soins visage
            </Link>
            <Link href="/search?category=massage" className="nav-link">
              Massages & Spas
            </Link>
            <Link href="/search?category=barber" className="nav-link">
              Barbiers
            </Link>
            <Link href="/search?category=nails" className="nav-link">
              Onglerie
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/pro"
            className="hidden sm:inline-flex text-xs font-medium tracking-wide uppercase text-fg-muted hover:text-fg transition-colors"
          >
            Espace Professionnel
          </Link>

          <span className="hidden sm:inline-block w-px h-4 bg-line" aria-hidden="true" />

          <Link href="/account" className="btn btn-outline btn-sm">
            <svg
              className="w-4 h-4 text-fg-muted"
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
      {/* 2. Hero Photographique & Recherche intégrée                           */}
      {/* -------------------------------------------------------------------- */}
      <section className="hero">
        <Image
          src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=2000&q=85"
          alt="Atmosphère d'un salon de soin haut de gamme"
          fill
          priority
          sizes="100vw"
          className="hero-media"
        />

        <div className="container-belora w-full pb-16 pt-24 sm:pb-20 relative z-10">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <h1 className="display-xl text-sand-50 mb-4 text-balance">
              L’art du soin, <span className="display-italic">à votre rythme.</span>
            </h1>
            <p className="text-base sm:text-lg text-sand-200 max-w-xl text-pretty leading-relaxed">
              Découvrez et réservez les salons de coiffure, instituts et spas
              indépendants sélectionnés pour leur exigence.
            </p>
          </div>

          {/* Formulaire de recherche 3 champs */}
          <form
            action="/search"
            method="GET"
            className="searchbar shadow-sm max-w-4xl"
            role="search"
          >
            <div className="searchbar-field">
              <label htmlFor="search-service" className="searchbar-label">
                Prestation ou établissement
              </label>
              <input
                id="search-service"
                name="q"
                type="text"
                placeholder="Coupe, soin éclat, balayage…"
                className="searchbar-input"
                autoComplete="off"
              />
            </div>

            <div className="searchbar-field">
              <label htmlFor="search-location" className="searchbar-label">
                Adresse, ville ou quartier
              </label>
              <input
                id="search-location"
                name="location"
                type="text"
                placeholder="Paris, Lyon, Bordeaux…"
                className="searchbar-input"
                autoComplete="address-level2"
              />
            </div>

            <div className="searchbar-field">
              <label htmlFor="search-date" className="searchbar-label">
                Date souhaitée
              </label>
              <input
                id="search-date"
                name="date"
                type="date"
                className="searchbar-input cursor-pointer"
              />
            </div>

            <button type="submit" className="searchbar-submit">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>Rechercher</span>
            </button>
          </form>

          {/* Suggestions rapides sobres */}
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-sand-300 font-medium mr-1">
              Recherches fréquentes :
            </span>
            {SEARCH_SUGGESTIONS.map((item) => (
              <Link
                key={item.query}
                href={`/search?q=${item.query}`}
                className="chip chip-photo text-xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 3. Univers & Catégories de Métiers                                    */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-bg" aria-labelledby="categories-heading">
        <div className="container-belora">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 hairline-b">
            <div>
              <p className="eyebrow mb-2">Savoir-faire d’exception</p>
              <h2 id="categories-heading" className="display-md text-sand-900">
                Explorer par univers
              </h2>
            </div>
            <Link
              href="/search"
              className="text-sm font-medium text-sand-900 hover:text-accent transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Tous les métiers</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className="tile group"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="tile-media"
                />
                <div className="tile-body">
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-sand-300 font-medium mb-1">
                      {category.count}
                    </span>
                    <h3 className="tile-title text-lg sm:text-xl text-sand-50">
                      {category.name}
                    </h3>
                  </div>
                  <svg
                    className="tile-arrow text-sand-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. Sélection d'Établissements Recommandés                             */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-surface hairline-t hairline-b" aria-labelledby="venues-heading">
        <div className="container-belora">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 hairline-b">
            <div>
              <p className="eyebrow mb-2">Sélection rigoureuse</p>
              <h2 id="venues-heading" className="display-md text-sand-900">
                Adresses recommandées
              </h2>
            </div>
            <Link
              href="/search?filter=curated"
              className="text-sm font-medium text-sand-900 hover:text-accent transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explorer la sélection</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
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
                  <button
                    type="button"
                    className="fav-btn"
                    aria-label={`Ajouter ${venue.name} aux favoris`}
                  >
                    <svg
                      className="w-4 h-4 text-sand-900"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>

                <div className="venue-meta">
                  <h3 className="venue-name group-hover:text-accent transition-colors">
                    {venue.name}
                  </h3>
                  <div className="venue-rating font-medium flex items-center gap-1 text-xs">
                    <svg
                      className="w-3.5 h-3.5 text-accent fill-current"
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
                  {venue.type} · {venue.district}, {venue.city}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. Le Rituel Belora (Section Éditoriale Asymétrique)                   */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-bg" aria-labelledby="editorial-heading">
        <div className="container-belora">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-3">L’expérience Belora</p>
              <h2 id="editorial-heading" className="display-lg text-sand-900 mb-6 text-balance">
                Une réservation fluide, pensée pour votre sérénité.
              </h2>
              <p className="lead mb-10 text-pretty">
                Fini les appels pendant vos heures de travail ou l’attente d’une
                confirmation par message. Belora connecte directement votre
                créneau à l’agenda officiel du salon.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-line">
                  <span className="num font-display text-2xl text-accent font-normal">
                    01
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1">
                      Créneaux certifiés en temps réel
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Chaque horaire affiché correspond aux disponibilités réelles de
                      l’équipe. Aucune double réservation, jamais de mauvaise surprise.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-line">
                  <span className="num font-display text-2xl text-accent font-normal">
                    02
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1">
                      Rappels discrets et gestion sans friction
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Recevez les coordonnées précises et vos rappels par e-mail et
                      SMS. Modifiez ou annulez en un clic selon les conditions du lieu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="num font-display text-2xl text-accent font-normal">
                    03
                  </span>
                  <div>
                    <h3 className="font-semibold text-sand-900 text-sm mb-1">
                      Règlement transparent
                    </h3>
                    <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                      Acompte ou paiement sur place selon les règles de
                      l’établissement. Aucun surcoût ni frais cachés pour le client.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-[var(--radius-photo)] overflow-hidden bg-sand-200">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Détail d'un rituel de soin et de détente"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 6. Section Professionnels                                             */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-sand-900 text-sand-50" aria-labelledby="pro-heading">
        <div className="container-belora">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium tracking-widest uppercase text-sand-400 mb-3">
              Pour les salons & praticiens indépendants
            </p>
            <h2 id="pro-heading" className="display-lg text-sand-50 mb-6 text-balance">
              Le logiciel d’agenda pensé pour votre maison de beauté.
            </h2>
            <p className="text-base sm:text-lg text-sand-300 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
              Rejoignez Belora pour gérer vos plannings d’équipe, encaisser vos
              acomptes en ligne et attirer une nouvelle clientèle sans dépendre du téléphone.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start mb-12">
              <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-950/60">
                <span className="block font-display text-3xl text-primary-300 mb-2">
                  01
                </span>
                <h3 className="font-medium text-sm text-sand-100 mb-2">
                  Agenda multi-collaborateurs
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Vue jour et semaine fluide, horaires personnalisés, pauses et
                  congés gérés en toute simplicité.
                </p>
              </div>

              <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-950/60">
                <span className="block font-display text-3xl text-primary-300 mb-2">
                  02
                </span>
                <h3 className="font-medium text-sm text-sand-100 mb-2">
                  Réduction des rendez-vous manqués
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Rappels automatiques par SMS et prise d’acompte Stripe Connect
                  pour sécuriser vos créneaux.
                </p>
              </div>

              <div className="p-6 rounded-[var(--radius-sm)] border border-sand-800 bg-sand-950/60">
                <span className="block font-display text-3xl text-primary-300 mb-2">
                  03
                </span>
                <h3 className="font-medium text-sm text-sand-100 mb-2">
                  Visibilité sur la marketplace
                </h3>
                <p className="text-xs text-sand-400 leading-relaxed">
                  Une vitrine élégante, fidèle à votre identité et ouverte aux
                  réservations 24h sur 24.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pro" className="btn btn-primary btn-lg w-full sm:w-auto">
                <span>Découvrir l’espace professionnel</span>
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
                className="btn btn-outline border-sand-700 text-sand-200 hover:text-sand-50 hover:border-sand-400 btn-lg w-full sm:w-auto"
              >
                Parler à un conseiller
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 7. Maillage SEO par Villes & Footer                                   */}
      {/* -------------------------------------------------------------------- */}
      <section className="section bg-bg" aria-labelledby="cities-heading">
        <div className="container-belora">
          <div className="mb-6">
            <p className="eyebrow mb-2">Présence nationale</p>
            <h2 id="cities-heading" className="display-md text-sand-900">
              Trouver un rendez-vous près de chez vous
            </h2>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-line">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city}
                href={`/search?location=${encodeURIComponent(city)}`}
                className="text-sm text-fg-muted hover:text-sand-900 transition-colors"
              >
                Coiffeur & soins à <span className="font-medium text-sand-900">{city}</span>
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
