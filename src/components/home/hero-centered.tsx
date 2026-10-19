import Image from "next/image";

export function HeroCentered() {
  return (
    <section className="relative w-full min-h-[calc(100vh-132px)] overflow-hidden flex flex-col justify-between pt-14 sm:pt-20 pb-8 sm:pb-12 border-b border-line">
      {/* 1. Photographie haute définition en arrière-plan complet (Full Width) */}
      <Image
        src="/images/heroes/hero-image.jpeg"
        alt="Atmosphère d’un salon de soin haut de gamme partenaire Belora"
        fill
        priority
        sizes="100vw"
        className="object-cover object-bottom"
      />

      {/* 2. L'overlay en demi-arc de cercle arrondi :
             SEUL le top-center est opaque pour abriter le texte et la recherche,
             les bords gauche et droit restent totalement transparents pour dévoiler la photo */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            "radial-gradient(ellipse 65% 88% at 50% 0%, var(--bg) 0%, var(--bg) 40%, rgba(246, 241, 234, 0.94) 55%, rgba(246, 241, 234, 0.2) 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Voile sombre léger au pied de la photo pour asseoir la cartouche */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-1"
        style={{
          background:
            "linear-gradient(to top, rgba(18, 16, 13, 0.45) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* 3. Contenu textuel et recherche positionnés au centre sur l'arc opaque */}
      <div className="container-belora relative z-10 w-full text-center">
        <div className="max-w-4xl mx-auto">
          {/* Grand titre centré à fort contraste */}
          <h1 className="display-xl text-sand-950 mb-4 sm:mb-5 text-balance">
            L’art du soin,{" "}
            <span className="font-normal text-primary-600 block sm:inline">
              à votre rythme.
            </span>
          </h1>

          {/* Sous-titre marketplace sobre et précis */}
          <p className="text-base sm:text-lg text-sand-700 max-w-2xl mx-auto text-pretty leading-relaxed mb-8 sm:mb-12 font-normal">
            Découvrez et réservez les salons de coiffure, instituts et spas
            indépendants sélectionnés pour l’exigence de leurs artisans.
          </p>

          {/* Barre de recherche 3 champs centrée */}
          <form
            action="/search"
            method="GET"
            className="searchbar shadow-2xl shadow-sand-950/10 bg-sand-50 border border-sand-300 max-w-3xl mx-auto"
            role="search"
          >
            <div className="searchbar-field">
              <label
                htmlFor="search-service"
                className="searchbar-label text-xs font-semibold text-sand-900"
              >
                Prestation ou salon
              </label>
              <input
                id="search-service"
                name="q"
                type="text"
                placeholder="Coupe, soin éclat, balayage…"
                className="searchbar-input text-sand-900 font-medium"
                autoComplete="off"
              />
            </div>

            <div className="searchbar-field">
              <label
                htmlFor="search-location"
                className="searchbar-label text-xs font-semibold text-sand-900"
              >
                Où (ville, quartier)
              </label>
              <input
                id="search-location"
                name="location"
                type="text"
                placeholder="Paris, Lyon, Bordeaux…"
                className="searchbar-input text-sand-900 font-medium"
                autoComplete="address-level2"
              />
            </div>

            <div className="searchbar-field">
              <label
                htmlFor="search-date"
                className="searchbar-label text-xs font-semibold text-sand-900"
              >
                Date souhaitée
              </label>
              <input
                id="search-date"
                name="date"
                type="date"
                className="searchbar-input text-sand-900 cursor-pointer font-medium"
              />
            </div>

            <button
              type="submit"
              className="searchbar-submit px-8 text-xs font-semibold tracking-wider uppercase group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:scale-110"
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
        </div>
      </div>
    </section>
  );
}
