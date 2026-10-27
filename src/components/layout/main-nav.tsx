"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ArrowUpRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const MOBILE_UNIVERSES = [
  {
    name: "Coiffure d’auteur",
    subtitle: "Coupe, coloration végétale & balayage",
    href: "/search?category=hair",
    bgClass: "bg-earth-terracotta",
  },
  {
    name: "Soins visage & éclat",
    subtitle: "Facialisme holistique, Kobido & diagnostic",
    href: "/search?category=facial",
    bgClass: "bg-earth-olive",
  },
  {
    name: "Massages & Spas",
    subtitle: "Rituels relaxants & détente profonde",
    href: "/search?category=massage",
    bgClass: "bg-earth-moss",
  },
  {
    name: "Mains & pieds",
    subtitle: "Manucure japonaise & pose naturelle",
    href: "/search?category=nails",
    bgClass: "bg-earth-sand",
  },
  {
    name: "Barbiers traditionnels",
    subtitle: "Taille au coupe-choux & serviette chaude",
    href: "/search?category=barber",
    bgClass: "bg-earth-cognac",
  },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const closeMenu = () => setMobileOpen(false);

  // Verrouillage du scroll en arrière-plan lorsque le menu mobile est ouvert
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
    <header className="sticky top-0 z-40 w-full border-b border-sand-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
        {/* 1. Logo Belora officiel */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center"
          aria-label="Belora - Accueil"
        >
          <Image
            src="/images/logos/belora.png"
            alt="Belora"
            width={182}
            height={80}
            priority
            className="object-contain h-7 w-auto"
          />
        </Link>

        {/* 3. Actions Desktop à droite */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/pro"
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-sand-600 hover:text-primary-600 transition-colors"
          >
            <span>Je suis un professionnel</span>
       
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <span className="w-px h-3.5 bg-sand-300" aria-hidden="true" />

          <Link href="/login" className="btn btn-ghost btn-sm">
            Connexion
          </Link>

          <Link href="/register" className="btn btn-dark btn-sm">
            Rejoindre
          </Link>
        </div>

        {/* 4. Bouton Burger Mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-sand-800 hover:text-sand-950 focus:outline-none cursor-pointer"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 5. Menu Mobile Créatif, Pro & Épuré (Plein écran coulissant) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-50 bg-white/98 backdrop-blur-xl overflow-y-auto flex flex-col justify-between p-5 sm:p-6"
          >
            <div className="space-y-6">
              {/* En-tête du tiroir avec eyebrow */}
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-sand-400 mb-3">
                  Explorer les univers de soins
                </p>

                {/* Liste des 5 univers au design soigné */}
                <div className="space-y-2">
                  {MOBILE_UNIVERSES.map((universe) => (
                    <Link
                      key={universe.href}
                      href={universe.href}
                      onClick={closeMenu}
                      className="group flex items-center justify-between p-3 rounded-2xl border border-sand-200/80 bg-white hover:border-sand-300 hover:bg-sand-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {/* Puce / miniature en arche avec couleur de l'univers */}
                        <div
                          className={`w-3.5 h-6 arch-t rounded-b-sm shrink-0 ${universe.bgClass}`}
                        />
                        <div>
                          <h3 className="text-sm font-bold text-sand-950 group-hover:text-primary-600 transition-colors">
                            {universe.name}
                          </h3>
                          <p className="text-xs text-sand-500 font-normal">
                            {universe.subtitle}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Raccourcis rapides éditoriaux */}
              <div className="pt-2 border-t border-sand-100">
                <p className="text-xs uppercase font-semibold tracking-wider text-sand-400 mb-2.5">
                  La Maison Belora
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/about"
                    onClick={closeMenu}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-50 border border-sand-200/60 text-xs font-semibold text-sand-800 hover:text-primary-600 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>Charte d’audit</span>
                  </Link>

                  <Link
                    href="/help"
                    onClick={closeMenu}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-sand-50 border border-sand-200/60 text-xs font-semibold text-sand-800 hover:text-primary-600 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>Aide & FAQ</span>
                  </Link>
                </div>
              </div>

              {/* Carte d'accès Belora Pro */}
              <Link
                href="/pro"
                onClick={closeMenu}
                className="block p-3.5 rounded-2xl bg-earth-espresso text-white hover:bg-sand-900 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-semibold tracking-wider text-sand-300 block mb-0.5">
                      Praticiens & Salons
                    </span>
                    <h4 className="text-sm font-bold text-sand-50">
                      Rejoindre Belora Pro
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-sand-200" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Pied du menu : Boutons d'authentification & signature en arches */}
            <div className="pt-6 mt-6 border-t border-sand-200/80 relative">
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="btn btn-outline py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-center"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="btn btn-primary py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-center"
                >
                  Rejoindre
                </Link>
              </div>

              {/* Arches décoratives en filigrane discret au bas du tiroir mobile */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-5 right-2 flex items-end opacity-15 select-none z-0"
              >
                <div className="w-16 h-24 arch-t rounded-b-none bg-earth-olive -mr-2" />
                <div className="w-20 h-16 arch-t rounded-b-none bg-earth-terracotta" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
