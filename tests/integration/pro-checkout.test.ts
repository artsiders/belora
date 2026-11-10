import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { GET as getPendingRoute } from "@/app/api/pro/checkout/pending-appointments/route";
import { POST as createTicketRoute } from "@/app/api/pro/checkout/tickets/route";
import { GET as getDailySummaryRoute } from "@/app/api/pro/checkout/daily-summary/route";
import { POST as dailyClosingRoute } from "@/app/api/pro/checkout/daily-closing/route";
import { BookingStatus, PaymentStatus } from "@prisma/client";

describe("Sprint 8 — Espace Pro : Caisse Enregistreuse POS & Clôture Fiscale Z", () => {
  let venueId: string;
  let testBookingId: string;
  let testCustomerId: string;
  let staffId: string;
  let serviceId: string;

  const testEmail = "pos-test@belora.fr";
  const testPhone = "06 88 99 11 22";

  const cleanupTestData = async () => {
    // Supprimer les tickets de test
    await db.saleTicket.deleteMany({
      where: { clientName: "Juliette POS Test" },
    });
    // Supprimer les fermetures journalières de test
    await db.dailyClosing.deleteMany({
      where: { venueId },
    });
    // Supprimer les réservations de test
    await db.bookingItem.deleteMany({
      where: { booking: { clientEmail: testEmail } },
    });
    await db.booking.deleteMany({
      where: { clientEmail: testEmail },
    });
    await db.customerCRM.deleteMany({
      where: { email: testEmail },
    });
  };

  beforeAll(async () => {
    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: {
        staff: true,
        services: true,
      },
    });

    expect(venue).toBeDefined();
    venueId = venue!.id;
    staffId = venue!.staff[0].id;
    serviceId = venue!.services[0].id;

    await cleanupTestData();

    // 1. Créer un client CRM
    const customer = await db.customerCRM.create({
      data: {
        venueId,
        firstName: "Juliette",
        lastName: "POS Test",
        phone: testPhone,
        email: testEmail,
        totalVisits: 1,
        totalSpentCents: 0,
      },
    });
    testCustomerId = customer.id;

    // 2. Créer une réservation du jour avec acompte de 25€ (2500 centimes)
    const today = new Date();
    today.setHours(10, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(11, 0, 0, 0);

    const booking = await db.booking.create({
      data: {
        reference: `#BEL-POS-${Date.now().toString().slice(-4)}`,
        venueId,
        customerId: customer.id,
        clientName: "Juliette POS Test",
        clientPhone: testPhone,
        clientEmail: testEmail,
        status: BookingStatus.CONFIRMED,
        totalPriceCents: 8500, // 85.00 €
        depositCents: 2500,    // 25.00 € réglé en ligne
        remainingCents: 6000,  // 60.00 € restant à payer
        paymentStatus: PaymentStatus.PENDING,
        items: {
          create: {
            serviceId,
            staffId,
            startTime: today,
            endTime: endToday,
            priceCents: 8500,
          },
        },
      },
    });
    testBookingId = booking.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("1. GET /api/pro/checkout/pending-appointments returns appointments awaiting payment", async () => {
    const req = new Request(`http://localhost:3000/api/pro/checkout/pending-appointments?venueId=${venueId}`);
    const res = await getPendingRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.allTodayAppointments).toBeDefined();
    expect(Array.isArray(data.allTodayAppointments)).toBe(true);

    const found = data.allTodayAppointments.find((a: any) => a.id === testBookingId);
    expect(found).toBeDefined();
    expect(found.clientName).toBe("Juliette POS Test");
    expect(found.depositPaid).toBe(25);
  });

  it("2. POST /api/pro/checkout/tickets creates a certified sale ticket with deposit deduction and completes the appointment", async () => {
    const payload = {
      venueId,
      bookingId: testBookingId,
      clientId: testCustomerId,
      clientName: "Juliette POS Test",
      items: [
        {
          title: "Soin Végétal Signature",
          type: "service",
          price: 85,
          quantity: 1,
          staffId,
        },
        {
          title: "Huile Botanique 50ml",
          type: "product",
          price: 30,
          quantity: 1,
          staffId,
        },
      ],
      depositDeducted: 25, // Acompte de 25€ déduit du total (85 + 30 = 115€ -> Reste 90€)
      paymentMethod: "card",
    };

    const req = new Request("http://localhost:3000/api/pro/checkout/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createTicketRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.ticket).toBeDefined();
    expect(data.ticket.id).toMatch(/^#TC-2026-\d{4}$/); // Format séquentiel inaltérable
    expect(data.ticket.totalTtc).toBe(90); // 115 - 25 = 90 €
    expect(data.ticket.depositDeducted).toBe(25);
    expect(data.ticket.vatAmount).toBeCloseTo(15, 0); // TVA 20% sur 90€ = 15€
    expect(data.ticket.subtotalHt).toBeCloseTo(75, 0); // 90 - 15 = 75€ HT

    // Vérification en base : réservation passée à COMPLETED
    const updatedBooking = await db.booking.findUnique({
      where: { id: testBookingId },
    });
    expect(updatedBooking!.status).toBe(BookingStatus.COMPLETED);
    expect(updatedBooking!.paymentStatus).toBe(PaymentStatus.SUCCEEDED);
    expect(updatedBooking!.remainingCents).toBe(0);

    // Vérification en base : CRM client crédité
    const updatedCustomer = await db.customerCRM.findUnique({
      where: { id: testCustomerId },
    });
    expect(updatedCustomer!.totalSpentCents).toBe(11500); // 90€ encaissés + 25€ acompte
  });

  it("3. GET /api/pro/checkout/daily-summary returns daily totals and ticket list", async () => {
    const req = new Request(`http://localhost:3000/api/pro/checkout/daily-summary?venueId=${venueId}`);
    const res = await getDailySummaryRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.totals).toBeDefined();
    expect(data.totals.totalTtc).toBeGreaterThanOrEqual(90);
    expect(data.totals.totalCard).toBeGreaterThanOrEqual(90);
    expect(data.isClosed).toBe(false);
    expect(data.tickets.length).toBeGreaterThanOrEqual(1);
  });

  it("4. POST /api/pro/checkout/daily-closing executes certified Z closing and calculates discrepancy", async () => {
    const payload = {
      venueId,
      startingFloat: 150, // Fond de caisse 150 €
      cashCounted: 150,   // Pas d'espèces encaissées sur ce ticket, 150€ comptés
    };

    const req = new Request("http://localhost:3000/api/pro/checkout/daily-closing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await dailyClosingRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.closing).toBeDefined();
    expect(data.closing.discrepancy).toBe(0); // 150 comptés vs 150 attendus = 0 écart

    // Vérification que le résumé indique désormais que la caisse est fermée
    const summaryReq = new Request(`http://localhost:3000/api/pro/checkout/daily-summary?venueId=${venueId}`);
    const summaryRes = await getDailySummaryRoute(summaryReq);
    const summaryData = await summaryRes.json();
    expect(summaryData.isClosed).toBe(true);
  });
});
