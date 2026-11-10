import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import {
  GET as getServicesRoute,
  POST as createServiceRoute,
} from "@/app/api/pro/services/route";
import {
  PATCH as updateServiceRoute,
  DELETE as deleteServiceRoute,
} from "@/app/api/pro/services/[id]/route";
import { POST as duplicateServiceRoute } from "@/app/api/pro/services/duplicate/route";
import { POST as massPriceRoute } from "@/app/api/pro/services/mass-price/route";
import { POST as createCategoryRoute } from "@/app/api/pro/services/categories/route";
import { DELETE as deleteCategoryRoute } from "@/app/api/pro/services/categories/[id]/route";
import {
  GET as getEstablishmentRoute,
  PATCH as updateEstablishmentRoute,
} from "@/app/api/pro/settings/establishment/route";
import {
  GET as getTeamRoute,
  POST as createStaffRoute,
} from "@/app/api/pro/settings/team/route";
import { PATCH as updateStaffRoute } from "@/app/api/pro/settings/team/[staffId]/route";
import {
  GET as getCashRegisterRoute,
  PATCH as updateCashRegisterRoute,
} from "@/app/api/pro/settings/cash-register/route";
import {
  GET as getNotificationsRoute,
  PATCH as updateNotificationsRoute,
} from "@/app/api/pro/settings/notifications/route";

describe("Sprint 10 — Espace Pro : Catalogue Prestations & Paramètres Salon", () => {
  let venueId: string;
  let testCategoryId: string;
  let createdServiceId: string;
  let duplicatedServiceId: string;
  let createdStaffId: string;

  const testServiceName = "Rituel Botanique Test Sprint 10";
  const testCategoryName = "Soins Éphémères Test";

  const cleanupTestData = async () => {
    // Nettoyer les services et catégories de test
    await db.service.deleteMany({
      where: {
        venueId,
        OR: [
          { name: { contains: "Test Sprint 10" } },
          { name: { contains: "(Copie)" } },
        ],
      },
    });

    await db.serviceCategory.deleteMany({
      where: {
        venueId,
        name: testCategoryName,
      },
    });

    if (createdStaffId) {
      await db.staffSchedule.deleteMany({ where: { staffId: createdStaffId } });
      await db.staffMember.deleteMany({ where: { id: createdStaffId } });
    }

    if (venueId) {
      await db.venue.update({
        where: { id: venueId },
        data: {
          name: "L’Atelier Botanique",
          email: "contact.atelierbotanique@yopmail.com",
          cancellationDelayHours: 24,
          depositPercentage: 30,
        },
      });
      await db.venueOpeningHour.updateMany({
        where: { venueId, dayOfWeek: 2 },
        data: { openTime: "09:30", closeTime: "19:30", isOpen: true },
      });
    }
  };

  beforeAll(async () => {
    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
    });
    expect(venue).toBeDefined();
    venueId = venue!.id;

    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  // ===========================================================================
  // 1. CATALOGUE PRESTATIONS & CATÉGORIES
  // ===========================================================================

  it("1. GET /api/pro/services returns both categories and services hierarchy", async () => {
    const req = new Request(`http://localhost:3000/api/pro/services?venueId=${venueId}`);
    const res = await getServicesRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.services).toBeDefined();
    expect(Array.isArray(data.services)).toBe(true);
    expect(data.services.length).toBeGreaterThanOrEqual(1);

    expect(data.categories).toBeDefined();
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThanOrEqual(1);

    // Vérifier les champs de la première prestation
    const srv = data.services[0];
    expect(srv.id).toBeDefined();
    expect(srv.name).toBeDefined();
    expect(srv.durationMinutes).toBeGreaterThan(0);
    expect(srv.priceEuros).toBeGreaterThan(0);
  });

  it("2. POST /api/pro/services/categories creates a new ritual category", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/services/categories?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: testCategoryName }),
      }
    );
    const res = await createCategoryRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.category).toBeDefined();
    expect(data.category.name).toBe(testCategoryName);
    testCategoryId = data.category.id;
  });

  it("3. POST /api/pro/services creates a new service in cents and validates deposit rules", async () => {
    // Tentative avec acompte supérieur au tarif -> doit échouer
    const invalidReq = new Request(
      `http://localhost:3000/api/pro/services?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testServiceName,
          categoryId: testCategoryId,
          durationMinutes: 60,
          priceEuros: 50,
          depositRequired: true,
          depositAmountEuros: 80, // Invalide : 80€ > 50€
        }),
      }
    );
    const invalidRes = await createServiceRoute(invalidReq);
    expect(invalidRes.status).toBe(400);

    // Création valide
    const validReq = new Request(
      `http://localhost:3000/api/pro/services?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: testServiceName,
          categoryId: testCategoryId,
          durationMinutes: 75,
          breakDurationMinutes: 15,
          priceEuros: 90,
          depositRequired: true,
          depositAmountEuros: 30,
          description: "Soin aux extraits botaniques et massage crânien.",
        }),
      }
    );
    const validRes = await createServiceRoute(validReq);
    expect(validRes.status).toBe(201);

    const data = await validRes.json();
    expect(data.service).toBeDefined();
    expect(data.service.name).toBe(testServiceName);
    expect(data.service.priceEuros).toBe(90);
    expect(data.service.depositAmountEuros).toBe(30);
    expect(data.service.breakDurationMinutes).toBe(15);
    createdServiceId = data.service.id;
  });

  it("4. PATCH /api/pro/services/[id] updates duration, price and pose time", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/services/${createdServiceId}?venueId=${venueId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes: 90,
          priceEuros: 110,
          breakDurationMinutes: 20,
        }),
      }
    );
    const res = await updateServiceRoute(req, {
      params: Promise.resolve({ id: createdServiceId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.service.durationMinutes).toBe(90);
    expect(data.service.priceEuros).toBe(110);
    expect(data.service.breakDurationMinutes).toBe(20);
  });

  it("5. POST /api/pro/services/duplicate clones an existing service with '(Copie)' suffix", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/services/duplicate?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: createdServiceId }),
      }
    );
    const res = await duplicateServiceRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.service).toBeDefined();
    expect(data.service.name).toBe(`${testServiceName} (Copie)`);
    expect(data.service.durationMinutes).toBe(90);
    expect(data.service.priceEuros).toBe(110);
    duplicatedServiceId = data.service.id;
  });

  it("6. POST /api/pro/services/mass-price adjusts prices in bulk (percent & fixed)", async () => {
    // Augmentation de 10% sur notre catégorie de test
    const percentReq = new Request(
      `http://localhost:3000/api/pro/services/mass-price?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: testCategoryId,
          deltaPercent: 10,
          deltaFixed: 0,
        }),
      }
    );
    const percentRes = await massPriceRoute(percentReq);
    expect(percentRes.status).toBe(200);

    const percentData = await percentRes.json();
    expect(percentData.count).toBeGreaterThanOrEqual(2); // createdService + duplicatedService

    // Vérification en base : 110€ + 10% = 121€
    const updatedSrv = await db.service.findUnique({
      where: { id: createdServiceId },
    });
    expect(updatedSrv?.priceCents).toBe(12100);

    // Ajustement fixe de +4€ sur la catégorie
    const fixedReq = new Request(
      `http://localhost:3000/api/pro/services/mass-price?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: testCategoryId,
          deltaPercent: 0,
          deltaFixed: 4,
        }),
      }
    );
    const fixedRes = await massPriceRoute(fixedReq);
    expect(fixedRes.status).toBe(200);

    const updatedAgain = await db.service.findUnique({
      where: { id: createdServiceId },
    });
    expect(updatedAgain?.priceCents).toBe(12500); // 121€ + 4€ = 125€
  });

  it("7. DELETE /api/pro/services/[id] removes or deactivates the service", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/services/${duplicatedServiceId}?venueId=${venueId}`,
      { method: "DELETE" }
    );
    const res = await deleteServiceRoute(req, {
      params: Promise.resolve({ id: duplicatedServiceId }),
    });
    expect(res.status).toBe(200);

    const check = await db.service.findFirst({
      where: { id: duplicatedServiceId, isActive: true },
    });
    expect(check).toBeNull();
  });

  it("8. DELETE /api/pro/services/categories/[id] deletes the category", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/services/categories/${testCategoryId}?venueId=${venueId}`,
      { method: "DELETE" }
    );
    const res = await deleteCategoryRoute(req, {
      params: Promise.resolve({ id: testCategoryId }),
    });
    expect(res.status).toBe(200);

    const check = await db.serviceCategory.findUnique({
      where: { id: testCategoryId },
    });
    expect(check).toBeNull();
  });

  // ===========================================================================
  // 2. PARAMÈTRES ÉTABLISSEMENT & HORAIRES HEBDOMADAIRES
  // ===========================================================================

  it("9. GET /api/pro/settings/establishment retrieves legal data, address, and 7-day schedule", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/settings/establishment?venueId=${venueId}`
    );
    const res = await getEstablishmentRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.establishment).toBeDefined();
    expect(data.establishment.name).toBe("L’Atelier Botanique");
    expect(data.establishment.siret).toBeDefined();
    expect(data.establishment.vatNumber).toBeDefined();
    expect(data.establishment.cancellationDelayHours).toBe(24);
    expect(data.establishment.depositPercentage).toBe(30);

    expect(data.establishment.openingHours).toBeDefined();
    expect(data.establishment.openingHours.length).toBe(7);
  });

  it("10. PATCH /api/pro/settings/establishment updates legal coordinates, cancellation policy and opening hours", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/settings/establishment?venueId=${venueId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "L’Atelier Botanique Paris Marais",
          category: "Artisan Coiffeur Haute Coiffure",
          description: "Maison d'artisan rénovée au cœur du Marais.",
          siret: "849 201 942 00027",
          vatNumber: "FR 82 849201942",
          phone: "01 42 68 90 12",
          email: "contact.atelierbotanique@yopmail.com",
          address: "18 Rue de Turenne",
          postalCode: "75003",
          city: "Paris",
          cancellationDelayHours: 48,
          depositPercentage: 35,
          openingHours: [
            { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isOpen: false }, // Lundi
            { dayOfWeek: 2, openTime: "10:00", closeTime: "20:00", isOpen: true },  // Mardi
            { dayOfWeek: 3, openTime: "09:30", closeTime: "19:30", isOpen: true },  // Mercredi
            { dayOfWeek: 4, openTime: "09:30", closeTime: "20:30", isOpen: true },  // Jeudi
            { dayOfWeek: 5, openTime: "09:30", closeTime: "20:30", isOpen: true },  // Vendredi
            { dayOfWeek: 6, openTime: "09:00", closeTime: "19:00", isOpen: true },  // Samedi
            { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isOpen: false }, // Dimanche
          ],
        }),
      }
    );
    const res = await updateEstablishmentRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.establishment.name).toBe("L’Atelier Botanique Paris Marais");
    expect(data.establishment.cancellationDelayHours).toBe(48);
    expect(data.establishment.depositPercentage).toBe(35);

    // Rétablir les paramètres originaux pour l'isolation des tests
    await db.venue.update({
      where: { id: venueId },
      data: {
        name: "L’Atelier Botanique",
        email: "contact.atelierbotanique@yopmail.com",
        cancellationDelayHours: 24,
        depositPercentage: 30,
      },
    });
    await db.venueOpeningHour.updateMany({
      where: { venueId, dayOfWeek: 2 },
      data: { openTime: "09:30", closeTime: "19:30", isOpen: true },
    });
  });

  // ===========================================================================
  // 3. GESTION DE L'ÉQUIPE & PLANNINGS
  // ===========================================================================

  it("11. GET /api/pro/settings/team returns staff with planned weekly schedules", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/settings/team?venueId=${venueId}`
    );
    const res = await getTeamRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.team).toBeDefined();
    expect(Array.isArray(data.team)).toBe(true);
    expect(data.team.length).toBeGreaterThanOrEqual(1);

    const firstStaff = data.team[0];
    expect(firstStaff.name).toBeDefined();
    expect(firstStaff.role).toBeDefined();
    expect(firstStaff.schedules).toBeDefined();
    expect(firstStaff.schedules.length).toBe(7);
  });

  it("12. POST & PATCH /api/pro/settings/team manages staff creation and schedule configuration", async () => {
    // Création d'un collaborateur
    const createReq = new Request(
      `http://localhost:3000/api/pro/settings/team?venueId=${venueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Lucas Valette Sprint 10",
          role: "Artisan Coloriste Végétal",
          color: "#0284c7",
        }),
      }
    );
    const createRes = await createStaffRoute(createReq);
    expect(createRes.status).toBe(201);

    const createData = await createRes.json();
    expect(createData.staffMember.name).toBe("Lucas Valette Sprint 10");
    expect(createData.staffMember.schedules.length).toBe(7);
    createdStaffId = createData.staffMember.id;

    // Modification de ses horaires du mardi
    const patchReq = new Request(
      `http://localhost:3000/api/pro/settings/team/${createdStaffId}?venueId=${venueId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedules: [
            { dayOfWeek: 2, plannedStart: "10:30", plannedEnd: "18:30", isActive: true },
          ],
        }),
      }
    );
    const patchRes = await updateStaffRoute(patchReq, {
      params: Promise.resolve({ staffId: createdStaffId }),
    });
    expect(patchRes.status).toBe(200);

    const patchData = await patchRes.json();
    const mardiSchedule = patchData.staffMember.schedules.find(
      (s: { dayOfWeek: number }) => s.dayOfWeek === 2
    );
    expect(mardiSchedule.plannedStart).toBe("10:30");
    expect(mardiSchedule.plannedEnd).toBe("18:30");
  });

  // ===========================================================================
  // 4. CAISSE & NOTIFICATIONS
  // ===========================================================================

  it("13. GET & PATCH /api/pro/settings/cash-register updates payment preferences and ticket footer", async () => {
    const getReq = new Request(
      `http://localhost:3000/api/pro/settings/cash-register?venueId=${venueId}`
    );
    const getRes = await getCashRegisterRoute(getReq);
    expect(getRes.status).toBe(200);

    const getData = await getRes.json();
    expect(getData.settings.acceptCard).toBe(true);

    const patchReq = new Request(
      `http://localhost:3000/api/pro/settings/cash-register?venueId=${venueId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          acceptCard: true,
          acceptCash: true,
          acceptCheck: true,
          ticketFooter: "Belora - Merci pour ce moment d'exception.",
        }),
      }
    );
    const patchRes = await updateCashRegisterRoute(patchReq);
    expect(patchRes.status).toBe(200);

    const patchData = await patchRes.json();
    expect(patchData.settings.acceptCheck).toBe(true);
    expect(patchData.settings.ticketFooter).toBe(
      "Belora - Merci pour ce moment d'exception."
    );
  });

  it("14. GET & PATCH /api/pro/settings/notifications configures SMS reminder triggers and templates", async () => {
    const getReq = new Request(
      `http://localhost:3000/api/pro/settings/notifications?venueId=${venueId}`
    );
    const getRes = await getNotificationsRoute(getReq);
    expect(getRes.status).toBe(200);

    const getData = await getRes.json();
    expect(getData.settings.emailConfirmEnabled).toBe(true);

    const newTemplate =
      "Rappel Belora : {client_name}, nous vous attendons chez {venue_name} le {date} à {time}.";
    const patchReq = new Request(
      `http://localhost:3000/api/pro/settings/notifications?venueId=${venueId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailConfirmEnabled: true,
          sms24hEnabled: true,
          sms2hEnabled: true,
          smsTemplate: newTemplate,
        }),
      }
    );
    const patchRes = await updateNotificationsRoute(patchReq);
    expect(patchRes.status).toBe(200);

    const patchData = await patchRes.json();
    expect(patchData.settings.sms2hEnabled).toBe(true);
    expect(patchData.settings.smsTemplate).toBe(newTemplate);
  });
});
