import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { AvailabilityService } from "../../src/modules/availability/availability.service";
import { LockService } from "../../src/modules/availability/lock.service";

describe("Sprint 3 — Moteur de Disponibilités & Verrouillage Anti-Collision", () => {
  let prisma: PrismaClient;
  let venueId: string;
  let serviceCoupeId: string;
  let staffHeleneId: string;
  let staffClementId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();

    const venue = await prisma.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: {
        services: true,
        staff: true,
      },
    });

    if (!venue) throw new Error("Atelier Botanique non trouvé dans la base seed.");

    venueId = venue.id;
    const coupe = venue.services.find((s) => s.name.includes("Shampoing + Coupe"));
    if (!coupe) throw new Error("Prestation Coupe non trouvée");
    serviceCoupeId = coupe.id;

    const helene = venue.staff.find((s) => s.name.includes("Hélène"));
    const clement = venue.staff.find((s) => s.name.includes("Clément"));
    if (!helene || !clement) throw new Error("Staff non trouvé");

    staffHeleneId = helene.id;
    staffClementId = clement.id;
  });

  afterAll(async () => {
    // Nettoyer tous les verrous de test
    await prisma.holdingLock.deleteMany({
      where: { lockKey: { contains: venueId } },
    });
    await prisma.$disconnect();
  });

  describe("Calcul des Créneaux Disponibles (AvailabilityService)", () => {
    it("returns 0 slots and isOpen=false when the salon is closed (Monday 2026-11-16)", async () => {
      const result = await AvailabilityService.getAvailableSlots({
        venueId,
        serviceIds: [serviceCoupeId],
        date: "2026-11-16", // Lundi (Fermé dans les horaires)
      });

      expect(result.isOpen).toBe(false);
      expect(result.slots.length).toBe(0);
    });

    it("returns available 15-minute slots on an open day (Tuesday 2026-11-17)", async () => {
      const result = await AvailabilityService.getAvailableSlots({
        venueId,
        serviceIds: [serviceCoupeId],
        date: "2026-11-17", // Mardi (Ouvert 09:30 à 19:30)
      });

      expect(result.isOpen).toBe(true);
      expect(result.totalDurationMinutes).toBe(45);
      expect(result.slots.length).toBeGreaterThan(0);

      // Le premier créneau démarre à 09:30
      expect(result.slots[0].time).toBe("09:30");

      // Chaque créneau liste les artisans disponibles
      for (const slot of result.slots) {
        expect(slot.availableStaff.length).toBeGreaterThan(0);
      }
    });

    it("filters slots by specific staff member when staffId is specified", async () => {
      const resultHelene = await AvailabilityService.getAvailableSlots({
        venueId,
        serviceIds: [serviceCoupeId],
        date: "2026-11-17",
        staffId: staffHeleneId,
      });

      expect(resultHelene.slots.length).toBeGreaterThan(0);
      for (const slot of resultHelene.slots) {
        expect(slot.availableStaff.length).toBe(1);
        expect(slot.availableStaff[0].id).toBe(staffHeleneId);
      }
    });

    it("excludes lunch break hours (13:00 to 14:00) from starting slots", async () => {
      const result = await AvailabilityService.getAvailableSlots({
        venueId,
        serviceIds: [serviceCoupeId],
        date: "2026-11-17",
        staffId: staffHeleneId,
      });

      // Aucun créneau de 45 min ne doit chevaucher la pause 13:00 - 14:00
      const collidingSlot = result.slots.find((s) => s.time === "13:00" || s.time === "13:15" || s.time === "13:30");
      expect(collidingSlot).toBeUndefined();
    });
  });

  describe("Système de Verrouillage Temporaire 10 min (LockService)", () => {
    it("acquires a lock, rejects concurrent lock, and releases it cleanly", async () => {
      const testTime = new Date("2026-11-20T10:00:00.000Z");

      // 1. Pose du verrou initial
      const lockRes = await LockService.acquireLock({
        venueId,
        staffId: staffHeleneId,
        startTime: testTime,
        durationMinutes: 45,
        lockDurationSeconds: 600,
      });

      expect(lockRes.success).toBe(true);
      expect(lockRes.lockKey).toBeDefined();

      // 2. Vérification que le créneau est verrouillé
      const isLocked = await LockService.isLocked(venueId, staffHeleneId, testTime);
      expect(isLocked).toBe(true);

      // 3. Tentative concurrente -> doit échouer
      const concurrentRes = await LockService.acquireLock({
        venueId,
        staffId: staffHeleneId,
        startTime: testTime,
        durationMinutes: 45,
      });

      expect(concurrentRes.success).toBe(false);
      expect(concurrentRes.error).toContain("réservation en cours");

      // 4. Libération du verrou
      const released = await LockService.releaseLock(lockRes.lockKey!);
      expect(released).toBe(true);

      // 5. Le créneau redeviens immédiatement libre
      const isLockedAfter = await LockService.isLocked(venueId, staffHeleneId, testTime);
      expect(isLockedAfter).toBe(false);
    });

    it("cleans up expired holding locks", async () => {
      const expiredKey = `lock:${venueId}:${staffClementId}:expired-test`;
      const expiredDate = new Date(Date.now() - 60 * 1000); // Expiré il y a 1 min

      await prisma.holdingLock.upsert({
        where: { lockKey: expiredKey },
        update: { expiresAt: expiredDate },
        create: { lockKey: expiredKey, expiresAt: expiredDate },
      });

      const deletedCount = await LockService.cleanupExpiredLocks();
      expect(deletedCount).toBeGreaterThanOrEqual(1);

      const exists = await prisma.holdingLock.findUnique({
        where: { lockKey: expiredKey },
      });
      expect(exists).toBeNull();
    });
  });
});
