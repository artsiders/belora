"use client";

import React, { useState } from "react";
import Image from "next/image";
// Modal pour les horaires de présence
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { ProStaffMember } from "@/lib/data/pro-mock-data";

interface PresenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: ProStaffMember[];
  onUpdatePresence: (staffId: string, start: string, end: string) => void;
}

export function PresenceModal({
  isOpen,
  onClose,
  staffList,
  onUpdatePresence,
}: PresenceModalProps) {
  const [localTimes, setLocalTimes] = useState<
    Record<string, { start: string; end: string }>
  >(
    staffList.reduce((acc, st) => {
      acc[st.id] = {
        start: st.presenceToday.plannedStart,
        end: st.presenceToday.plannedEnd,
      };
      return acc;
    }, {} as Record<string, { start: string; end: string }>)
  );

  const handleSave = () => {
    Object.entries(localTimes).forEach(([staffId, times]) => {
      onUpdatePresence(staffId, times.start, times.end);
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Horaires de présence de l’équipe"
      description="Consulter et ajuster les plages de présence planifiées pour la journée."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary btn-sm"
          >
            Enregistrer les horaires
          </button>
        </div>
      }
    >
      <div className="divide-y divide-neutral-200/80">
        {staffList.map((staff) => {
          const times = localTimes[staff.id] || {
            start: staff.presenceToday.plannedStart,
            end: staff.presenceToday.plannedEnd,
          };

          return (
            <div
              key={staff.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                  <Image
                    src={staff.avatar}
                    alt={staff.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950">
                    {staff.name}
                  </h4>
                  <p className="text-sm text-neutral-500">{staff.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <input
                  type="time"
                  value={times.start}
                  onChange={(e) =>
                    setLocalTimes({
                      ...localTimes,
                      [staff.id]: { ...times, start: e.target.value },
                    })
                  }
                  className="h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900"
                />
                <span className="text-neutral-400 text-sm">à</span>
                <input
                  type="time"
                  value={times.end}
                  onChange={(e) =>
                    setLocalTimes({
                      ...localTimes,
                      [staff.id]: { ...times, end: e.target.value },
                    })
                  }
                  className="h-9 px-2.5 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900"
                />
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
