"use client";

import { useEffect, useMemo, useState } from "react";
import { updateEstablishmentSchema, type UpdateEstablishmentInput } from "@/lib/validations/settings.schema";
import type { FormattedEstablishment } from "@/modules/pro/settings.service";

export function toPayload(form: FormattedEstablishment): UpdateEstablishmentInput {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    siret: form.siret,
    vatNumber: form.vatNumber,
    phone: form.phone,
    email: form.email,
    website: form.website,
    address: form.address,
    postalCode: form.postalCode,
    city: form.city,
    cancellationDelayHours: form.cancellationDelayHours,
    depositPercentage: form.depositPercentage,
    onlinePaymentMode: form.onlinePaymentMode,
    depositScope: form.depositScope,
    onlineBookingEnabled: form.onlineBookingEnabled,
    minBookingNoticeMinutes: form.minBookingNoticeMinutes,
    maxBookingAdvanceDays: form.maxBookingAdvanceDays,
    slotStepMinutes: form.slotStepMinutes as UpdateEstablishmentInput["slotStepMinutes"],
    bufferMinutes: form.bufferMinutes,
    allowStaffChoice: form.allowStaffChoice,
    openingHours: form.openingHours.map((oh) => ({
      dayOfWeek: oh.dayIndex,
      isOpen: oh.isOpen,
      openTime: oh.openTime,
      closeTime: oh.closeTime,
      breakStart: oh.breakStart,
      breakEnd: oh.breakEnd,
    })),
    closures: form.closures,
  };
}

/**
 * État du formulaire d'établissement : brouillon local, modifications en attente,
 * erreurs par champ (même schéma que le serveur) et garde avant de quitter la page.
 * Remonter le composant (prop `key`) pour repartir des valeurs enregistrées.
 */
export function useEstablishmentForm(saved: FormattedEstablishment) {
  const [form, setForm] = useState<FormattedEstablishment>(saved);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);

  const errors = useMemo(() => {
    const result = updateEstablishmentSchema.safeParse(toPayload(form));
    const map: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!map[key]) map[key] = issue.message;
      }
    }
    return map;
  }, [form]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const set = <K extends keyof FormattedEstablishment>(key: K, value: FormattedEstablishment[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => (prev.has(key as string) ? prev : new Set(prev).add(key as string)));
  };

  /** Erreur d'un champ, affichée seulement une fois le champ modifié (ou après une tentative d'envoi). */
  const fieldError = (key: keyof FormattedEstablishment) => (touched.has(key as string) ? errors[key as string] : undefined);

  const touchAll = () => setTouched(new Set(Object.keys(errors)));
  const reset = () => {
    setForm(saved);
    setTouched(new Set());
  };

  return { form, set, isDirty, errors, errorCount: Object.keys(errors).length, fieldError, touchAll, reset };
}
