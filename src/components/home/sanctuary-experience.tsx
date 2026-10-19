import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SANCTUARY_PILLARS = [
  {
    num: "01",
    title: "Des havres calmes & intimes",
    description:
      "Acoustique feutrée, lumière douce et zéro musique intrusive. Chaque lieu est audité pour vous offrir un moment de déconnexion totale.",
  },
  {
    num: "02",
    title: "L’artisanat du geste & matières pures",
    description:
      "Praticiens indépendants diplômés, diagnostic personnalisé préalable et soins prodigués avec des cosmétiques botaniques d’exception.",
  },
  {
    num: "03",
    title: "Votre temps sanctuarisé",
    description:
      "Réservation instantanée sans intermédiaire, créneaux garantis et accueil attentif dès le pas de la porte, sans aucune attente.",
  },
];

export function SanctuaryExperience() {
  return (
    <section className="section bg-white border-b border-sand-200/80" aria-labelledby="experience-heading">
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Colonne Gauche : Manifeste & 3 engagements purs */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-2">Charte d’Excellence</p>
            <h2 id="experience-heading" className="section-title mb-3 text-balance">
              Plus qu’un rendez-vous,{" "}
              <span className="font-display  block sm:inline text-primary-600">
                l’expérience sanctuaire.
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-sand-600 leading-relaxed font-normal mb-8 max-w-xl">
              Belora ne référence pas de chaînes impersonnelles. Nous sélectionnons
              uniquement des ateliers indépendants où le soin est un art et votre tranquillité une priorité.
            </p>

            {/* 3 Engagements épurés avec fine numérotation (sans boîtes d'icônes SaaS) */}
            <div className="space-y-5 mb-8">
              {SANCTUARY_PILLARS.map((pillar) => (
                <div
                  key={pillar.num}
                  className="flex items-start gap-4 pb-5 border-b border-sand-200/70 last:border-b-0 last:pb-0"
                >
                  <span className="font-display text-base text-primary-600 font-normal shrink-0 pt-0.5">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-sand-950 mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-sand-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-medium text-sand-800 hover:text-primary-600 transition-colors"
            >
              <span>Découvrir notre protocole d’audit</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Colonne Droite : Photographie architecturale apaisante en arche */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] arch-t rounded-b-2xl overflow-hidden bg-sand-200 border border-sand-200/80 shadow-sm">
              <Image
                src="/images/sanctuaries/sanctuary-architecture.jpg"
                alt="Intérieur minéral et épuré d'un sanctuaire partenaire Belora"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />

              {/* Voile d'ombrage discret et cartouche sobre */}
              <div
                className="absolute inset-0 bg-sand-950/15"
                aria-hidden="true"
              />

              <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-xs border border-sand-200/80 text-sand-900 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-display text-base text-sand-950">
                    Maison Albar Institut & Spa
                  </h4>
                  <p className="text-[11px] text-sand-500">
                    Lyon Presqu’île · Audit 2026
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-sand-700 bg-sand-200/60 px-2 py-0.5 rounded-[var(--radius-xs)] num">
                  Noté 5,0 / 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
