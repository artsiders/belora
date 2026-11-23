import React from "react";
import { DashboardHeader } from "@/components/pro-dashboard/header/dashboard-header";
import { EstablishmentProvider } from "@/contexts/pro-establishment-context";
import { SubscriptionBanner } from "@/components/pro-dashboard/subscription/subscription-banner";

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
    <EstablishmentProvider>
      <div className="h-dvh flex flex-col overflow-hidden bg-neutral-100/60 text-neutral-900 antialiased">
        {/* Header Permanent Pro */}
        <DashboardHeader />
        <SubscriptionBanner />

        {/* Main Content Area */}
        {/* Hauteur restante sous l'en-tête : chaque page gère son propre défilement */}
        <main className="flex-1 min-h-0 flex flex-col overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </EstablishmentProvider>
  );
}
