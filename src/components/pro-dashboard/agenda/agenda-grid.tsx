"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  Users,
  Armchair,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  ProStaffMember,
  ProResource,
  ProAppointment,
} from "@/lib/data/pro-mock-data";
import { AppointmentCard } from "@/components/pro-dashboard/agenda/appointment-card";

interface AgendaGridProps {
  staffList: ProStaffMember[];
  resourceList: ProResource[];
  appointments: ProAppointment[];
  intervalMinutes: number;
  viewMode?: "day" | "week";
  currentDate?: Date;
  onSelectAppointment: (appointment: ProAppointment) => void;
  onSlotClick: (
    time: string,
    staffId?: string,
    resourceId?: string,
    date?: string
  ) => void;
}

const START_HOUR = 9; // 09:00
const END_HOUR = 20; // 20:00
const HOUR_HEIGHT = 80; // 80px per hour

export function AgendaGrid({
  staffList,
  resourceList,
  appointments,
  intervalMinutes,
  viewMode = "day",
  currentDate = new Date(),
  onSelectAppointment,
  onSlotClick,
}: AgendaGridProps) {
  // Filtre d'affichage des colonnes en vue Jour (Collaborateurs vs Cabines vs Tous)
  const [dayColumnFilter, setDayColumnFilter] = useState<
    "staff" | "resource" | "all"
  >("staff");

  // Collaborateur actif en vue Semaine
  const [selectedWeekStaffId, setSelectedWeekStaffId] = useState<string>(
    staffList[0]?.id || "staff-1"
  );

  // Position de la ligne d'heure en direct
  const [currentLineTop, setCurrentLineTop] = useState<number | null>(null);

  useEffect(() => {
    const updateTimeLine = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();

      if (currentH >= START_HOUR && currentH <= END_HOUR) {
        const minutesSinceStart = (currentH - START_HOUR) * 60 + currentM;
        setCurrentLineTop((minutesSinceStart / 60) * HOUR_HEIGHT);
      } else {
        setCurrentLineTop(null);
      }
    };

    updateTimeLine();
    const interval = setInterval(updateTimeLine, 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = useMemo(() => {
    const list: string[] = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      list.push(`${String(h).padStart(2, "0")}:00`);
    }
    return list;
  }, []);

  const totalGridHeight = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;

  // Calcul du positionnement vertical d'un créneau
  const getPosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = (startH - START_HOUR) * 60 + startM;
    const endMinutes = (endH - START_HOUR) * 60 + endM;

    const topPx = (startMinutes / 60) * HOUR_HEIGHT;
    const heightPx = Math.max(
      35,
      ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT
    );

    return { topPx, heightPx };
  };

  // Calcul des 7 jours en Vue Semaine
  const weekDays = useMemo(() => {
    const base = new Date(currentDate);
    const day = base.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(base);
    monday.setDate(base.getDate() + mondayOffset);

    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("fr-FR", { weekday: "short" });
      const dayNum = d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      const isToday = new Date().toDateString() === d.toDateString();
      return { date: d, iso, dayName, dayNum, isToday };
    });
  }, [currentDate]);

  // Colonnes en Vue Jour selon le filtre
  const dayColumns = useMemo(() => {
    const staffCols = staffList.map((st) => ({
      type: "staff" as const,
      id: st.id,
      name: st.name,
      role: st.role,
      avatar: st.avatar,
      color: st.color,
    }));

    const resourceCols = resourceList.map((res) => ({
      type: "resource" as const,
      id: res.id,
      name: res.name,
      role: "Cabine / Poste",
      avatar: "",
      color: res.color,
    }));

    if (dayColumnFilter === "staff") return staffCols;
    if (dayColumnFilter === "resource") return resourceCols;
    return [...staffCols, ...resourceCols];
  }, [staffList, resourceList, dayColumnFilter]);

  const activeWeekStaff = useMemo(() => {
    return (
      staffList.find((s) => s.id === selectedWeekStaffId) ||
      staffList[0] || {
        id: "staff-1",
        name: "Collaborateur",
        role: "Styliste",
        color: "#82385a",
      }
    );
  }, [staffList, selectedWeekStaffId]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-auto custom-scrollbar select-none">
      {/* Barre de contrôle contextuelle (Filtre praticiens/cabines en vue jour ou sélecteur en vue semaine) */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-neutral-50/95 border-b border-neutral-200/90 backdrop-blur-xs">
        {viewMode === "day" ? (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white border border-neutral-200/80 shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDayColumnFilter("staff")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                dayColumnFilter === "staff"
                  ? "bg-primary-600 text-white shadow-2xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Praticiens ({staffList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setDayColumnFilter("resource")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                dayColumnFilter === "resource"
                  ? "bg-primary-600 text-white shadow-2xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Armchair className="w-3.5 h-3.5" />
              <span>Cabines & Postes ({resourceList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setDayColumnFilter("all")}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                dayColumnFilter === "all"
                  ? "bg-primary-600 text-white shadow-2xs font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tous</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-500">
              Planning hebdomadaire de :
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={selectedWeekStaffId}
                onChange={(e) => setSelectedWeekStaffId(e.target.value)}
                className="select h-8 ps-3 pe-8 text-sm font-bold text-neutral-900 appearance-none shadow-2xs"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute end-2.5 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="text-xs text-neutral-500 font-medium hidden sm:block">
          Cliquez sur un créneau pour créer un rendez-vous
        </div>
      </div>

      {/* Header des colonnes (Sticky sous la barre de filtre) */}
      <div className="sticky top-[45px] z-20 flex bg-white border-b border-neutral-200/90 shadow-2xs">
        {/* Coin supérieur gauche (échelle horaire) */}
        <div className="w-16 sm:w-20 shrink-0 p-3 bg-neutral-50/90 border-e border-neutral-200/80 text-center text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Heures
        </div>

        {/* ===================================================================
            HEADER VUE JOUR
            =================================================================== */}
        {viewMode === "day" && (
          <div className="flex-1 flex divide-x divide-neutral-200/80 min-w-max">
            {dayColumns.map((col) => {
              const count = appointments.filter((apt) =>
                col.type === "staff"
                  ? apt.staffId === col.id
                  : apt.resourceId === col.id
              ).length;

              return (
                <div
                  key={`${col.type}-${col.id}`}
                  className="w-56 sm:w-64 p-3 bg-white flex items-center justify-between gap-2 shrink-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-1 h-6 rounded-full shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    {col.avatar && (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200 shrink-0 ring-1 ring-neutral-200/80">
                        <Image
                          src={col.avatar}
                          alt={col.name}
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-neutral-950 truncate">
                        {col.name}
                      </h4>
                      <p className="text-xs text-neutral-500 truncate font-medium">
                        {col.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                    {count} RDV
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            HEADER VUE SEMAINE (7 JOURS)
            =================================================================== */}
        {viewMode === "week" && (
          <div className="flex-1 flex divide-x divide-neutral-200/80 min-w-max">
            {weekDays.map((day) => {
              const count = appointments.filter(
                (apt) => apt.staffId === activeWeekStaff.id
              ).length;

              return (
                <div
                  key={day.iso}
                  className={`w-52 sm:w-60 p-3 flex items-center justify-between gap-2 shrink-0 ${
                    day.isToday ? "bg-primary-50/40" : "bg-white"
                  }`}
                >
                  <div>
                    <h4
                      className={`text-sm font-bold capitalize ${
                        day.isToday ? "text-primary-800" : "text-neutral-950"
                      }`}
                    >
                      {day.dayName} {day.dayNum}
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium">
                      {activeWeekStaff.name}
                    </p>
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0">
                    {count} RDV
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Corps de la Grille */}
      <div
        className="relative flex min-w-max"
        style={{ height: totalGridHeight }}
      >
        {/* Échelle horaire sur la gauche */}
        <div className="w-16 sm:w-20 shrink-0 bg-neutral-50/40 border-e border-neutral-200/80 flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: HOUR_HEIGHT }}
              className="relative p-2 text-end text-xs font-semibold tabular-nums text-neutral-500 border-b border-neutral-100"
            >
              <span className="-translate-y-2 block">{hour}</span>
            </div>
          ))}
        </div>

        {/* Ligne d'heure actuelle en temps réel */}
        {currentLineTop !== null && (
          <div
            style={{ top: `${currentLineTop}px` }}
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
          >
            <div className="w-3 h-3 rounded-full bg-primary-600 -translate-x-1.5 shadow-xs" />
            <div className="h-0.5 w-full bg-primary-600/90 shadow-2xs" />
          </div>
        )}

        {/* ===================================================================
            GRILLE VUE JOUR
            =================================================================== */}
        {viewMode === "day" && (
          <div className="flex-1 flex divide-x divide-neutral-200/80">
            {dayColumns.map((col) => {
              const colAppointments = appointments.filter((apt) =>
                col.type === "staff"
                  ? apt.staffId === col.id
                  : apt.resourceId === col.id
              );

              return (
                <div
                  key={`grid-${col.type}-${col.id}`}
                  className="w-56 sm:w-64 relative shrink-0 hover:bg-neutral-50/30 transition-colors cursor-pointer"
                  style={{ height: totalGridHeight }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetY = e.clientY - rect.top;
                    const minutesFromStart = (offsetY / HOUR_HEIGHT) * 60;
                    const clickedH =
                      START_HOUR + Math.floor(minutesFromStart / 60);
                    const rawM = Math.floor(minutesFromStart % 60);
                    const snappedM =
                      Math.floor(rawM / intervalMinutes) * intervalMinutes;
                    const clickedTime = `${String(clickedH).padStart(
                      2,
                      "0"
                    )}:${String(snappedM).padStart(2, "0")}`;

                    onSlotClick(
                      clickedTime,
                      col.type === "staff" ? col.id : undefined,
                      col.type === "resource" ? col.id : undefined
                    );
                  }}
                >
                  {/* Lignes horizontales de repères horaires */}
                  {hours.map((hour) => (
                    <div
                      key={`line-${hour}`}
                      style={{ height: HOUR_HEIGHT }}
                      className="border-b border-neutral-100 border-dashed"
                    />
                  ))}

                  {/* Rendez-vous positionnés */}
                  {colAppointments.map((apt) => {
                    const { topPx, heightPx } = getPosition(
                      apt.startTime,
                      apt.endTime
                    );
                    return (
                      <AppointmentCard
                        key={`${col.type}-${apt.id}`}
                        appointment={apt}
                        topPx={topPx}
                        heightPx={heightPx}
                        colorBorder={col.color}
                        onClick={onSelectAppointment}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            GRILLE VUE SEMAINE (7 JOURS)
            =================================================================== */}
        {viewMode === "week" && (
          <div className="flex-1 flex divide-x divide-neutral-200/80">
            {weekDays.map((day) => {
              const dayAppointments = appointments.filter(
                (apt) => apt.staffId === activeWeekStaff.id
              );

              return (
                <div
                  key={`week-grid-${day.iso}`}
                  className={`w-52 sm:w-60 relative shrink-0 hover:bg-neutral-50/30 transition-colors cursor-pointer ${
                    day.isToday ? "bg-primary-50/15" : ""
                  }`}
                  style={{ height: totalGridHeight }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetY = e.clientY - rect.top;
                    const minutesFromStart = (offsetY / HOUR_HEIGHT) * 60;
                    const clickedH =
                      START_HOUR + Math.floor(minutesFromStart / 60);
                    const rawM = Math.floor(minutesFromStart % 60);
                    const snappedM =
                      Math.floor(rawM / intervalMinutes) * intervalMinutes;
                    const clickedTime = `${String(clickedH).padStart(
                      2,
                      "0"
                    )}:${String(snappedM).padStart(2, "0")}`;

                    onSlotClick(
                      clickedTime,
                      activeWeekStaff.id,
                      undefined,
                      day.iso
                    );
                  }}
                >
                  {/* Lignes horizontales de repères horaires */}
                  {hours.map((hour) => (
                    <div
                      key={`week-line-${day.iso}-${hour}`}
                      style={{ height: HOUR_HEIGHT }}
                      className="border-b border-neutral-100 border-dashed"
                    />
                  ))}

                  {/* Rendez-vous positionnés */}
                  {dayAppointments.map((apt) => {
                    const { topPx, heightPx } = getPosition(
                      apt.startTime,
                      apt.endTime
                    );
                    return (
                      <AppointmentCard
                        key={`week-apt-${apt.id}`}
                        appointment={apt}
                        topPx={topPx}
                        heightPx={heightPx}
                        colorBorder={activeWeekStaff.color}
                        onClick={onSelectAppointment}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
