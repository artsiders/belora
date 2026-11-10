"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { AgendaToolbar } from "@/components/pro-dashboard/agenda/agenda-toolbar";
import { AgendaSidebar } from "@/components/pro-dashboard/agenda/agenda-sidebar";
import { AgendaGrid } from "@/components/pro-dashboard/agenda/agenda-grid";
import { AppointmentModal } from "@/components/pro-dashboard/agenda/appointment-modal";
import { PresenceModal } from "@/components/pro-dashboard/agenda/presence-modal";
import { ClockInModal } from "@/components/pro-dashboard/agenda/clock-in-modal";
import {
  ProAppointment,
  ProStaffMember,
  ProResource,
  ProService,
  ProClient,
} from "@/lib/data/pro-mock-data";

function AgendaContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // État date & affichage
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [intervalMinutes, setIntervalMinutes] = useState<number>(15);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Calcul déterministe des bornes temporelles pour React Query
  const { startDate, endDate } = useMemo(() => {
    const base = new Date(currentDate);
    if (viewMode === "day") {
      const dayIso = base.toISOString().split("T")[0];
      return { startDate: dayIso, endDate: dayIso };
    } else {
      // Vue Semaine : du Lundi au Dimanche
      const day = base.getDay();
      const mondayOffset = day === 0 ? -6 : 1 - day;
      const monday = new Date(base);
      monday.setDate(base.getDate() + mondayOffset);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      return {
        startDate: monday.toISOString().split("T")[0],
        endDate: sunday.toISOString().split("T")[0],
      };
    }
  }, [currentDate, viewMode]);

  // 1. Requête Collaborateurs du salon
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

  // 2. Requête Ressources (Fauteuils / Cabines)
  const {
    data: resourceList = [],
    isLoading: isResourcesLoading,
  } = useQuery<ProResource[]>({
    queryKey: ["pro", "resources"],
    queryFn: async () => {
      const res = await apiClient.get<{ resources: ProResource[] }>("/pro/resources");
      return res.data.resources;
    },
    staleTime: 300_000,
  });

  // 3. Requête Prestations & Tarifs
  const { data: servicesList = [] } = useQuery<ProService[]>({
    queryKey: ["pro", "services"],
    queryFn: async () => {
      const res = await apiClient.get<{ services: ProService[] }>("/pro/services");
      return res.data.services;
    },
    staleTime: 300_000,
  });

  // 4. Requête Clients CRM
  const { data: clientsList = [] } = useQuery<ProClient[]>({
    queryKey: ["pro", "clients"],
    queryFn: async () => {
      const res = await apiClient.get<{ clients: ProClient[] }>("/pro/clients");
      return res.data.clients;
    },
    staleTime: 60_000,
  });

  // 5. Requête Rendez-vous de la période sélectionnée
  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    isFetching: isAppointmentsFetching,
    isError: isAppointmentsError,
    refetch: refetchAppointments,
  } = useQuery<ProAppointment[]>({
    queryKey: ["pro", "appointments", startDate, endDate],
    queryFn: async () => {
      const res = await apiClient.get<{ appointments: ProAppointment[] }>(
        `/pro/appointments?startDate=${startDate}&endDate=${endDate}`
      );
      return res.data.appointments;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // Filtres actifs de sélection
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  // Synchronisation des filtres lorsque les listes sont chargées
  useEffect(() => {
    if (staffList.length > 0 && selectedStaffIds.length === 0) {
      setSelectedStaffIds(staffList.map((s) => s.id));
    }
  }, [staffList, selectedStaffIds.length]);

  useEffect(() => {
    if (resourceList.length > 0 && selectedResourceIds.length === 0) {
      setSelectedResourceIds(resourceList.map((r) => r.id));
    }
  }, [resourceList, selectedResourceIds.length]);

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: async (newAptData: Partial<ProAppointment> & { date?: string }) => {
      const targetDate = newAptData.date || currentDate.toISOString().split("T")[0];
      const payload = {
        clientId: newAptData.clientId,
        clientName: newAptData.clientName,
        clientPhone: newAptData.clientPhone,
        clientEmail: newAptData.clientEmail,
        serviceId: newAptData.serviceId,
        staffId: newAptData.staffId,
        resourceId: newAptData.resourceId || null,
        date: targetDate,
        startTime: newAptData.startTime,
        endTime: newAptData.endTime,
        notes: newAptData.notes,
        price: newAptData.price,
        depositPaid: newAptData.depositPaid,
      };
      const res = await apiClient.post<{ appointment: ProAppointment }>(
        "/pro/appointments",
        payload
      );
      return res.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pro", "clients"] });
      toast.success("Rendez-vous créé avec succès");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de la création du rendez-vous.";
      toast.error(msg);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      status?: ProAppointment["status"];
      date?: string;
      startTime?: string;
      endTime?: string;
      staffId?: string;
      resourceId?: string;
      notes?: string;
    }) => {
      const res = await apiClient.patch<{ appointment: ProAppointment }>(
        `/pro/appointments/${id}`,
        updates
      );
      return res.data.appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "appointments"] });
      toast.success("Rendez-vous mis à jour");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de la modification.";
      toast.error(msg);
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async (staffId: string) => {
      const res = await apiClient.post<{ message: string; clockedIn: boolean }>(
        "/pro/staff/clock-in",
        { staffId }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "staff"] });
      toast.success(data.message);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors du pointage.";
      toast.error(msg);
    },
  });

  const updatePresenceMutation = useMutation({
    mutationFn: async (updates: Array<{ staffId: string; plannedStart: string; plannedEnd: string }>) => {
      const res = await apiClient.post("/pro/staff/presence", {
        updates,
        date: currentDate.toISOString().split("T")[0],
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pro", "staff"] });
      toast.success("Horaires de présence enregistrés");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur d'enregistrement des horaires.";
      toast.error(msg);
    },
  });

  // État modales
  const [selectedAppointment, setSelectedAppointment] = useState<ProAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);

  // Pré-remplissage du nouveau RDV
  const [slotPrefill, setSlotPrefill] = useState<{
    time: string;
    staffId?: string;
    resourceId?: string;
    date?: string;
  }>({ time: "10:00" });

  // Toggle Collaborateurs
  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const handleToggleAllStaff = (selectAll: boolean) => {
    setSelectedStaffIds(selectAll ? staffList.map((s) => s.id) : []);
  };

  // Toggle Cabines
  const handleToggleResource = (resId: string) => {
    setSelectedResourceIds((prev) =>
      prev.includes(resId) ? prev.filter((id) => id !== resId) : [...prev, resId]
    );
  };

  const handleToggleAllResources = (selectAll: boolean) => {
    setSelectedResourceIds(selectAll ? resourceList.map((r) => r.id) : []);
  };

  // Clic sur créneau vide
  const handleSlotClick = (
    time: string,
    staffId?: string,
    resourceId?: string,
    date?: string
  ) => {
    setSlotPrefill({ time, staffId, resourceId, date });
    setIsCreateModalOpen(true);
  };

  // Clic sur RDV existant
  const handleSelectAppointment = (apt: ProAppointment) => {
    setSelectedAppointment(apt);
    setIsDetailModalOpen(true);
  };

  // Sauvegarde nouveau RDV
  const handleSaveNewAppointment = (newAptData: Partial<ProAppointment>) => {
    createAppointmentMutation.mutate({
      ...newAptData,
      date: slotPrefill.date || currentDate.toISOString().split("T")[0],
    });
  };

  // Modification statut RDV
  const handleStatusChange = (
    aptId: string,
    newStatus: ProAppointment["status"]
  ) => {
    updateAppointmentMutation.mutate({ id: aptId, status: newStatus });
  };

  // Redirection Caisse depuis RDV
  const handleNavigateToCheckout = (apt: ProAppointment) => {
    router.push(`/pro/checkout?appointmentId=${apt.id}`);
  };

  // Mise à jour présence
  const handleUpdatePresence = (staffId: string, start: string, end: string) => {
    updatePresenceMutation.mutate([{ staffId, plannedStart: start, plannedEnd: end }]);
  };

  // Pointage arrivée / départ
  const handleToggleClockIn = (staffId: string) => {
    clockInMutation.mutate(staffId);
  };

  // Filtrage des listes selon les checkboxes
  const visibleStaff = staffList.filter((s) => selectedStaffIds.includes(s.id));
  const visibleResources = resourceList.filter((r) => selectedResourceIds.includes(r.id));

  // Gestion d'erreur globale avec interface dédiée et bouton Réessayer
  if (isAppointmentsError || isStaffError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">
          Impossible de charger le planning
        </h3>
        <p className="text-sm text-neutral-600 max-w-md mb-6">
          Une erreur est survenue lors de la récupération des rendez-vous ou de l&apos;équipe.
          Veuillez vérifier votre connexion et réessayez.
        </p>
        <button
          type="button"
          onClick={() => {
            refetchAppointments();
            refetchStaff();
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
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Barre d'outils secondaire de l'Agenda */}
      <AgendaToolbar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        intervalMinutes={intervalMinutes}
        onIntervalChange={setIntervalMinutes}
        onNewAppointment={() => {
          setSlotPrefill({ time: "10:00" });
          setIsCreateModalOpen(true);
        }}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Indicateur de synchronisation chirurgical discret */}
      {isAppointmentsFetching && (
        <div className="absolute top-2 right-4 z-40 bg-white/95 border border-neutral-200/90 rounded-full px-3 py-1 shadow-2xs flex items-center gap-2 text-xs font-semibold text-neutral-700 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
          <span>Actualisation...</span>
        </div>
      )}

      {/* Corps principal : Sidebar de filtres + Grille de planning */}
      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && (
          <AgendaSidebar
            currentDate={currentDate}
            onDateSelect={setCurrentDate}
            staffList={staffList}
            selectedStaffIds={selectedStaffIds}
            onToggleStaff={handleToggleStaff}
            onToggleAllStaff={handleToggleAllStaff}
            resourceList={resourceList}
            selectedResourceIds={selectedResourceIds}
            onToggleResource={handleToggleResource}
            onToggleAllResources={handleToggleAllResources}
            onOpenPresenceModal={() => setIsPresenceModalOpen(true)}
            onOpenClockInModal={() => setIsClockInModalOpen(true)}
          />
        )}

        <AgendaGrid
          staffList={visibleStaff}
          resourceList={visibleResources}
          appointments={appointments}
          intervalMinutes={intervalMinutes}
          viewMode={viewMode}
          currentDate={currentDate}
          onSelectAppointment={handleSelectAppointment}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* Modale Détails RDV */}
      <AppointmentModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedAppointment(null);
        }}
        mode="detail"
        appointment={selectedAppointment}
        staffList={staffList}
        resourceList={resourceList}
        servicesList={servicesList}
        clientsList={clientsList}
        onSaveNewAppointment={handleSaveNewAppointment}
        onStatusChange={handleStatusChange}
        onNavigateToCheckout={handleNavigateToCheckout}
      />

      {/* Modale Création Nouveau RDV */}
      <AppointmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        defaultTime={slotPrefill.time}
        defaultStaffId={slotPrefill.staffId}
        defaultResourceId={slotPrefill.resourceId}
        staffList={staffList}
        resourceList={resourceList}
        servicesList={servicesList}
        clientsList={clientsList}
        onSaveNewAppointment={handleSaveNewAppointment}
        onStatusChange={handleStatusChange}
        onNavigateToCheckout={handleNavigateToCheckout}
      />

      {/* Modale Horaires de Présence */}
      <PresenceModal
        isOpen={isPresenceModalOpen}
        onClose={() => setIsPresenceModalOpen(false)}
        staffList={staffList}
        onUpdatePresence={handleUpdatePresence}
      />

      {/* Modale Pointage Équipe */}
      <ClockInModal
        isOpen={isClockInModalOpen}
        onClose={() => setIsClockInModalOpen(false)}
        staffList={staffList}
        onToggleClockIn={handleToggleClockIn}
      />
    </div>
  );
}

export default function AgendaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-neutral-500">
          Chargement du planning...
        </div>
      }
    >
      <AgendaContent />
    </React.Suspense>
  );
}
