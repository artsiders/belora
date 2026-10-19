import Link from "next/link";

interface UniverseArch {
  id: string;
  name: string;
  subservices: string;
  bgColor: string;
  textColor: string;
  href: string;
  icon: (color: string) => React.ReactNode;
}

const UNIVERSES: UniverseArch[] = [
  {
    id: "hair",
    name: "Cheveux",
    subservices: "Coupe · Coloration · Brushing",
    bgColor: "#C77C63", // Terracotta douce
    textColor: "text-white",
    href: "/search?category=hair",
    icon: (color) => (
      <svg
        className={`w-9 h-9 ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "facial",
    name: "Visage",
    subservices: "Soins · Éclat · Anti-âge",
    bgColor: "#96915E", // Olive / Sauge douce
    textColor: "text-white",
    href: "/search?category=facial",
    icon: (color) => (
      <svg
        className={`w-9 h-9 ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C7.5 2 4 5.5 4 10c0 4 2.5 7.5 6 9.5V22h4v-2.5c3.5-2 6-5.5 6-9.5 0-4.5-3.5-8-8-8z" />
        <path d="M9 11h.01" />
        <path d="M15 11h.01" />
        <path d="M10 15c.8.6 1.8.8 2 .8s1.2-.2 2-.8" />
      </svg>
    ),
  },
  {
    id: "nails",
    name: "Mains & pieds",
    subservices: "Manucure · Pédicure · Pose",
    bgColor: "#DEBFA9", // Blush sable poudré
    textColor: "text-sand-900",
    href: "/search?category=nails",
    icon: (color) => (
      <svg
        className={`w-9 h-9 ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C9.5 2 8 4 8 7v6a4 4 0 0 0 8 0V7c0-3-1.5-5-4-5z" />
        <path d="M9 7h6" />
        <path d="M12 17v5" />
      </svg>
    ),
  },
  {
    id: "massage",
    name: "Corps & massage",
    subservices: "Modelage · Soin du corps",
    bgColor: "#757045", // Sauge profonde / Olive terreuse
    textColor: "text-white",
    href: "/search?category=massage",
    icon: (color) => (
      <svg
        className={`w-9 h-9 ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 4c1.5 2.5 3 6 3 9 0 2.5-1.5 4-3 5-1.5-1-3-2.5-3-5 0-3 1.5-6.5 3-9z" />
        <path d="M12 18c-3 0-6.5-1-8.5-3.5 1-3.5 4.5-6 7.5-6.5" />
        <path d="M12 18c3 0 6.5-1 8.5-3.5-1-3.5-4.5-6-7.5-6.5" />
        <path d="M6 19.5c3.5 1.5 8.5 1.5 12 0" />
      </svg>
    ),
  },
  {
    id: "regard",
    name: "Regard",
    subservices: "Cils · Sourcils · Maquillage",
    bgColor: "#9E5236", // Cognac / Brique chaude
    textColor: "text-white",
    href: "/search?category=facial",
    icon: (color) => (
      <svg
        className={`w-9 h-9 ${color}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export function CategoryCircles() {
  return (
    <section
      className="py-14 sm:py-20 bg-white border-b border-sand-200/80"
      aria-labelledby="univers-heading"
    >
      <div className="container-belora">
        {/* En-tête centré épuré comme dans la maquette */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <h2
            id="univers-heading"
            className="font-display text-3xl sm:text-4xl text-sand-950 mb-2"
          >
            Nos univers
          </h2>
          <p className="text-[11px] uppercase font-semibold tracking-[0.18em] text-sand-500">
            Choisissez votre moment bien-être
          </p>
        </div>

        {/* Grille des 5 arches de couleur côte-à-côte */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {UNIVERSES.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              {/* Arche supérieure colorée */}
              <div
                className="w-full h-44 sm:h-52 arch-t rounded-b-2xl flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1 shadow-2xs group-hover:shadow-md"
                style={{ backgroundColor: item.bgColor }}
              >
                {item.icon(item.textColor)}
              </div>

              {/* Titre, sous-services et flèche discrète sous l'arche */}
              <div className="pt-3.5 flex flex-col items-center">
                <h3 className="font-display text-lg sm:text-xl text-sand-950 group-hover:text-primary-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-sand-500 font-normal mt-0.5 mb-2 leading-tight">
                  {item.subservices}
                </p>
                <span className="text-xs text-sand-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
