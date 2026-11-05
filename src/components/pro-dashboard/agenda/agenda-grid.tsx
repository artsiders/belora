"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
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
  onSelectAppointment: (appointment: ProAppointment) => void;
  onSlotClick: (time: string, staffId?: string, resourceId?: string) => void;
}

const START_HOUR = 9; // 09:00
const END_HOUR = 20; // 20:00
const HOUR_HEIGHT = 80; // 80px per hour

export function AgendaGrid({
  staffList,
  resourceList,
  appointments,
  intervalMinutes,
  onSelectAppointment,
  onSlotClick,
}: AgendaGridProps) {
  // Calcul de la position de la ligne de temps en direct
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

  // Calcul du positionnement d'un RDV
  const getPosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startMinutes = (startH - START_HOUR) * 60 + startM;
    const endMinutes = (endH - START_HOUR) * 60 + endM;

    const topPx = (startMinutes / 60) * HOUR_HEIGHT;
    const heightPx = Math.max(35, ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT);

    return { topPx, heightPx };
  };

  const allColumns = [
    ...staffList.map((st) => ({
      type: "staff" as const,
      id: st.id,
      name: st.name,
      role: st.role,
      avatar: st.avatar,
      color: st.color,
    })),
    ...resourceList.map((res) => ({
      type: "resource" as const,
      id: res.id,
      name: res.name,
      role: "Cabine / Poste",
      avatar: "",
      color: res.color,
    })),
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-auto custom-scrollbar select-none">
      {/* Header des colonnes (Sticky) */}
      <div className="sticky top-0 z-20 flex bg-white border-b border-neutral-200/90 shadow-2xs">
        {/* Coin supérieur gauche (échelle horaire) */}
        <div className="w-16 sm:w-20 shrink-0 p-3 bg-neutral-50/90 border-e border-neutral-200/80 text-center text-sm font-semibold text-neutral-500">
          Heures
        </div>

        {/* Colonnes des Collaborateurs et Cabines */}
        <div className="flex-1 flex divide-x divide-neutral-200/80 min-w-max">
          {allColumns.map((col) => (
            <div
              key={`${col.type}-${col.id}`}
              className="w-56 sm:w-64 p-3 bg-white flex items-center justify-between gap-2 shrink-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-1.5 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: col.color }}
                />
                {col.avatar && (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-neutral-200 shrink-0">
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
                  <h4 className="text-sm sm:text-base font-bold text-neutral-950 truncate">
                    {col.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500 truncate">
                    {col.role}
                  </p>
                </div>
              </div>

              {/* Nombre de RDV dans la colonne */}
              <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full tabular-nums shrink-0">
                {
                  appointments.filter((apt) =>
                    col.type === "staff"
                      ? apt.staffId === col.id
                      : apt.resourceId === col.id
                  ).length
                }{" "}
                RDV
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Corps de la Grille */}
      <div className="relative flex min-w-max" style={{ height: totalGridHeight }}>
        {/* Échelle horaire sur la gauche */}
        <div className="w-16 sm:w-20 shrink-0 bg-neutral-50/40 border-e border-neutral-200/80 flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: HOUR_HEIGHT }}
              className="relative p-2 text-end text-sm font-semibold tabular-nums text-neutral-500 border-b border-neutral-100"
            >
              <span className="-translate-y-2 block">{hour}</span>
            </div>
          ))}
        </div>

        {/* Ligne d'heure actuelle en temps réel (Traversant toutes les colonnes) */}
        {currentLineTop !== null && (
          <div
            style={{ top: `${currentLineTop}px` }}
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
          >
            <div className="w-3 h-3 rounded-full bg-primary-600 -translate-x-1.5 shadow-xs" />
            <div className="h-0.5 w-full bg-primary-600/90 shadow-2xs" />
          </div>
        )}

        {/* Grille multi-colonnes */}
        <div className="flex-1 flex divide-x divide-neutral-200/80">
          {allColumns.map((col) => {
            // Filtrage des rendez-vous de cette colonne
            const colAppointments = appointments.filter((apt) =>
              col.type === "staff"
                ? apt.staffId === col.id
                : apt.resourceId === col.id
            );

            return (
              <div
                key={`grid-${col.type}-${col.id}`}
                className="w-56 sm:w-64 relative shrink-0 hover:bg-neutral-50/30 transition-colors"
                style={{ height: totalGridHeight }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const offsetY = e.clientY - rect.top;
                  const minutesFromStart = (offsetY / HOUR_HEIGHT) * 60;
                  const clickedH = START_HOUR + Math.floor(minutesFromStart / 60);
                  const rawM = Math.floor(minutesFromStart % 60);
                  const snappedM = Math.floor(rawM / intervalMinutes) * intervalMinutes;
                  const clickedTime = `${String(clickedH).padStart(2, "0")}:${String(
                    snappedM
                  ).padStart(2, "0")}`;

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
      </div>
    </div>
  );
}
