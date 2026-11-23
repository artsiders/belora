"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Store,
  Wallet,
  MessageSquare,
  Coins,
  Layers,
  Settings,
  PlusCircle,
  ShieldCheck,
  ArrowLeft,
  X,
} from "lucide-react";
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
    label: "Forfaits",
    href: "/admin/plans",
    icon: Layers,
  },
  {
    label: "Monétisation",
    href: "/admin/monetization",
    icon: Coins,
  },
  {
    label: "Santé système",
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
  const { isCollapsed, isMobileOpen, closeMobile } = useAdminSidebar();

  return (
    <aside
      className={`bg-neutral-950 text-neutral-100 flex flex-col shrink-0 min-h-screen border-r border-neutral-800/90 z-50
        /* Mobile: Tiroir coulissant */
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
      {/* Brand Header épuré sans doublon d'icône */}
      <div
        className={`h-14 sm:h-16 px-4 border-b border-neutral-800/80 flex items-center transition-all ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {isCollapsed ? (
          /* Version compacte du Logo pour largeur réduite */
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center group"
            title="Belora Admin"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center font-bold text-white text-base shadow-xs group-hover:border-secondary-500 transition-colors">
              B
            </div>
          </Link>
        ) : (
          /* Version complète avec le vrai logo SVG officiel */
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2"
              aria-label="Belora Admin"
            >
              <Image
                src="/images/logos/belora.svg"
                alt="Belora"
                width={100}
                height={26}
                priority
                className="object-contain h-5 sm:h-6 w-auto brightness-0 invert"
              />
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-300 bg-secondary-950/80 border border-secondary-600/40 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </div>
        )}

        {/* Bouton de fermeture uniquement visible sur mobile (pas sur desktop pour éviter tout doublon) */}
        <button
          type="button"
          onClick={closeMobile}
          className="lg:hidden p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links épurés */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
              className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-150 ${
                isCollapsed
                  ? "justify-center p-3"
                  : "gap-3 px-3 py-2.5"
              } ${
                isActive
                  ? "bg-neutral-900 text-white border border-neutral-700/60 shadow-2xs"
                  : "text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-100"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? "text-secondary-400" : "text-neutral-500"
                }`}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation épuré (Pas de doublon de Déconnexion car gérée dans le profil) */}
      <div className="p-3 border-t border-neutral-800/80 space-y-2">
        {/* Lien Retour sur Belora.com */}
        <Link
          href="/"
          title={isCollapsed ? "Retour sur Belora.com" : undefined}
          className={`flex items-center text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors ${
            isCollapsed
              ? "justify-center p-2.5"
              : "gap-2.5 px-3 py-2"
          }`}
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-neutral-500" />
          {!isCollapsed && <span className="truncate">Retour au site public</span>}
        </Link>

        {/* Badge de sécurité (visible en mode étendu) */}
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs text-neutral-400 border border-neutral-800/80 rounded-xl bg-neutral-900/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
              <span>Espace Sécurisé</span>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase font-mono">v1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}
