"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};

const NAV_LINKS = [
  {
    title: "Réserver un salon",
    subtitle: "Coiffure, esthétique, massages & soins",
    href: "/search",
    number: "01",
  },
  {
    title: "Nos Prestations",
    subtitle: "Explorer les rituels et univers de soin",
    href: "/search?category=hair",
    number: "02",
  },
  {
    title: "Notre Philosophie",
    subtitle: "L'art du bien-être et de l'exigence artisanale",
    href: "/about",
    number: "03",
  },
  {
    title: "Assistance & FAQ",
    subtitle: "Toutes les réponses à vos questions",
    href: "/help",
    number: "04",
  },
];

const CATEGORY_CHIPS = [
  { name: "Coiffure", href: "/category/hair" },
  { name: "Esthétique", href: "/category/facial" },
  { name: "Onglerie", href: "/category/nails" },
  { name: "Barbier", href: "/category/barber" },
  { name: "Massages", href: "/category/massage" },
  { name: "À domicile", href: "/category/home" },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const closeMenu = () => setMobileOpen(false);

  // Verrouillage du scroll arrière-plan quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
          {/* 1. Logo Belora officiel */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center"
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

          {/* 2. Actions Desktop à droite */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/pro/join"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <span>Je suis un professionnel</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <span className="w-px h-3.5 bg-neutral-300" aria-hidden="true" />

            <Link href="/login" className="btn btn-ghost btn-sm">
              Connexion
            </Link>

            <Link href="/register" className="btn btn-dark btn-sm">
              Rejoindre
            </Link>
          </div>

          {/* 3. Bouton Burger Mobile Design Épuré */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 bg-neutral-50/80 text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* 4. Menu Mobile Plein Écran via Portail sur document.body (insensible aux contextes d'empilement du header) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col h-dvh w-screen overflow-hidden"
              >
                {/* Barre supérieure avec Logo et bouton de fermeture rond élégant */}
                <div className="h-16 px-5 sm:px-8 border-b border-neutral-200/80 flex items-center justify-between shrink-0 bg-white">
                  <Link href="/" onClick={closeMenu} aria-label="Belora - Accueil">
                    <Image
                      src="/images/logos/belora.svg"
                      alt="Belora"
                      width={182}
                      height={80}
                      priority
                      className="object-contain h-7 w-auto"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={closeMenu}
                    className="w-10 h-10 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer shadow-2xs"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-5 h-5 stroke-[1.8]" />
                  </button>
                </div>

                {/* Corps du menu avec défilement fluide et typographie éditoriale */}
                <div className="flex-1 overflow-y-auto px-6 py-6 sm:py-8 flex flex-col justify-between space-y-8 bg-white">
                  {/* Navigation Principale Éditoriale */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase font-semibold tracking-widest text-primary-700">
                        Navigation
                      </span>
                      <span className="h-px w-10 bg-primary-300" aria-hidden="true" />
                    </div>

                    <nav className="flex flex-col space-y-4">
                      {NAV_LINKS.map((link, idx) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.22, delay: idx * 0.04 }}
                        >
                          <Link
                            href={link.href}
                            onClick={closeMenu}
                            className="group flex items-baseline justify-between py-2 border-b border-neutral-100"
                          >
                            <div>
                              <span className="text-2xl sm:text-3xl font-normal text-neutral-950 group-hover:text-primary-600 transition-colors">
                                {link.title}
                              </span>
                              <p className="text-xs text-neutral-500 font-normal mt-0.5">
                                {link.subtitle}
                              </p>
                            </div>
                            <span className="text-xs font-mono font-medium text-neutral-400 group-hover:text-primary-600 transition-colors">
                              {link.number}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    {/* Accès direct aux univers avec badges légers */}
                    <div className="pt-2">
                      <span className="block text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-3">
                        Recherche par catégorie
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_CHIPS.map((chip) => (
                          <Link
                            key={chip.name}
                            href={chip.href}
                            onClick={closeMenu}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 border border-neutral-200/80 transition-colors"
                          >
                            {chip.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section inférieure : Belora Pro & Authentification */}
                  <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                    {/* Carte raffinée Belora Pro */}
                    <Link
                      href="/pro/join"
                      onClick={closeMenu}
                      className="flex items-center justify-between p-4 rounded-2xl bg-secondary-900 text-white hover:bg-neutral-950 transition-colors shadow-sm"
                    >
                      <div>
                        <span className="text-xs uppercase font-semibold tracking-wider text-neutral-400 block mb-0.5">
                          Espace Professionnel
                        </span>
                        <span className="text-sm font-semibold text-neutral-50">
                          Développer votre salon avec Belora Pro
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-neutral-200" />
                      </div>
                    </Link>

                    {/* Boutons Connexion / Rejoindre */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <Link
                        href="/login"
                        onClick={closeMenu}
                        className="btn btn-outline py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-center"
                      >
                        Connexion
                      </Link>
                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="btn btn-primary py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-center"
                      >
                        Rejoindre
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
