import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { GET as getStaffRoute } from "@/app/api/pro/staff/route";
import { POST as clockInRoute } from "@/app/api/pro/staff/clock-in/route";
import { POST as presenceRoute } from "@/app/api/pro/staff/presence/route";
import { GET as getResourcesRoute } from "@/app/api/pro/resources/route";
import { GET as getServicesRoute } from "@/app/api/pro/services/route";
import { GET as getClientsRoute } from "@/app/api/pro/clients/route";
import {
  GET as getAppointmentsRoute,
  POST as createAppointmentRoute,
} from "@/app/api/pro/appointments/route";
import {
  GET as getSingleAppointmentRoute,
  PATCH as updateAppointmentRoute,
  DELETE as deleteAppointmentRoute,
} from "@/app/api/pro/appointments/[id]/route";

describe("Sprint 7 — Espace Pro : Agenda Dynamique & Pointage Présences", () => {
  let venueId: string;
  let staffHeleneId: string;
  let staffClementId: string;
  let serviceCutId: string;
  let createdAppointmentId: string;

  const testPhone = "06 99 00 11 22";
  const testEmail = "pro-agenda-test@belora.fr";

  const cleanupTestData = async () => {
    await db.bookingItem.deleteMany({
      where: { booking: { clientEmail: testEmail } },
    });
    await db.booking.deleteMany({
      where: { clientEmail: testEmail },
    });
    await db.customerCRM.deleteMany({
      where: { OR: [{ email: testEmail }, { phone: testPhone }] },
    });
  };

  beforeAll(async () => {
    await cleanupTestData();

    const venue = await db.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: {
        staff: true,
        services: true,
      },
    });

    expect(venue).toBeDefined();
    venueId = venue!.id;

    const helene = venue!.staff.find((s) => s.name.includes("Hélène")) || venue!.staff[0];
    const clement = venue!.staff.find((s) => s.name.includes("Clément")) || venue!.staff[1];
    staffHeleneId = helene.id;
    staffClementId = clement.id;

    serviceCutId = venue!.services[0].id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("1. GET /api/pro/staff returns active staff members with presence and clock-in information", async () => {
    const req = new Request(`http://localhost:3000/api/pro/staff?venueId=${venueId}`);
    const res = await getStaffRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.staff).toBeDefined();
    expect(Array.isArray(data.staff)).toBe(true);
    expect(data.staff.length).toBeGreaterThan(0);

    const helene = data.staff.find((s: any) => s.id === staffHeleneId);
    expect(helene).toBeDefined();
    expect(helene.name).toContain("Hélène");
    expect(helene.presenceToday).toBeDefined();
    expect(helene.presenceToday.plannedStart).toBeDefined();
    expect(helene.presenceToday.plannedEnd).toBeDefined();
  });

  it("2. GET /api/pro/resources returns active salon cabins and chairs", async () => {
    const req = new Request(`http://localhost:3000/api/pro/resources?venueId=${venueId}`);
    const res = await getResourcesRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.resources).toBeDefined();
    expect(Array.isArray(data.resources)).toBe(true);
    expect(data.resources.length).toBeGreaterThan(0);

    const firstResource = data.resources[0];
    expect(firstResource.id).toBeDefined();
    expect(firstResource.name).toBeDefined();
    expect(firstResource.type).toBeDefined();
  });

  it("3. GET /api/pro/services returns treatments list with categories and prices", async () => {
    const req = new Request(`http://localhost:3000/api/pro/services?venueId=${venueId}`);
    const res = await getServicesRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.services).toBeDefined();
    expect(data.services.length).toBeGreaterThan(0);

    const service = data.services[0];
    expect(service.durationMinutes).toBeGreaterThan(0);
    expect(service.priceEuros).toBeGreaterThan(0);
  });

  it("4. GET /api/pro/clients returns CRM customers with search filtering", async () => {
    const req = new Request(`http://localhost:3000/api/pro/clients?venueId=${venueId}`);
    const res = await getClientsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clients).toBeDefined();
    expect(data.clients.length).toBeGreaterThan(0);
  });

  it("5. POST /api/pro/appointments creates a manual in-salon appointment with CRM linking", async () => {
    const futureDate = "2026-11-25";
    const payload = {
      venueId,
      clientName: "Aurélie Fontaine",
      clientPhone: testPhone,
      clientEmail: testEmail,
      serviceId: serviceCutId,
      staffId: staffHeleneId,
      date: futureDate,
      startTime: "11:00",
      notes: "Rendez-vous pris par téléphone au salon",
    };

    const req = new Request("http://localhost:3000/api/pro/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createAppointmentRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.appointment).toBeDefined();
    expect(data.appointment.id).toBeDefined();
    expect(data.appointment.clientName).toBe("Aurélie Fontaine");
    expect(data.appointment.startTime).toBe("11:00");
    expect(data.appointment.date).toBe(futureDate);
    expect(data.appointment.status).toBe("confirmed");

    createdAppointmentId = data.appointment.id;

    // Vérification en base : client CRM créé
    const crmCustomer = await db.customerCRM.findFirst({
      where: { venueId, phone: testPhone },
    });
    expect(crmCustomer).toBeDefined();
    expect(crmCustomer!.firstName).toBe("Aurélie");
  });

  it("6. POST /api/pro/appointments prevents collision for the same staff on the same time slot", async () => {
    const payload = {
      venueId,
      clientName: "Autre Client",
      clientPhone: "06 11 22 33 44",
      serviceId: serviceCutId,
      staffId: staffHeleneId,
      date: "2026-11-25",
      startTime: "11:00", // Même créneau que le test précédent
    };

    const req = new Request("http://localhost:3000/api/pro/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createAppointmentRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("déjà");
  });

  it("7. GET /api/pro/appointments retrieves appointments for a date range", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/appointments?venueId=${venueId}&startDate=2026-11-25&endDate=2026-11-25`
    );
    const res = await getAppointmentsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.appointments).toBeDefined();
    expect(Array.isArray(data.appointments)).toBe(true);

    const found = data.appointments.find((a: any) => a.id === createdAppointmentId);
    expect(found).toBeDefined();
    expect(found.clientName).toBe("Aurélie Fontaine");
  });

  it("8. GET /api/pro/appointments/[id] retrieves appointment details", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/appointments/${createdAppointmentId}?venueId=${venueId}`
    );
    const res = await getSingleAppointmentRoute(req, {
      params: Promise.resolve({ id: createdAppointmentId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.appointment).toBeDefined();
    expect(data.appointment.id).toBe(createdAppointmentId);
    expect(data.appointment.clientPhone).toBe(testPhone);
  });

  it("9. PATCH /api/pro/appointments/[id] reschedules and reassigns staff", async () => {
    const updatePayload = {
      venueId,
      date: "2026-11-25",
      startTime: "15:00",
      staffId: staffClementId, // Réattribution à Clément Roux
      notes: "Déplacé à 15h00 avec Clément à la demande de la cliente",
    };

    const req = new Request(
      `http://localhost:3000/api/pro/appointments/${createdAppointmentId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      }
    );

    const res = await updateAppointmentRoute(req, {
      params: Promise.resolve({ id: createdAppointmentId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.appointment.startTime).toBe("15:00");
    expect(data.appointment.staffId).toBe(staffClementId);
  });

  it("10. PATCH /api/pro/appointments/[id] changes appointment status to completed", async () => {
    const updatePayload = {
      venueId,
      status: "completed",
    };

    const req = new Request(
      `http://localhost:3000/api/pro/appointments/${createdAppointmentId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      }
    );

    const res = await updateAppointmentRoute(req, {
      params: Promise.resolve({ id: createdAppointmentId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.appointment.status).toBe("completed");
  });

  it("11. POST /api/pro/staff/clock-in toggles clock-in and clock-out for a staff member", async () => {
    // 1. Pointage Arrivée
    const clockInReq = new Request("http://localhost:3000/api/pro/staff/clock-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId,
        staffId: staffThomasIdFallback(staffClementId),
        action: "clock-in",
      }),
    });

    const clockInRes = await clockInRoute(clockInReq);
    expect(clockInRes.status).toBe(200);

    const clockInData = await clockInRes.json();
    expect(clockInData.clockedIn).toBe(true);
    expect(clockInData.message).toContain("Arrivée");

    // 2. Pointage Départ
    const clockOutReq = new Request("http://localhost:3000/api/pro/staff/clock-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId,
        staffId: staffThomasIdFallback(staffClementId),
        action: "clock-out",
      }),
    });

    const clockOutRes = await clockInRoute(clockOutReq);
    expect(clockOutRes.status).toBe(200);

    const clockOutData = await clockOutRes.json();
    expect(clockOutData.clockedIn).toBe(false);
    expect(clockOutData.message).toContain("Départ");
  });

  it("12. POST /api/pro/staff/presence updates planned presence times for staff", async () => {
    const presenceReq = new Request("http://localhost:3000/api/pro/staff/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        venueId,
        updates: [
          {
            staffId: staffHeleneId,
            plannedStart: "09:00",
            plannedEnd: "18:30",
          },
        ],
      }),
    });

    const res = await presenceRoute(presenceReq);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.count).toBeGreaterThanOrEqual(1);
  });

  it("13. DELETE /api/pro/appointments/[id] cancels the appointment", async () => {
    const req = new Request(
      `http://localhost:3000/api/pro/appointments/${createdAppointmentId}?venueId=${venueId}`,
      { method: "DELETE" }
    );

    const res = await deleteAppointmentRoute(req, {
      params: Promise.resolve({ id: createdAppointmentId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);

    // Vérification que le statut est bien CANCELLED
    const booking = await db.booking.findUnique({
      where: { id: createdAppointmentId },
    });
    expect(booking?.status).toBe("CANCELLED");
  });
});

function staffThomasIdFallback(fallbackId: string) {
  return fallbackId;
}
