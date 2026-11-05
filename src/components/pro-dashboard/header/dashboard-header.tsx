"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  Users,
  Settings,
  Bell,
  ExternalLink,
  ChevronDown,
  Clock,
  Check,
} from "lucide-react";
import { MOCK_ESTABLISHMENT } from "@/lib/data/pro-mock-data";

export function DashboardHeader() {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");
  const [salonSwitcherOpen, setSalonSwitcherOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const NAV_ITEMS = [
    {
      label: "Agenda",
      href: "/pro/agenda",
      icon: CalendarDays,
      active: pathname.startsWith("/pro/agenda"),
    },
    {
      label: "Caisse",
      href: "/pro/checkout",
      icon: CreditCard,
      active: pathname.startsWith("/pro/checkout"),
    },
    {
      label: "Clients",
      href: "/pro/clients",
      icon: Users,
      active: pathname.startsWith("/pro/clients"),
    },
    {
      label: "Admin",
      href: "/pro/settings",
      icon: Settings,
      active: pathname.startsWith("/pro/settings"),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/90 shadow-2xs select-none">
      <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 gap-2 sm:gap-6">
        {/* Section Gauche : Logo & Sélecteur d'établissement */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/pro/agenda"
            className="flex items-center gap-2 group"
            aria-label="Belora Pro - Accueil planning"
          >
            <Image
              src="/images/logos/belora.svg"
              alt="Belora"
              width={100}
              height={32}
              priority
              className="h-5 sm:h-6 w-auto object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
              Pro
            </span>
          </Link>

          <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

          {/* Switcher d'Établissement (Style Planity "Chez Colette") */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSalonSwitcherOpen(!salonSwitcherOpen)}
              className="flex items-center gap-2 text-sm sm:text-base font-semibold text-neutral-900 hover:text-primary-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">
                {MOCK_ESTABLISHMENT.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {salonSwitcherOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSalonSwitcherOpen(false)}
                />
                <div className="absolute left-0 mt-1 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg z-50 text-xs">
                  <div className="px-3 py-2 text-neutral-400 font-medium border-b border-neutral-100 uppercase tracking-wider">
                    Établissement actif
                  </div>
                  <div className="p-2 flex items-center justify-between rounded-lg bg-primary-50/60 text-neutral-900 font-semibold my-1">
                    <div>
                      <p>{MOCK_ESTABLISHMENT.name}</p>
                      <span className="text-neutral-500 font-normal">
                        {MOCK_ESTABLISHMENT.city}
                      </span>
                    </div>
                    <Check className="w-4 h-4 text-primary-700" />
                  </div>
                  <div className="pt-2 border-t border-neutral-100">
                    <Link
                      href={`/venue/${MOCK_ESTABLISHMENT.slug}`}
                      target="_blank"
                      className="flex items-center justify-between px-3 py-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <span>Voir la page publique</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section Centre : Les 4 Onglets Principaux */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-semibold transition-all duration-150 ${
                  item.active
                    ? "bg-primary-600 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Section Droite : Horloge, Notifications, Profil */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Horloge en direct */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-600 font-medium bg-neutral-100/80 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span className="tabular-nums font-semibold text-neutral-900">
              {currentTime || "14:37"}
            </span>
          </div>

          {/* Cloche de notifications avec badge Planity-style */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              aria-label="Centre de notifications"
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 px-2">
                    <span className="font-bold text-neutral-900">
                      Notifications du salon
                    </span>
                    <span className="text-neutral-400 text-[11px]">Direct</span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    <div className="py-2.5 px-2 hover:bg-neutral-50 rounded-lg">
                      <p className="font-semibold text-neutral-900">
                        Nouvelle réservation en ligne
                      </p>
                      <p className="text-neutral-600 text-xs mt-0.5">
                        Sophie Martin &bull; Grand Rituel Kobido (14h00)
                      </p>
                      <span className="text-neutral-400 text-[10px] mt-1 block">
                        Il y a 12 minutes &bull; Acompte 40 € perçu
                      </span>
                    </div>
                    <div className="py-2.5 px-2 hover:bg-neutral-50 rounded-lg">
                      <p className="font-semibold text-neutral-900">
                        Rappel SMS envoyé
                      </p>
                      <p className="text-neutral-600 text-xs mt-0.5">
                        Antoine Dupont confirmé pour 10h00 demain
                      </p>
                      <span className="text-neutral-400 text-[10px] mt-1 block">
                        Il y a 1 heure
                      </span>
                    </div>
                    <div className="py-2.5 px-2 hover:bg-neutral-50 rounded-lg">
                      <p className="font-semibold text-neutral-900">
                        Pointage équipe validé
                      </p>
                      <p className="text-neutral-600 text-xs mt-0.5">
                        Clément Roux a pointé son arrivée à 09:55
                      </p>
                      <span className="text-neutral-400 text-[10px] mt-1 block">
                        Ce matin
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Lien externe vers la fiche vitrine */}
          <Link
            href={`/venue/${MOCK_ESTABLISHMENT.slug}`}
            target="_blank"
            title="Consulter ma fiche en ligne sur Belora"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 text-xs font-semibold transition-colors"
          >
            <span>Fiche publique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Avatar Pro */}
          <div className="w-8 h-8 rounded-full bg-primary-100 border border-primary-200 text-primary-900 font-bold text-xs flex items-center justify-center shrink-0">
            HV
          </div>
        </div>
      </div>
    </header>
  );
}
