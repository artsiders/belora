import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { POST as cronRemindersRoute } from "@/app/api/cron/reminders/route";
import { BookingStatus, PaymentStatus } from "@prisma/client";

describe("Sprint 6 — Tâche Automatisée de Rappels (Worker Cron)", () => {
  let testBookingId: string;

  beforeAll(async () => {
    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: { staff: true, services: true },
    });

    if (!venue || !venue.staff[0] || !venue.services[0]) {
      throw new Error("Salon atelier-botanique-paris introuvable");
    }

    // Création d'une réservation prévue dans 26 heures (dans la fenêtre 20-48h)
    const startTime = new Date(Date.now() + 26 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    const booking = await db.booking.create({
      data: {
        reference: "#BEL-CRON1",
        venueId: venue.id,
        clientName: "Testeur Cron",
        clientEmail: "cron-test@belora.fr",
        clientPhone: "06 00 11 22 33",
        status: BookingStatus.CONFIRMED,
        totalPriceCents: 5000,
        paymentStatus: PaymentStatus.SUCCEEDED,
        items: {
          create: [
            {
              serviceId: venue.services[0].id,
              staffId: venue.staff[0].id,
              startTime,
              endTime,
              priceCents: 5000,
            },
          ],
        },
      },
    });

    testBookingId = booking.id;
  });

  afterAll(async () => {
    if (testBookingId) {
      await db.bookingItem.deleteMany({ where: { bookingId: testBookingId } });
      await db.booking.deleteMany({ where: { id: testBookingId } });
    }
  });

  it("POST /api/cron/reminders rejects requests without valid Bearer token", async () => {
    const req = new Request("http://localhost:3000/api/cron/reminders", {
      method: "POST",
      headers: { Authorization: "Bearer bad-token" },
    });

    const res = await cronRemindersRoute(req);
    expect(res.status).toBe(401);
  });

  it("POST /api/cron/reminders processes upcoming appointments and sends reminder email & SMS", async () => {
    const cronSecret = process.env.CRON_SECRET || "belora-dev-cron-secret";

    const req = new Request("http://localhost:3000/api/cron/reminders", {
      method: "POST",
      headers: { Authorization: `Bearer ${cronSecret}` },
    });

    const res = await cronRemindersRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.processedCount).toBeGreaterThanOrEqual(1);

    const processed = data.reminders.find((r: any) => r.reference === "#BEL-CRON1");
    expect(processed).toBeDefined();
    expect(processed.emailSent).toBe(true);
    expect(processed.smsSent).toBe(true);
  });
});
