import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col lg:grid lg:grid-cols-12 selection:bg-primary-100 selection:text-primary-900">
      {/* 1. Colonne Visuelle Immersive Éditoriale (Desktop 5 cols) */}
      <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-14 text-white overflow-hidden bg-neutral-950">
        {/* Photographie d’ambiance haute définition */}
        <Image
          src="/images/auth/auth-editorial.jpg"
          alt="Ambiance feutrée d'un sanctuaire de soin Belora"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover object-center opacity-60"
        />

        {/* Voile d'ombrage pour lisibilité typographique */}
        <div
          className="absolute inset-0 bg-neutral-950/40 pointer-events-none"
          aria-hidden="true"
        />

        {/* En-tête : Logo Belora & Retour accueil */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Belora - Retour à l'accueil"
          >
            <Image
              src="/images/logos/belora.svg"
              alt="Belora"
              width={182}
              height={80}
              priority
              className="object-contain h-7 w-auto invert brightness-200"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-200 hover:text-white transition-colors py-2 px-3.5 rounded-xl border border-white/20 bg-neutral-950/40 backdrop-blur-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explorer le site</span>
          </Link>
        </div>

        {/* Pied de page visuel : Manifeste & Réassurance */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs border border-white/15 text-sm uppercase tracking-wider text-primary-200 font-semibold">
            <span>Maison d’artisans du soin</span>
          </div>

          <h2 className="font-display text-3xl xl:text-4xl leading-[1.15] text-white text-balance font-normal">
            L’exigence du geste, la beauté du moment suspendu.
          </h2>

          <p className="text-sm text-neutral-300 font-normal leading-relaxed text-pretty">
            Rejoignez une communauté de passionnés et réservez vos soins auprès
            des salons de coiffure, instituts et spas d&apos;exception.
          </p>

          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-sm text-neutral-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-primary-300" />
              <span>Artisans audités</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium num text-neutral-100">
              <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
              <span>4,9 / 5 certifié</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Colonne Contenu Formulaire (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 min-h-screen bg-white">
        {/* Navigation supérieure mobile & liens rapides */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          {/* Logo visible sur mobile uniquement */}
          <Link
            href="/"
            className="lg:hidden flex items-center"
            aria-label="Belora - Accueil"
          >
            <Image
              src="/images/logos/belora.svg"
              alt="Belora"
              width={182}
              height={80}
              priority
              className="object-contain h-7 w-auto"
            />
          </Link>

          <div className="ml-auto flex items-center gap-4 text-sm">
            <Link
              href="/"
              className="text-neutral-600 hover:text-neutral-950 transition-colors inline-flex items-center gap-1.5 lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>

        {/* Zone centrale dédiée au formulaire */}
        <div className="max-w-md w-full mx-auto my-auto py-6">
          {children}
        </div>

        {/* Pied de page sobre */}
        <div className="pt-8 mt-8 border-t border-neutral-200/80 text-center sm:flex sm:items-center sm:justify-between text-sm text-neutral-500">
          <p>© 2026 Belora · Tous droits réservés.</p>
          <div className="flex items-center justify-center gap-4 mt-2 sm:mt-0">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">
              Confidentialité
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-neutral-900 transition-colors">
              Conditions
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-neutral-900 transition-colors">
              Assistance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
