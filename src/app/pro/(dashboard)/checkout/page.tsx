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
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Terminal de Vente & Caisse POS avec Sidebar unifiée */}
      <CheckoutTerminal
        services={MOCK_SERVICES}
        staffList={MOCK_STAFF}
        clients={MOCK_CLIENTS}
        appointments={MOCK_APPOINTMENTS}
        initialAppointmentId={appointmentId}
        onTicketCompleted={handleTicketCompleted}
        tickets={tickets}
        totalDayRevenue={totalDayRevenue}
        onOpenClosingModal={() => setIsClosingModalOpen(true)}
      />

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
