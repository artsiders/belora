import React from "react";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";
import { auth } from "@/lib/auth";

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
    <AdminLayoutShell userEmail={userEmail}>
      {children}
    </AdminLayoutShell>
  );
}
