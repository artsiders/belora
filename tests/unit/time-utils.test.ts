import { describe, it, expect } from "vitest";
import {
  timeStringToMinutes,
  minutesToTimeString,
  minutesRangesOverlap,
  dateRangesOverlap,
  getDayOfWeekFromDateString,
  createUtcDateFromLocal,
} from "../../src/modules/availability/time-utils";

describe("Sprint 3 — Utilitaires Temporels & Calculs Créneaux (time-utils)", () => {
  it("converts time string to minutes and back without loss", () => {
    expect(timeStringToMinutes("00:00")).toBe(0);
    expect(timeStringToMinutes("09:30")).toBe(570);
    expect(timeStringToMinutes("14:45")).toBe(885);
    expect(timeStringToMinutes("20:00")).toBe(1200);

    expect(minutesToTimeString(0)).toBe("00:00");
    expect(minutesToTimeString(570)).toBe("09:30");
    expect(minutesToTimeString(885)).toBe("14:45");
    expect(minutesToTimeString(1200)).toBe("20:00");
  });

  it("detects range overlap correctly on minutes", () => {
    // [09:00, 10:00] (540, 600) vs [09:30, 10:30] (570, 630) -> Overlap!
    expect(minutesRangesOverlap(540, 600, 570, 630)).toBe(true);

    // [09:00, 10:00] (540, 600) vs [10:00, 11:00] (600, 660) -> Exact boundary, NO overlap!
    expect(minutesRangesOverlap(540, 600, 600, 660)).toBe(false);

    // [09:00, 10:00] vs [11:00, 12:00] -> Disjoint, NO overlap!
    expect(minutesRangesOverlap(540, 600, 660, 720)).toBe(false);

    // [10:00, 12:00] vs [10:30, 11:30] -> Completely included, Overlap!
    expect(minutesRangesOverlap(600, 720, 630, 690)).toBe(true);
  });

  it("detects date range overlap correctly on UTC Dates", () => {
    const d1 = new Date("2026-11-15T10:00:00.000Z");
    const d2 = new Date("2026-11-15T11:00:00.000Z");
    const d3 = new Date("2026-11-15T10:30:00.000Z");
    const d4 = new Date("2026-11-15T11:30:00.000Z");
    const d5 = new Date("2026-11-15T11:00:00.000Z");
    const d6 = new Date("2026-11-15T12:00:00.000Z");

    expect(dateRangesOverlap(d1, d2, d3, d4)).toBe(true);
    // Boundary match -> no overlap
    expect(dateRangesOverlap(d1, d2, d5, d6)).toBe(false);
  });

  it("determines day of week accurately (0=Sunday, 1=Monday, 2=Tuesday, etc.)", () => {
    // 2026-11-10 est un Mardi (2)
    expect(getDayOfWeekFromDateString("2026-11-10")).toBe(2);
    // 2026-11-11 est un Mercredi (3)
    expect(getDayOfWeekFromDateString("2026-11-11")).toBe(3);
    // 2026-11-14 est un Samedi (6)
    expect(getDayOfWeekFromDateString("2026-11-14")).toBe(6);
    // 2026-11-15 est un Dimanche (0)
    expect(getDayOfWeekFromDateString("2026-11-15")).toBe(0);
    // 2026-11-16 est un Lundi (1)
    expect(getDayOfWeekFromDateString("2026-11-16")).toBe(1);
  });

  it("creates deterministic UTC dates from local time for Europe/Paris timezone", () => {
    // En hiver (novembre), Paris est à UTC+1.
    // 10:00 heure locale à Paris = 09:00 UTC.
    const utcDate = createUtcDateFromLocal("2026-11-10", 600, "Europe/Paris");
    expect(utcDate.toISOString()).toBe("2026-11-10T09:00:00.000Z");

    // 14:30 heure locale à Paris (870 minutes) = 13:30 UTC.
    const utcAfternoon = createUtcDateFromLocal("2026-11-10", 870, "Europe/Paris");
    expect(utcAfternoon.toISOString()).toBe("2026-11-10T13:30:00.000Z");
  });
});
