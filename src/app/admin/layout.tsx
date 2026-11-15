import React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Super-Admin Plateforme - Belora",
  description: "Portail d'administration centrale de la marketplace Belora.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userEmail = session?.user?.email || "admin@belora.com";

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
            <Badge variant="success" size="sm">
              Système Opérationnel
            </Badge>
            <div className="h-6 w-px bg-neutral-200" />
            <span className="text-xs text-neutral-600 font-medium font-mono">
              {userEmail}
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
