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
    <section className="relative bg-bg pt-6 pb-16 lg:pt-8 lg:pb-20 border-b border-line">
      <div className="container-belora">
        {/* Conteneur principal inspiré de Voiceflow : Image en fond intégral avec cadre doux */}
        <div className="relative w-full min-h-[720px] sm:min-h-[780px] lg:min-h-[840px] rounded-2xl sm:rounded-3xl overflow-hidden border border-line shadow-2xl flex flex-col justify-between pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8 lg:px-12">
          {/* 1. Photographie haute définition en arrière-plan complet */}
          <Image
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=2400&q=85"
            alt="Intérieur architectural lumineux et apaisant d’un salon partenaire Belora"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />

          {/* 2. L'overlay en demi-arc de cercle (dôme/ellipse) :
                 Opaque au sommet derrière le texte pour une lisibilité absolue,
                 qui s'arrondit et s'estompe vers le bas pour révéler la photo */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background:
                "radial-gradient(ellipse 130% 68% at 50% 0%, var(--bg) 0%, var(--bg) 42%, rgba(246, 241, 234, 0.92) 58%, rgba(246, 241, 234, 0.4) 78%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* Voile sombre léger au pied de la photo pour faire ressortir la cartouche */}
          <div
            className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-[1]"
            style={{
              background:
                "linear-gradient(to top, rgba(18, 16, 13, 0.5) 0%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {/* 3. Contenu textuel et recherche positionnés par-dessus le dôme opaque */}
          <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
            {/* Pastille éditoriale sobre */}
            <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 rounded-full bg-sand-200/70 border border-sand-300">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600" aria-hidden="true" />
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-sand-800 font-semibold">
                Maison de réservation · Beauté & Bien-être
              </span>
            </div>

            {/* Grand titre centré à fort contraste */}
            <h1 className="display-xl text-sand-950 mb-4 sm:mb-5 text-balance">
              L’art du soin,{" "}
              <span className="display-italic font-normal text-primary-600 block sm:inline">
                à votre rythme.
              </span>
            </h1>

            {/* Sous-titre sobre et précis */}
            <p className="text-base sm:text-lg text-sand-700 max-w-2xl mx-auto text-pretty leading-relaxed mb-8 sm:mb-10 font-normal">
              Découvrez et réservez les salons de coiffure, instituts et spas
              indépendants sélectionnés pour l’exigence de leurs artisans.
            </p>

            {/* Barre de recherche 3 champs centrée */}
            <form
              action="/search"
              method="GET"
              className="searchbar shadow-2xl shadow-sand-950/10 bg-sand-50/98 backdrop-blur-md border border-sand-300 max-w-3xl mx-auto"
              role="search"
            >
              <div className="searchbar-field">
                <label
                  htmlFor="search-service"
                  className="searchbar-label text-[10px] font-semibold text-sand-500"
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
                  className="searchbar-label text-[10px] font-semibold text-sand-500"
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
                  className="searchbar-label text-[10px] font-semibold text-sand-500"
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

            {/* Suggestions de recherche */}
            <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-sand-600 font-medium mr-1">
                Recherches fréquentes :
              </span>
              {SEARCH_SUGGESTIONS.map((item) => (
                <Link
                  key={item.query}
                  href={`/search?q=${item.query}`}
                  className="chip text-xs bg-sand-50/90 hover:bg-sand-200 border-sand-300 text-sand-800 backdrop-blur-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Cartouche d'artisan / témoignage flottante dans le bas de la photo (Style Voiceflow) */}
          <div className="relative z-10 mt-12 sm:mt-16 flex justify-end w-full">
            <div className="max-w-sm sm:max-w-md p-5 sm:p-6 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-md border border-sand-200/90 shadow-2xl text-sand-900">
              <p className="font-display text-base sm:text-lg italic text-sand-900 mb-3 leading-snug">
                « Un accueil feutré, une écoute rare et un balayage minéral d’une
                précision absolue. C’est exactement le niveau d’artisanat que je recherchais. »
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-line/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center font-display text-primary-700 font-semibold text-xs">
                    CB
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-sand-900 leading-tight">
                      Camille B.
                    </p>
                    <p className="text-[10px] text-fg-subtle">
                      Cliente vérifiée · L’Atelier Botanique
                    </p>
                  </div>
                </div>
                <Link
                  href="/venue/atelier-botanique-paris"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 group/link"
                >
                  <span>Découvrir</span>
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
        </div>
      </div>
    </section>
  );
}
