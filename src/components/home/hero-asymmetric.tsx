import Image from "next/image";
import Link from "next/link";

const SEARCH_SUGGESTIONS = [
  { label: "Balayage signature", query: "balayage" },
  { label: "Massage californien", query: "massage-californien" },
  { label: "Soin hydrafacial", query: "hydrafacial" },
  { label: "Manucure japonaise", query: "manucure-japonaise" },
  { label: "Taille de barbe", query: "barbe" },
];

export function HeroAsymmetric() {
  return (
    <section className="relative overflow-hidden bg-bg pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-line">
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Colonne gauche : Typographie noble, 100% lisible & Searchbar */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary-600" aria-hidden="true" />
              <span className="text-xs uppercase tracking-widest text-sand-600 font-semibold">
                Maison de réservation · Beauté & Bien-être
              </span>
            </div>

            <h1 className="display-xl text-sand-950 mb-6 text-balance">
              L’art du soin,{" "}
              <span className="display-italic font-normal text-primary-600 block sm:inline">
                à votre rythme.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-sand-600 max-w-xl text-pretty leading-relaxed mb-10">
              Découvrez et réservez les salons de coiffure, instituts et spas
              indépendants sélectionnés pour l’exigence de leurs artisans.
            </p>

            {/* Barre de recherche architecturée 3 champs */}
            <form
              action="/search"
              method="GET"
              className="searchbar shadow-lg shadow-sand-900/5 bg-sand-50 border border-sand-300 max-w-2xl"
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
                  Date
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
                className="searchbar-submit px-7 text-xs font-semibold tracking-wider uppercase group"
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

            {/* Recherches fréquentes */}
            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-sand-500 font-medium mr-1">
                Tendances :
              </span>
              {SEARCH_SUGGESTIONS.map((item) => (
                <Link
                  key={item.query}
                  href={`/search?q=${item.query}`}
                  className="chip text-xs bg-surface hover:bg-sand-200 border-line text-sand-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Colonne droite : Grande Composition Photographique Immersive */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] min-h-[460px] sm:min-h-[580px] rounded-[var(--radius-photo)] overflow-hidden border border-line bg-sand-200 shadow-2xl shadow-sand-900/10">
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85"
                alt="Ambiance architecturale d’un salon partenaire Belora"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />

              {/* Voile discret au bas de l'image */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-sand-950/70 via-transparent to-transparent"
                aria-hidden="true"
              />

              {/* Cartouche d'ambiance d'atelier */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-md border border-sand-200 shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-0.5">
                      Sélection de la semaine
                    </span>
                    <p className="font-display text-lg text-sand-900">
                      L’Atelier Botanique · Paris 3e
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600">
                      <span>★</span> 4,95 / 5
                    </span>
                    <span className="block text-[10px] text-fg-subtle">
                      142 avis certifiés
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
