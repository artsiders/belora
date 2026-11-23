"use client";

import type { BillingIntervalValue } from "@/modules/billing/types";

interface BillingIntervalToggleProps {
  value: BillingIntervalValue;
  onChange: (value: BillingIntervalValue) => void;
  /** Remise annuelle à afficher (0 = masquée). */
  annualDiscountPercent?: number;
  className?: string;
}

const OPTIONS: { value: BillingIntervalValue; label: string }[] = [
  { value: "MONTHLY", label: "Mensuel" },
  { value: "ANNUAL", label: "Annuel" },
];

export function BillingIntervalToggle({
  value,
  onChange,
  annualDiscountPercent = 0,
  className = "",
}: BillingIntervalToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Cycle de facturation"
      className={`inline-flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 ${className}`}
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              isActive ? "bg-white text-neutral-950 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span>{option.label}</span>
            {option.value === "ANNUAL" && annualDiscountPercent > 0 && (
              <span className="text-sm text-primary-700 font-semibold">-{annualDiscountPercent} %</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
