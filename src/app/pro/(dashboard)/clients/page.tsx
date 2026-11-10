"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Phone, Mail, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DataTable, Column } from "@/components/pro-dashboard/ui/data-table";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { NewClientModal } from "@/components/pro-dashboard/clients/new-client-modal";
import { ClientDrawer } from "@/components/pro-dashboard/clients/client-drawer";
import {
  ClientsSidebar,
  ClientFilterSegment,
} from "@/components/pro-dashboard/clients/clients-sidebar";
import { ProClient, ProAppointment } from "@/lib/data/pro-mock-data";

function ClientsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const queryClient = useQueryClient();

  const [filterSegment, setFilterSegment] = useState<ClientFilterSegment>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedClient, setSelectedClient] = useState<ProClient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => Boolean(initialSearch));
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState<boolean>(false);

  // 1. Requête Clients CRM avec segmentation serveur
  const {
    data: clientsResponse,
    isLoading: isClientsLoading,
    isFetching: isClientsFetching,
    isError: isClientsError,
    refetch: refetchClients,
  } = useQuery<{
    clients: ProClient[];
    counts: {
      all: number;
      vip: number;
      regulars: number;
      new: number;
      inactive: number;
    };
    totals: {
      totalRevenue: number;
      avgSpendPerClient: number;
      retentionRate: number;
    };
  }>({
    queryKey: ["pro", "clients", filterSegment, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterSegment !== "all") params.append("segment", filterSegment);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await apiClient.get<{
        clients: ProClient[];
        counts: {
          all: number;
          vip: number;
          regulars: number;
          new: number;
          inactive: number;
        };
        totals: {
          totalRevenue: number;
          avgSpendPerClient: number;
          retentionRate: number;
        };
      }>(`/pro/clients?${params.toString()}`);
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  // 2. Requête Rendez-vous pour l'historique complet dans le tiroir (drawer)
  const { data: appointments = [] } = useQuery<ProAppointment[]>({
    queryKey: ["pro", "appointments"],
    queryFn: async () => {
      const res = await apiClient.get<{ appointments: ProAppointment[] }>("/pro/appointments");
      return res.data.appointments;
    },
    staleTime: 60_000,
  });

  const clients = clientsResponse?.clients || [];

  // Mutation création fiche client
  const createClientMutation = useMutation({
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      isVip: boolean;
      notes: string;
    }) => {
      const res = await apiClient.post<{ client: ProClient }>("/pro/clients", payload);
      return res.data.client;
    },
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "clients"] });
      setSelectedClient(newClient);
      setIsDrawerOpen(true);
      toast.success(`Fiche de ${newClient.firstName} ${newClient.lastName} créée`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de la création de la fiche client.";
      toast.error(msg);
    },
  });

  // Mutation mise à jour fiche client
  const updateClientMutation = useMutation({
    mutationFn: async (updated: ProClient) => {
      const res = await apiClient.patch<{ client: ProClient }>(`/pro/clients/${updated.id}`, {
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        email: updated.email,
        isVip: updated.isVip,
        notes: updated.notes,
        techSheet: updated.techSheet,
      });
      return res.data.client;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "clients"] });
      setSelectedClient(saved);
      toast.success("Fiche client mise à jour");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur de mise à jour.";
      toast.error(msg);
    },
  });

  const handleCreateClient = (newClient: ProClient) => {
    setSelectedClient(newClient);
    setIsDrawerOpen(true);
  };

  const handleUpdateClient = (updated: ProClient) => {
    updateClientMutation.mutate(updated);
  };

  // Définition des colonnes du tableau
  const columns: Column<ProClient>[] = [
    {
      key: "name",
      header: "Client",
      sortable: true,
      render: (client) => {
        const initials = `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-900 font-bold text-xs flex items-center justify-center shrink-0 border border-primary-200/60 shadow-2xs">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-950 text-sm">
                  {client.firstName} {client.lastName}
                </span>
                {client.isVip && (
                  <Badge variant="primary" size="sm">
                    VIP
                  </Badge>
                )}
              </div>
              <span className="text-xs text-neutral-500 font-medium">
                Inscrit le {client.createdAt}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "phone",
      header: "Téléphone",
      render: (client) => (
        <div className="flex items-center gap-1.5 text-neutral-700 text-sm">
          <Phone className="w-3.5 h-3.5 text-neutral-400" />
          <span className="tabular-nums font-medium">{client.phone}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Adresse e-mail",
      render: (client) => (
        <div className="flex items-center gap-1.5 text-neutral-700 text-sm">
          <Mail className="w-3.5 h-3.5 text-neutral-400" />
          <span>{client.email || "-"}</span>
        </div>
      ),
    },
    {
      key: "lastVisit",
      header: "Dernière visite",
      sortable: true,
      render: (client) => (
        <span className="text-neutral-600 text-sm tabular-nums font-medium">
          {client.lastVisit}
        </span>
      ),
    },
    {
      key: "totalVisits",
      header: "Visites",
      sortable: true,
      className: "text-center",
      render: (client) => (
        <span className="font-semibold text-xs tabular-nums text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-full">
          {client.totalVisits}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "Dépenses cumulées",
      sortable: true,
      className: "text-right",
      render: (client) => (
        <span className="font-bold text-sm tabular-nums text-primary-800">
          {client.totalSpent.toFixed(2)} €
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (client) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedClient(client);
            setIsDrawerOpen(true);
          }}
          className="btn btn-outline btn-xs rounded-lg inline-flex items-center gap-1.5 hover:border-primary-600 hover:text-primary-700"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Fiche</span>
        </button>
      ),
    },
  ];

  const getSegmentTitle = (seg: ClientFilterSegment) => {
    switch (seg) {
      case "vip":
        return "Clients Privilégiés / VIP";
      case "regulars":
        return "Clients Habitués (4+ visites)";
      case "new":
        return "Nouveaux Clients";
      case "inactive":
        return "Clients Inactifs (> 60 jours)";
      default:
        return "Tous les clients de l'atelier";
    }
  };

  // État d'erreur conforme à AGENTS.md
  if (isClientsError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">
          Impossible de charger le fichier clients
        </h3>
        <p className="text-sm text-neutral-600 max-w-md mb-6">
          Une erreur est survenue lors de la synchronisation de l&apos;annuaire client.
          Veuillez vérifier votre connexion et réessayez.
        </p>
        <button
          type="button"
          onClick={() => refetchClients()}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Réessayer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Sidebar Dédiée Fichier Clients */}
      <ClientsSidebar
        clients={clients}
        activeSegment={filterSegment}
        onSelectSegment={setFilterSegment}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
      />

      {/* Zone Principale de Travail CRM */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar bg-neutral-50/40">
        {/* En-tête de vue contextuel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-950 flex items-center gap-2">
              <span>{getSegmentTitle(filterSegment)}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-semibold border border-neutral-200 tabular-nums">
                {clients.length} fiche{clients.length > 1 ? "s" : ""}
              </span>
            </h1>
            <p className="text-sm text-neutral-500">
              Consultez les fiches de vos clients, l&apos;historique des rituels et les fiches techniques.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewClientModalOpen(true)}
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau client</span>
            </button>
          </div>
        </div>

        {/* Tableau réutilisable DataTable */}
        <div className="flex-1">
          <DataTable<ProClient>
            data={clients}
            columns={columns}
            rowKey={(c) => c.id}
            searchPlaceholder="Filtrer dans la sélection..."
            onRowClick={(client) => {
              setSelectedClient(client);
              setIsDrawerOpen(true);
            }}
            emptyMessage="Aucun client ne correspond à ce filtre"
            emptySubMessage="Essayez un autre segment ou créez une nouvelle fiche client."
            pageSize={9}
          />
        </div>
      </div>

      {/* Drawer Fiche Client Détaillée */}
      <ClientDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        client={selectedClient}
        appointments={appointments}
        onUpdateClient={handleUpdateClient}
      />

      {/* Modale Nouveau Client */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientCreated={handleCreateClient}
        isCreating={createClientMutation.isPending}
        onCreateClientAction={async (payload) => {
          return await createClientMutation.mutateAsync(payload);
        }}
      />
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12 text-sm text-neutral-500">
          Chargement du fichier clients...
        </div>
      }
    >
      <ClientsContent />
    </Suspense>
  );
}
