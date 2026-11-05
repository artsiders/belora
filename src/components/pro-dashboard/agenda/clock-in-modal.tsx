"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, CheckCircle2, LogOut, LogIn } from "lucide-react";
import { Modal } from "@/components/pro-dashboard/ui/modal";
import { ProStaffMember } from "@/lib/data/pro-mock-data";

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffList: ProStaffMember[];
  onToggleClockIn: (staffId: string) => void;
}

export function ClockInModal({
  isOpen,
  onClose,
  staffList,
  onToggleClockIn,
}: ClockInModalProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAction = (staff: ProStaffMember) => {
    onToggleClockIn(staff.id);
    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const action = staff.presenceToday.clockedIn
      ? "Départ enregistré"
      : "Arrivée enregistrée";
    setSuccessMessage(`${action} pour ${staff.name} à ${now}.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pointage des présences en temps réel"
      description="Enregistrer l’arrivée ou le départ des collaborateurs du salon."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
          >
            Fermer
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="divide-y divide-neutral-200/80">
          {staffList.map((staff) => {
            const isClockedIn = staff.presenceToday.clockedIn;

            return (
              <div
                key={staff.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                    <Image
                      src={staff.avatar}
                      alt={staff.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-950">
                      {staff.name}
                    </h4>
                    <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>
                        {isClockedIn
                          ? `Arrivé(e) à ${staff.presenceToday.clockInTime}`
                          : "Non pointé(e) actuellement"}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(staff)}
                  className={`btn btn-sm text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer ${
                    isClockedIn
                      ? "bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                  }`}
                >
                  {isClockedIn ? (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Pointer le départ</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Pointer l’arrivée</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
