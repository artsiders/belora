import Link from "next/link";
import { Scissors, Leaf, Home, LayoutGrid } from "lucide-react";

interface CategorySwitcherProps {
  currentSlug: string;
}

const SWITCHER_ITEMS = [
  {
    id: "all",
    slug: "all",
    label: "Tous les univers",
    href: "/search",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    id: "nails",
    slug: "nails",
    label: "Onglerie & Manucure",
    href: "/category/nails",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <rect x="10" y="3" width="4" height="6" rx="1" />
        <path d="M8 9h8a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-7a2 2 0 0 1 2-2z" />
        <line x1="9" y1="14" x2="15" y2="14" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    id: "hair",
    slug: "hair",
    label: "Coiffure",
    href: "/category/hair",
    icon: <Scissors className="w-4 h-4 stroke-[1.5]" />,
  },
  {
    id: "facial",
    slug: "facial",
    label: "Esthétique & Soins",
    href: "/category/facial",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M12 4.5c-1.6 2.8-1.6 6.8 0 9.5 1.6-2.7 1.6-6.7 0-9.5z" />
        <path d="M10.5 14C7 12.8 4.5 14.5 3.5 17c2.5 1 6.5.5 8.5-3z" />
        <path d="M13.5 14c3.5-1.2 6 .5 7 3-2.5 1-6.5.5-8.5-3z" />
      </svg>
    ),
  },
  {
    id: "massage",
    slug: "massage",
    label: "Massages & Spas",
    href: "/category/massage",
    icon: <Leaf className="w-4 h-4 stroke-[1.5]" />,
  },
  {
    id: "barber",
    slug: "barber",
    label: "Barbier",
    href: "/category/barber",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <path d="M4 14c2-4 5.5-3.5 8-1 2.5-2.5 6-3 8 1-2 2.5-5 2-8 0-3 2-6 2.5-8 0z" />
      </svg>
    ),
  },
  {
    id: "home",
    slug: "home",
    label: "À domicile",
    href: "/category/home",
    icon: <Home className="w-4 h-4 stroke-[1.5]" />,
  },
];

export function CategorySwitcher({ currentSlug }: CategorySwitcherProps) {
  return (
    <div className="w-full bg-white border-b border-primary-200/80 sticky top-16 z-30 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="container-belora">
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
          {SWITCHER_ITEMS.map((item) => {
            const isActive = item.slug === currentSlug;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-sand-950 text-white shadow-2xs"
                    : "bg-sand-50 text-sand-700 hover:text-sand-950 hover:bg-sand-100 border border-neutral-200/70"
                }`}
              >
                <span className={isActive ? "text-white" : "text-sand-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
