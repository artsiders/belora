"use client";

import { useEffect, useState } from "react";

export interface SectionLink {
  id: string;
  label: string;
}

/** Sommaire collant des sections, avec mise en évidence de la section visible. */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Sections" className="sticky top-6 space-y-1 text-sm">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={() => setActive(s.id)}
          className={`block px-3 py-2 rounded-lg border-s-2 transition-colors ${
            active === s.id
              ? "border-primary-600 bg-primary-50 text-primary-800 font-semibold"
              : "border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          }`}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
