"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Phone, Mail, Eye } from "lucide-react";
import { DataTable, Column } from "@/components/pro-dashboard/ui/data-table";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { NewClientModal } from "@/components/pro-dashboard/clients/new-client-modal";
import { ClientDrawer } from "@/components/pro-dashboard/clients/client-drawer";
import {
  ClientsSidebar,
  ClientFilterSegment,
} from "@/components/pro-dashboard/clients/clients-sidebar";
import {
  MOCK_CLIENTS,
  MOCK_APPOINTMENTS,
  ProClient,
} from "@/lib/data/pro-mock-data";

function ClientsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [clients, setClients] = useState<ProClient[]>(MOCK_CLIENTS);
  const [filterSegment, setFilterSegment] = useState<ClientFilterSegment>("all");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedClient, setSelectedClient] = useState<ProClient | null>(() => {
    if (initialSearch) {
      return (
        MOCK_CLIENTS.find((c) =>
          `${c.firstName} ${c.lastName}`
            .toLowerCase()
            .includes(initialSearch.toLowerCase())
        ) || null
      );
    }
    return null;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(() => {
    return Boolean(initialSearch);
  });
  const [isNewClientModalOpen, setIsNewClientModalOpen] =
    useState<boolean>(false);

  // Filtrage combiné (segment + recherche)
  const filteredClients = clients.filter((c) => {
    if (filterSegment === "vip" && !c.isVip) return false;
    if (filterSegment === "regulars" && c.totalVisits < 4) return false;
    if (filterSegment === "new" && c.totalVisits > 1) return false;
    if (
      filterSegment === "inactive" &&
      !c.lastVisit.includes("2025") &&
      c.totalVisits > 0
    )
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleCreateClient = (newClient: ProClient) => {
    setClients((prev) => [newClient, ...prev]);
    setSelectedClient(newClient);
    setIsDrawerOpen(true);
  };

  const handleUpdateClient = (updated: ProClient) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedClient(updated);
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
          <span>{client.email}</span>
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

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
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
                {filteredClients.length} fiche{filteredClients.length > 1 ? "s" : ""}
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
            data={filteredClients}
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
        appointments={MOCK_APPOINTMENTS}
        onUpdateClient={handleUpdateClient}
      />

      {/* Modale Nouveau Client */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onClientCreated={handleCreateClient}
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
