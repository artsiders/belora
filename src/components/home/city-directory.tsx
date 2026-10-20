import Link from "next/link";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowUpRight } from "lucide-react";

const POPULAR_CITIES = [
  { name: "Paris", count: "185 salons" },
  { name: "Lyon", count: "64 salons" },
  { name: "Bordeaux", count: "48 salons" },
  { name: "Marseille", count: "42 salons" },
  { name: "Lille", count: "36 salons" },
  { name: "Nantes", count: "32 salons" },
  { name: "Toulouse", count: "28 salons" },
  { name: "Strasbourg", count: "24 salons" },
  { name: "Nice", count: "22 salons" },
  { name: "Montpellier", count: "19 salons" },
  { name: "Rennes", count: "16 salons" },
  { name: "Aix-en-Provence", count: "14 salons" },
];

export function CityDirectory() {
  return (
    <section className="section relative overflow-hidden bg-white border-b border-sand-200/80" aria-labelledby="cities-heading">
      <div className="container-belora relative z-10">
        {/* En-tête de section unifié */}
        <SectionHeader
          eyebrow="Villes"
          title={
            <>
              Trouver un artisan{" "}
              <span className="text-primary-600 font-bold">dans votre ville</span>
            </>
          }
          subtitle="Nos havres et ateliers partenaires vous accueillent au cœur des douze plus grandes métropoles françaises."
          action={
            <span className="px-3 py-1.5 rounded-full bg-sand-100 text-sand-800 text-xs font-semibold num shadow-2xs">
              450+ adresses certifiées
            </span>
          }
          id="cities-heading"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/search?location=${encodeURIComponent(city.name)}`}
              className="p-3.5 rounded-xl border border-sand-200/80 bg-white hover:border-sand-300 hover:shadow-xs transition-all text-xs text-sand-900 font-medium flex items-center justify-between group"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sand-950 group-hover:text-primary-600 transition-colors">
                  {city.name}
                </span>
                <span className="text-xs text-sand-500 num mt-0.5">
                  {city.count}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Arches graphiques décoratives en variante filigrane pour signer la section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 lg:right-16 hidden sm:flex flex-col opacity-20 select-none z-0"
      >
        <div className="h-24 lg:h-32 w-36 lg:w-48 arch-r rounded-b-none bg-earth-olive" />
        <div className="h-32 lg:h-40 w-28 lg:w-36 arch-r rounded-b-none bg-earth-terracotta" />
      </div>
 
    </section>
  );
}
