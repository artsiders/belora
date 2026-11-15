"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
}

export function AdminLayoutShell({
  children,
  userEmail,
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("belora_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignorer si localStorage n'est pas disponible
    }
  }, []);

  // Save preference on change
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

  // Fermer la sidebar mobile lors de la navigation
  useEffect(() => {
    closeMobile();
  }, [pathname]);

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

        {/* Sidebar Desktop (statique & collapsible) & Mobile (tiroir) */}
        <AdminSidebar />

        {/* Zone de contenu principale */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          {/* Header supérieur Responsive */}
          <header className="h-16 bg-white border-b border-neutral-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-2xs">
            {/* Côté gauche : Toggle sidebar & Titre */}
            <div className="flex items-center gap-3">
              {/* Bouton Hamburger sur mobile */}
              <button
                type="button"
                onClick={toggleMobile}
                className="lg:hidden p-2 -ml-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Bouton Réduire / Agrandir sur Desktop */}
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:inline-flex p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                title={
                  isCollapsed
                    ? "Agrandir le menu latéral"
                    : "Réduire le menu latéral"
                }
                aria-label="Contrôler la largeur du menu latéral"
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </button>

              <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

              <div>
                <h1 className="text-xs sm:text-sm font-semibold text-neutral-900 tracking-wide uppercase">
                  Supervision Belora France
                </h1>
              </div>
            </div>

            {/* Côté droit : Statut, Profil & Déconnexion */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <Badge variant="success" size="sm">
                  Système Opérationnel
                </Badge>
              </div>

              <div className="h-5 w-px bg-neutral-200 hidden sm:block" />

              {/* Email de l'administrateur */}
              <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-mono">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <span>{userEmail}</span>
              </div>

              {/* Bouton de Déconnexion officiel */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-red-600 hover:bg-red-50 border border-neutral-200/80 hover:border-red-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Déconnexion de l'espace administration"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-600" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </header>

          {/* Corps de page avec container responsive */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarContext.Provider>
  );
}
