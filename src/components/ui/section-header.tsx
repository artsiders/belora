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
    <div className={`section-header ${className}`}>
      <div className="max-w-xl">
        {eyebrow && <p className="eyebrow mb-2.5">{eyebrow}</p>}
        <h2 id={id} className="section-title text-balance">
          {title}
        </h2>
      </div>

      {(subtitle || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center md:items-end justify-between md:justify-end gap-4 max-w-lg md:text-right">
          {subtitle && (
            <p className="section-subtitle md:text-right">
              {subtitle}
            </p>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </div>
  );
}
