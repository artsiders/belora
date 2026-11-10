"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ArrowUpRight,
  User,
  Calendar,
  LogOut,
  ChevronDown,
  Shield,
  Store,
} from "lucide-react";
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
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const closeMenu = () => setMobileOpen(false);

  // Fermer le dropdown utilisateur au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

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

  const user = session?.user;
  const role = (user as { role?: string })?.role;
  const userInitials = (
    user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "MB"
  )
    .toUpperCase()
    .slice(0, 2);

  const displayName =
    user?.name?.split(" ")[0] || "Mon Compte";

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
            {status === "loading" ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-neutral-200 animate-pulse" />
                <div className="h-4 w-20 rounded bg-neutral-100 animate-pulse" />
              </div>
            ) : status === "authenticated" && user ? (
              <div className="flex items-center gap-3">
                {role === "PRO" ? (
                  <Link
                    href="/pro/agenda"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-900 border border-primary-200/80 hover:bg-primary-100 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5 text-primary-700" />
                    <span>Espace Pro</span>
                  </Link>
                ) : role === "ADMIN" ? (
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-100 hover:bg-neutral-800 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Super-Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/search"
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <span>Réserver un rituel</span>
                  </Link>
                )}

                <span className="w-px h-3.5 bg-neutral-300" aria-hidden="true" />

                {/* Dropdown Menu Utilisateur */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200/90 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-colors cursor-pointer text-left shadow-2xs"
                    aria-expanded={userMenuOpen}
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-900 text-white font-medium text-xs flex items-center justify-center shrink-0 tracking-wider">
                      {userInitials}
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 max-w-[130px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-neutral-200/90 shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-950 truncate">
                          {user.name || displayName}
                        </p>
                        <p className="text-xs text-neutral-500 truncate mb-2">
                          {user.email}
                        </p>
                        <span className="inline-block text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                          {role === "ADMIN"
                            ? "Administrateur"
                            : role === "PRO"
                            ? "Professionnel Belora"
                            : "Membre Belora"}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-neutral-400" />
                          <span>Mon Compte</span>
                        </Link>

                        <Link
                          href="/account?tab=upcoming"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          <span>Mes Rendez-vous</span>
                        </Link>

                        {role === "PRO" && (
                          <>
                            <div className="my-1 border-t border-neutral-100" />
                            <Link
                              href="/pro/agenda"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-primary-900 bg-primary-50/50 hover:bg-primary-50 transition-colors"
                            >
                              <Store className="w-4 h-4 text-primary-700" />
                              <span>Agenda & Réservations</span>
                            </Link>
                            <Link
                              href="/pro/checkout"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors pl-11"
                            >
                              <span>Caisse & Facturation</span>
                            </Link>
                          </>
                        )}

                        {role === "ADMIN" && (
                          <>
                            <div className="my-1 border-t border-neutral-100" />
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-neutral-900 bg-neutral-100/70 hover:bg-neutral-100 transition-colors"
                            >
                              <Shield className="w-4 h-4 text-amber-600" />
                              <span>Console Super-Admin</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/60 transition-colors cursor-pointer text-left font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/pro/join"
                  className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <span>Je suis un professionnel</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </Link>

                <span className="w-px h-3.5 bg-neutral-300" aria-hidden="true" />

                <Link href="/login" className="btn btn-ghost btn-sm">
                  Connexion
                </Link>

                <Link href="/register" className="btn btn-dark">
                  Rejoindre
                </Link>
              </>
            )}
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
                      <span className="text-sm uppercase font-semibold tracking-widest text-primary-700">
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
                              <p className="text-sm text-neutral-500 font-normal mt-0.5">
                                {link.subtitle}
                              </p>
                            </div>
                            <span className="text-sm font-mono font-medium text-neutral-400 group-hover:text-primary-600 transition-colors">
                              {link.number}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    {/* Accès direct aux univers avec badges légers */}
                    <div className="pt-2">
                      <span className="block text-sm uppercase font-semibold tracking-wider text-neutral-400 mb-3">
                        Recherche par catégorie
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_CHIPS.map((chip) => (
                          <Link
                            key={chip.name}
                            href={chip.href}
                            onClick={closeMenu}
                            className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 border border-neutral-200/80 transition-colors"
                          >
                            {chip.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section inférieure : Belora Pro & Authentification */}
                  <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                    {status === "authenticated" && user ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                          <div className="w-11 h-11 rounded-full bg-primary-900 text-white font-medium text-sm flex items-center justify-center shrink-0 tracking-wider">
                            {userInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-neutral-950 truncate">
                              {user.name || displayName}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {user.email}
                            </p>
                            <span className="inline-block mt-1 text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                              {role === "ADMIN"
                                ? "Administrateur"
                                : role === "PRO"
                                ? "Professionnel"
                                : "Client Belora"}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/account"
                            onClick={closeMenu}
                            className="btn btn-outline py-2.5 rounded-xl text-xs font-semibold text-center"
                          >
                            Mon Compte
                          </Link>
                          <Link
                            href="/account?tab=upcoming"
                            onClick={closeMenu}
                            className="btn btn-primary py-2.5 rounded-xl text-xs font-semibold text-center"
                          >
                            Mes Rendez-vous
                          </Link>
                        </div>

                        {role === "PRO" && (
                          <Link
                            href="/pro/agenda"
                            onClick={closeMenu}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-primary-900 text-white hover:bg-neutral-950 transition-colors text-xs font-semibold"
                          >
                            <span>Espace Pro (Agenda & Caisse)</span>
                            <ArrowUpRight className="w-4 h-4 text-neutral-200" />
                          </Link>
                        )}

                        {role === "ADMIN" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={closeMenu}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-950 transition-colors text-xs font-semibold"
                          >
                            <span>Console Super-Admin</span>
                            <ArrowUpRight className="w-4 h-4 text-amber-400" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            closeMenu();
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Carte raffinée Belora Pro */}
                        <Link
                          href="/pro/join"
                          onClick={closeMenu}
                          className="flex items-center justify-between p-4 rounded-2xl bg-secondary-900 text-white hover:bg-neutral-950 transition-colors shadow-sm"
                        >
                          <div>
                            <span className="text-sm uppercase font-semibold tracking-wider text-neutral-400 block mb-0.5">
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
                            className="btn btn-outline py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-center"
                          >
                            Connexion
                          </Link>
                          <Link
                            href="/register"
                            onClick={closeMenu}
                            className="btn btn-primary py-3 rounded-full text-sm font-semibold uppercase tracking-wider text-center"
                          >
                            Rejoindre
                          </Link>
                        </div>
                      </>
                    )}
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
