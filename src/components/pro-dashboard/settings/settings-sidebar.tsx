"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Building2,
  Clock,
  CreditCard,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

export function SettingsSidebar() {
  const pathname = usePathname();

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
        <p className="text-sm text-neutral-500 mt-0.5">
          Paramètres opérationnels de l&apos;atelier
        </p>
      </div>

      <nav className="p-3 space-y-1 text-sm font-semibold">
        <Link
          href="/pro/settings/services"
          className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-150 ${
            isServicesActive
              ? "bg-primary-600 text-white shadow-2xs font-bold"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Gestion des prestations</span>
        </Link>

        <Link
          href="/pro/settings/establishment"
          className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-150 ${
            isEstablishmentActive
              ? "bg-primary-600 text-white shadow-2xs font-bold"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>Paramètres Établissement</span>
        </Link>

        <Link
          href="/pro/settings/team"
          className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-150 ${
            isTeamActive
              ? "bg-primary-600 text-white shadow-2xs font-bold"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>Gestion Temps de Travail</span>
        </Link>

        <Link
          href="/pro/settings/cash-register"
          className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-150 ${
            isCashActive
              ? "bg-primary-600 text-white shadow-2xs font-bold"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span>Paramètres Caisse</span>
        </Link>

        <Link
          href="/pro/settings/notifications"
          className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-150 ${
            isNotificationsActive
              ? "bg-primary-600 text-white shadow-2xs font-bold"
              : "text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
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
          className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2 text-neutral-800"
        >
          <HelpCircle className="w-4 h-4 text-neutral-600" />
          <span>Centre d&apos;aide Belora Pro</span>
        </Link>
      </div>
    </aside>
  );
}
