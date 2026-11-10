import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { POST as createBookingRoute } from "@/app/api/bookings/route";
import { GET as getBookingRoute } from "@/app/api/bookings/[id]/route";
import { POST as stripeWebhookRoute } from "@/app/api/webhooks/stripe/route";
import { BookingStatus, PaymentStatus } from "@prisma/client";

describe("Sprint 5 — Tunnel de Réservation & Flux Financier Stripe Connect", () => {
  const cleanupTestData = async () => {
    await db.bookingItem.deleteMany({
      where: { booking: { clientEmail: "eleonore@test-belora.fr" } },
    });
    await db.booking.deleteMany({
      where: { clientEmail: "eleonore@test-belora.fr" },
    });
    await db.customerCRM.deleteMany({
      where: { email: "eleonore@test-belora.fr" },
    });
  };

  beforeAll(async () => {
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("POST /api/bookings creates a booking with reference #BEL-XXXXX and correct financial breakdown", async () => {
    // 1. Récupération des données du salon seed
    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: {
        staff: true,
        services: true,
      },
    });

    expect(venue).toBeDefined();
    expect(venue!.staff.length).toBeGreaterThan(0);
    expect(venue!.services.length).toBeGreaterThan(0);

    const staffMember = venue!.staff[0];
    const service = venue!.services[0];

    // Créneau pour un jour futur (Mardi prochain à 14h00 UTC)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);
    futureDate.setUTCHours(14, 0, 0, 0);

    const bookingPayload = {
      venueId: venue!.id,
      serviceIds: [service.id],
      staffId: staffMember.id,
      startTime: futureDate.toISOString(),
      clientName: "Éléonore Da Silva",
      clientPhone: "06 99 88 77 66",
      clientEmail: "eleonore@test-belora.fr",
      notes: "Soin doux pour cuir chevelu sensible",
    };

    const req = new Request("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    const res = await createBookingRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data).toHaveProperty("booking");
    expect(data.booking.reference).toMatch(/^#BEL-\d{5}$/);
    expect(data.booking.totalPriceCents).toBe(service.priceCents);
    expect(data.booking.venueId).toBe(venue!.id);
    expect(data.booking.staffId).toBe(staffMember.id);
    expect(data.booking.items.length).toBe(1);

    // 2. Vérification CRM
    const customer = await db.customerCRM.findFirst({
      where: { email: "eleonore@test-belora.fr" },
    });
    expect(customer).toBeDefined();
    expect(customer!.firstName).toBe("Éléonore");
    expect(customer!.lastName).toBe("Da Silva");

    // 3. Test Anti-collision : la même réservation sur le même créneau doit être refusée
    const conflictReq = new Request("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    const conflictRes = await createBookingRoute(conflictReq);
    expect(conflictRes.status).toBe(400);
    const conflictData = await conflictRes.json();
    expect(conflictData).toHaveProperty("error");
    expect(conflictData.error).toContain("Ce créneau vient d'être réservé");

    // 4. Test GET /api/bookings/[id] par ID et par Référence
    const getByIdReq = new Request(`http://localhost:3000/api/bookings/${data.booking.id}`);
    const getByIdRes = await getBookingRoute(getByIdReq, {
      params: Promise.resolve({ id: data.booking.id }),
    });
    expect(getByIdRes.status).toBe(200);
    const fetchedById = await getByIdRes.json();
    expect(fetchedById.id).toBe(data.booking.id);
    expect(fetchedById.reference).toBe(data.booking.reference);

    const getByRefReq = new Request(
      `http://localhost:3000/api/bookings/${encodeURIComponent(data.booking.reference)}`
    );
    const getByRefRes = await getBookingRoute(getByRefReq, {
      params: Promise.resolve({ id: data.booking.reference }),
    });
    expect(getByRefRes.status).toBe(200);
    const fetchedByRef = await getByRefRes.json();
    expect(fetchedByRef.id).toBe(data.booking.id);

    // 5. Test Webhook Stripe payment_intent.succeeded
    const webhookPayload = {
      id: "evt_test_12345",
      type: "payment_intent.succeeded",
      data: {
        object: {
          id: "pi_test_success_999",
          amount: data.depositCents,
          metadata: {
            bookingId: data.booking.id,
            venueId: venue!.id,
          },
        },
      },
    };

    const webhookReq = new Request("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    const webhookRes = await stripeWebhookRoute(webhookReq);
    expect(webhookRes.status).toBe(200);

    const updatedBooking = await db.booking.findUnique({
      where: { id: data.booking.id },
    });
    expect(updatedBooking!.status).toBe(BookingStatus.CONFIRMED);
    expect(updatedBooking!.stripePaymentIntentId).toBe("pi_test_success_999");
  });
});
