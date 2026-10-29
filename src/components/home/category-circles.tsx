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
    icon: <LayoutGrid className="w-5 h-5 text-white stroke-[1.6]" />,
  },
  {
    id: "hair",
    name: "Coiffure",
    href: "/category/hair",
    icon: <Scissors className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150 stroke-[1.5]" />,
  },
  {
    id: "facial",
    name: "Esthétique",
    href: "/category/facial",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150"
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
    href: "/category/nails",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150"
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
    href: "/category/barber",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150"
        aria-hidden="true"
      >
        <path d="M4 14c2-4 5.5-3.5 8-1 2.5-2.5 6-3 8 1-2 2.5-5 2-8 0-3 2-6 2.5-8 0z" />
      </svg>
    ),
  },
  {
    id: "massage",
    name: "Corps et esprit",
    href: "/category/massage",
    icon: <Leaf className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150 stroke-[1.5]" />,
  },
  {
    id: "home",
    name: "À domicile",
    href: "/category/home",
    icon: <Home className="w-5 h-5 text-neutral-700 group-hover:text-neutral-950 transition-colors duration-150 stroke-[1.5]" />,
  },
];

export function CategoryCircles() {
  return (
    <section
      className="w-full bg-white border-b border-neutral-100 py-6 sm:py-7 select-none"
      aria-label="Catégories de prestations"
    >
      <div className="container-belora">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar px-1 py-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center shrink-0 min-w-16 sm:min-w-19 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:ring-offset-2"
            >
              {/* Cercle d'icône */}
              <div
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-colors duration-150 ${
                  cat.isAll
                    ? "bg-neutral-900 text-white group-hover:bg-neutral-800"
                    : "bg-neutral-50 border border-neutral-200/70 text-neutral-700 group-hover:bg-neutral-100/80 group-hover:border-neutral-300"
                }`}
              >
                {cat.icon}
              </div>

              {/* Libellé */}
              <span className="mt-2.5 text-xs font-medium tracking-tight text-neutral-600 group-hover:text-neutral-900 transition-colors duration-150 text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}