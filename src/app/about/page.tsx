import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const AUDIT_CRITERIA = [
    {
      num: "01",
      title: "Visite terrain obligatoire & anonyme",
      description:
        "Aucun salon n’est référencé sur simple déclaration en ligne. Notre équipe d'inspecteurs visite chaque lieu physiquement pour éprouver l'accueil, l'hygiène et l'acoustique en conditions réelles.",
    },
    {
      num: "02",
      title: "Matières premières & traçabilité",
      description:
        "Nous vérifions l'absence de produits chimiques agressifs (ammoniaque toxique, parabènes, perturbateurs endocriniens). Priorité absolue aux formulations végétales, biologiques et éthiques.",
    },
    {
      num: "03",
      title: "Maîtrise du geste & formation continue",
      description:
        "Les artisans référencés justifient de diplômes d'État et de spécialisations reconnues (maîtrise du cheveu texturé, facialisme Kobido, taille au coupe-choux traditionnel).",
    },
    {
      num: "04",
      title: "Sanctuarisation du temps & zéro attente",
      description:
        "Un client Belora ne doit jamais patienter 30 minutes dans un hall bruyant. Les plannings sont rigoureusement cadencés pour préserver l'intimité de chaque prestation.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        {/* 1. Hero Manifeste */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-primary-50/10/70">
          <div className="container-belora">
            <div className="max-w-3xl space-y-6">
              <span className="eyebrow text-primary-700 font-semibold tracking-widest block">
                Manifeste · L’Esprit Belora
              </span>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-neutral-950 leading-[1.08] text-balance">
                Rendre au soin sa noblesse d’artisanat.
              </h1>

              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal text-pretty">
                Dans un monde saturé d’usines à rendez-vous où les clients sont traités comme des numéros sur une chaîne d’assemblage, Belora est né d’une conviction simple : le cheveu, la peau et le corps méritent du temps, du silence et des mains expertes.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Image d'ambiance et histoire */}
        <section className="py-16 sm:py-20 border-b border-primary-200/80 bg-neutral-100">
          <div className="container-belora">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] rounded-[var(--radius-photo)] overflow-hidden bg-neutral-200 border border-primary-300 shadow-lg">
                  <Image
                    src="/images/about/about-craft.jpg"
                    alt="Le geste délicat d'une artisane du soin"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <h2 className="font-display text-3xl sm:text-4xl text-neutral-950">
                  La fin de la beauté industrielle.
                </h2>
                <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                  <p>
                    Les plateformes généralistes ont standardisé la réservation en compressant les temps de pose, en banalisant les salons indépendants et en encourageant une course au volume délétère pour la qualité du geste.
                  </p>
                  <p>
                    Belora prend le contre-pied absolu. Nous construisons une maison d’édition vivante qui sélectionne exclusivement les artisans d’exception : ceux qui prennent le temps d’un diagnostic approfondi, qui privilégient les pigments végétaux et qui soignent l’acoustique de leur lieu pour vous offrir un véritable sas de décompression.
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/search" className="btn btn-primary btn-sm inline-flex items-center gap-2">
                    <span>Explorer nos salons audités</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. La Charte d'Audit en 4 Piliers */}
        <section className="py-16 sm:py-24 border-b border-primary-200/80 bg-primary-50/10/60">
          <div className="container-belora">
            <div className="max-w-2xl mb-14">
              <h2 className="font-display text-3xl sm:text-4xl text-neutral-950 mb-3">
                Notre protocole d’audit en 4 critères.
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                Moins de 15% des établissements candidats intègrent la sélection officielle Belora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {AUDIT_CRITERIA.map((crit) => (
                <div
                  key={crit.num}
                  className="p-8 rounded-xl bg-primary-50/10 border border-primary-200/90 space-y-3"
                >
                  <span className="font-display text-2xl text-primary-700 block font-normal">
                    {crit.num}.
                  </span>
                  <h3 className="text-base font-semibold text-neutral-950">
                    {crit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                    {crit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Chiffres clés */}
        <section className="py-16 bg-neutral-100">
          <div className="container-belora">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <span className="font-display text-4xl sm:text-5xl text-neutral-950 block num mb-1">
                  450+
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Ateliers Audités
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-5xl text-neutral-950 block num mb-1">
                  12
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Métropoles de France
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-5xl text-neutral-950 block num mb-1">
                  4,9 / 5
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Note Moyenne Vérifiée
                </span>
              </div>
              <div>
                <span className="font-display text-4xl sm:text-5xl text-neutral-950 block num mb-1">
                  0 min
                </span>
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Attente Garantie
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
