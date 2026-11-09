"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Phone, Mail, Eye } from "lucide-react";
import { DataTable, Column } from "@/components/pro-dashboard/ui/data-table";
import { Badge } from "@/components/pro-dashboard/ui/badge";
import { NewClientModal } from "@/components/pro-dashboard/clients/new-client-modal";
import { ClientDrawer } from "@/components/pro-dashboard/clients/client-drawer";
import {
  MOCK_CLIENTS,
  MOCK_APPOINTMENTS,
  ProClient,
} from "@/lib/data/pro-mock-data";

function ClientsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [clients, setClients] = useState<ProClient[]>(MOCK_CLIENTS);
  const [filterSegment, setFilterSegment] = useState<
    "all" | "vip" | "regulars" | "new"
  >("all");
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

  // Filtrage selon segment
  const segmentedClients = clients.filter((c) => {
    if (filterSegment === "vip") return c.isVip;
    if (filterSegment === "regulars") return c.totalVisits >= 4;
    if (filterSegment === "new") return c.totalVisits <= 1;
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

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar">
      {/* En-tête de section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Fichier Clients & CRM
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            Gérez vos fiches contacts, fiches techniques capillaires et
            l&apos;historique des soins de vos habitués.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewClientModalOpen(true)}
          className="btn btn-primary btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Filtres de segmentation rapide */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setFilterSegment("all")}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterSegment === "all"
              ? "bg-primary-600 text-white border-primary-600 shadow-2xs font-bold"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Tous les clients ({clients.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterSegment("vip")}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterSegment === "vip"
              ? "bg-primary-600 text-white border-primary-600 shadow-2xs font-bold"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Clients VIP ({clients.filter((c) => c.isVip).length})
        </button>

        <button
          type="button"
          onClick={() => setFilterSegment("regulars")}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterSegment === "regulars"
              ? "bg-primary-600 text-white border-primary-600 shadow-2xs font-bold"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Habitués (4+ visites) (
          {clients.filter((c) => c.totalVisits >= 4).length})
        </button>

        <button
          type="button"
          onClick={() => setFilterSegment("new")}
          className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            filterSegment === "new"
              ? "bg-primary-600 text-white border-primary-600 shadow-2xs font-bold"
              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          Nouveaux clients ({clients.filter((c) => c.totalVisits <= 1).length})
        </button>
      </div>

      {/* Tableau réutilisable DataTable */}
      <DataTable<ProClient>
        data={segmentedClients}
        columns={columns}
        rowKey={(c) => c.id}
        searchPlaceholder="Rechercher par nom, téléphone, e-mail..."
        searchFilter={(client, query) => {
          const q = query.toLowerCase();
          return (
            client.firstName.toLowerCase().includes(q) ||
            client.lastName.toLowerCase().includes(q) ||
            client.phone.includes(q) ||
            client.email.toLowerCase().includes(q)
          );
        }}
        onRowClick={(client) => {
          setSelectedClient(client);
          setIsDrawerOpen(true);
        }}
        emptyMessage="Aucun client ne correspond à votre recherche"
        emptySubMessage="Vérifiez l'orthographe ou ajoutez une nouvelle fiche client."
        pageSize={8}
      />

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
