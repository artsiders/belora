import Image from "next/image";
import Link from "next/link";

const SEARCH_SUGGESTIONS = [
  { label: "Balayage signature", query: "balayage" },
  { label: "Massage californien", query: "massage-californien" },
  { label: "Soin hydrafacial", query: "hydrafacial" },
  { label: "Manucure japonaise", query: "manucure-japonaise" },
  { label: "Taille de barbe", query: "barbe" },
];

export function HeroCentered() {
  return (
    <section className="relative w-full min-h-[720px] sm:min-h-[780px] lg:min-h-[860px] overflow-hidden flex flex-col justify-between pt-14 sm:pt-20 pb-8 sm:pb-12 border-b border-line">
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
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 65% 58% at 50% 0%, var(--bg) 0%, var(--bg) 40%, rgba(246, 241, 234, 0.94) 55%, rgba(246, 241, 234, 0.2) 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Voile sombre léger au pied de la photo pour asseoir la cartouche */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-[1]"
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
            <span className="display-italic font-normal text-primary-600 block sm:inline">
              à votre rythme.
            </span>
          </h1>

          {/* Sous-titre marketplace sobre et précis */}
          <p className="text-base sm:text-lg text-sand-700 max-w-2xl mx-auto text-pretty leading-relaxed mb-8 sm:mb-10 font-normal">
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
                className="searchbar-label text-xs font-semibold text-sand-500"
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
                className="searchbar-label text-xs font-semibold text-sand-500"
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
                className="searchbar-label text-xs font-semibold text-sand-500"
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

          {/* Suggestions de recherche avec fond OPAQUE solide */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-sand-700 font-semibold mr-1">
              Recherches fréquentes :
            </span>
            {SEARCH_SUGGESTIONS.map((item) => (
              <Link
                key={item.query}
                href={`/search?q=${item.query}`}
                className="chip text-xs bg-sand-50 hover:bg-sand-200 border border-sand-300 text-sand-900 font-medium shadow-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Cartouche réassurance Marketplace Belora (centrée sur le rôle de la plateforme) */}
      <div className="container-belora relative z-10 mt-12 sm:mt-16 flex justify-end w-full">
        <div className="max-w-sm sm:max-w-md p-5 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300/80 shadow-xl text-sand-900">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-600" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-widest text-sand-600 font-semibold">
                Marketplace Belora
              </span>
            </div>
            <span className="text-[11px] text-primary-600 font-semibold flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Réservation garantie
            </span>
          </div>

          <p className="font-display text-lg text-sand-950 mb-1.5 leading-snug">
            Prenez rendez-vous en moins de 90 secondes.
          </p>
          <p className="text-xs text-sand-600 leading-relaxed mb-4">
            Coiffure, barbiers, soins du visage et spas indépendants partout en France. Disponibilités en direct, zéro appel téléphonique, confirmation immédiate.
          </p>

          <div className="pt-3 border-t border-line/80 flex items-center justify-between text-xs text-sand-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-medium">
                <span className="text-primary-600 font-bold">✓</span> 24h/24 & 7j/7
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-primary-600 font-bold">✓</span> Rappels SMS
              </span>
            </div>
            <Link
              href="/search"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group/link"
            >
              <span>Explorer</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
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
  );
}
