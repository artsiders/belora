"use client";

import { useState } from "react";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { FormInput } from "@/components/pro-dashboard/ui/form-controls";
import type { FormattedClosure } from "@/modules/pro/settings.service";

interface ClosuresEditorProps {
  value: FormattedClosure[];
  onChange: (value: FormattedClosure[]) => void;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
const formatDate = (d: string) => dateFormatter.format(new Date(`${d}T12:00:00`));
const today = () => new Date().toISOString().slice(0, 10);

/** Fermetures exceptionnelles : congés, jours fériés, travaux. Aucune réservation en ligne sur ces dates. */
export function ClosuresEditor({ value, onChange }: ClosuresEditorProps) {
  const [draft, setDraft] = useState<FormattedClosure>({ startDate: today(), endDate: today(), label: "" });
  const draftError = draft.endDate < draft.startDate ? "La date de fin doit suivre la date de début." : null;

  const add = () => {
    if (draftError) return;
    const next = [...value, { ...draft, label: draft.label?.trim() || null }].sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );
    onChange(next);
    setDraft({ startDate: draft.endDate, endDate: draft.endDate, label: "" });
  };

  return (
    <div className="space-y-4">
      {value.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune fermeture prévue.</p>
      ) : (
        <ul className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-lg">
          {value.map((c, index) => (
            <li key={`${c.startDate}-${c.endDate}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <div className="flex items-start gap-2.5">
                <CalendarOff className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" aria-hidden />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {c.startDate === c.endDate ? formatDate(c.startDate) : `Du ${formatDate(c.startDate)} au ${formatDate(c.endDate)}`}
                  </p>
                  {c.label && <p className="text-neutral-500">{c.label}</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="btn btn-ghost btn-sm"
                aria-label="Supprimer cette fermeture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.5fr_auto] gap-3 items-end">
        <FormInput
          label="Du"
          type="date"
          min={today()}
          value={draft.startDate}
          onChange={(e) =>
            setDraft((d) => ({ ...d, startDate: e.target.value, endDate: d.endDate < e.target.value ? e.target.value : d.endDate }))
          }
        />
        <FormInput
          label="Au"
          type="date"
          min={draft.startDate}
          value={draft.endDate}
          error={draftError ?? undefined}
          onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
        />
        <FormInput
          label="Motif (optionnel)"
          placeholder="Ex : congés d'été"
          maxLength={80}
          value={draft.label ?? ""}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
        />
        <button type="button" onClick={add} disabled={Boolean(draftError)} className="btn btn-outline">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
    </div>
  );
}
