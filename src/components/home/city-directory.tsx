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
    <section className="section bg-sand-100" aria-labelledby="cities-heading">
      <div className="container-belora">
        {/* En-tête de section unifié */}
        <SectionHeader
          eyebrow="Présence Nationale"
          title={
            <>
              Trouver un artisan{" "}
              <span className="font-display italic text-primary-600">dans votre ville</span>
            </>
          }
          subtitle="Nos havres et ateliers partenaires vous accueillent au cœur des douze plus grandes métropoles françaises."
          action={
            <span className="px-3 py-1.5 rounded-[var(--radius-xs)] bg-sand-200/80 text-sand-800 text-xs font-semibold num shadow-2xs">
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
              className="p-3.5 rounded-[var(--radius-sm)] border border-sand-300/80 bg-sand-50 hover:border-sand-400 hover:bg-sand-100 transition-all text-xs text-sand-900 font-medium flex items-center justify-between group shadow-2xs"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-sand-950 group-hover:text-primary-600 transition-colors">
                  {city.name}
                </span>
                <span className="text-[10px] text-sand-500 num mt-0.5">
                  {city.count}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
