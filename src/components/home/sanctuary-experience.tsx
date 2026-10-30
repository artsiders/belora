import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const SANCTUARY_PILLARS = [
  {
    num: "01",
    title: "Des havres calmes & intimes",
    description:
      "Acoustique douce, lumière apaisante, sans musique intrusive. Chaque lieu est contrôlé pour garantir la tranquillité.",
  },
  {
    num: "02",
    title: "L’artisanat du geste & matières pures",
    description:
      "Praticiens diplômés, soin personnalisé, cosmétiques botaniques de qualité.",
  },
  {
    num: "03",
    title: "Votre temps sanctuarisé",
    description:
      "Réservation simple, créneaux fiables et accueil attentionné sans attente.",
  },
];

export function SanctuaryExperience() {
  return (
    <section className="section bg-white border-b border-primary-200/80" aria-labelledby="experience-heading">
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Colonne Gauche : Manifeste & 3 engagements purs */}
          <div className="lg:col-span-6">
            <h2 id="experience-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 mb-3 text-balance">
              Plus qu’un rendez-vous,{" "}
              <span className="block sm:inline text-primary-600 font-bold">
                l’expérience sanctuaire.
              </span>
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal mb-8 max-w-xl">
              Belora ne référence pas de chaînes impersonnelles. Nous sélectionnons
              uniquement des ateliers indépendants où le soin est un art et votre tranquillité une priorité.
            </p>

            {/* 3 Engagements épurés avec fine numérotation */}
            <div className="space-y-5 mb-8">
              {SANCTUARY_PILLARS.map((pillar) => (
                <div
                  key={pillar.num}
                  className="flex items-start gap-4 pb-5 border-b border-primary-200/70 last:border-b-0 last:pb-0"
                >
                  <span className="text-base font-bold text-primary-600 shrink-0 pt-0.5">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-950 mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="btn btn-primary btn-lg"
            >
              <span>Notre audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

       
          </div>

          {/* Colonne Droite : Composition architecturale en arches (Variante Sanctuaire) */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-3 sm:gap-4 items-end">
              {/* Arche Principale Photographique (Gauche) */}
              <Link
                href="/venue/maison-albar-soins"
                className="group col-span-8 relative aspect-4/5 rounded-b-xl overflow-hidden bg-neutral-200 border border-primary-200/80 shadow-sm block cursor-pointer"
              >
                <Image
                  src="/images/sanctuaries/sanctuary-architecture.jpg"
                  alt="Intérieur minéral et épuré d'un sanctuaire partenaire Belora"
                  fill
                  sizes="(max-width: 1024px) 70vw, 30vw"
                  className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />

                {/* Voile d'ombrage discret et cartouche sobre */}
                <div
                  className="absolute inset-0 bg-neutral-950/15 group-hover:bg-transparent transition-colors duration-300"
                  aria-hidden="true"
                />

                <div className="absolute bottom-3 inset-x-3 p-3 rounded-md bg-white/95 backdrop-blur-xs border border-primary-200/80 text-neutral-900 shadow-xs flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-950 group-hover:text-primary-600 transition-colors">
                      Maison Albar Institut
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Lyon Presqu’île · Audit 2026
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
                </div>
              </Link>

              {/* Formes décoratives Arches en variante (Droite) */}
              <div className="col-span-4 flex flex-col gap-3 sm:gap-4 justify-end">
                {/* Arche supérieure Terracotta douce avec promesse */}
                <div className="h-44 sm:h-76 rounded-b-xl bg-primary-700 p-3.5 sm:p-4 flex flex-col justify-center text-center text-white shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 mx-auto mb-2" />
                  <p className="text-xs font-semibold leading-snug">
                    Acoustique feutrée & calme absolu
                  </p>
                </div>

                {/* Arche inférieure Olive avec forme arrondie horizontale */}
                <div className="h-28 sm:h-36 rounded-r-xl bg-secondary-900 shadow-2xs flex items-center justify-center text-white text-center p-2">
                  <span className="text-xs font-bold tracking-wider uppercase">Audit Certifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
