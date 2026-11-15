"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Shield,
  ChevronDown,
  ExternalLink,
  Settings,
  LayoutDashboard,
  Coins,
  PlusCircle,
} from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

interface AdminSidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
  undefined
);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error(
      "useAdminSidebar must be used within an AdminSidebarProvider"
    );
  }
  return context;
}

interface AdminLayoutShellProps {
  children: React.ReactNode;
  userEmail: string;
  userName?: string;
}

const SECTION_TITLES: Record<string, string> = {
  "/admin/dashboard": "Vue d'ensemble",
  "/admin/bookings": "Gestion des Réservations",
  "/admin/users": "Répertoire des Utilisateurs",
  "/admin/venues": "Salons & Établissements Partenaires",
  "/admin/venues/create-assisted": "Onboarding Partenaire Assisté",
  "/admin/finance": "Finances & Payouts Stripe",
  "/admin/reviews": "Modération des Avis Clients",
  "/admin/monetization": "Monétisation & Commissions",
  "/admin/settings": "Paramètres Système & Santé",
};

export function AdminLayoutShell({
  children,
  userEmail,
  userName = "Administrateur Belora",
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("belora_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignorer si localStorage indisponible
    }
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(
          "belora_admin_sidebar_collapsed",
          next ? "true" : "false"
        );
      } catch {
        // Ignorer
      }
      return next;
    });
  };

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  // Fermer la sidebar mobile lors du changement de route
  useEffect(() => {
    closeMobile();
    setUserDropdownOpen(false);
  }, [pathname]);

  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SA";

  const currentSectionTitle =
    SECTION_TITLES[pathname] || "Console de Supervision";

  return (
    <AdminSidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapsed,
        toggleMobile,
        closeMobile,
      }}
    >
      <div className="min-h-screen flex bg-neutral-50 text-neutral-900 antialiased font-sans">
        {/* Backdrop pour mobile */}
        {isMobileOpen && (
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
            aria-hidden="true"
          />
        )}

        {/* Sidebar Desktop & Mobile */}
        <AdminSidebar />

        {/* Zone de contenu principale */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Header supérieur moderne, épuré, sans aucun doublon */}
          <header className="h-14 sm:h-16 bg-white border-b border-neutral-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs select-none">
            {/* Côté gauche : Toggle sidebar unique & Fil d'ariane contextuel */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Bouton Hamburger sur mobile */}
              <button
                type="button"
                onClick={toggleMobile}
                className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Bouton unique de réduction / expansion sur Desktop */}
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:inline-flex p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                title={
                  isCollapsed
                    ? "Développer la barre latérale"
                    : "Réduire la barre latérale"
                }
                aria-label="Contrôler la barre latérale"
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </button>

              <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

              {/* Fil d'Ariane épuré */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden md:inline">
                  Supervision Belora
                </span>
                <span className="text-neutral-300 hidden md:inline">&bull;</span>
                <h1 className="text-sm font-bold text-neutral-900 truncate">
                  {currentSectionTitle}
                </h1>
              </div>
            </div>

            {/* Côté droit : Indicateur d'état & Menu Déroulant Profil Administrateur */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Statut Plateforme épuré avec point pulsé discret */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-medium text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Système Opérationnel</span>
              </div>

              <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

              {/* Dropdown Profil Administrateur (Remplace l'email brut et le bouton déconnexion isolé) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-secondary-500/20 text-secondary-900 font-bold text-xs flex items-center justify-center shrink-0 border border-secondary-400/50">
                    {initials}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-neutral-900 truncate max-w-[130px]">
                      {userName}
                    </span>
                    <span className="text-[11px] text-neutral-500 truncate max-w-[130px]">
                      {userEmail}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180 text-secondary-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 rounded-2xl border border-neutral-200/90 bg-white p-2 shadow-xl z-50 text-sm overflow-hidden"
                      >
                        {/* En-tête du Profil */}
                        <div className="p-3 bg-neutral-50/90 rounded-xl border border-neutral-200/60 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-secondary-500/20 text-secondary-900 font-bold text-xs flex items-center justify-center shrink-0 border border-secondary-400/50">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-neutral-950 text-xs truncate">
                                {userName}
                              </p>
                              <p className="text-[11px] text-neutral-500 truncate mt-0.5 font-mono">
                                {userEmail}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                            <span className="text-neutral-500 text-[11px]">Rôle plateforme</span>
                            <span className="font-bold text-secondary-800 bg-secondary-50 border border-secondary-200/60 px-2 py-0.5 rounded text-[11px]">
                              Super-Admin
                            </span>
                          </div>
                        </div>

                        {/* Liens rapides d'administration */}
                        <div className="space-y-0.5 py-1 text-xs">
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                          >
                            <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                            <span>Vue d&apos;ensemble</span>
                          </Link>

                          <Link
                            href="/admin/settings"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                          >
                            <Settings className="w-4 h-4 text-neutral-400" />
                            <span>Paramètres système &amp; santé</span>
                          </Link>

                          <Link
                            href="/admin/monetization"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                          >
                            <Coins className="w-4 h-4 text-neutral-400" />
                            <span>Monétisation &amp; commissions</span>
                          </Link>

                          <Link
                            href="/admin/venues/create-assisted"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                          >
                            <PlusCircle className="w-4 h-4 text-neutral-400" />
                            <span>Créer un salon assisté</span>
                          </Link>

                          <div className="pt-1 mt-1 border-t border-neutral-100">
                            <Link
                              href="/"
                              target="_blank"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center justify-between px-3 py-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors font-medium"
                            >
                              <div className="flex items-center gap-2.5">
                                <ExternalLink className="w-4 h-4 text-neutral-400" />
                                <span>Voir le site public Belora</span>
                              </div>
                            </Link>
                          </div>
                        </div>

                        {/* Déconnexion unique et officielle */}
                        <div className="pt-1 mt-1 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              signOut({ callbackUrl: "/login" });
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50/70 transition-colors cursor-pointer text-left font-semibold text-xs"
                          >
                            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Se déconnecter</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Corps de page responsive */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarContext.Provider>
  );
}
