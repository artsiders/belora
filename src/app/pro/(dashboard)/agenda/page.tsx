"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AgendaToolbar } from "@/components/pro-dashboard/agenda/agenda-toolbar";
import { AgendaSidebar } from "@/components/pro-dashboard/agenda/agenda-sidebar";
import { AgendaGrid } from "@/components/pro-dashboard/agenda/agenda-grid";
import { AppointmentModal } from "@/components/pro-dashboard/agenda/appointment-modal";
import { PresenceModal } from "@/components/pro-dashboard/agenda/presence-modal";
import { ClockInModal } from "@/components/pro-dashboard/agenda/clock-in-modal";
import {
  MOCK_STAFF,
  MOCK_RESOURCES,
  MOCK_SERVICES,
  MOCK_CLIENTS,
  MOCK_APPOINTMENTS,
  ProAppointment,
  ProStaffMember,
} from "@/lib/data/pro-mock-data";

function AgendaContent() {
  const router = useRouter();

  // État date & affichage
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [intervalMinutes, setIntervalMinutes] = useState<number>(15);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // État filtres ressources & équipe
  const [staffList, setStaffList] = useState<ProStaffMember[]>(MOCK_STAFF);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>(
    MOCK_STAFF.map((s) => s.id)
  );
  const [resourceList] = useState(MOCK_RESOURCES);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>(
    MOCK_RESOURCES.map((r) => r.id)
  );

  // État rendez-vous
  const [appointments, setAppointments] =
    useState<ProAppointment[]>(MOCK_APPOINTMENTS);

  // État modales
  const [selectedAppointment, setSelectedAppointment] =
    useState<ProAppointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(false);
  const [isClockInModalOpen, setIsClockInModalOpen] = useState(false);

  // Pré-remplissage du nouveau RDV
  const [slotPrefill, setSlotPrefill] = useState<{
    time: string;
    staffId?: string;
    resourceId?: string;
  }>({ time: "10:00" });

  // Toggle Collaborateurs
  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleToggleAllStaff = (selectAll: boolean) => {
    setSelectedStaffIds(selectAll ? staffList.map((s) => s.id) : []);
  };

  // Toggle Cabines
  const handleToggleResource = (resId: string) => {
    setSelectedResourceIds((prev) =>
      prev.includes(resId)
        ? prev.filter((id) => id !== resId)
        : [...prev, resId]
    );
  };

  const handleToggleAllResources = (selectAll: boolean) => {
    setSelectedResourceIds(selectAll ? resourceList.map((r) => r.id) : []);
  };

  // Clic sur créneau vide
  const handleSlotClick = (
    time: string,
    staffId?: string,
    resourceId?: string
  ) => {
    setSlotPrefill({ time, staffId, resourceId });
    setIsCreateModalOpen(true);
  };

  // Clic sur RDV existant
  const handleSelectAppointment = (apt: ProAppointment) => {
    setSelectedAppointment(apt);
    setIsDetailModalOpen(true);
  };

  // Sauvegarde nouveau RDV
  const handleSaveNewAppointment = (newAptData: Partial<ProAppointment>) => {
    const newApt: ProAppointment = {
      id: `apt-${Date.now()}`,
      clientId: newAptData.clientId || "cli-1",
      clientName: newAptData.clientName || "Client Salon",
      clientPhone: newAptData.clientPhone || "",
      clientEmail: newAptData.clientEmail || "",
      serviceId: newAptData.serviceId || "srv-1",
      serviceName: newAptData.serviceName || "Prestation",
      staffId: newAptData.staffId || staffList[0].id,
      staffName: newAptData.staffName || staffList[0].name,
      resourceId: newAptData.resourceId,
      resourceName: newAptData.resourceName,
      date: currentDate.toISOString().split("T")[0],
      startTime: newAptData.startTime || "10:00",
      endTime: newAptData.endTime || "10:45",
      price: newAptData.price || 50,
      depositPaid: newAptData.depositPaid || 0,
      status: "confirmed",
      notes: newAptData.notes,
    };
    setAppointments((prev) => [...prev, newApt]);
  };

  // Modification statut RDV
  const handleStatusChange = (
    aptId: string,
    newStatus: ProAppointment["status"]
  ) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
    );
  };

  // Redirection Caisse depuis RDV
  const handleNavigateToCheckout = (apt: ProAppointment) => {
    router.push(`/pro/checkout?appointmentId=${apt.id}`);
  };

  // Mise à jour présence
  const handleUpdatePresence = (staffId: string, start: string, end: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              presenceToday: {
                ...s.presenceToday,
                plannedStart: start,
                plannedEnd: end,
              },
            }
          : s
      )
    );
  };

  // Pointage arrivée / départ
  const handleToggleClockIn = (staffId: string) => {
    const nowTime = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              presenceToday: {
                ...s.presenceToday,
                clockedIn: !s.presenceToday.clockedIn,
                clockInTime: !s.presenceToday.clockedIn
                  ? nowTime
                  : s.presenceToday.clockInTime,
              },
            }
          : s
      )
    );
  };

  // Filtrage des listes selon les checkboxes
  const visibleStaff = staffList.filter((s) =>
    selectedStaffIds.includes(s.id)
  );
  const visibleResources = resourceList.filter((r) =>
    selectedResourceIds.includes(r.id)
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
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
        servicesList={MOCK_SERVICES}
        clientsList={MOCK_CLIENTS}
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
        servicesList={MOCK_SERVICES}
        clientsList={MOCK_CLIENTS}
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
        <div className="flex-1 flex items-center justify-center p-12 text-xs text-neutral-500">
          Chargement du planning...
        </div>
      }
    >
      <AgendaContent />
    </React.Suspense>
  );
}
