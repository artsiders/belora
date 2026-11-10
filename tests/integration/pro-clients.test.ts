import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import {
  GET as getClientsRoute,
  POST as createClientRoute,
} from "@/app/api/pro/clients/route";
import {
  GET as getClientDetailsRoute,
  PATCH as updateClientRoute,
} from "@/app/api/pro/clients/[id]/route";

describe("Sprint 9 — Espace Pro : Fichier Clients CRM & Fiches Techniques", () => {
  let venueId: string;
  let createdClientId: string;

  const testPhone = "06 55 44 33 22";
  const testEmail = "charlotte.crm@belora.fr";

  const cleanupTestData = async () => {
    await db.customerCRM.deleteMany({
      where: {
        OR: [{ email: testEmail }, { phone: testPhone }],
      },
    });
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

  it("1. GET /api/pro/clients returns clients with segment counts and financial metrics", async () => {
    const req = new Request(`http://localhost:3000/api/pro/clients?venueId=${venueId}`);
    const res = await getClientsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clients).toBeDefined();
    expect(Array.isArray(data.clients)).toBe(true);
    expect(data.clients.length).toBeGreaterThan(0);

    expect(data.counts).toBeDefined();
    expect(data.counts.all).toBeGreaterThanOrEqual(10);
    expect(data.counts.vip).toBeGreaterThanOrEqual(1);

    expect(data.totals).toBeDefined();
    expect(data.totals.totalRevenue).toBeGreaterThanOrEqual(0);
  });

  it("2. GET /api/pro/clients?segment=vip filters strictly by VIP status", async () => {
    const req = new Request(`http://localhost:3000/api/pro/clients?venueId=${venueId}&segment=vip`);
    const res = await getClientsRoute(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.clients.length).toBeGreaterThan(0);
    for (const client of data.clients) {
      expect(client.isVip).toBe(true);
    }
  });

  it("3. POST /api/pro/clients creates a new client with technical diagnosis sheet", async () => {
    const payload = {
      venueId,
      firstName: "Charlotte",
      lastName: "Garnier",
      phone: testPhone,
      email: testEmail,
      isVip: true,
      notes: "Préfère les thés verts et rituels calmes.",
      techSheet: {
        hairType: "Cheveux fins, tendance cassants",
        naturalBase: "Châtain clair (hauteur de ton 6)",
        sensitivities: "Légère sensibilité à l'ammoniaque",
        lastFormulas: [],
      },
    };

    const req = new Request("http://localhost:3000/api/pro/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createClientRoute(req);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data.client).toBeDefined();
    expect(data.client.id).toBeDefined();
    expect(data.client.firstName).toBe("Charlotte");
    expect(data.client.isVip).toBe(true);
    expect(data.client.techSheet.hairType).toContain("Cheveux fins");

    createdClientId = data.client.id;
  });

  it("4. POST /api/pro/clients rejects duplicate phone number in the same venue", async () => {
    const payload = {
      venueId,
      firstName: "Doublon",
      lastName: "Test",
      phone: testPhone, // Même numéro que Charlotte
    };

    const req = new Request("http://localhost:3000/api/pro/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createClientRoute(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("numéro");
  });

  it("5. GET /api/pro/clients/[id] retrieves complete profile with past appointments history", async () => {
    const req = new Request(`http://localhost:3000/api/pro/clients/${createdClientId}?venueId=${venueId}`);
    const res = await getClientDetailsRoute(req, {
      params: Promise.resolve({ id: createdClientId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.client).toBeDefined();
    expect(data.client.id).toBe(createdClientId);
    expect(data.client.phone).toBe(testPhone);
    expect(Array.isArray(data.appointments)).toBe(true);
  });

  it("6. PATCH /api/pro/clients/[id] updates client notes and records confidential color formula", async () => {
    const updatePayload = {
      venueId,
      notes: "Notes mises à jour : cliente ravie du rituel végétal.",
      techSheet: {
        hairType: "Cheveux fins, texture souple",
        naturalBase: "Châtain clair 6",
        sensitivities: "Aucune sensibilité constatée",
        lastFormulas: [
          {
            date: "10/11/2026",
            service: "Balayage Minéral Argile",
            formula: "Argile blanche + Oxydant 20vol + Huile protectrice",
            leaveInTime: "40 min",
            colorist: "Hélène de Valois",
          },
        ],
      },
    };

    const req = new Request(`http://localhost:3000/api/pro/clients/${createdClientId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });

    const res = await updateClientRoute(req, {
      params: Promise.resolve({ id: createdClientId }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.client.notes).toContain("cliente ravie");
    expect(data.client.techSheet.lastFormulas.length).toBe(1);
    expect(data.client.techSheet.lastFormulas[0].formula).toContain("Argile blanche");

    // Vérification en base PostgreSQL
    const inDb = await db.customerCRM.findUnique({
      where: { id: createdClientId },
    });
    expect(inDb).toBeDefined();
    const dbFormulas = (inDb!.techFormulas as any)?.lastFormulas;
    expect(dbFormulas.length).toBe(1);
    expect(dbFormulas[0].colorist).toBe("Hélène de Valois");
  });
});
