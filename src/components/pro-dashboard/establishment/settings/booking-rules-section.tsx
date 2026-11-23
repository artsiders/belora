"use client";

import { FormInput, ToggleSwitch } from "@/components/pro-dashboard/ui/form-controls";
import { Select } from "@/components/ui/select";
import type { FormattedEstablishment } from "@/modules/pro/settings.service";

type RulesFields = Pick<
  FormattedEstablishment,
  | "onlineBookingEnabled"
  | "minBookingNoticeMinutes"
  | "maxBookingAdvanceDays"
  | "slotStepMinutes"
  | "bufferMinutes"
  | "allowStaffChoice"
  | "cancellationDelayHours"
>;

interface BookingRulesSectionProps {
  value: RulesFields;
  onChange: <K extends keyof RulesFields>(key: K, value: FormattedEstablishment[K]) => void;
}

const NOTICE_OPTIONS = [
  { value: "0", label: "Aucun délai" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 heure" },
  { value: "120", label: "2 heures" },
  { value: "240", label: "4 heures" },
  { value: "720", label: "12 heures" },
  { value: "1440", label: "24 heures" },
  { value: "2880", label: "48 heures" },
];

const ADVANCE_OPTIONS = [
  { value: "7", label: "1 semaine" },
  { value: "14", label: "2 semaines" },
  { value: "30", label: "1 mois" },
  { value: "60", label: "2 mois" },
  { value: "90", label: "3 mois" },
  { value: "180", label: "6 mois" },
  { value: "365", label: "1 an" },
];

const STEP_OPTIONS = [5, 10, 15, 20, 30, 60].map((m) => ({ value: String(m), label: `Toutes les ${m} minutes` }));
const BUFFER_OPTIONS = [0, 5, 10, 15, 20, 30, 45, 60].map((m) => ({
  value: String(m),
  label: m === 0 ? "Aucun" : `${m} minutes`,
}));

/** Ajoute la valeur enregistrée aux options si elle n'en fait pas partie. */
function withCurrent(options: { value: string; label: string }[], current: number, suffix: string) {
  return options.some((o) => o.value === String(current))
    ? options
    : [...options, { value: String(current), label: `${current} ${suffix}` }];
}

export function BookingRulesSection({ value, onChange }: BookingRulesSectionProps) {
  return (
    <div className="space-y-6">
      <ToggleSwitch
        label="Réservation en ligne"
        description={
          value.onlineBookingEnabled
            ? "Vos clients réservent depuis Belora et votre lien personnel."
            : "Suspendue : votre fiche reste visible, mais plus aucun créneau n'est proposé en ligne. L'agenda reste utilisable."
        }
        checked={value.onlineBookingEnabled}
        onChange={(v) => onChange("onlineBookingEnabled", v)}
      />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${value.onlineBookingEnabled ? "" : "opacity-50 pointer-events-none"}`}>
        <Select
          label="Délai minimum avant le rendez-vous"
          helper="Évite les réservations de dernière minute"
          options={withCurrent(NOTICE_OPTIONS, value.minBookingNoticeMinutes, "minutes")}
          value={String(value.minBookingNoticeMinutes)}
          onChange={(v) => onChange("minBookingNoticeMinutes", Number(v))}
        />
        <Select
          label="Réservation possible jusqu'à"
          helper="Au-delà, l'agenda n'est pas ouvert en ligne"
          options={withCurrent(ADVANCE_OPTIONS, value.maxBookingAdvanceDays, "jours")}
          value={String(value.maxBookingAdvanceDays)}
          onChange={(v) => onChange("maxBookingAdvanceDays", Number(v))}
        />
        <Select
          label="Créneaux proposés"
          helper="Intervalle entre deux heures de début"
          options={STEP_OPTIONS}
          value={String(value.slotStepMinutes)}
          onChange={(v) => onChange("slotStepMinutes", Number(v))}
        />
        <Select
          label="Battement entre deux rendez-vous"
          helper="Temps de préparation ou de nettoyage"
          options={withCurrent(BUFFER_OPTIONS, value.bufferMinutes, "minutes")}
          value={String(value.bufferMinutes)}
          onChange={(v) => onChange("bufferMinutes", Number(v))}
        />
      </div>

      <ToggleSwitch
        label="Choix de l'artisan par le client"
        description={
          value.allowStaffChoice
            ? "Le client choisit son artisan ou « Sans préférence »."
            : "Le premier collaborateur disponible est attribué automatiquement."
        }
        checked={value.allowStaffChoice}
        onChange={(v) => onChange("allowStaffChoice", v)}
      />

      <div className="max-w-sm">
        <FormInput
          type="number"
          label="Annulation gratuite jusqu'à (heures avant)"
          helper={
            value.cancellationDelayHours === 0
              ? "Annulation possible jusqu'à l'heure du rendez-vous."
              : `Passé ce délai, le client ne peut plus annuler en ligne et l'acompte n'est pas remboursé.`
          }
          min={0}
          max={168}
          step={1}
          value={String(value.cancellationDelayHours)}
          onChange={(e) => onChange("cancellationDelayHours", Math.min(168, Math.max(0, parseInt(e.target.value, 10) || 0)))}
        />
      </div>
    </div>
  );
}
