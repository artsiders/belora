import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Super-Admin Plateforme - Belora",
  description: "Portail d'administration centrale de la marketplace Belora.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900 antialiased font-sans">
      {/* Sidebar latérale fixe */}
      <AdminSidebar />

      {/* Zone de contenu principale */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-neutral-800 tracking-wide uppercase">
              Supervision Belora France
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Système Opérationnel
            </span>
            <div className="h-8 w-px bg-neutral-200" />
            <span className="text-xs text-neutral-600 font-medium">
              admin@yopmail.com
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
