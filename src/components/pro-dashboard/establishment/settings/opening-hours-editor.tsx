"use client";

import { Copy, Plus, X } from "lucide-react";
import { ToggleSwitch } from "@/components/pro-dashboard/ui/form-controls";
import type { FormattedOpeningHour } from "@/modules/pro/settings.service";
import { Tooltip } from "@/components/ui/tooltip";
import { TimeSelect } from "./time-select";

interface OpeningHoursEditorProps {
  value: FormattedOpeningHour[];
  onChange: (value: FormattedOpeningHour[]) => void;
}

const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

function dayError(oh: FormattedOpeningHour): string | null {
  if (!oh.isOpen) return null;
  if (toMinutes(oh.closeTime) <= toMinutes(oh.openTime)) return "La fermeture doit suivre l'ouverture.";
  if (oh.breakStart && oh.breakEnd) {
    const bs = toMinutes(oh.breakStart);
    const be = toMinutes(oh.breakEnd);
    if (be <= bs || bs <= toMinutes(oh.openTime) || be >= toMinutes(oh.closeTime)) {
      return "La pause doit être comprise dans les horaires.";
    }
  }
  return null;
}

function weeklyHours(days: FormattedOpeningHour[]): string {
  const minutes = days.reduce((acc, d) => {
    if (!d.isOpen) return acc;
    let m = toMinutes(d.closeTime) - toMinutes(d.openTime);
    if (d.breakStart && d.breakEnd) m -= toMinutes(d.breakEnd) - toMinutes(d.breakStart);
    return acc + Math.max(0, m);
  }, 0);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m}` : `${h} h`;
}

/** Horaires hebdomadaires : ouverture, fermeture et pause éventuelle pour chaque jour. */
export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const update = (dayIndex: number, patch: Partial<FormattedOpeningHour>) =>
    onChange(value.map((d) => (d.dayIndex === dayIndex ? { ...d, ...patch } : d)));

  const copyToAll = (source: FormattedOpeningHour) =>
    onChange(
      value.map((d) =>
        d.isOpen
          ? {
              ...d,
              openTime: source.openTime,
              closeTime: source.closeTime,
              breakStart: source.breakStart,
              breakEnd: source.breakEnd,
            }
          : d
      )
    );

  const openDays = value.filter((d) => d.isOpen).length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-600">
        {openDays} jour{openDays > 1 ? "s" : ""} d&apos;ouverture, {weeklyHours(value)} par semaine. Les créneaux
        proposés en ligne tiennent compte de ces horaires et des horaires de chaque collaborateur.
      </p>
      <div className="divide-y divide-neutral-100">
        {value.map((oh) => {
          const error = dayError(oh);
          const hasBreak = Boolean(oh.breakStart && oh.breakEnd);
          return (
            <div key={oh.dayIndex} className="py-3 space-y-2">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="w-36 shrink-0">
                  <ToggleSwitch
                    label={oh.day}
                    checked={oh.isOpen}
                    onChange={(isOpen) => update(oh.dayIndex, { isOpen })}
                  />
                </div>

                {oh.isOpen ? (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <TimeSelect ariaLabel={`Ouverture ${oh.day}`} value={oh.openTime} onChange={(v) => update(oh.dayIndex, { openTime: v })} />
                    {hasBreak ? (
                      <>
                        <span className="text-neutral-400">à</span>
                        <TimeSelect ariaLabel={`Début de pause ${oh.day}`} value={oh.breakStart!} onChange={(v) => update(oh.dayIndex, { breakStart: v })} />
                        <span className="text-neutral-500">puis</span>
                        <TimeSelect ariaLabel={`Fin de pause ${oh.day}`} value={oh.breakEnd!} onChange={(v) => update(oh.dayIndex, { breakEnd: v })} />
                      </>
                    ) : null}
                    <span className="text-neutral-400">à</span>
                    <TimeSelect ariaLabel={`Fermeture ${oh.day}`} value={oh.closeTime} onChange={(v) => update(oh.dayIndex, { closeTime: v })} />

                    {hasBreak ? (
                      <button
                        type="button"
                        onClick={() => update(oh.dayIndex, { breakStart: null, breakEnd: null })}
                        className="btn btn-ghost btn-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                        Retirer la pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => update(oh.dayIndex, { breakStart: "12:30", breakEnd: "14:00" })}
                        className="btn btn-ghost btn-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Ajouter une pause
                      </button>
                    )}
                    <Tooltip content="Appliquer ces horaires à tous les jours ouverts">
                      <button
                        type="button"
                        onClick={() => copyToAll(oh)}
                        className="btn btn-ghost btn-xs"
                        aria-label={`Appliquer les horaires du ${oh.day.toLowerCase()} à tous les jours ouverts`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">Fermé</span>
                )}
              </div>
              {error && <p className="text-sm text-rose-600 lg:ps-39">{error}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
