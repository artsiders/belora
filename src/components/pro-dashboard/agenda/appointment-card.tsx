"use client";

import React from "react";
import { Repeat, ShieldCheck } from "lucide-react";
import { ProAppointment } from "@/lib/data/pro-mock-data";

interface AppointmentCardProps {
  appointment: ProAppointment;
  topPx: number;
  heightPx: number;
  colorBorder?: string;
  onClick: (appointment: ProAppointment) => void;
}

export function AppointmentCard({
  appointment,
  topPx,
  heightPx,
  colorBorder = "#82385a",
  onClick,
}: AppointmentCardProps) {
  // Densité d'affichage selon la hauteur exacte du créneau
  const isMicro = heightPx < 45; // < 35 min
  const isCompact = heightPx < 65; // < 50 min
  const isSpacious = heightPx >= 85; // >= 65 min

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(appointment);
      }}
      style={{
        top: `${topPx}px`,
        height: `${Math.max(30, heightPx - 2)}px`,
      }}
      className="absolute inset-x-1 rounded-none bg-white border border-neutral-200/90 shadow-2xs hover:border-neutral-400/90 transition-colors duration-150 p-2 ps-3 cursor-pointer z-10 overflow-hidden flex flex-col justify-between select-none group"
    >
      {/* Barre d'accentuation latérale droite et nette (sans arrondi) */}
      <span
        className="absolute start-0 top-0 bottom-0 w-[2px] rounded-none"
        style={{ backgroundColor: colorBorder }}
      />

      <div className="min-w-0 flex-1 flex flex-col justify-start">
        {/* Ligne 1 : Heure & Badges */}
        <div className="flex items-center justify-between gap-1 text-xs font-bold text-neutral-900 leading-none">
          <span className="tabular-nums">
            {appointment.startTime} - {appointment.endTime}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {appointment.isRecurring && (
              <span title="Client régulier">
                <Repeat className="w-3 h-3 text-neutral-400" />
              </span>
            )}
            {appointment.depositPaid > 0 && (
              <span title={`Acompte de ${appointment.depositPaid} € perçu via Stripe Connect`}>
                <ShieldCheck className="w-3.5 h-3.5 text-primary-700" />
              </span>
            )}
          </div>
        </div>

        {/* Ligne 2 : Nom du client */}
        <div
          className={`font-bold text-neutral-950 truncate leading-tight ${
            isMicro ? "text-xs mt-0.5" : "text-sm mt-1"
          }`}
        >
          {appointment.clientName}
        </div>

        {/* Ligne 3 : Prestation (uniquement si hauteur suffisante pour ne pas tronquer le texte) */}
        {!isCompact && (
          <div className="text-xs text-neutral-600 truncate mt-0.5 font-medium leading-tight">
            {appointment.serviceName}
          </div>
        )}
      </div>

      {/* Ligne basse : Ressource / Prix (uniquement si créneau spacieux) */}
      {isSpacious && (
        <div className="flex items-center justify-between gap-1 pt-1 mt-1 border-t border-neutral-100 text-xs text-neutral-500 leading-none">
          <span className="truncate font-medium">
            {appointment.resourceName || "Sans cabine"}
          </span>
          <span className="font-bold tabular-nums text-neutral-950 shrink-0">
            {appointment.price} €
          </span>
        </div>
      )}
    </div>
  );
}
