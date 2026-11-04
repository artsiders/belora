"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Building2,
  Clock,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export function SettingsSidebar() {
  const pathname = usePathname();
  const [agendaExpanded, setAgendaExpanded] = useState(true);

  const isServicesActive = pathname === "/pro/settings/services" || pathname === "/pro/settings";
  const isEstablishmentActive = pathname === "/pro/settings/establishment";
  const isTeamActive = pathname === "/pro/settings/team";
  const isCashActive = pathname === "/pro/settings/cash-register";
  const isNotificationsActive = pathname === "/pro/settings/notifications";

  return (
    <aside className="w-64 sm:w-72 bg-white border-e border-neutral-200/90 flex flex-col shrink-0 overflow-y-auto custom-scrollbar select-none">
      <div className="p-4 border-b border-neutral-200/80">
        <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
          Configuration &bull; Admin
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Paramètres opérationnels de l&apos;atelier
        </p>
      </div>

      <nav className="p-3 space-y-1 text-xs">
        {/* Accordéon 1 : Paramètres Agenda */}
        <div>
          <button
            type="button"
            onClick={() => setAgendaExpanded(!agendaExpanded)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 font-bold transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-primary-700" />
              <span>Paramètres Agenda</span>
            </div>
            {agendaExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </button>

          {agendaExpanded && (
            <div className="ps-6 pe-2 py-1 space-y-1">
              <Link
                href="/pro/settings/services"
                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                  isServicesActive
                    ? "bg-primary-50 text-primary-800 font-bold"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50"
                }`}
              >
                Gestion des prestations
              </Link>
              <span className="block px-3 py-2 rounded-lg text-neutral-400 cursor-not-allowed">
                Gestion des agendas
              </span>
              <span className="block px-3 py-2 rounded-lg text-neutral-400 cursor-not-allowed">
                Affichage des rendez-vous
              </span>
              <span className="block px-3 py-2 rounded-lg text-neutral-400 cursor-not-allowed">
                Contenu de marque
              </span>
            </div>
          )}
        </div>

        {/* Section 2 : Paramètres Établissement (Prioritaire / Encadré rouge) */}
        <Link
          href="/pro/settings/establishment"
          className={`flex items-center justify-between p-2.5 rounded-xl font-bold transition-colors ${
            isEstablishmentActive
              ? "bg-primary-600 text-white shadow-2xs"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 shrink-0" />
            <span>Paramètres Établissement</span>
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              isEstablishmentActive ? "bg-white" : "bg-primary-600"
            }`}
          />
        </Link>

        {/* Section 3 : Gestion Temps de Travail & Équipe */}
        <Link
          href="/pro/settings/team"
          className={`flex items-center gap-2.5 p-2.5 rounded-xl font-bold transition-colors ${
            isTeamActive
              ? "bg-primary-600 text-white shadow-2xs"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>Gestion Temps de Travail</span>
        </Link>

        {/* Section 4 : Paramètres Caisse */}
        <Link
          href="/pro/settings/cash-register"
          className={`flex items-center gap-2.5 p-2.5 rounded-xl font-bold transition-colors ${
            isCashActive
              ? "bg-primary-600 text-white shadow-2xs"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>Paramètres Caisse</span>
        </Link>

        {/* Section 5 : SMS & Emails */}
        <Link
          href="/pro/settings/notifications"
          className={`flex items-center gap-2.5 p-2.5 rounded-xl font-bold transition-colors ${
            isNotificationsActive
              ? "bg-primary-600 text-white shadow-2xs"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50"
          }`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>SMS & E-mails</span>
        </Link>
      </nav>

      {/* Bouton Centre d'aide en bas (Style Planity) */}
      <div className="p-4 mt-auto border-t border-neutral-200/80 bg-neutral-50/50">
        <Link
          href="/help"
          target="_blank"
          className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-neutral-600" />
          <span>Centre d&apos;aide Belora Pro</span>
        </Link>
      </div>
    </aside>
  );
}
