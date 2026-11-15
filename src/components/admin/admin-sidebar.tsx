"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  return (
    <aside className="w-64 bg-neutral-950 text-neutral-100 flex flex-col shrink-0 min-h-screen border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xl tracking-wider text-white font-medium">
              BELORA
            </span>
            <Badge variant="gold" size="sm">
              Admin
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Supervision Plateforme
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation avec padding de sécurité pour les overlays */}
      <div className="p-4 pb-16 sm:pb-8 border-t border-neutral-800 space-y-2.5">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour sur Belora.com</span>
        </Link>
        <div className="p-3 text-xs text-neutral-400 border border-neutral-800/80 rounded-xl bg-neutral-900/60 space-y-1">
          <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-500" />
            <span>Environnement Sécurisé</span>
          </div>
          <p className="text-xs text-neutral-400">Accès Super-Administrateur</p>
        </div>
      </div>
    </aside>
  );
}
