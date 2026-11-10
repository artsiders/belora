"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { CheckoutTerminal } from "@/components/pro-dashboard/checkout/checkout-terminal";
import { DailyClosingModal } from "@/components/pro-dashboard/checkout/daily-closing-modal";
import {
  ProService,
  ProStaffMember,
  ProClient,
  ProAppointment,
  ProSaleTicket,
} from "@/lib/data/pro-mock-data";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const queryClient = useQueryClient();

  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);

  // 1. Requête Prestations du salon
  const {
    data: services = [],
    isLoading: isServicesLoading,
    isError: isServicesError,
    refetch: refetchServices,
  } = useQuery<ProService[]>({
    queryKey: ["pro", "services"],
    queryFn: async () => {
      const res = await apiClient.get<{ services: ProService[] }>("/pro/services");
      return res.data.services;
    },
    staleTime: 300_000,
  });

  // 2. Requête Collaborateurs du salon
  const {
    data: staffList = [],
    isLoading: isStaffLoading,
    isError: isStaffError,
    refetch: refetchStaff,
  } = useQuery<ProStaffMember[]>({
    queryKey: ["pro", "staff"],
    queryFn: async () => {
      const res = await apiClient.get<{ staff: ProStaffMember[] }>("/pro/staff");
      return res.data.staff;
    },
    staleTime: 60_000,
  });

  // 3. Requête Clients CRM
  const {
    data: clients = [],
    isLoading: isClientsLoading,
    refetch: refetchClients,
  } = useQuery<ProClient[]>({
    queryKey: ["pro", "clients"],
    queryFn: async () => {
      const res = await apiClient.get<{ clients: ProClient[] }>("/pro/clients");
      return res.data.clients;
    },
    staleTime: 60_000,
  });

  // 4. Requête Rendez-vous du jour
  const {
    data: appointmentsData,
    isLoading: isAppointmentsLoading,
    isError: isAppointmentsError,
    refetch: refetchAppointments,
  } = useQuery<{
    pendingAppointments: ProAppointment[];
    allTodayAppointments: ProAppointment[];
  }>({
    queryKey: ["pro", "checkout", "pending-appointments"],
    queryFn: async () => {
      const res = await apiClient.get<{
        pendingAppointments: ProAppointment[];
        allTodayAppointments: ProAppointment[];
      }>("/pro/checkout/pending-appointments");
      return res.data;
    },
    staleTime: 15_000,
  });

  // 5. Requête Résumé Journalier et Tickets émis
  const {
    data: dailySummary,
    isLoading: isSummaryLoading,
    refetch: refetchDailySummary,
  } = useQuery<{
    date: string;
    isClosed: boolean;
    totals: {
      totalTtc: number;
      totalHt: number;
      vatAmount: number;
      totalDeposits: number;
      totalCard: number;
      totalCash: number;
      ticketsCount: number;
    };
    tickets: ProSaleTicket[];
  }>({
    queryKey: ["pro", "checkout", "daily-summary"],
    queryFn: async () => {
      const res = await apiClient.get<{
        date: string;
        isClosed: boolean;
        totals: {
          totalTtc: number;
          totalHt: number;
          vatAmount: number;
          totalDeposits: number;
          totalCard: number;
          totalCash: number;
          ticketsCount: number;
        };
        tickets: ProSaleTicket[];
      }>("/pro/checkout/daily-summary");
      return res.data;
    },
    staleTime: 15_000,
  });

  // Mutation création ticket de vente
  const createTicketMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post<{ ticket: ProSaleTicket }>(
        "/pro/checkout/tickets",
        payload
      );
      return res.data.ticket;
    },
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "checkout"] });
      queryClient.invalidateQueries({ queryKey: ["pro", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pro", "clients"] });
      toast.success(`Ticket #${newTicket.id} enregistré avec succès`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de l'encaissement.";
      toast.error(msg);
    },
  });

  // Mutation clôture de caisse Z
  const dailyClosingMutation = useMutation({
    mutationFn: async (cashCounted: number) => {
      const res = await apiClient.post("/pro/checkout/daily-closing", {
        cashCounted,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "checkout", "daily-summary"] });
      toast.success("Clôture journalière Z enregistrée");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de la clôture de caisse.";
      toast.error(msg);
    },
  });

  // Liste des rendez-vous prioritaires du jour (en attente en premier)
  const displayAppointments = appointmentsData?.allTodayAppointments || [];
  const tickets = dailySummary?.tickets || [];
  const totalDayRevenue = dailySummary?.totals.totalTtc || 0;
  const isClosed = dailySummary?.isClosed || false;

  // Gestion de l'état d'erreur conforme à AGENTS.md
  if (isServicesError || isStaffError || isAppointmentsError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">
          Impossible de charger le terminal de caisse
        </h3>
        <p className="text-sm text-neutral-600 max-w-md mb-6">
          Une erreur est survenue lors de la récupération des données de caisse ou des rendez-vous.
          Veuillez vérifier votre connexion et réessayez.
        </p>
        <button
          type="button"
          onClick={() => {
            refetchServices();
            refetchStaff();
            refetchClients();
            refetchAppointments();
            refetchDailySummary();
          }}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Réessayer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Terminal de Vente & Caisse POS avec Sidebar unifiée */}
      <CheckoutTerminal
        services={services}
        staffList={staffList}
        clients={clients}
        appointments={displayAppointments}
        initialAppointmentId={appointmentId}
        onTicketCompleted={(newTicket) => {
          queryClient.invalidateQueries({ queryKey: ["pro", "checkout"] });
        }}
        onValidateCheckoutAction={async (payload) => {
          return await createTicketMutation.mutateAsync(payload);
        }}
        isCheckoutLoading={createTicketMutation.isPending}
        tickets={tickets}
        totalDayRevenue={totalDayRevenue}
        onOpenClosingModal={() => setIsClosingModalOpen(true)}
      />

      {/* Modale Clôture de Caisse (Z) */}
      <DailyClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        tickets={tickets}
        staffList={staffList}
        isClosed={isClosed}
        isClosingLoading={dailyClosingMutation.isPending}
        onPerformClosing={(cashCounted) => {
          dailyClosingMutation.mutate(cashCounted);
        }}
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
