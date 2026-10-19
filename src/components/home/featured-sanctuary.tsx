import Image from "next/image";
import Link from "next/link";

export function FeaturedSanctuary() {
  return (
    <section className="section bg-sand-50 border-b border-line overflow-hidden" aria-labelledby="sanctuary-heading">
      <div className="container-belora">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 hairline-b">
          <div>
            <p className="eyebrow mb-2">Immersion dans nos maisons partenaires</p>
            <h2 id="sanctuary-heading" className="display-md text-sand-900">
              L’intimité d’un lieu d’exception
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-fg-muted max-w-md">
            Chaque salon référencé par Belora est visité et validé pour la qualité de son accueil, le silence du lieu et l’expertise de son équipe.
          </p>
        </div>

        {/* Immense photographie panoramique architecturale */}
        <div className="relative aspect-[16/9] min-h-[440px] sm:min-h-[580px] w-full rounded-[var(--radius-photo)] overflow-hidden border border-line bg-sand-200 shadow-xl">
          <Image
            src="/images/sanctuaries/sanctuary-architecture.jpg"
            alt="Maison Albar Institut - Un espace de soin d’une grande pureté architecturale"
            fill
            sizes="100vw"
            className="object-cover"
          />

          <div
            className="absolute inset-0 bg-sand-950/35"
            aria-hidden="true"
          />

          {/* Cartouche d'artisan en bas à gauche */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 max-w-xl text-sand-50">
            <span className="inline-block px-3 py-1 rounded-[var(--radius-xs)] bg-primary-600/90 text-sand-50 text-xs tracking-widest uppercase font-semibold mb-3 backdrop-blur-sm">
              Maison Coup de Cœur
            </span>
            <h3 className="text-3xl sm:text-4xl text-sand-50 mb-3">
              Maison Albar Institut & Spa
            </h3>
            <p className="text-xs sm:text-sm text-sand-200 leading-relaxed mb-6 max-w-md">
              Nichée au cœur de la Presqu’île de Lyon, cette ancienne demeure de maître réunit les rituels du visage sur-mesure et l’hydrothérapie dans un cadre minéral d’un calme absolu.
            </p>

            <div className="flex items-center gap-4">
              <Link
                href="/venue/maison-albar-soins"
                className="btn btn-editorial-light btn-sm"
              >
                <span>Découvrir la maison</span>
                <svg
                  className="w-3.5 h-3.5 btn-icon-slide"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <span className="text-xs text-sand-300 font-medium">
                À partir de 80 € · 96 avis 5.0 ★
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
