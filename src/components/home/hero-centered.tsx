"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, CalendarDays, Scissors, ChevronLeft, ChevronRight } from "lucide-react";

export function HeroCentered() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Initialisation différée de la date courante (évite l'erreur blocking-prerender au build)
  useEffect(() => {
    setCurrentMonth(new Date());
  }, []);

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
    // Décalage pour démarrer le lundi (0: Dim -> 6: Sam)
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
    <section className="relative w-full h-[calc(100dvh-216px)] min-h-115 max-h-[calc(100dvh-191px)] overflow-hidden bg-sand-100 flex flex-col justify-end">
      {/* 1. Visuel d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/heroes/people-collage-design.webp"
          alt="Belora - Beauté, bien-être et communauté"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/10 pointer-events-none" />
      </div>

      {/* 2. Barre de Recherche Intégrale - Centrée au bas de la vue visible */}
      <div className="relative z-20 w-full flex justify-center px-3 sm:px-6 pb-6 sm:pb-8 md:pb-10 shrink-0">
        <form
          action="/search"
          method="GET"
          role="search"
          className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl border border-sand-200/90 shadow-2xl p-2 sm:p-2.5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-0">
            {/* Champ 1 : Où souhaitez-vous ? */}
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 focus-within:bg-sand-50 rounded-2xl transition-colors">
              <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="hero-location"
                  className="block text-xs font-semibold text-sand-950 uppercase tracking-wide cursor-pointer"
                >
                  Où ?
                </label>
                <input
                  id="hero-location"
                  name="location"
                  type="text"
                  placeholder="Ville, code postal..."
                  className="w-full bg-transparent text-xs sm:text-sm text-sand-800 placeholder:text-sand-400 focus:outline-none font-medium truncate"
                />
              </div>
            </div>

            {/* Séparateur vertical (desktop) */}
            <div className="hidden md:block w-px h-8 bg-sand-200 shrink-0 mx-1" aria-hidden="true" />

            {/* Champ 2 : Prestation */}
            <div className="flex-1 flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 focus-within:bg-sand-50 rounded-2xl transition-colors">
              <Scissors className="w-4 h-4 text-primary-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="hero-service"
                  className="block text-xs font-semibold text-sand-950 uppercase tracking-wide cursor-pointer"
                >
                  Prestation
                </label>
                <input
                  id="hero-service"
                  name="category"
                  type="text"
                  placeholder="Coiffure, soins..."
                  className="w-full bg-transparent text-xs sm:text-sm text-sand-800 placeholder:text-sand-400 focus:outline-none font-medium truncate"
                />
              </div>
            </div>

            {/* Séparateur vertical (desktop) */}
            <div className="hidden md:block w-px h-8 bg-sand-200 shrink-0 mx-1" aria-hidden="true" />

            {/* Champ 3 : Date Moderne avec Dropdown Calendar */}
            <div ref={calendarRef} className="relative flex-1">
              <div
                onClick={handleToggleCalendar}
                className="flex items-center gap-3 px-3.5 py-2 hover:bg-sand-50/80 rounded-2xl cursor-pointer transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-primary-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-semibold text-sand-950 uppercase tracking-wide">
                    Quand ?
                  </span>
                  <input
                    type="hidden"
                    name="date"
                    value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                  />
                  <span className="block text-xs sm:text-sm text-sand-400 font-medium truncate">
                    {selectedDate ? formatDisplayDate(selectedDate) : "Ajouter une date"}
                  </span>
                </div>
              </div>

              {/* Popup Calendrier Moderne (s'ouvre vers le haut pour éviter le hors-champ) */}
              {isCalendarOpen && (
                <div className="absolute bottom-full mb-3 left-0 sm:left-auto sm:right-0 w-[280px] sm:w-[310px] bg-white rounded-2xl shadow-2xl border border-sand-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Entête du mois */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold text-sand-950 capitalize">
                      {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(activeMonth)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-sand-100 rounded-lg text-sand-700 transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-sand-100 rounded-lg text-sand-700 transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Noms des jours */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs font-semibold text-sand-400">
                    <span>Lu</span><span>Ma</span><span>Me</span><span>Je</span><span>Ve</span><span>Sa</span><span>Di</span>
                  </div>

                  {/* Grille des jours */}
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
                              : "text-sand-800 hover:bg-sand-100"
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

            {/* Bouton de recherche */}
            <div className="pt-1.5 md:pt-0 shrink-0">
              <button
                type="submit"
                className="btn btn-primary py-3.5 rounded-xl w-full cursor-pointer"
              >
                <Search className="w-4 h-4 text-white shrink-0" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}