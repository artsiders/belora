import React from "react";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  id,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-5 border-b border-sand-200/80 ${className}`}
    >
      <div className="max-w-xl">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 id={id} className="section-title text-sand-950">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-sand-600 mt-1.5 leading-relaxed font-normal">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 self-start sm:self-end">{action}</div>}
    </div>
  );
}
