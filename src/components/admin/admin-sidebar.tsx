"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Store,
  Wallet,
  MessageSquare,
  Coins,
  Settings,
  PlusCircle,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdminSidebar } from "./admin-layout-shell";

const NAV_ITEMS = [
  {
    label: "Vue d'ensemble",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Réservations",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Établissements",
    href: "/admin/venues",
    icon: Store,
  },
  {
    label: "Finances & Payouts",
    href: "/admin/finance",
    icon: Wallet,
  },
  {
    label: "Modération avis",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    label: "Monétisation",
    href: "/admin/monetization",
    icon: Coins,
  },
  {
    label: "Paramètres & Santé",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    label: "Création assistée",
    href: "/admin/venues/create-assisted",
    icon: PlusCircle,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } =
    useAdminSidebar();

  return (
    <>
      <aside
        className={`bg-neutral-950 text-neutral-100 flex flex-col shrink-0 min-h-screen border-r border-neutral-800/90 z-50
          /* Mobile: Tiroir coulissant off-canvas */
          fixed inset-y-0 left-0 transition-all duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0 w-72 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }
          /* Desktop: Largeur dynamique (w-64 étendu vs w-20 réduit) */
          lg:static ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Brand Header */}
        <div
          className={`p-4 border-b border-neutral-800/80 flex items-center transition-all ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {isCollapsed ? (
            /* Version compacte du Logo pour largeur réduite */
            <Link
              href="/admin/dashboard"
              className="flex flex-col items-center gap-1 group"
              title="Belora Admin"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center font-bold text-white text-base shadow-xs group-hover:border-secondary-500 transition-colors">
                B
              </div>
            </Link>
          ) : (
            /* Version complète avec le vrai logo SVG officiel */
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2.5"
                aria-label="Belora Dashboard"
              >
                <Image
                  src="/images/logos/belora.svg"
                  alt="Belora"
                  width={112}
                  height={28}
                  priority
                  className="object-contain h-6 w-auto brightness-0 invert"
                />
              </Link>
              <Badge variant="gold" size="sm">
                Admin
              </Badge>
            </div>
          )}

          {/* Boutons d'actions dans l'entête : Réduire sur Desktop / Fermer sur Mobile */}
          <div className="flex items-center gap-1">
            {/* Bouton fermeture sur mobile */}
            <button
              type="button"
              onClick={closeMobile}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Bouton collapse/expand sur Desktop */}
            {!isCollapsed && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                title="Réduire la barre latérale"
                aria-label="Réduire la barre latérale"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-medium transition-colors ${
                  isCollapsed
                    ? "justify-center p-3"
                    : "gap-3 px-3 py-2.5"
                } ${
                  isActive
                    ? "bg-secondary-500/15 text-white font-semibold border border-secondary-500/30"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-secondary-400" : "text-neutral-400"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bouton de ré-expansion en mode compact */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center p-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={toggleCollapsed}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer"
              title="Agrandir la barre latérale"
              aria-label="Agrandir la barre latérale"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Navigation avec Déconnexion et Retour sur Belora */}
        <div className="p-3 pb-8 border-t border-neutral-800 space-y-2">
          {/* Bouton Se déconnecter */}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title={isCollapsed ? "Déconnexion" : undefined}
            className={`w-full flex items-center text-xs font-semibold text-neutral-300 hover:text-red-400 hover:bg-neutral-900 rounded-xl transition-colors cursor-pointer ${
              isCollapsed
                ? "justify-center p-2.5"
                : "gap-2.5 px-3 py-2.5"
            }`}
          >
            <LogOut className="w-4 h-4 text-neutral-400 shrink-0" />
            {!isCollapsed && <span>Se déconnecter</span>}
          </button>

          {/* Lien Retour sur Belora.com */}
          <Link
            href="/"
            title={isCollapsed ? "Retour sur Belora.com" : undefined}
            className={`flex items-center text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors ${
              isCollapsed
                ? "justify-center p-2.5"
                : "gap-2.5 px-3 py-2"
            }`}
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Retour sur Belora.com</span>}
          </Link>

          {/* Badge de sécurité (visible en mode étendu) */}
          {!isCollapsed && (
            <div className="p-3 text-xs text-neutral-400 border border-neutral-800/80 rounded-xl bg-neutral-900/60 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />
                <span>Environnement Sécurisé</span>
              </div>
              <p className="text-neutral-500">Super-Administrateur</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
