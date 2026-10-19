"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  MapPin,
} from "lucide-react";

interface UniverseItem {
  id: string;
  label: string;
  href: string;
  tagline: string;
  popularServices: { name: string; duration: string; price: string }[];
  featuredVenue: {
    name: string;
    city: string;
    rating: string;
    image: string;
    specialty: string;
  };
}

const UNIVERSES: UniverseItem[] = [
  {
    id: "hair",
    label: "Coiffure",
    href: "/search?category=hair",
    tagline: "Coupes d'auteur, colorations végétales et balayages minéraux",
    popularServices: [
      { name: "Balayage minéral sur-mesure", duration: "2h30", price: "dès 110 €" },
      { name: "Coupe & séchage signature", duration: "1h00", price: "dès 55 €" },
      { name: "Soin profond du cuir chevelu", duration: "45 min", price: "dès 45 €" },
      { name: "Coloration végétale 100% bio", duration: "1h45", price: "dès 75 €" },
    ],
    featuredVenue: {
      name: "L’Atelier Botanique",
      city: "Paris 3e (Le Marais)",
      rating: "4,9",
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      specialty: "Spécialiste du blond minéral et de la coupe à sec",
    },
  },
  {
    id: "facial",
    label: "Soins Visage",
    href: "/search?category=facial",
    tagline: "Diagnostics cutanés précis, rituels holistiques et Kobido",
    popularServices: [
      { name: "Rituel Kobido lifting japonais", duration: "1h15", price: "dès 95 €" },
      { name: "Soin éclat Hydrafacial d’auteur", duration: "1h00", price: "dès 120 €" },
      { name: "Diagnostic cutané & soin sur-mesure", duration: "1h30", price: "dès 85 €" },
      { name: "Nettoyage profond & luminothérapie", duration: "50 min", price: "dès 65 €" },
    ],
    featuredVenue: {
      name: "Maison Albar Institut",
      city: "Lyon (Presqu’île)",
      rating: "5,0",
      image:
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80",
      specialty: "Protocoles cosméceutiques et massages faciaux d'exception",
    },
  },
  {
    id: "massage",
    label: "Massages & Spas",
    href: "/search?category=massage",
    tagline: "Parenthèses sensorielles, bains de vapeur et massages holistiques",
    popularServices: [
      { name: "Massage grand relaxant signature", duration: "1h30", price: "dès 90 €" },
      { name: "Rituel ayurvédique aux huiles chaudes", duration: "1h15", price: "dès 85 €" },
      { name: "Accès bain de vapeur & gommage", duration: "2h00", price: "dès 70 €" },
      { name: "Drainage lymphatique d’inspiration Renata", duration: "1h00", price: "dès 110 €" },
    ],
    featuredVenue: {
      name: "Studio Séquoia",
      city: "Marseille (Vieux-Port)",
      rating: "4,8",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      specialty: "Sanctuaire minéral et modelages corporels ciblés",
    },
  },
  {
    id: "barber",
    label: "Barbiers",
    href: "/search?category=barber",
    tagline: "L'art du rasage traditionnel et de la coupe masculine travaillée",
    popularServices: [
      { name: "Taille de barbe & serviette chaude", duration: "45 min", price: "dès 38 €" },
      { name: "Coupe ciseaux classique & coiffage", duration: "45 min", price: "dès 42 €" },
      { name: "Formule Complète : Coupe & Barbe", duration: "1h15", price: "dès 72 €" },
      { name: "Soin vapeur purifiant du visage", duration: "30 min", price: "dès 35 €" },
    ],
    featuredVenue: {
      name: "Le Salon Saint-Germain",
      city: "Bordeaux (Triangle d’Or)",
      rating: "4,9",
      image:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
      specialty: "Fauteuils d'époque, rasage au coupe-choux et huiles artisanales",
    },
  },
  {
    id: "nails",
    label: "Onglerie",
    href: "/search?category=nails",
    tagline: "Soins réparateurs japonais, poses épurées et beauté des pieds",
    popularServices: [
      { name: "Manucure japonaise nourrissante", duration: "50 min", price: "dès 45 €" },
      { name: "Pose vernis semi-permanent sans solvant", duration: "1h00", price: "dès 50 €" },
      { name: "Beauté des pieds spa & gommage", duration: "1h15", price: "dès 65 €" },
      { name: "Dépose douce & soin kératine", duration: "30 min", price: "dès 25 €" },
    ],
    featuredVenue: {
      name: "L’Écrin Onglerie",
      city: "Paris 6e (Saint-Germain)",
      rating: "4,9",
      image:
        "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
      specialty: "Soins botaniques des ongles naturels et vernis clean",
    },
  },
];

export function MainNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveMenu(null);
  };

  // Gestion du survol avec délai pour éviter les fermetures accidentelles
  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const currentUniverse = UNIVERSES.find((u) => u.id === activeMenu);

  return (
    <header
      ref={navRef}
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 z-40 w-full transition-colors duration-200 border-b border-sand-200/90 bg-sand-100/95 backdrop-blur-md"
    >
      {/* 1. Ligne éditoriale supérieure discrète */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-12 py-1.5 border-b border-sand-200/60 text-[11px] text-sand-600 bg-sand-50/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600" aria-hidden="true" />
            <span className="font-medium text-sand-800">
              Maison Belora
            </span>
            <span className="text-sand-400">•</span>
            <span>Sélection d’artisans indépendants vérifiés</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sand-500">Paris • Lyon • Bordeaux • Marseille • Lille</span>
          <Link
            href="/pro"
            className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>Vous êtes un salon ou un institut ? Rejoindre le collectif</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. Barre principale de navigation */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-[68px] sm:h-[72px] flex items-center justify-between gap-6">
        {/* Gauche : Logo Belora */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            onClick={closeMenus}
            className="group flex items-baseline gap-1 focus:outline-none"
            aria-label="Belora - Accueil"
          >
            <span className="font-display text-2xl sm:text-[1.75rem] tracking-tight text-sand-950 transition-colors group-hover:text-primary-600">
              Belora
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 transition-transform group-hover:scale-125" aria-hidden="true" />
          </Link>

          {/* Centre : Liens d'univers avec méga-menu déroulant */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Univers de soins">
            {UNIVERSES.map((universe) => {
              const isActive = activeMenu === universe.id;
              return (
                <div
                  key={universe.id}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(universe.id)}
                >
                  <Link
                    href={universe.href}
                    onClick={closeMenus}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs uppercase tracking-wider font-semibold rounded-[var(--radius-sm)] transition-all ${
                      isActive
                        ? "text-primary-600 bg-sand-200/60"
                        : "text-sand-700 hover:text-sand-950 hover:bg-sand-200/30"
                    }`}
                  >
                    <span>{universe.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isActive ? "rotate-180 text-primary-600" : "text-sand-400"
                      }`}
                    />
                  </Link>

                  {/* Ligne d'accent active discrète sous le lien */}
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 inset-x-3.5 h-[2px] bg-primary-600"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Droite : Recherche rapide, Espace Pro & Boutons d'accès compte */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/search"
            onClick={closeMenus}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs text-sand-600 hover:text-sand-900 bg-sand-50 border border-sand-300 rounded-[var(--radius-sm)] transition-colors shadow-2xs"
            aria-label="Recherche rapide"
          >
            <Search className="w-3.5 h-3.5 text-sand-500" />
            <span className="font-medium">Trouver un soin…</span>
            <kbd className="text-[10px] text-sand-400 bg-sand-200/60 px-1.5 py-0.5 rounded font-mono">
              /
            </kbd>
          </Link>

          <Link
            href="/pro"
            onClick={closeMenus}
            className="hidden xl:inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-sand-700 hover:text-primary-600 transition-colors px-2 py-1"
          >
            <span>Espace Pro</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          <span className="hidden sm:inline-block w-px h-5 bg-sand-300" aria-hidden="true" />

          {/* Bouton Connexion qui redirige vers /login */}
          <Link
            href="/login"
            onClick={closeMenus}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[var(--radius-sm)] border border-sand-300 bg-sand-50 hover:bg-sand-900 text-sand-900 hover:text-sand-50 text-xs font-semibold tracking-wide uppercase transition-all duration-150 shadow-2xs"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Connexion</span>
          </Link>

          {/* Bouton Inscription discret pour les nouveaux visiteurs */}
          <Link
            href="/register"
            onClick={closeMenus}
            className="hidden sm:inline-flex items-center justify-center min-h-[40px] px-4 rounded-[var(--radius-sm)] bg-primary-600 hover:bg-primary-700 text-sand-50 text-xs font-semibold tracking-wide uppercase transition-all duration-150 shadow-2xs"
          >
            Rejoindre
          </Link>

          {/* Déclencheur Mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] border border-sand-300 bg-sand-50 text-sand-800 hover:bg-sand-200 transition-colors"
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. MEGA-MENU ÉDITORIAL DÉROULANT (Desktop) */}
      <AnimatePresence>
        {activeMenu && currentUniverse && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-sand-50 border-b border-sand-300 shadow-xl overflow-hidden"
            onMouseEnter={() => handleMouseEnter(currentUniverse.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-[1400px] mx-auto px-10 py-8 grid grid-cols-12 gap-8">
              {/* Colonne 1 : Titre & Concept de l'univers */}
              <div className="col-span-3 border-r border-sand-200 pr-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600 block mb-2">
                    Univers du soin
                  </span>
                  <h2 className="font-display text-2xl text-sand-950 mb-2">
                    {currentUniverse.label}
                  </h2>
                  <p className="text-xs text-sand-600 leading-relaxed font-normal">
                    {currentUniverse.tagline}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={currentUniverse.href}
                    onClick={closeMenus}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline underline-offset-4"
                  >
                    <span>Tous les salons de {currentUniverse.label.toLowerCase()}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Colonne 2 : Prestations signatures recherchées */}
              <div className="col-span-5 pr-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-sand-500 block mb-4">
                  Prestations les plus réservées
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentUniverse.popularServices.map((service, index) => (
                    <Link
                      key={index}
                      href={`/search?category=${currentUniverse.id}&service=${encodeURIComponent(service.name)}`}
                      onClick={closeMenus}
                      className="group flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-transparent hover:border-sand-200 hover:bg-sand-100 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-sand-900 group-hover:text-primary-600 transition-colors">
                          {service.name}
                        </span>
                        <span className="text-[11px] text-sand-500">
                          Durée indicative : {service.duration}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-sand-800 num">
                        {service.price}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Colonne 3 : Artisan / Atelier mis en avant */}
              <div className="col-span-4 pl-4 border-l border-sand-200">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-sand-500 block mb-4">
                  Maison d’artisan sélectionnée
                </span>
                <Link
                  href={`/venue/${currentUniverse.featuredVenue.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={closeMenus}
                  className="group block p-3 rounded-[var(--radius-sm)] bg-sand-100 border border-sand-200 hover:border-sand-300 transition-all"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-xs)] mb-3 bg-sand-200">
                    <Image
                      src={currentUniverse.featuredVenue.image}
                      alt={currentUniverse.featuredVenue.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 1200px) 300px, 400px"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-sand-50/90 backdrop-blur-xs text-[11px] font-semibold text-sand-900 num flex items-center gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                      ★ {currentUniverse.featuredVenue.rating}
                    </div>
                  </div>
                  <h3 className="font-display text-base text-sand-950 group-hover:text-primary-600 transition-colors">
                    {currentUniverse.featuredVenue.name}
                  </h3>
                  <p className="text-[11px] text-sand-500 flex items-center gap-1 mt-0.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-sand-400" />
                    <span>{currentUniverse.featuredVenue.city}</span>
                  </p>
                  <p className="text-xs text-sand-600 leading-snug line-clamp-2">
                    {currentUniverse.featuredVenue.specialty}
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. TIROIR MOBILE (Drawer) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b border-sand-300 bg-sand-50 overflow-hidden"
          >
            <div className="px-5 py-6 space-y-6">
              {/* Barre de recherche mobile */}
              <form action="/search" method="GET" className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-500" />
                <input
                  type="text"
                  name="q"
                  placeholder="Prestation, salon, ville…"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-sand-100 border border-sand-300 rounded-[var(--radius-sm)] text-sand-900 placeholder:text-sand-500 focus:outline-none focus:border-primary-600"
                />
              </form>

              {/* Liens d'univers */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sand-500 block mb-2">
                  Univers de soins
                </span>
                <div className="divide-y divide-sand-200">
                  {UNIVERSES.map((universe) => (
                    <Link
                      key={universe.id}
                      href={universe.href}
                      onClick={closeMenus}
                      className="flex items-center justify-between py-3 text-sm font-medium text-sand-900 hover:text-primary-600"
                    >
                      <span>{universe.label}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-sand-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Liens de compte */}
              <div className="pt-4 border-t border-sand-200 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-sm)] border border-sand-300 bg-sand-100 text-sand-900 text-xs font-semibold uppercase tracking-wider"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Se connecter</span>
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="w-full flex items-center justify-center py-3 rounded-[var(--radius-sm)] bg-primary-600 text-sand-50 text-xs font-semibold uppercase tracking-wider"
                >
                  <span>Créer un compte Belora</span>
                </Link>
                <Link
                  href="/pro"
                  onClick={closeMenus}
                  className="w-full text-center py-2 text-xs font-semibold text-sand-600 hover:text-primary-600"
                >
                  Espace Professionnel (Salons & Spas) ↗
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
