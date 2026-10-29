"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { CategoryData } from "@/lib/data/categories";

interface CategoryHeroProps {
  category: CategoryData;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section className="relative w-full bg-sand-50/70 border-b border-primary-200/80 pt-8 pb-12 sm:pt-12 sm:pb-16 select-none">
      <div className="container-belora">
        {/* Fil d'Ariane / Breadcrumb sobre */}
        <nav aria-label="Fil d'ariane" className="mb-6 flex items-center gap-1.5 text-xs text-sand-500">
          <Link href="/" className="hover:text-sand-950 transition-colors">
            Accueil
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
          <Link href="/search" className="hover:text-sand-950 transition-colors">
            Prestations
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-sand-400" />
          <span className="text-sand-900 font-medium">{category.name}</span>
        </nav>

        {/* Titre & Sous-titre */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <span className="eyebrow text-primary-700 tracking-wider font-semibold block mb-2">
            {category.eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-sand-950 leading-tight">
            {category.heroTitle}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-sand-600 font-normal leading-relaxed">
            {category.heroSubtitle}
          </p>
        </div>

        {/* Capsule de recherche épurée & performante */}
        <div className="max-w-4xl bg-white rounded-2xl border border-primary-200/90 shadow-md p-2.5 sm:p-3">
          <form
            action="/search"
            method="GET"
            role="search"
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3"
          >
            {/* Champ Catégorie masqué pour conserver le contexte */}
            <input type="hidden" name="category" value={category.slug} />

            {/* Input 1 : Prestation ou Salon */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sand-50/60 border border-neutral-200/60 focus-within:bg-white focus-within:border-primary-500 transition-colors">
              <Search className="w-4 h-4 text-primary-600 shrink-0" />
              <input
                type="text"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={category.searchPlaceholder}
                className="w-full bg-transparent text-xs sm:text-sm text-sand-950 placeholder:text-sand-500 focus:outline-none"
              />
            </div>

            {/* Input 2 : Métropole / Adresse */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sand-50/60 border border-neutral-200/60 focus-within:bg-white focus-within:border-primary-500 transition-colors">
              <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
              <input
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Où ? Paris, New York, Tokyo, Milan..."
                className="w-full bg-transparent text-xs sm:text-sm text-sand-950 placeholder:text-sand-500 focus:outline-none"
              />
            </div>

            {/* Bouton Soumettre */}
            <button
              type="submit"
              className="btn-dark min-h-11 px-6 rounded-xl shrink-0 inline-flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-white" />
              <span>Rechercher</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
