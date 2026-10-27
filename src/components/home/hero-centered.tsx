"use client";

import Image from "next/image";
import { Search, MapPin, CalendarDays, User } from "lucide-react";

export function HeroCentered() {
  return (
    <section className="relative w-full overflow-hidden bg-sand-100">
      {/* 1. Visuel Communauté Beauté & Bien-être plein écran / ratio éditorial */}
      <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[720px]">
        <Image
          src="/images/heroes/hero-banner.webp"
          alt="Belora - Beauté, bien-être et communauté"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* 2. Barre de Recherche Flottante en Capsule intégrée en bas du visuel */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-7 inset-x-0 z-20 flex justify-center px-3 sm:px-6">
          <form
            action="/search"
            method="GET"
            role="search"
            className="w-full max-w-4xl bg-white/95 backdrop-blur-xs rounded-2xl border border-sand-200/90 shadow-xl p-2 sm:p-2.5"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-0">
              {/* Champ 1 : Où souhaitez-vous ? */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 focus-within:bg-sand-50 rounded-xl md:rounded-full transition-colors">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="hero-location"
                    className="block text-xs font-semibold text-sand-950 cursor-pointer"
                  >
                    Où souhaitez-vous ?
                  </label>
                  <input
                    id="hero-location"
                    name="location"
                    type="text"
                    placeholder="Ville, code postal..."
                    className="w-full bg-transparent text-xs text-sand-700 placeholder:text-sand-400 focus:outline-none font-medium truncate"
                  />
                </div>
              </div>

              {/* Séparateur vertical */}
              <div
                className="hidden md:block w-px h-8 bg-sand-200/90 shrink-0 mx-1"
                aria-hidden="true"
              />

              {/* Champ 2 : Quelle prestation ? */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 focus-within:bg-sand-50 rounded-xl md:rounded-full transition-colors">
                <CalendarDays className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="hero-service"
                    className="block text-xs font-semibold text-sand-950 cursor-pointer"
                  >
                    Quelle prestation ?
                  </label>
                  <input
                    id="hero-service"
                    name="category"
                    type="text"
                    placeholder="Coiffure, esthétique, onglerie..."
                    className="w-full bg-transparent text-xs text-sand-700 placeholder:text-sand-400 focus:outline-none font-medium truncate"
                  />
                </div>
              </div>

              {/* Séparateur vertical */}
              <div
                className="hidden md:block w-px h-8 bg-sand-200/90 shrink-0 mx-1"
                aria-hidden="true"
              />

              {/* Champ 3 : Quand ? */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 focus-within:bg-sand-50 rounded-xl md:rounded-full transition-colors">
                <User className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="hero-date"
                    className="block text-xs font-semibold text-sand-950 cursor-pointer"
                  >
                    Quand ?
                  </label>
                  <input
                    id="hero-date"
                    name="date"
                    type="text"
                    placeholder="Date souhaitée"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    className="w-full bg-transparent text-xs text-sand-700 placeholder:text-sand-400 focus:outline-none font-medium truncate cursor-pointer"
                  />
                </div>
              </div>

              {/* Bouton de recherche bordeaux / figue */}
              <div className="pt-1 md:pt-0 shrink-0 px-2 md:px-0">
                <button
                  type="submit"
                  className="w-full md:w-auto btn btn-primary rounded-xl h-full py-4"
                >
                  <Search className="w-4 h-4 text-white shrink-0" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
