"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, Plus } from "lucide-react";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { MOCK_STAFF, ProStaffMember } from "@/lib/data/pro-mock-data";

export default function TeamSettingsPage() {
  const [staffList] = useState<ProStaffMember[]>(MOCK_STAFF);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Gestion du Temps de Travail & Équipe
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Plannings individuels, horaires hebdomadaires et congés des collaborateurs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => showFeedback("Fonctionnalité d'invitation active.")}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto rounded-xl shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Inviter un collaborateur</span>
        </button>
      </div>

      {/* Grille des Membres d'Équipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                  <Image
                    src={staff.avatar}
                    alt={staff.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-950">
                    {staff.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {staff.role}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {staff.email} &bull; {staff.phone}
                  </p>
                </div>
              </div>

              <span
                className="w-3 h-3 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: staff.color }}
                title="Couleur d'agenda"
              />
            </div>

            {/* Horaires et Présence */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-neutral-700">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>
                  Plage habituelle :{" "}
                  <strong>
                    {staff.presenceToday.plannedStart} -{" "}
                    {staff.presenceToday.plannedEnd}
                  </strong>
                </span>
              </div>
              <Badge
                variant={staff.presenceToday.clockedIn ? "success" : "neutral"}
                size="sm"
              >
                {staff.presenceToday.clockedIn ? "Présent(e)" : "Non pointé"}
              </Badge>
            </div>

            {/* Jours travaillés */}
            <div className="flex items-center justify-between pt-1 text-xs text-neutral-600">
              <span>Jours travaillés : Mar, Mer, Jeu, Ven, Sam</span>
              <button
                type="button"
                onClick={() =>
                  showFeedback(`Plannings de ${staff.name} configurables.`)
                }
                className="text-primary-700 font-semibold hover:underline cursor-pointer"
              >
                Modifier planning &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
