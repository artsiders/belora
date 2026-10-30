import { Metadata } from "next";
import { Suspense } from "react";
import { ProJoinFlow } from "@/components/pro/pro-join-flow";

export const metadata: Metadata = {
  title: "Devenir Partenaire Belora Pro | Rejoindre le Cercle des Artisans",
  description:
    "Rejoignez les meilleurs salons de coiffure, instituts de beauté, barbiers et spas indépendants. Agenda haute précision, sans engagement et 0% de commission sur vos habitués.",
  openGraph: {
    title: "Devenir Partenaire Belora Pro",
    description:
      "La plateforme de référence pour valoriser votre savoir-faire et digitaliser votre salon ou atelier.",
    images: ["/images/pro/pro-hero.jpg"],
  },
};

export default function ProJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-8 text-xs text-neutral-500">
          Chargement de l&apos;espace Belora Pro...
        </div>
      }
    >
      <ProJoinFlow />
    </Suspense>
  );
}
