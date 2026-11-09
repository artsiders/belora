"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

interface AgendaToolbarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: "day" | "week";
  onViewModeChange: (mode: "day" | "week") => void;
  intervalMinutes: number;
  onIntervalChange: (interval: number) => void;
  onNewAppointment: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function AgendaToolbar({
  currentDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  intervalMinutes,
  onIntervalChange,
  onNewAppointment,
  onToggleSidebar,
  isSidebarOpen,
}: AgendaToolbarProps) {
  const handlePrevDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() - (viewMode === "day" ? 1 : 7));
    onDateChange(next);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + (viewMode === "day" ? 1 : 7));
    onDateChange(next);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white border-b border-neutral-200/90 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs select-none">
      {/* Contrôles de navigation de date */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Basculer le panneau latéral"
          className={`p-2 rounded-lg border text-neutral-700 transition-colors cursor-pointer ${
            isSidebarOpen
              ? "bg-neutral-100 border-neutral-300 text-neutral-950"
              : "bg-white border-neutral-200 hover:bg-neutral-50"
          }`}
          title="Afficher/Masquer le panneau filtres"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleToday}
          className="btn btn-outline btn-sm"
        >
          Aujourd&apos;hui
        </button>

        <div className="flex items-center gap-0.5 border border-neutral-200 rounded-lg bg-white p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1 rounded-md text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Jour précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextDay}
            className="p-1 rounded-md text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Jour suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Affichage de la date sélectionnée (Style Planity) */}
        <div className="flex items-center gap-2 px-2">
          <Calendar className="w-4 h-4 text-primary-700 hidden sm:block" />
          <span className="text-sm sm:text-base font-bold text-neutral-950 capitalize">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Vue jour/semaine, intervalle et bouton Création */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle Vue jour / Vue semaine */}
        <div className="inline-flex p-1 rounded-lg bg-neutral-100 border border-neutral-200/80 text-sm font-semibold">
          <button
            type="button"
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "day"
                ? "bg-white text-neutral-950 shadow-2xs font-bold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Vue jour
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              viewMode === "week"
                ? "bg-white text-neutral-950 shadow-2xs font-bold"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Vue semaine
          </button>
        </div>

        {/* Granularité des créneaux (15 min / 20 min / 30 min) */}
        <div className="hidden md:flex items-center gap-1.5 text-sm text-neutral-600">
          <span className="text-neutral-500">Pas :</span>
          <select
            value={intervalMinutes}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="select h-8 px-2 py-0 text-sm font-semibold text-neutral-800"
          >
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={20}>20 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>

        {/* Bouton Création d'un RDV */}
        <button
          type="button"
          onClick={onNewAppointment}
          className="btn btn-primary btn-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau RDV</span>
        </button>
      </div>
    </div>
  );
}
