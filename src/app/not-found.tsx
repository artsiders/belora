import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
  const popularCategories = [
    { label: "Coiffure d’auteur", href: "/search?category=hair" },
    { label: "Soins du visage", href: "/search?category=facial" },
    { label: "Massages & Spas", href: "/search?category=massage" },
    { label: "Barbiers", href: "/search?category=barber" },
    { label: "Onglerie de soin", href: "/search?category=nails" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-sand-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-2xl w-full text-center">
          <p className="eyebrow mb-3 text-sand-500 font-semibold tracking-widest">
            Erreur 404 · Page Introuvable
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-sand-950 mb-5 leading-tight text-balance">
            Cette adresse semble s’être volatilisée.
          </h1>

          <p className="text-sm sm:text-base text-sand-600 max-w-lg mx-auto mb-10 leading-relaxed font-normal text-pretty">
            La page que vous recherchez n’existe plus ou a été déplacée.
            Retrouvez le chemin de nos sanctuaires et artisans du soin d’exception.
          </p>

          {/* Recherche rapide */}
          <form
            action="/search"
            method="GET"
            className="flex items-center gap-2 max-w-md mx-auto mb-10 p-1.5 rounded-[var(--radius-sm)] bg-sand-50 border border-sand-300 shadow-2xs"
          >
            <div className="pl-3 text-sand-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Rechercher une maison, un artisan ou un soin..."
              className="flex-1 bg-transparent border-0 py-1.5 px-2 text-xs sm:text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none"
            />
            <button type="submit" className="btn btn-primary btn-xs sm:btn-sm">
              Chercher
            </button>
          </form>

          {/* Liens rapides d'action */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link href="/" className="btn btn-primary btn-sm inline-flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à l’accueil</span>
            </Link>

            <Link href="/search" className="btn btn-outline btn-sm inline-flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Explorer la sélection</span>
            </Link>
          </div>

          {/* Raccourcis univers */}
          <div className="pt-8 border-t border-sand-200/80">
            <p className="text-xs text-sand-500 uppercase tracking-wider font-semibold mb-3">
              Univers recommandés
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-medium text-sand-700 bg-sand-50 hover:bg-sand-200/70 border border-sand-300/80 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
