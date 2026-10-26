import Link from "next/link";
import { LayoutGrid, Scissors, Leaf, Home } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  href: string;
  isAll?: boolean;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "all",
    name: "Tout",
    href: "/search",
    isAll: true,
    icon: <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />,
  },
  {
    id: "hair",
    name: "Coiffure",
    href: "/search?category=hair",
    icon: <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 stroke-[1.6]" />,
  },
  {
    id: "facial",
    name: "Exthétique",
    href: "/search?category=facial",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
        aria-hidden="true"
      >
        <path d="M12 4.5c-1.6 2.8-1.6 6.8 0 9.5 1.6-2.7 1.6-6.7 0-9.5z" />
        <path d="M10.5 14C7 12.8 4.5 14.5 3.5 17c2.5 1 6.5.5 8.5-3z" />
        <path d="M13.5 14c3.5-1.2 6 .5 7 3-2.5 1-6.5.5-8.5-3z" />
        <path d="M7 11.5c-1.5-3.5 1-6 2.5-7.5.5 3 2.5 5.5 2.5 5.5" />
        <path d="M17 11.5c1.5-3.5-1-6-2.5-7.5-.5 3-2.5 5.5-2.5 5.5" />
      </svg>
    ),
  },
  {
    id: "nails",
    name: "Onglerie",
    href: "/search?category=nails",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
        aria-hidden="true"
      >
        <rect x="10" y="3" width="4" height="6" rx="1" />
        <path d="M8 9h8a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-7a2 2 0 0 1 2-2z" />
        <line x1="9" y1="14" x2="15" y2="14" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    id: "barber",
    name: "Barbier",
    href: "/search?category=barber",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600"
        aria-hidden="true"
      >
        <path d="M4 14c2-4 5.5-3.5 8-1 2.5-2.5 6-3 8 1-2 2.5-5 2-8 0-3 2-6 2.5-8 0z" />
      </svg>
    ),
  },
  {
    id: "massage",
    name: "Corps et esprit",
    href: "/search?category=massage",
    icon: <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 stroke-[1.6]" />,
  },
  {
    id: "home",
    name: "À domicile",
    href: "/search?type=home",
    icon: <Home className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 stroke-[1.6]" />,
  },
];

export function CategoryCircles() {
  return (
    <section
      className="w-full bg-white py-8 sm:py-10 border-b border-sand-200/60"
      aria-label="Catégories de prestations"
    >
      <div className="container-belora">
        {/* Navigation des 7 univers circulaires */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 lg:gap-10 overflow-x-auto no-scrollbar py-2 px-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center shrink-0 min-w-[70px] sm:min-w-[84px] focus:outline-none"
            >
              {/* Cercle d'icône */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ease-belora group-hover:-translate-y-1 shadow-2xs group-hover:shadow-sm ${
                  cat.isAll
                    ? "bg-primary-600 text-white group-hover:bg-primary-700"
                    : "bg-primary-50/80 text-primary-600 border border-primary-100/70 group-hover:bg-primary-100 group-hover:border-primary-200"
                }`}
              >
                {cat.icon}
              </div>

              {/* Libellé de la catégorie */}
              <span className="mt-2.5 text-xs sm:text-sm font-semibold text-sand-800 text-center transition-colors group-hover:text-primary-700">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
