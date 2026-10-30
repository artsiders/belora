import { Metadata } from "next";
import { Suspense } from "react";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "Rechercher un havre ou un artisan de soin | Belora",
  description:
    "Explorez et réservez instantanément les salons de coiffure, instituts de manucure, spas et barbiers d'exception à Paris, New York, Londres, Tokyo et Milan.",
};

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-belora py-16 text-center text-xs text-sand-500">
              Chargement des maisons de soins...
            </div>
          }
        >
          <SearchClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
