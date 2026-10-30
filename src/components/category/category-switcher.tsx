import Link from "next/link";
import { LayoutGrid, Scissors, Leaf, Home } from "lucide-react";

export interface CategoryNavCircle {
  id: string;
  name: string;
  href: string;
  slug: string;
  icon: (active: boolean) => React.ReactNode;
}

export const CATEGORY_CIRCLES: CategoryNavCircle[] = [
  {
    id: "all",
    slug: "all",
    name: "Tout",
    href: "/search",
    icon: (active) => (
      <LayoutGrid
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        } stroke-[1.6]`}
      />
    ),
  },
  {
    id: "hair",
    slug: "hair",
    name: "Coiffure",
    href: "/category/hair",
    icon: (active) => (
      <Scissors
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        } stroke-[1.5]`}
      />
    ),
  },
  {
    id: "facial",
    slug: "facial",
    name: "Esthétique",
    href: "/category/facial",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        }`}
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
    slug: "nails",
    name: "Onglerie",
    href: "/category/nails",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        }`}
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
    slug: "barber",
    name: "Barbier",
    href: "/category/barber",
    icon: (active) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        }`}
        aria-hidden="true"
      >
        <path d="M4 14c2-4 5.5-3.5 8-1 2.5-2.5 6-3 8 1-2 2.5-5 2-8 0-3 2-6 2.5-8 0z" />
      </svg>
    ),
  },
  {
    id: "massage",
    slug: "massage",
    name: "Corps et esprit",
    href: "/category/massage",
    icon: (active) => (
      <Leaf
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        } stroke-[1.5]`}
      />
    ),
  },
  {
    id: "home",
    slug: "home",
    name: "À domicile",
    href: "/category/home",
    icon: (active) => (
      <Home
        className={`w-5 h-5 transition-colors duration-150 ${
          active ? "text-white" : "text-neutral-700 group-hover:text-neutral-950"
        } stroke-[1.5]`}
      />
    ),
  },
];

export interface CategorySwitcherProps {
  currentSlug?: string;
  variant?: "home" | "category";
  className?: string;
}

export function CategorySwitcher({
  currentSlug,
  variant,
  className = "",
}: CategorySwitcherProps = {}) {
  const activeSlug =
    currentSlug !== undefined
      ? currentSlug
      : variant === "home"
      ? "all"
      : "all";

  const paddingClass =
    variant === "home"
      ? "py-6 sm:py-7"
      : variant === "category"
      ? "py-4 sm:py-5"
      : activeSlug === "all" && currentSlug === undefined
      ? "py-6 sm:py-7"
      : "py-4 sm:py-5";

  return (
    <section
      className={`w-full bg-white border-b border-neutral-200/80 ${paddingClass} select-none ${className}`}
      aria-label="Univers de prestations"
    >
      <div className="container-belora">
        <div className="flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar px-1 py-2">
          {CATEGORY_CIRCLES.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                aria-current={isActive ? "page" : undefined}
                className="group flex flex-col items-center shrink-0 min-w-16 sm:min-w-19 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
              >
                {/* Cercle d'icône avec anneau détaché actif et au survol (hover) */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-200 ease-belora ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-2xs ring-2 ring-primary-600/35 ring-offset-2 ring-offset-white group-hover:ring-primary-600/50"
                      : "bg-neutral-50 border border-neutral-200/80 text-neutral-700 group-hover:bg-neutral-100/90 group-hover:border-neutral-300 group-hover:text-neutral-950 group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-offset-white group-hover:ring-primary-600/25"
                  }`}
                >
                  {cat.icon(isActive)}
                </div>

                {/* Libellé */}
                <span
                  className={`mt-2.5 text-xs tracking-tight text-center leading-tight transition-colors duration-150 ${
                    isActive
                      ? "font-bold text-neutral-950"
                      : "font-medium text-neutral-600 group-hover:text-neutral-950"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
