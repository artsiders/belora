"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

interface ProNavProps {
  onStartDemo?: () => void;
  showNavLinks?: boolean;
}

export function ProNav({ onStartDemo, showNavLinks = true }: ProNavProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
        {/* 1. Logo Belora Pro officiel */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Belora - Retour à la marketplace"
          >
            <Image
              src="/images/logos/belora.svg"
              alt="Belora"
              width={182}
              height={80}
              priority
              className="object-contain h-7 w-auto"
            />
            <span className="text-[11px] font-bold tracking-widest text-primary-700 uppercase bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200/70">
              Pro
            </span>
          </Link>
        </div>

        {/* 2. Menu Pro au centre (visible sur grand écran) */}
        {showNavLinks && (
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            <Link
              href="/pro#features"
              className="hover:text-primary-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Solutions</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </Link>
            <Link
              href="/pro#pricing"
              className="hover:text-primary-600 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-600 transition-colors"
            >
              Le Manifeste
            </Link>
          </nav>
        )}

        {/* 3. Actions à droite */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors px-2 py-1.5"
          >
            Se connecter
          </Link>

          {onStartDemo ? (
            <button
              type="button"
              onClick={onStartDemo}
              className="btn btn-dark btn-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Demander une démo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/pro/join"
              className="btn btn-dark btn-sm inline-flex items-center gap-1.5"
            >
              <span>Demander une démo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
