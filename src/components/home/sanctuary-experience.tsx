import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  Award,
  VolumeX,
  ShieldCheck,
  HeartHandshake,
  Coffee,
  ArrowRight,
} from "lucide-react";

const SANCTUARY_PILLARS = [
  {
    icon: Leaf,
    title: "Matières Botaniques & Éthiques",
    description: "Cosmétiques biologiques, argiles pures et pigments végétaux respectueux de votre santé.",
  },
  {
    icon: Award,
    title: "Artisans Diplômés & Éprouvés",
    description: "Professionnels formés auprès des maîtres du métier, sélectionnés après visite en salon.",
  },
  {
    icon: VolumeX,
    title: "Atmosphère Feutrée & Apaisante",
    description: "Une acoustique pensée pour le calme. Zéro musique agressive, votre temps est sanctuarisé.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiène & Stérilisation Hospitalière",
    description: "Désinfection méticuleuse de chaque instrument et linge propre à usage strictement unique.",
  },
  {
    icon: HeartHandshake,
    title: "Diagnostic Personnalisé Systématique",
    description: "Un temps d'échange dédié avant tout geste pour adapter la prestation à votre morphologie.",
  },
  {
    icon: Coffee,
    title: "Hospitalité & Attentions Rares",
    description: "Thé d’infusion botanique, café de terroir et accueil personnalisé dès le pas de la porte.",
  },
];

export function SanctuaryExperience() {
  return (
    <section className="section bg-sand-50 border-b border-sand-200/80" aria-labelledby="experience-heading">
      <div className="container-belora">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Colonne Gauche : Engagements & Liste en 6 piliers */}
          <div className="lg:col-span-7">
            <p className="eyebrow mb-2.5">Charte d’Excellence</p>
            <h2 id="experience-heading" className="section-title mb-3 text-balance">
              Plus qu’un rendez-vous,{" "}
              <span className="font-display italic text-primary-600 block sm:inline">
                l’expérience sanctuaire.
              </span>
            </h2>
            <p className="section-subtitle max-w-xl mb-8 text-pretty">
              Belora ne référence pas des chaînes anonymes, mais des ateliers
              indépendants où l’artisanat du soin retrouve toute sa noblesse et
              son intimité.
            </p>

            {/* Grille des 6 engagements épurés */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 mb-10">
              {SANCTUARY_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-sand-200/70 text-primary-600 flex items-center justify-center shrink-0 border border-sand-300/60 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-sand-950 mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-sand-600 leading-relaxed font-normal">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/about" className="btn btn-outline btn-sm">
              <span>Lire notre charte de sélection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Colonne Droite : Grande photographie d'architecture d'intérieur */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[var(--radius-photo)] overflow-hidden bg-sand-200 border border-sand-300 shadow-xl">
              <Image
                src="/images/sanctuaries/sanctuary-architecture.jpg"
                alt="Ambiance minérale et feutrée d'un institut partenaire Belora"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />

              {/* Voile d'ombrage léger pour le bas */}
              <div
                className="absolute inset-0 bg-sand-950/20"
                aria-hidden="true"
              />

              {/* Cartouche d'accréditation en bas */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-[var(--radius-sm)] bg-sand-50/95 backdrop-blur-xs border border-sand-200 shadow-md text-sand-900">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600 block mb-0.5">
                      Audit qualité terrain
                    </span>
                    <h4 className="font-display text-base text-sand-950">
                      Maison Albar Institut & Spa
                    </h4>
                    <p className="text-[11px] text-sand-500">
                      Lyon Presqu’île · Noté 5,0 / 5
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded bg-sand-200/80 text-[11px] font-semibold text-sand-800 num">
                    Certifié 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
