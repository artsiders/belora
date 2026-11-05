"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarCheck2,
} from "lucide-react";
import {
  ProStaffMember,
  ProResource,
} from "@/lib/data/pro-mock-data";

interface AgendaSidebarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  staffList: ProStaffMember[];
  selectedStaffIds: string[];
  onToggleStaff: (staffId: string) => void;
  onToggleAllStaff: (selectAll: boolean) => void;
  resourceList: ProResource[];
  selectedResourceIds: string[];
  onToggleResource: (resId: string) => void;
  onToggleAllResources: (selectAll: boolean) => void;
  onOpenPresenceModal: () => void;
  onOpenClockInModal: () => void;
}

export function AgendaSidebar({
  currentDate,
  onDateSelect,
  staffList,
  selectedStaffIds,
  onToggleStaff,
  onToggleAllStaff,
  resourceList,
  selectedResourceIds,
  onToggleResource,
  onToggleAllResources,
  onOpenPresenceModal,
  onOpenClockInModal,
}: AgendaSidebarProps) {
  // Navigation du mini-calendrier
  const [calMonth, setCalMonth] = useState(currentDate.getMonth());
  const [calYear, setCalYear] = useState(currentDate.getFullYear());

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  // Calcul des jours du mois
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  // Adapter pour début lundi (0 = Lundi, 6 = Dimanche)
  const startingDay = (firstDayOfMonth + 6) % 7;

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const allStaffSelected =
    staffList.length > 0 && selectedStaffIds.length === staffList.length;
  const allResourcesSelected =
    resourceList.length > 0 &&
    selectedResourceIds.length === resourceList.length;

  return (
    <aside className="w-64 sm:w-72 bg-white border-e border-neutral-200/90 flex flex-col shrink-0 overflow-y-auto custom-scrollbar select-none">
      {/* 1. Mini Calendrier Interactif (Style Planity) */}
      <div className="p-4 border-b border-neutral-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-neutral-900 capitalize">
            {monthNames[calMonth]} {calYear}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Mois précédent"
              className="p-1 rounded-md text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Mois suivant"
              className="p-1 rounded-md text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-neutral-400 mb-1">
          <span>L</span>
          <span>M</span>
          <span>M</span>
          <span>J</span>
          <span>V</span>
          <span>S</span>
          <span>D</span>
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({ length: startingDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-7 w-7" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected =
              currentDate.getDate() === dayNum &&
              currentDate.getMonth() === calMonth &&
              currentDate.getFullYear() === calYear;
            const isToday =
              new Date().getDate() === dayNum &&
              new Date().getMonth() === calMonth &&
              new Date().getFullYear() === calYear;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => {
                  onDateSelect(new Date(calYear, calMonth, dayNum));
                }}
                className={`h-7 w-7 rounded-lg text-sm font-medium flex items-center justify-center transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary-600 text-white font-bold shadow-2xs"
                    : isToday
                    ? "border border-primary-600 text-primary-700 font-semibold"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Filtres Collaborateurs */}
      <div className="p-4 border-b border-neutral-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-neutral-900 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={allStaffSelected}
              onChange={(e) => onToggleAllStaff(e.target.checked)}
              className="accent-primary-600 w-4 h-4 rounded cursor-pointer"
            />
            <span>Collaborateurs ({staffList.length})</span>
          </label>
        </div>

        <div className="space-y-2 mt-2">
          {staffList.map((staff) => {
            const isChecked = selectedStaffIds.includes(staff.id);
            return (
              <div
                key={staff.id}
                onClick={() => onToggleStaff(staff.id)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? "bg-neutral-50/80 border-neutral-200"
                    : "bg-white border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleStaff(staff.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-primary-600 w-4 h-4 rounded cursor-pointer shrink-0"
                  />
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                    <Image
                      src={staff.avatar}
                      alt={staff.name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {staff.name}
                    </p>
                  </div>
                </div>

                {/* Badge d'heures de présence journalières */}
                <span className="text-[10px] font-semibold text-neutral-500 tabular-nums bg-white px-1.5 py-0.5 rounded border border-neutral-200/80 shrink-0">
                  {staff.presenceToday.totalLogged}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Filtres Cabines & Ressources */}
      <div className="p-4 border-b border-neutral-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-neutral-900 uppercase tracking-wider">
            <input
              type="checkbox"
              checked={allResourcesSelected}
              onChange={(e) => onToggleAllResources(e.target.checked)}
              className="accent-primary-600 w-4 h-4 rounded cursor-pointer"
            />
            <span>Ressources ({resourceList.length})</span>
          </label>
        </div>

        <div className="space-y-1.5 mt-2">
          {resourceList.map((res) => {
            const isChecked = selectedResourceIds.includes(res.id);
            return (
              <label
                key={res.id}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                  isChecked
                    ? "bg-neutral-50/80 border-neutral-200 text-neutral-900"
                    : "bg-white border-transparent text-neutral-500 opacity-60 hover:opacity-90"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleResource(res.id)}
                  className="accent-primary-600 w-4 h-4 rounded cursor-pointer shrink-0"
                />
                <span className="truncate">{res.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Boutons d'action RH (Horaires de présence & Pointage) */}
      <div className="p-4 mt-auto space-y-2.5 bg-neutral-50/50">
        <button
          type="button"
          onClick={onOpenPresenceModal}
          className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <CalendarCheck2 className="w-4 h-4 text-neutral-600" />
          <span>Horaires de présence</span>
        </button>

        <button
          type="button"
          onClick={onOpenClockInModal}
          className="w-full h-11 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>Pointage équipe</span>
        </button>
      </div>
    </aside>
  );
}
