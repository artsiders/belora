"use client";

import { useState } from "react";
import { FormCheckbox, FormInput } from "@/components/pro-dashboard/ui/form-controls";

/**
 * Champs numériques de l'administration.
 * Les valeurs sont stockées dans leur unité métier (taux décimal, centimes)
 * et affichées dans l'unité naturelle (%, €).
 */

interface BaseProps {
  label: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
}

function toInputString(n: number | null, factor: number) {
  if (n === null) return "";
  return String(Math.round(n * factor * 100) / 100);
}

/**
 * Brouillon de saisie : conservé tant que la valeur reçue est celle que le champ a émise,
 * réinitialisé quand la valeur change de l'extérieur (ex : annulation des modifications).
 */
function useNumericDraft(value: number | null, factor: number) {
  const [state, setState] = useState({ source: value, draft: toInputString(value, factor) });
  if (state.source !== value) {
    setState({ source: value, draft: toInputString(value, factor) });
  }
  const setDraft = (draft: string, emitted: number | null) => setState({ source: emitted, draft });
  return [state.draft, setDraft] as const;
}

interface ScaledInputProps extends BaseProps {
  value: number | null;
  onChange: (value: number | null) => void;
  factor: number;
  step: string;
  max?: number;
  suffix: string;
  nullable?: boolean;
  integer?: boolean;
}

function ScaledInput({ value, onChange, factor, step, max, suffix, nullable, integer, ...rest }: ScaledInputProps) {
  const [draft, setDraft] = useNumericDraft(value, factor);
  return (
    <FormInput
      {...rest}
      type="number"
      inputMode="decimal"
      min={0}
      max={max}
      step={step}
      value={draft}
      placeholder={nullable ? "Aucun" : "0"}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          const empty = nullable ? null : 0;
          setDraft(raw, empty);
          onChange(empty);
          return;
        }
        const parsed = Number(raw.replace(",", "."));
        if (Number.isNaN(parsed)) {
          setDraft(raw, value);
          return;
        }
        const scaled = parsed / factor;
        const next = integer ? Math.round(scaled) : Math.round(scaled * 100000) / 100000;
        setDraft(raw, next);
        onChange(next);
      }}
      label={`${rest.label} (${suffix})`}
    />
  );
}

/** Taux stocké en décimal (0.018), saisi en pourcentage (1,8). */
export function PercentInput(props: BaseProps & { value: number | null; onChange: (v: number | null) => void; nullable?: boolean; max?: number }) {
  return <ScaledInput {...props} factor={100} step="0.1" suffix="%" max={props.max ?? 50} />;
}

/** Montant stocké en centimes, saisi en euros. */
export function MoneyInput(props: BaseProps & { value: number | null; onChange: (v: number | null) => void; nullable?: boolean }) {
  return <ScaledInput {...props} factor={0.01} step="0.01" suffix="€" integer />;
}

/** Limite entière optionnelle : cochée = illimitée. */
export function LimitInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  helper?: string;
}) {
  const unlimited = value === null;
  return (
    <div className="space-y-2">
      <FormInput
        label={label}
        type="number"
        min={1}
        step="1"
        disabled={unlimited}
        value={unlimited ? "" : String(value)}
        placeholder="Illimité"
        helper={helper}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? 1 : Math.max(1, n));
        }}
      />
      <FormCheckbox label="Illimité" checked={unlimited} onChange={(e) => onChange(e.target.checked ? null : 1)} />
    </div>
  );
}
