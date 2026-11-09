"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { CheckoutTerminal } from "@/components/pro-dashboard/checkout/checkout-terminal";
import { DailyClosingModal } from "@/components/pro-dashboard/checkout/daily-closing-modal";
import {
  MOCK_SERVICES,
  MOCK_STAFF,
  MOCK_CLIENTS,
  MOCK_APPOINTMENTS,
  MOCK_TICKETS,
  ProSaleTicket,
} from "@/lib/data/pro-mock-data";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [tickets, setTickets] = useState<ProSaleTicket[]>(MOCK_TICKETS);
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);

  const handleTicketCompleted = (newTicket: ProSaleTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const totalDayRevenue = tickets.reduce((acc, t) => acc + t.totalTtc, 0);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Barre d'outils supérieure de la Caisse */}
      <div className="bg-white border-b border-neutral-200/90 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs select-none">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-950 leading-tight">
            Caisse & Encaissement POS
          </h1>
          <p className="text-sm text-neutral-500">
            {tickets.length} encaissement{tickets.length > 1 ? "s" : ""} enregistré{tickets.length > 1 ? "s" : ""} aujourd&apos;hui &bull; Total :{" "}
            <strong className="text-neutral-900 font-bold tabular-nums">
              {totalDayRevenue.toFixed(2)} €
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsClosingModalOpen(true)}
            className="btn btn-outline btn-sm flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4 text-neutral-600" />
            <span>Clôture Z de caisse</span>
          </button>
        </div>
      </div>

      {/* Terminal de Vente */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <CheckoutTerminal
          services={MOCK_SERVICES}
          staffList={MOCK_STAFF}
          clients={MOCK_CLIENTS}
          appointments={MOCK_APPOINTMENTS}
          initialAppointmentId={appointmentId}
          onTicketCompleted={handleTicketCompleted}
        />
      </div>

      {/* Modale Clôture de Caisse (Z) */}
      <DailyClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        tickets={tickets}
        staffList={MOCK_STAFF}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-neutral-500">
          Chargement de la caisse...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
