"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  MessageSquare,
  Coins,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Vue d'ensemble",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Établissements",
    href: "/admin/venues",
    icon: Store,
  },
  {
    label: "Création assistée",
    href: "/admin/venues/create-assisted",
    icon: PlusCircle,
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
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-100 flex flex-col shrink-0 min-h-screen border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-wider text-white font-medium">
              BELORA
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold px-2 py-0.5 rounded bg-neutral-800 border border-amber-500/30">
              Admin
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Supervision Plateforme
          </p>
        </div>
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-neutral-800 text-white border-l-2 border-amber-400 font-semibold"
                  : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-amber-400" : "text-neutral-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-neutral-800 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour sur Belora.com</span>
        </Link>
        <div className="px-3 py-2 text-xs text-neutral-400 border border-neutral-800 rounded-md bg-neutral-900/50">
          <p className="font-medium text-neutral-300">Environnement Sécurisé</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Accès Super-Administrateur</p>
        </div>
      </div>
    </aside>
  );
}
