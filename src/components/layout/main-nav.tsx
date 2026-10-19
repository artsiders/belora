"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { label: "Coiffure", href: "/search?category=hair" },
  { label: "Soins visage", href: "/search?category=facial" },
  { label: "Massages & Spas", href: "/search?category=massage" },
  { label: "Barbiers", href: "/search?category=barber" },
  { label: "Onglerie", href: "/search?category=nails" },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sand-200/80 bg-sand-100/90 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-[68px] flex items-center justify-between">
        {/* 1. Logo Belora pur et épuré */}
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display text-2xl tracking-tight text-sand-950 hover:text-sand-700 transition-colors focus:outline-none"
          aria-label="Belora - Accueil"
        >
          Belora
        </Link>

        {/* 2. Navigation centrale : univers de soins sobres */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Univers de soins">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="text-sm font-medium text-sand-700 hover:text-sand-950 transition-colors relative py-1"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* 3. Actions à droite : Espace Pro & Authentification */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            href="/pro"
            className="text-xs font-semibold uppercase tracking-wider text-sand-600 hover:text-sand-950 transition-colors"
          >
            Espace Pro
          </Link>

          <span className="w-px h-3.5 bg-sand-300" aria-hidden="true" />

          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-wider text-sand-800 hover:text-primary-600 transition-colors"
          >
            Connexion
          </Link>

          <Link
            href="/register"
            className="text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-[var(--radius-sm)] bg-sand-900 hover:bg-sand-950 text-sand-50 transition-colors"
          >
            Rejoindre
          </Link>
        </div>

        {/* 4. Bouton Mobile Menu */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-sand-800 hover:text-sand-950 focus:outline-none"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 5. Tiroir Mobile minimaliste */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="md:hidden border-t border-sand-200 bg-sand-50 px-6 py-5 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={closeMenu}
                  className="text-sm font-medium text-sand-800 hover:text-sand-950 py-1"
                >
                  {cat.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-sand-200 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-sand-900 border border-sand-300 rounded-[var(--radius-sm)] bg-sand-100"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-sand-50 bg-sand-900 rounded-[var(--radius-sm)]"
                >
                  Rejoindre
                </Link>
                <Link
                  href="/pro"
                  onClick={closeMenu}
                  className="text-center py-2 text-xs font-semibold text-sand-600 hover:text-sand-900"
                >
                  Espace Professionnel ↗
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
