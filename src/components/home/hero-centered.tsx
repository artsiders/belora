import Image from "next/image";
import { Search, MapPin, Layers, Calendar } from "lucide-react";

export function HeroCentered() {
  return (
    <section className="relative w-full bg-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-sand-200/80">
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Colonne Gauche : Titre éditorial, sous-titre et barre de recherche */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Eyebrow épuré sans badges artificiels */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase font-semibold tracking-wider text-sand-500">
                Beauté · Bien-être · Soin de soi
              </span>
            </div>

            {/* Titre demandé par l'utilisateur (Montserrat pur, sans italique) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sand-950 leading-tight mb-4 text-balance">
              Prendre soin de soi,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                c’est déjà être beau.
              </span>
            </h1>

            {/* Sous-titre sobre et accueillant */}
            <p className="text-sm sm:text-base text-sand-600 leading-relaxed max-w-xl mb-8 font-normal">
              Réservez en quelques clics votre moment de bien-être parmi les meilleurs
              salons et instituts indépendants près de chez vous.
            </p>

            {/* Carte de recherche inspirée de la référence */}
            <form
              action="/search"
              method="GET"
              className="bg-white rounded-2xl border border-sand-200/90 p-4 sm:p-5 space-y-4 max-w-xl"
              role="search"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Champ 1 : Où ? */}
                <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200/60 focus-within:border-primary-500 transition-colors">
                  <label
                    htmlFor="search-location"
                    className="block text-xs font-semibold text-sand-900 mb-1"
                  >
                    Où ?
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-sand-600">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <input
                      id="search-location"
                      name="location"
                      type="text"
                      placeholder="Paris, Lyon, quartier..."
                      className="w-full bg-transparent text-xs text-sand-900 placeholder:text-sand-400 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Champ 2 : Quoi ? */}
                <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200/60 focus-within:border-primary-500 transition-colors">
                  <label
                    htmlFor="search-category"
                    className="block text-xs font-semibold text-sand-900 mb-1"
                  >
                    Quoi ?
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-sand-600">
                    <Layers className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <select
                      id="search-category"
                      name="category"
                      className="w-full bg-transparent text-xs text-sand-900 focus:outline-none cursor-pointer font-medium"
                      defaultValue=""
                    >
                      <option value="">Toutes les prestations</option>
                      <option value="hair">Coiffure d’auteur</option>
                      <option value="facial">Soins visage & éclat</option>
                      <option value="massage">Massages & Spas</option>
                      <option value="nails">Mains & pieds</option>
                      <option value="barber">Barbiers & Homme</option>
                    </select>
                  </div>
                </div>

                {/* Champ 3 : Quand ? */}
                <div className="p-3 rounded-xl bg-sand-50/70 border border-sand-200/60 focus-within:border-primary-500 transition-colors">
                  <label
                    htmlFor="search-date"
                    className="block text-xs font-semibold text-sand-900 mb-1"
                  >
                    Quand ?
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-sand-600">
                    <Calendar className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <input
                      id="search-date"
                      name="date"
                      type="date"
                      className="w-full bg-transparent text-xs text-sand-900 focus:outline-none cursor-pointer font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de recherche Terracotta pleine largeur */}
              <button
                type="submit"
                className="w-full btn btn-primary py-3.5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher un salon</span>
              </button>
            </form>
          </div>

          {/* Colonne Droite : Composition en arches (Arch Formes) de la DA */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Arche Principale Photographique (Gauche du bloc) */}
              <div className="col-span-8 relative h-[360px] sm:h-[460px] lg:h-[500px] arch-t rounded-b-2xl overflow-hidden bg-sand-200 border border-sand-200/80 shadow-sm">
                <Image
                  src="/images/heroes/hero-facial.jpg"
                  alt="Rituel de soin du visage et bien-être"
                  fill
                  priority
                  sizes="(max-width: 1024px) 70vw, 32vw"
                  className="object-cover"
                />
              </div>

              {/* Colonne Droite : Formes graphiques Arches de couleur */}
              <div className="col-span-4 flex flex-col gap-3 sm:gap-4 h-[360px] sm:h-[460px] lg:h-[500px]">
                {/* Arche supérieure Olive / Kaki avec mantra */}
                <div className="flex-1 arch-t rounded-b-2xl bg-earth-olive p-4 sm:p-5 flex flex-col justify-center text-center text-white shadow-2xs">
                  <p className="text-xs sm:text-sm font-medium leading-snug">
                    Prendre soin de soi, c’est se reconnecter.
                  </p>
                </div>

                {/* Arche inférieure Blush / Sable doux */}
                <div className="h-32 sm:h-44 arch-r rounded-l-2xl bg-earth-sand shadow-2xs flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
