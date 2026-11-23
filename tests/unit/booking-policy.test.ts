import { describe, it, expect } from "vitest";
import { bookingWindowError, computeOnlinePaymentCents, findClosure, formatDuration } from "@/modules/booking/booking-policy";
import { isValidFrenchVat, isValidSiret, formatSiret } from "@/lib/validations/fr-business";
import { updateEstablishmentSchema, establishmentOpeningHourSchema } from "@/lib/validations/settings.schema";
import { formatOpeningHours } from "@/lib/utils/opening-hours";

const services = [
  { priceCents: 8000, depositRequired: true, depositCents: 0 },
  { priceCents: 3000, depositRequired: false, depositCents: 0 },
  { priceCents: 5000, depositRequired: false, depositCents: 1500 },
];

describe("Politique de paiement en ligne", () => {
  it("aucun paiement en ligne", () => {
    expect(computeOnlinePaymentCents(services, { mode: "NONE", scope: "ALL_SERVICES", depositPercentage: 30 })).toBe(0);
  });
  it("paiement intégral", () => {
    expect(computeOnlinePaymentCents(services, { mode: "FULL", scope: "FLAGGED_SERVICES", depositPercentage: 30 })).toBe(16000);
  });
  it("acompte sur les seules prestations concernées, montant fixe prioritaire", () => {
    // 30 % de 80 € + 15 € fixe ; la coupe n'exige rien
    expect(computeOnlinePaymentCents(services, { mode: "DEPOSIT", scope: "FLAGGED_SERVICES", depositPercentage: 30 })).toBe(3900);
  });
  it("acompte sur toutes les prestations", () => {
    expect(computeOnlinePaymentCents(services, { mode: "DEPOSIT", scope: "ALL_SERVICES", depositPercentage: 30 })).toBe(2400 + 900 + 1500);
  });
});

describe("Fenêtre de réservation et fermetures", () => {
  const now = new Date("2026-11-23T10:00:00Z");
  it("refuse un créneau trop proche ou trop lointain", () => {
    const w = { minNoticeMinutes: 120, maxAdvanceDays: 30 };
    expect(bookingWindowError(new Date("2026-11-23T11:00:00Z"), w, now)).toContain("2 heures");
    expect(bookingWindowError(new Date("2026-11-23T13:00:00Z"), w, now)).toBeNull();
    expect(bookingWindowError(new Date("2027-01-10T10:00:00Z"), w, now)).toContain("30 jours");
  });
  it("détecte une fermeture exceptionnelle, bornes incluses", () => {
    const closures = [{ startDate: new Date("2026-12-24T00:00:00Z"), endDate: new Date("2026-12-26T00:00:00Z"), label: "Noël" }];
    expect(findClosure("2026-12-24", closures)?.label).toBe("Noël");
    expect(findClosure("2026-12-26", closures)).not.toBeNull();
    expect(findClosure("2026-12-27", closures)).toBeNull();
  });
  it("formate les durées", () => {
    expect(formatDuration(1440)).toBe("1 jour");
    expect(formatDuration(120)).toBe("2 heures");
    expect(formatDuration(30)).toBe("30 minutes");
  });
});

describe("Identifiants et horaires", () => {
  it("valide SIRET et TVA", () => {
    expect(isValidSiret("849 201 942 00018")).toBe(true);
    expect(isValidSiret("849 201 942 00019")).toBe(false);
    expect(isValidSiret("123")).toBe(false);
    expect(isValidFrenchVat("FR 82 849201942")).toBe(true);
    expect(isValidFrenchVat("DE123")).toBe(false);
    expect(formatSiret("84920194200018")).toBe("849 201 942 00018");
  });
  it("refuse une pause hors des horaires ou une fermeture avant l'ouverture", () => {
    const base = { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "19:00" };
    expect(establishmentOpeningHourSchema.safeParse({ ...base, breakStart: "12:00", breakEnd: "13:00" }).success).toBe(true);
    expect(establishmentOpeningHourSchema.safeParse({ ...base, breakStart: "08:00", breakEnd: "13:00" }).success).toBe(false);
    expect(establishmentOpeningHourSchema.safeParse({ ...base, closeTime: "08:00" }).success).toBe(false);
    expect(establishmentOpeningHourSchema.safeParse({ ...base, breakStart: "12:00", breakEnd: null }).success).toBe(false);
  });
  it("exige un code postal à 5 chiffres", () => {
    const r = updateEstablishmentSchema.shape.postalCode.safeParse("7500");
    expect(r.success).toBe(false);
  });
  it("affiche la pause sur la fiche publique", () => {
    expect(formatOpeningHours({ isOpen: true, openTime: "09:00", closeTime: "19:00", breakStart: "12:30", breakEnd: "14:00" })).toBe(
      "09:00 - 12:30, 14:00 - 19:00"
    );
    expect(formatOpeningHours({ isOpen: false, openTime: "09:00", closeTime: "19:00" })).toBe("Fermé");
  });
});
