import Image from "next/image";
import Link from "next/link";

export function PhilosophySection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-50 border-b border-primary-200/80"
      aria-labelledby="philosophy-title"
    >
      {/* 1. Sur desktop (lg+) : Arrière-plan panoramique à droite (version validée et parfaite sur grand écran) */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/heroes/philosophy-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
      </div>

      {/* 2. Contenu éditorial textuel */}
      <div className="container-belora relative z-10 pt-12 pb-0 sm:pt-16 lg:py-28">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow éditorial avec filet linéaire bordeaux/figue */}
          <div className="flex items-center gap-3.5 mb-4 sm:mb-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-primary-700">
              Notre philosophie
            </span>
            <span
              className="h-px w-12 sm:w-16 bg-primary-400/80"
              aria-hidden="true"
            />
          </div>

          {/* Titre éditorial haut de gamme */}
          <h2
            id="philosophy-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-950 leading-tight mb-4"
          >
            Prendre soin de soi,{" "}
            <span className="block text-primary-600">
              c’est déjà être beau.
            </span>
          </h2>

          {/* Texte de présentation éditorial avec contraste et lisibilité parfaits */}
          <p className="text-sm sm:text-base lg:text-base text-neutral-700 leading-relaxed max-w-lg mb-6 sm:mb-8 font-normal">
            Chez Belora, nous croyons que la beauté commence par le bien-être.
            Découvrez et réservez les meilleurs salons, instituts et professionnels
            indépendants, sélectionnés pour la qualité de leurs services et le
            savoir-faire de leurs artisans.
          </p>

          {/* Bouton d'action bordeaux / figue */}
          <div>
            <Link
              href="/about"
              className="btn btn-primary cursor-pointer"
            >
              Découvrir notre univers
            </Link>
          </div>
        </div>

        {/* 3. Sur mobile et tablette (< lg) : L'image se place en pleine largeur sous le texte (aucun chevauchement, lisibilité 100% garantie, sans boîte carrée) */}
        <div className="block lg:hidden relative w-[calc(100%+2.5rem)] -mx-5 sm:w-[calc(100%+4rem)] sm:-mx-8 h-64 sm:h-80 mt-8 overflow-hidden">
          <Image
            src="/images/heroes/philosophy-banner.webp"
            alt="Rituel bien-être Belora"
            fill
            sizes="100vw"
            className="object-cover object-right sm:object-center"
          />
        </div>
      </div>
    </section>
  );
}
