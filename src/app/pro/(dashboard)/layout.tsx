import React from "react";
import { DashboardHeader } from "@/components/pro-dashboard/header/dashboard-header";

export const metadata = {
  title: "Belora Pro - Espace de Gestion",
  description: "Logiciel d'agenda, caisse et relation client pour salons et spas d'exception.",
};

export default function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100/60 text-neutral-900 antialiased">
      {/* Header Permanent Pro */}
      <DashboardHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
