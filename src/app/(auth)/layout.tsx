import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-sand-100 flex flex-col lg:grid lg:grid-cols-12 selection:bg-primary-100 selection:text-primary-900">
      {/* 1. Colonne Visuelle Immersive Éditoriale (Desktop 5 cols) */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-14 text-sand-50 overflow-hidden bg-sand-950">
        {/* Photographie d’ambiance haute définition */}
        <Image
          src="/images/auth/auth-editorial.jpg"
          alt="Ambiance feutrée d'un sanctuaire de soin Belora"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover object-center opacity-65"
        />

        {/* Voile d'ombrage pour lisibilité typographique */}
        <div
          className="absolute inset-0 bg-sand-950/35 pointer-events-none"
          aria-hidden="true"
        />

        {/* En-tête : Logo Belora & Retour accueil */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl tracking-tight text-sand-50 hover:text-primary-300 transition-colors"
            aria-label="Belora - Retour à l'accueil"
          >
            Belora
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-sand-200/80 hover:text-sand-50 transition-colors py-1.5 px-3 rounded-[var(--radius-sm)] border border-sand-50/20 bg-sand-950/30 backdrop-blur-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explorer le site</span>
          </Link>
        </div>

        {/* Pied de page visuel : Manifeste & Réassurance */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-sand-950/60 backdrop-blur-xs border border-sand-50/15 text-[11px] uppercase tracking-widest text-primary-200 font-semibold">
            <span>Maison d’artisans du soin</span>
          </div>

          <h2 className="text-3xl xl:text-4xl leading-[1.1] text-sand-50 text-balance">
            L’exigence du geste, la beauté du moment suspendu.
          </h2>

          <p className="text-xs xl:text-sm text-sand-200/80 font-normal leading-relaxed text-pretty">
            Rejoignez une communauté de passionnés et réservez vos soins auprès
            des salons de coiffure, instituts et spas indépendants les plus
            exigeants de France.
          </p>

          <div className="pt-4 border-t border-sand-50/15 flex items-center justify-between text-xs text-sand-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-300" />
              <span>Artisans rigoureusement sélectionnés</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium num text-sand-200">
              <Star className="w-3.5 h-3.5 fill-primary-400 text-primary-400" />
              <span>4,9 / 5 sur 12 000+ avis</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Colonne Contenu Formulaire (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 min-h-screen">
        {/* Navigation supérieure mobile & liens rapides */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          {/* Logo visible sur mobile uniquement */}
          <Link
            href="/"
            className="lg:hidden text-2xl tracking-tight text-sand-950"
            aria-label="Belora - Accueil"
          >
            Belora
          </Link>

          <div className="ml-auto flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="text-sand-600 hover:text-sand-950 transition-colors inline-flex items-center gap-1 lg:hidden"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </Link>
          </div>
        </div>

        {/* Zone centrale dédiée au formulaire */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          {children}
        </div>

        {/* Pied de page sobre */}
        <div className="pt-8 mt-8 border-t border-sand-200 text-center sm:flex sm:items-center sm:justify-between text-[11px] text-sand-500">
          <p>© 2026 Belora - L’artisanat du soin d’exception.</p>
          <div className="flex items-center justify-center gap-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="hover:text-sand-900 transition-colors">
              Confidentialité
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-sand-900 transition-colors">
              Conditions générales
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-sand-900 transition-colors">
              Assistance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
