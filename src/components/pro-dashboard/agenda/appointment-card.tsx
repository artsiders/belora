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
  const isCompact = heightPx < 50;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(appointment);
      }}
      style={{
        top: `${topPx}px`,
        height: `${Math.max(34, heightPx - 2)}px`,
        borderInlineStartColor: colorBorder,
      }}
      className="absolute inset-x-1.5 border-s-4 bg-white border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-shadow duration-150 p-2 cursor-pointer z-10 overflow-hidden flex flex-col justify-between select-none"
    >
      <div>
        {/* Ligne 1 : Heure & Récurrence */}
        <div className="flex items-center justify-between gap-1 text-sm font-bold text-neutral-900 leading-tight">
          <span className="tabular-nums">
            {appointment.startTime} - {appointment.endTime}
          </span>
          <div className="flex items-center gap-1">
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
        <div className="font-semibold text-xs text-neutral-950 truncate mt-0.5">
          {appointment.clientName}
        </div>

        {/* Ligne 3 : Prestation (si hauteur suffisante) */}
        {!isCompact && (
          <div className="text-sm text-neutral-600 truncate mt-0.5">
            {appointment.serviceName}
          </div>
        )}
      </div>

      {/* Ligne basse : Ressource / Statut (si hauteur suffisante) */}
      {!isCompact && heightPx > 70 && (
        <div className="flex items-center justify-between gap-1 pt-1 mt-1 border-t border-neutral-100 text-[10px] text-neutral-500">
          <span className="truncate">
            {appointment.resourceName || "Sans cabine"}
          </span>
          <span className="font-bold tabular-nums text-neutral-900 shrink-0">
            {appointment.price} €
          </span>
        </div>
      )}
    </div>
  );
}
