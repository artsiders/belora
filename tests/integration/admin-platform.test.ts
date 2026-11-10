import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { Role, VenueStatus, BookingStatus } from "@prisma/client";
import { GET as getDashboardRoute } from "@/app/api/admin/dashboard/route";
import { GET as getVenuesRoute } from "@/app/api/admin/venues/route";
import { PATCH as updateVenueRoute } from "@/app/api/admin/venues/[id]/route";
import { POST as createAssistedVenueRoute } from "@/app/api/admin/venues/assisted/route";
import {
  GET as getMonetizationRoute,
  PATCH as updateMonetizationRoute,
} from "@/app/api/admin/monetization/route";
import { GET as getReviewsRoute } from "@/app/api/admin/reviews/route";
import { DELETE as deleteReviewRoute } from "@/app/api/admin/reviews/[id]/route";

describe("Sprint 12 — Panneau Super-Admin Belora Plateforme (/admin)", () => {
  const adminEmail = "admin@belora.com";
  const clientEmail = "client@belora.com";

  let atelierVenueId: string;
  let testAssistedVenueId: string | null = null;
  let testReviewId: string | null = null;

  const cleanup = async () => {
    // 1. Supprimer les avis et réservations de test
    if (testReviewId) {
      await db.review.deleteMany({ where: { id: testReviewId } });
    }
    await db.review.deleteMany({
      where: { authorName: "Test Modération Client" },
    });
    await db.booking.deleteMany({
      where: { reference: "#TEST-SP12-MODERATION" },
    });

    // 2. Supprimer les salons assistés de test
    const testVenues = await db.venue.findMany({
      where: {
        OR: [
          { email: "assisted.pro.test@belora.fr" },
          { slug: { startsWith: "salon-test-assiste" } },
        ],
      },
      select: { id: true, ownerId: true },
    });

    for (const v of testVenues) {
      await db.venueOpeningHour.deleteMany({ where: { venueId: v.id } });
      await db.verificationToken.deleteMany({
        where: { identifier: `assisted_venue:${v.id}` },
      });
      await db.venue.delete({ where: { id: v.id } });
      await db.user.deleteMany({ where: { id: v.ownerId, email: "assisted.pro.test@belora.fr" } });
    }

    // 3. Restaurer les paramètres de monétisation
    const setting = await db.platformSetting.findFirst();
    if (setting) {
      await db.platformSetting.update({
        where: { id: setting.id },
        data: {
          defaultCommissionRate: 0.018,
          maintenanceMode: false,
        },
      });
    }

    // 4. Restaurer le statut et commission de L'Atelier Botanique
    const atelier = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
    });
    if (atelier) {
      await db.venue.update({
        where: { id: atelier.id },
        data: {
          status: VenueStatus.PUBLISHED,
          commissionRate: 0.018,
        },
      });
    }
  };

  beforeAll(async () => {
    await cleanup();

    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
    });
    expect(venue).toBeDefined();
    atelierVenueId = venue!.id;
  });

  afterAll(async () => {
    await cleanup();
  });

  // ===========================================================================
  // 1. SÉCURITÉ RBAC & ACCÈS SUPER-ADMIN
  // ===========================================================================
  it("1. Devrait refuser l'accès au tableau de bord (401) sans identification admin", async () => {
    const req = new Request("http://localhost:3000/api/admin/dashboard");
    const res = await getDashboardRoute(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain("Non authentifié");
  });

  it("2. Devrait refuser l'accès au tableau de bord (403) pour un utilisateur CUSTOMER", async () => {
    const req = new Request(
      `http://localhost:3000/api/admin/dashboard?adminEmail=${clientEmail}`
    );
    const res = await getDashboardRoute(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Privilèges administrateur requis");
  });

  it("3. Devrait retourner les métriques KPIs consolidées avec un compte ADMIN", async () => {
    const req = new Request(
      `http://localhost:3000/api/admin/dashboard?adminEmail=${adminEmail}`
    );
    const res = await getDashboardRoute(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.metrics).toBeDefined();
    expect(body.metrics.kpis).toBeDefined();
    expect(body.metrics.kpis.totalBookings).toBeGreaterThanOrEqual(1);
    expect(body.metrics.kpis.activeVenuesCount).toBeGreaterThanOrEqual(1);
    expect(body.metrics.recentBookings).toBeInstanceOf(Array);
  });

  // ===========================================================================
  // 2. GESTION & VALIDATION DES SALONS
  // ===========================================================================
  it("4. Devrait lister tous les établissements avec pagination/recherche pour l'admin", async () => {
    const req = new Request(
      `http://localhost:3000/api/admin/venues?adminEmail=${adminEmail}&search=Botanique`
    );
    const res = await getVenuesRoute(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.venues).toBeInstanceOf(Array);
    expect(body.venues.length).toBeGreaterThanOrEqual(1);
    const atelier = body.venues.find((v: any) => v.id === atelierVenueId);
    expect(atelier).toBeDefined();
    expect(atelier.name).toContain("Atelier Botanique");
  });

  it("5. Devrait suspendre et modifier la commission d'un salon via PATCH /api/admin/venues/[id]", async () => {
    const req = new Request(
      `http://localhost:3000/api/admin/venues/${atelierVenueId}?adminEmail=${adminEmail}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "SUSPENDED",
          commissionRate: 0.025,
        }),
      }
    );

    const res = await updateVenueRoute(req, {
      params: Promise.resolve({ id: atelierVenueId }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.venue.status).toBe(VenueStatus.SUSPENDED);
    expect(body.venue.commissionRate).toBe(0.025);

    // Vérification en base
    const dbVenue = await db.venue.findUnique({ where: { id: atelierVenueId } });
    expect(dbVenue?.status).toBe(VenueStatus.SUSPENDED);
    expect(dbVenue?.commissionRate).toBe(0.025);

    // Restauration en PUBLISHED
    const restoreReq = new Request(
      `http://localhost:3000/api/admin/venues/${atelierVenueId}?adminEmail=${adminEmail}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PUBLISHED",
          commissionRate: 0.018,
        }),
      }
    );
    const restoreRes = await updateVenueRoute(restoreReq, {
      params: Promise.resolve({ id: atelierVenueId }),
    });
    expect(restoreRes.status).toBe(200);
  });

  // ===========================================================================
  // 3. CRÉATION ASSISTÉE D'ÉTABLISSEMENT
  // ===========================================================================
  it("6. Devrait créer un salon assisté et générer un jeton d'invitation sécurisé", async () => {
    const req = new Request(
      `http://localhost:3000/api/admin/venues/assisted?adminEmail=${adminEmail}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Salon Test Assisté Belora",
          proEmail: "assisted.pro.test@belora.fr",
          proFirstName: "Sophie",
          proLastName: "Gautier",
          proPhone: "01 40 20 30 40",
          address: "22 Rue Oberkampf",
          city: "Paris",
          postalCode: "75011",
          tagline: "Institut de beauté & massages bio",
          commissionRate: 0.02,
        }),
      }
    );

    const res = await createAssistedVenueRoute(req);
    expect(res.status).toBe(201);
    const body = await res.json();

    expect(body.venue).toBeDefined();
    expect(body.venue.name).toBe("Salon Test Assisté Belora");
    expect(body.venue.status).toBe(VenueStatus.PENDING_VALIDATION);
    expect(body.owner.email).toBe("assisted.pro.test@belora.fr");
    expect(body.invitationToken).toBeDefined();
    expect(body.invitationUrl).toContain(body.venue.id);
    expect(body.invitationUrl).toContain(body.invitationToken);

    testAssistedVenueId = body.venue.id;

    // Vérification que le token est bien enregistré dans VerificationToken
    const tokenRecord = await db.verificationToken.findFirst({
      where: { identifier: `assisted_venue:${body.venue.id}` },
    });
    expect(tokenRecord).toBeDefined();
    expect(tokenRecord?.token).toBe(body.invitationToken);

    // Vérification que les horaires par défaut ont été créés
    const openingHours = await db.venueOpeningHour.findMany({
      where: { venueId: body.venue.id },
    });
    expect(openingHours.length).toBe(7);
  });

  // ===========================================================================
  // 4. MONÉTISATION & COMMISSIONS GLOBALES
  // ===========================================================================
  it("7. Devrait récupérer et mettre à jour le taux de commission par défaut de la plateforme", async () => {
    // GET
    const getReq = new Request(
      `http://localhost:3000/api/admin/monetization?adminEmail=${adminEmail}`
    );
    const getRes = await getMonetizationRoute(getReq);
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.settings.defaultCommissionRate).toBeDefined();
    expect(getBody.settings.venuesSummary).toBeInstanceOf(Array);

    // PATCH
    const patchReq = new Request(
      `http://localhost:3000/api/admin/monetization?adminEmail=${adminEmail}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defaultCommissionRate: 0.022,
          maintenanceMode: false,
        }),
      }
    );
    const patchRes = await updateMonetizationRoute(patchReq);
    expect(patchRes.status).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.settings.defaultCommissionRate).toBe(0.022);

    // Vérification persistée en base
    const settingInDb = await db.platformSetting.findFirst();
    expect(settingInDb?.defaultCommissionRate).toBe(0.022);
  });

  // ===========================================================================
  // 5. MODÉRATION DES AVIS CLIENTS
  // ===========================================================================
  it("8. Devrait lister et supprimer un avis client signalé/inapproprié", async () => {
    // 1. Création d'une réservation terminée et de son avis
    const testBooking = await db.booking.create({
      data: {
        reference: "#TEST-SP12-MODERATION",
        venueId: atelierVenueId,
        clientName: "Test Modération Client",
        clientEmail: "moderation.test@belora.fr",
        clientPhone: "06 12 34 56 78",
        status: BookingStatus.COMPLETED,
        totalPriceCents: 6500,
        depositCents: 1500,
        remainingCents: 5000,
      },
    });

    const review = await db.review.create({
      data: {
        venueId: atelierVenueId,
        bookingId: testBooking.id,
        authorName: "Test Modération Client",
        rating: 1,
        comment: "Commentaire inapproprié à supprimer par le super-admin.",
        isVerified: true,
      },
    });
    testReviewId = review.id;

    // 2. GET /api/admin/reviews
    const getReq = new Request(
      `http://localhost:3000/api/admin/reviews?adminEmail=${adminEmail}`
    );
    const getRes = await getReviewsRoute(getReq);
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.reviews).toBeInstanceOf(Array);
    const found = getBody.reviews.find((r: any) => r.id === testReviewId);
    expect(found).toBeDefined();
    expect(found.comment).toContain("inapproprié");

    // 3. DELETE /api/admin/reviews/[id]
    const delReq = new Request(
      `http://localhost:3000/api/admin/reviews/${testReviewId}?adminEmail=${adminEmail}`,
      { method: "DELETE" }
    );
    const delRes = await deleteReviewRoute(delReq, {
      params: Promise.resolve({ id: testReviewId }),
    });
    expect(delRes.status).toBe(200);
    const delBody = await delRes.json();
    expect(delBody.success).toBe(true);

    // 4. Vérification suppression en base
    const deletedInDb = await db.review.findUnique({
      where: { id: testReviewId },
    });
    expect(deletedInDb).toBeNull();
    testReviewId = null;
  });
});
