"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Award,
  UserPlus,
  UserX,
  Plus,
  Search,
  Crown,
  TrendingUp,
} from "lucide-react";
import { ProClient } from "@/lib/data/pro-mock-data";

export type ClientFilterSegment = "all" | "vip" | "regulars" | "new" | "inactive";

interface ClientsSidebarProps {
  clients: ProClient[];
  activeSegment: ClientFilterSegment;
  onSelectSegment: (segment: ClientFilterSegment) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewClientModal: () => void;
}

export function ClientsSidebar({
  clients,
  activeSegment,
  onSelectSegment,
  searchQuery,
  onSearchChange,
  onOpenNewClientModal,
}: ClientsSidebarProps) {
  // Calculs des compteurs par segment
  const totalCount = clients.length;
  const vipCount = clients.filter((c) => c.isVip).length;
  const regularsCount = clients.filter((c) => c.totalVisits >= 4).length;
  const newCount = clients.filter((c) => c.totalVisits <= 1).length;
  const inactiveCount = clients.filter(
    (c) => c.lastVisit.includes("2025") || c.totalVisits === 0
  ).length;

  // Métriques financières globales
  const totalRevenue = clients.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgSpendPerClient = totalCount > 0 ? totalRevenue / totalCount : 0;
  const retentionRate =
    totalCount > 0 ? Math.round((regularsCount / totalCount) * 100) : 0;

  const segments = [
    {
      id: "all" as const,
      label: "Tous les clients",
      count: totalCount,
      icon: Users,
    },
    {
      id: "vip" as const,
      label: "Clients Privilégiés / VIP",
      count: vipCount,
      icon: Crown,
      badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    },
    {
      id: "regulars" as const,
      label: "Habitués (4+ visites)",
      count: regularsCount,
      icon: Award,
    },
    {
      id: "new" as const,
      label: "Nouveaux clients",
      count: newCount,
      icon: UserPlus,
    },
    {
      id: "inactive" as const,
      label: "Inactifs / À relancer",
      count: inactiveCount,
      icon: UserX,
    },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-white border-e border-neutral-200/90 flex flex-col shrink-0 overflow-y-auto custom-scrollbar select-none">
      {/* En-tête de la sidebar */}
      <div className="p-4 border-b border-neutral-200/80 space-y-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
            Fichier Clients &bull; CRM
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Segmentation & gestion de la patientèle
          </p>
        </div>

        {/* Bouton Création Nouveau Client */}
        <button
          type="button"
          onClick={onOpenNewClientModal}
          className="btn btn-primary btn-sm w-full flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau client</span>
        </button>

        {/* Recherche rapide */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un client..."
            className="input input-sm w-full ps-9 text-sm"
          />
        </div>
      </div>

      {/* Navigation des segments */}
      <nav className="p-3 space-y-1 text-sm font-semibold flex-1">
        <span className="px-2.5 py-1 text-xs font-bold text-neutral-500 uppercase tracking-wider block">
          Segments Clients
        </span>

        {segments.map((seg) => {
          const Icon = seg.icon;
          const isActive = activeSegment === seg.id;

          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onSelectSegment(seg.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-primary-600 text-white shadow-2xs font-bold"
                  : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-neutral-500"
                  }`}
                />
                <span className="truncate text-sm">{seg.label}</span>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold tabular-nums shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {seg.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Synthèse CRM en bas de la sidebar */}
      <div className="p-4 mt-auto border-t border-neutral-200/80 bg-neutral-50/60 space-y-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary-700" />
          <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Indicateurs Clés CRM
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
            <span className="text-xs text-neutral-500 block">Dépense moy.</span>
            <span className="font-bold text-neutral-950 tabular-nums">
              {avgSpendPerClient.toFixed(0)} €
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
            <span className="text-xs text-neutral-500 block">Fidélisation</span>
            <span className="font-bold text-neutral-950 tabular-nums">
              {retentionRate}%
            </span>
          </div>
        </div>

        <div className="text-xs text-neutral-500 text-center pt-1">
          {totalCount} fiches enregistrées dans l&apos;atelier
        </div>
      </div>
    </aside>
  );
}
