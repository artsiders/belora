"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, CalendarDays, Scissors, ChevronLeft, ChevronRight, ChevronRight as ChevronIcon } from "lucide-react";
import { CategoryData } from "@/lib/data/categories";

interface CategoryHeroProps {
  category: CategoryData;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fermer le calendrier au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Génération des jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;
    return { daysInMonth, startOffset };
  };

  const activeMonth = currentMonth || new Date(2026, 0, 1);
  const { daysInMonth, startOffset } = getDaysInMonth(activeMonth);

  const handleToggleCalendar = () => {
    if (!currentMonth) {
      setCurrentMonth(new Date());
    }
    setIsCalendarOpen((prev) => !prev);
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const base = currentMonth || new Date();
    setCurrentMonth(new Date(base.getFullYear(), base.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const base = currentMonth || new Date();
    setCurrentMonth(new Date(base.getFullYear(), base.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const base = currentMonth || new Date();
    const chosen = new Date(base.getFullYear(), base.getMonth(), day);
    setSelectedDate(chosen);
    setIsCalendarOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <section className="relative w-full h-auto overflow-hidden bg-neutral-950 py-7 sm:py-10 select-none">
      {/* 1. Visuel d'arrière-plan avec masque sombre neutre */}
      <div className="absolute inset-0 z-0">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      </div>

      {/* 2. Contenu principal : aligné à gauche avec boîte sobre et concise */}
      <div className="container-belora relative z-20 flex flex-col items-start gap-7 sm:gap-10">
        {/* Fil d'Ariane épuré sans fioritures */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-base text-white/70">
          <Link href="/" className="hover:text-white transition-colors">
            Accueil
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 text-white/40" />
          <Link href="/search" className="hover:text-white transition-colors">
            Univers
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white font-medium">{category.name}</span>
        </nav>

        {/* Carré sobre, compact et professionnel (Noir encre architectural) */}
        <div className="w-full max-w-xl lg:max-w-2xl bg-secondary-950/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-left">

          {/* Titre sobre et concis avec mots mis en valeur */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug mb-2">
            {category.titlePrefix}{" "}
            <span className="text-primary-300 font-bold">
              {category.titleHighlight}
            </span>
          </h1>

          {/* Sous-titre sobre et court */}
          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed">
            {category.heroSubtitle}
          </p>
        </div>

        {/* 3. Barre de recherche - Alignée À GAUCHE (sans centrage) */}
        <div className="w-full max-w-4xl text-left">
          <form
            action="/search"
            method="GET"
            role="search"
            className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
              {/* Champ 1 : Où ? */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-neutral-50 focus-within:bg-neutral-50 rounded-xl transition-colors">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="category-location"
                    className="block text-xs font-semibold text-neutral-950 uppercase tracking-wide cursor-pointer"
                  >
                    Où ?
                  </label>
                  <input
                    id="category-location"
                    name="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ville, code postal, pays..."
                    className="w-full bg-transparent text-sm sm:text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none font-medium truncate"
                  />
                </div>
              </div>

              {/* Séparateur vertical (desktop) */}
              <div className="hidden md:block w-px h-8 bg-neutral-200 shrink-0 mx-1" aria-hidden="true" />

              {/* Champ 2 : Prestation */}
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-neutral-50 focus-within:bg-neutral-50 rounded-xl transition-colors">
                <Scissors className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor="category-service"
                    className="block text-xs font-semibold text-neutral-950 uppercase tracking-wide cursor-pointer"
                  >
                    Prestation
                  </label>
                  <input type="hidden" name="category" value={category.slug} />
                  <input
                    id="category-service"
                    name="q"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={category.searchPlaceholder}
                    className="w-full bg-transparent text-sm sm:text-base text-neutral-800 placeholder:text-neutral-400 focus:outline-none font-medium truncate"
                  />
                </div>
              </div>

              {/* Séparateur vertical (desktop) */}
              <div className="hidden md:block w-px h-8 bg-neutral-200 shrink-0 mx-1" aria-hidden="true" />

              {/* Champ 3 : Date Moderne avec Dropdown Calendar */}
              <div ref={calendarRef} className="relative flex-1">
                <div
                  onClick={handleToggleCalendar}
                  className="flex items-center gap-3 px-3.5 py-2 hover:bg-neutral-50 rounded-xl cursor-pointer transition-colors"
                >
                  <CalendarDays className="w-4 h-4 text-primary-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-neutral-950 uppercase tracking-wide">
                      Quand ?
                    </span>
                    <input
                      type="hidden"
                      name="date"
                      value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                    />
                    <span className="block text-sm sm:text-base text-neutral-400 font-medium truncate">
                      {selectedDate ? formatDisplayDate(selectedDate) : "Ajouter une date"}
                    </span>
                  </div>
                </div>

                {/* Popup Calendrier Moderne */}
                {isCalendarOpen && (
                  <div className="absolute bottom-full mb-3 left-0 sm:left-auto sm:right-0 w-[280px] sm:w-[310px] bg-white rounded-2xl shadow-2xl border border-primary-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-neutral-950 capitalize">
                        {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(activeMonth)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-700 transition cursor-pointer"
                          aria-label="Mois précédent"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-700 transition cursor-pointer"
                          aria-label="Mois suivant"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs font-semibold text-neutral-400">
                      <span>Lu</span><span>Ma</span><span>Me</span><span>Je</span><span>Ve</span><span>Sa</span><span>Di</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {Array.from({ length: startOffset }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-8" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const isSelected =
                          selectedDate?.getDate() === day &&
                          selectedDate?.getMonth() === activeMonth.getMonth() &&
                          selectedDate?.getFullYear() === activeMonth.getFullYear();

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectDay(day)}
                            className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary-600 text-white font-bold"
                                : "text-neutral-800 hover:bg-neutral-100"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton de recherche bordeaux */}
              <div className="pt-1.5 md:pt-0 shrink-0">
                <button
                  type="submit"
                  className="btn btn-primary py-5 rounded-xl w-full cursor-pointer flex items-center justify-center gap-2"
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
