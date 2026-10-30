import { SectionHeader } from "@/components/ui/section-header";
import { CityCard } from "@/components/cards";

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
    <section className="section relative overflow-hidden bg-white border-b border-primary-200/80" aria-labelledby="cities-heading">
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
            <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold num shadow-2xs">
              450+ adresses certifiées
            </span>
          }
          id="cities-heading"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {POPULAR_CITIES.map((city) => (
            <CityCard key={city.name} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
