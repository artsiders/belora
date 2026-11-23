"use client";

import { Select } from "@/components/ui/select";

const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return { value: `${h}:${m}`, label: `${h}:${m}` };
});

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  disabled?: boolean;
}

/** Heure au format 24 h par pas de 15 minutes, quel que soit le réglage du navigateur. */
export function TimeSelect({ value, onChange, ariaLabel, disabled }: TimeSelectProps) {
  const options = TIME_OPTIONS.some((o) => o.value === value)
    ? TIME_OPTIONS
    : [...TIME_OPTIONS, { value, label: value }].sort((a, b) => a.value.localeCompare(b.value));
  return (
    <div className="w-28" aria-label={ariaLabel}>
      <Select size="sm" searchable options={options} value={value} onChange={onChange} disabled={disabled} />
    </div>
  );
}
