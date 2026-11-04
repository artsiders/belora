import React from "react";
import { SettingsSidebar } from "@/components/pro-dashboard/settings/settings-sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar Paramètres */}
      <SettingsSidebar />

      {/* Contenu de la sous-page Paramètres */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-neutral-50/50">
        {children}
      </div>
    </div>
  );
}
