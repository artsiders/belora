import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { BookingStatus, PaymentStatus, Role } from "@prisma/client";
import { GET as getAccountBookingsRoute } from "@/app/api/account/bookings/route";
import { POST as cancelBookingRoute } from "@/app/api/account/bookings/[id]/cancel/route";
import { POST as createReviewRoute } from "@/app/api/account/reviews/route";
import {
  GET as getProfileRoute,
  PATCH as updateProfileRoute,
} from "@/app/api/account/profile/route";

describe("Sprint 11 — Compte Client, Annulations & Avis Vérifiés", () => {
  let venueId: string;
  let serviceId: string;
  let staffId: string;
  let clientUserId: string;
  const clientEmail = "client@yopmail.com";

  let futureEligibleBookingId: string;
  let futureLateBookingId: string;
  let completedBookingId: string;

  const cleanupTestData = async () => {
    const testBookings = await db.booking.findMany({
      where: {
        OR: [
          { reference: { startsWith: "#TEST-SP11" } },
          { clientEmail: "temp.account.test@belora.fr" },
        ],
      },
      select: { id: true },
    });

    const bookingIds = testBookings.map((b) => b.id);
    if (bookingIds.length > 0) {
      await db.review.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await db.bookingItem.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await db.booking.deleteMany({ where: { id: { in: bookingIds } } });
    }
  };

  beforeAll(async () => {
    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
    });
    expect(venue).toBeDefined();
    venueId = venue!.id;

    const service = await db.service.findFirst({
      where: { venueId, isActive: true },
    });
    expect(service).toBeDefined();
    serviceId = service!.id;

    const staff = await db.staffMember.findFirst({
      where: { venueId, isActive: true },
    });
    expect(staff).toBeDefined();
    staffId = staff!.id;

    const clientUser = await db.user.findUnique({
      where: { email: clientEmail },
    });
    expect(clientUser).toBeDefined();
    clientUserId = clientUser!.id;

    await cleanupTestData();

    // 1. Créer une réservation future (> 48h) éligible au remboursement
    const futureDateEligible = new Date(Date.now() + 72 * 3600 * 1000);
    const bookingEligible = await db.booking.create({
      data: {
        reference: "#TEST-SP11-01",
        venueId,
        clientName: "Camille Dupont",
        clientEmail,
        clientPhone: "06 98 76 54 32",
        status: BookingStatus.CONFIRMED,
        totalPriceCents: 8500, // 85.00 €
        depositCents: 2500,    // 25.00 €
        remainingCents: 6000,
        paymentStatus: PaymentStatus.PENDING,
        stripePaymentIntentId: "pi_mock_sp11_eligible",
      },
    });
    await db.bookingItem.create({
      data: {
        bookingId: bookingEligible.id,
        serviceId,
        staffId,
        startTime: futureDateEligible,
        endTime: new Date(futureDateEligible.getTime() + 60 * 60 * 1000),
        priceCents: 8500,
      },
    });
    futureEligibleBookingId = bookingEligible.id;

    // 2. Créer une réservation future tardive (< 12h) non éligible au remboursement
    const futureDateLate = new Date(Date.now() + 6 * 3600 * 1000);
    const bookingLate = await db.booking.create({
      data: {
        reference: "#TEST-SP11-02",
        venueId,
        clientName: "Camille Dupont",
        clientEmail,
        clientPhone: "06 98 76 54 32",
        status: BookingStatus.CONFIRMED,
        totalPriceCents: 7500,
        depositCents: 2000,
        remainingCents: 5500,
        paymentStatus: PaymentStatus.PENDING,
        stripePaymentIntentId: "pi_mock_sp11_late",
      },
    });
    await db.bookingItem.create({
      data: {
        bookingId: bookingLate.id,
        serviceId,
        staffId,
        startTime: futureDateLate,
        endTime: new Date(futureDateLate.getTime() + 45 * 60 * 1000),
        priceCents: 7500,
      },
    });
    futureLateBookingId = bookingLate.id;

    // 3. Créer une réservation passée COMPLETED (pour dépôt d'avis)
    const pastDate = new Date(Date.now() - 48 * 3600 * 1000);
    const bookingCompleted = await db.booking.create({
      data: {
        reference: "#TEST-SP11-03",
        venueId,
        clientName: "Camille Dupont",
        clientEmail,
        clientPhone: "06 98 76 54 32",
        status: BookingStatus.COMPLETED,
        totalPriceCents: 9000,
        depositCents: 3000,
        remainingCents: 6000,
        paymentStatus: PaymentStatus.SUCCEEDED,
      },
    });
    await db.bookingItem.create({
      data: {
        bookingId: bookingCompleted.id,
        serviceId,
        staffId,
        startTime: pastDate,
        endTime: new Date(pastDate.getTime() + 60 * 60 * 1000),
        priceCents: 9000,
      },
    });
    completedBookingId = bookingCompleted.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  // ===========================================================================
  // 1. RÉCUPÉRATION DES RÉSERVATIONS DU CLIENT
  // ===========================================================================

  it("1. GET /api/account/bookings returns upcoming and past appointments for logged-in user", async () => {
    const req = new Request(`http://localhost:3000/api/account/bookings?userId=${clientUserId}`);
    const res = await getAccountBookingsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.upcoming).toBeDefined();
    expect(Array.isArray(data.upcoming)).toBe(true);
    expect(data.upcoming.length).toBeGreaterThanOrEqual(2);

    expect(data.past).toBeDefined();
    expect(Array.isArray(data.past)).toBe(true);
    expect(data.past.length).toBeGreaterThanOrEqual(1);

    expect(data.counts).toBeDefined();
    expect(data.counts.total).toBeGreaterThanOrEqual(3);

    // Vérifier les champs enrichis
    const firstUpcoming = data.upcoming.find((u: { id: string }) => u.id === futureEligibleBookingId);
    expect(firstUpcoming).toBeDefined();
    expect(firstUpcoming.reference).toBe("#TEST-SP11-01");
    expect(firstUpcoming.venueName).toBe("L’Atelier Botanique");
    expect(firstUpcoming.serviceName).toBeDefined();
    expect(firstUpcoming.artisanName).toBeDefined();
    expect(firstUpcoming.price).toBe(85);
    expect(firstUpcoming.depositAmount).toBe(25);
    expect(firstUpcoming.isEligibleForRefund).toBe(true);
  });

  // ===========================================================================
  // 2. ANNULATION AVEC VÉRIFICATION DE LA POLITIQUE & REMBOURSEMENT
  // ===========================================================================

  it("2. POST /api/account/bookings/[id]/cancel refunds deposit when cancelled within delay (>24h)", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/bookings/${futureEligibleBookingId}/cancel?userId=${clientUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Contretemps familial" }),
      }
    );
    const res = await cancelBookingRoute(req, {
      params: Promise.resolve({ id: futureEligibleBookingId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isRefunded).toBe(true);
    expect(data.refundAmountEuros).toBe(25);

    // Vérification en base
    const updated = await db.booking.findUnique({
      where: { id: futureEligibleBookingId },
    });
    expect(updated?.status).toBe(BookingStatus.CANCELLED);
    expect(updated?.paymentStatus).toBe(PaymentStatus.REFUNDED);
    expect(updated?.cancellationReason).toBe("Contretemps familial");
  });

  it("3. POST /api/account/bookings/[id]/cancel withholds deposit when cancelled past delay (<24h)", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/bookings/${futureLateBookingId}/cancel?userId=${clientUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Imprévu dernière minute" }),
      }
    );
    const res = await cancelBookingRoute(req, {
      params: Promise.resolve({ id: futureLateBookingId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.isRefunded).toBe(false);
    expect(data.refundAmountEuros).toBe(0);

    // Vérification en base : statut CANCELLED mais pas remboursé
    const updated = await db.booking.findUnique({
      where: { id: futureLateBookingId },
    });
    expect(updated?.status).toBe(BookingStatus.CANCELLED);
    expect(updated?.paymentStatus).not.toBe(PaymentStatus.REFUNDED);
  });

  it("4. POST /api/account/bookings/[id]/cancel rejects already cancelled booking", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/bookings/${futureEligibleBookingId}/cancel?userId=${clientUserId}`,
      { method: "POST" }
    );
    const res = await cancelBookingRoute(req, {
      params: Promise.resolve({ id: futureEligibleBookingId }),
    });
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("déjà annulé");
  });

  // ===========================================================================
  // 3. DÉPÔT D'AVIS CERTIFIÉ
  // ===========================================================================

  it("5. POST /api/account/reviews rejects review on non-completed booking", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/reviews?userId=${clientUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: futureEligibleBookingId, // Réservation annulée, pas terminée
          rating: 5,
          comment: "Très bonne expérience malgré tout !",
        }),
      }
    );
    const res = await createReviewRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("honoré");
  });

  it("6. POST /api/account/reviews creates a verified review on completed booking", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/reviews?userId=${clientUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: completedBookingId,
          rating: 5,
          comment: "Un rituel d'une délicatesse absolue. Hélène a pris grand soin de mes cheveux.",
        }),
      }
    );
    const res = await createReviewRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.review).toBeDefined();
    expect(data.review.rating).toBe(5);
    expect(data.review.isVerified).toBe(true);

    // Vérification en base
    const savedReview = await db.review.findUnique({
      where: { bookingId: completedBookingId },
    });
    expect(savedReview).toBeDefined();
    expect(savedReview?.authorName).toBe("Camille Dupont");
    expect(savedReview?.isVerified).toBe(true);
  });

  it("7. POST /api/account/reviews prevents duplicate review on same booking", async () => {
    const req = new Request(
      `http://localhost:3000/api/account/reviews?userId=${clientUserId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: completedBookingId,
          rating: 4,
          comment: "Nouvel avis en doublon",
        }),
      }
    );
    const res = await createReviewRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("déjà été publié");
  });

  // ===========================================================================
  // 4. GESTION DU PROFIL CLIENT
  // ===========================================================================

  it("8. GET & PATCH /api/account/profile retrieves and updates personal information", async () => {
    const getReq = new Request(`http://localhost:3000/api/account/profile?userId=${clientUserId}`);
    const getRes = await getProfileRoute(getReq);
    expect(getRes.status).toBe(200);

    const getData = await getRes.json();
    expect(getData.user.email).toBe(clientEmail);
    expect(getData.user.firstName).toBe("Camille");

    const patchReq = new Request(
      `http://localhost:3000/api/account/profile?userId=${clientUserId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: "Camille-Élise",
          lastName: "Dupont-Moreau",
          phone: "06 77 11 22 33",
        }),
      }
    );
    const patchRes = await updateProfileRoute(patchReq);
    expect(patchRes.status).toBe(200);

    const patchData = await patchRes.json();
    expect(patchData.user.firstName).toBe("Camille-Élise");
    expect(patchData.user.lastName).toBe("Dupont-Moreau");
    expect(patchData.user.phone).toBe("06 77 11 22 33");

    // Rétablir le profil original
    await db.user.update({
      where: { id: clientUserId },
      data: {
        firstName: "Camille",
        lastName: "Dupont",
        phone: "06 98 76 54 32",
      },
    });
    await db.customerCRM.updateMany({
      where: { userId: clientUserId },
      data: {
        firstName: "Camille",
        lastName: "Dupont",
        phone: "06 98 76 54 32",
      },
    });
  });

  it("7. GET /api/account/bookings and profile for Nathalie Vidal return seeded history, upcoming appointment, and verified review", async () => {
    const nathalieUser = await db.user.findUnique({
      where: { email: "nathalie.vidal@yopmail.com" },
    });
    expect(nathalieUser).toBeDefined();

    const bookingsReq = new Request(
      `http://localhost:3000/api/account/bookings?email=nathalie.vidal@yopmail.com`
    );
    const bookingsRes = await getAccountBookingsRoute(bookingsReq);
    expect(bookingsRes.status).toBe(200);

    const bookingsData = await bookingsRes.json();
    expect(bookingsData.upcoming.length).toBeGreaterThanOrEqual(1);
    expect(bookingsData.past.length).toBeGreaterThanOrEqual(1);

    const pastWithReview = bookingsData.past.find((b: any) => b.hasReview);
    expect(pastWithReview).toBeDefined();
    expect(pastWithReview.review.rating).toBe(5);
    expect(pastWithReview.review.reply).toBeDefined();

    const profileReq = new Request(
      `http://localhost:3000/api/account/profile?email=nathalie.vidal@yopmail.com`
    );
    const profileRes = await getProfileRoute(profileReq);
    expect(profileRes.status).toBe(200);

    const profileData = await profileRes.json();
    expect(profileData.user.firstName).toBe("Nathalie");
    expect(profileData.user.lastName).toBe("Vidal");
    expect(profileData.user.role).toBe(Role.CUSTOMER);
  });
});
