import Image from "next/image";
import Link from "next/link";

export function PhilosophySection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-sand-warm border-b border-sand-200/80"
      aria-labelledby="philosophy-title"
    >
      {/* 1. Image d'ambiance complète en arrière-plan (Rituel spa, serviettes, bougie, flacon ambré & eucalyptus à droite) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/heroes/philosophy-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center"
        />
      </div>

      {/* 2. Contenu éditorial textuel posé directement sur le fond (sans boîte carrée) */}
      <div className="container-belora relative z-10 py-16 sm:py-20 lg:py-28">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Eyebrow éditorial avec filet linéaire bordeaux/figue */}
          <div className="flex items-center gap-3.5 mb-5 sm:mb-6">
            <span className="text-xs uppercase font-semibold tracking-widest text-primary-700">
              Notre philosophie
            </span>
            <span
              className="h-px w-12 sm:w-16 bg-primary-400/80"
              aria-hidden="true"
            />
          </div>

          {/* Titre Serif éditorial haut de gamme */}
          <h2
            id="philosophy-title"
            className="text-3xl sm:text-4xl font-semibold text-sand-950 leading-tight mb-4"
          >
            Prendre soin de soi,{" "}
            <span className="block text-primary-600">
              c’est déjà être beau.
            </span>
          </h2>

          {/* Texte de présentation éditorial */}
          <p className="text-sm sm:text-base text-sand-700 leading-relaxed max-w-lg mb-8 font-normal">
            Chez Belora, nous croyons que la beauté commence par le bien-être.
            Découvrez et réservez les meilleurs salons, instituts et professionnels
            indépendants, sélectionnés pour la qualité de leurs services et le
            savoir-faire de leurs artisans.
          </p>

          {/* Bouton d'action bordeaux / figue */}
          <div>
            <Link
              href="/about"
              className="btn btn-primary"
            >
              Découvrir notre univers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
