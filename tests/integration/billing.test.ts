import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { GET as getPlansRoute } from "@/app/api/plans/route";
import { POST as createPlanRoute } from "@/app/api/admin/plans/route";
import { DELETE as deletePlanRoute } from "@/app/api/admin/plans/[id]/route";
import { POST as createBookingRoute } from "@/app/api/bookings/route";
import { assertWithinPlanLimit, PlanLimitError } from "@/modules/billing/subscription.service";

const adminEmail = "admin@yopmail.com";
const testEmails = ["billing.new@test-belora.fr", "billing.direct@test-belora.fr"];

describe("Forfaits, limites et commission d'acquisition", () => {
  let venueId: string;
  let staffId: string;
  let serviceId: string;
  let createdPlanId: string | null = null;

  const cleanup = async () => {
    await db.bookingItem.deleteMany({ where: { booking: { clientEmail: { in: testEmails } } } });
    await db.booking.deleteMany({ where: { clientEmail: { in: testEmails } } });
    await db.customerCRM.deleteMany({ where: { email: { in: testEmails } } });
    await db.subscriptionPlan.deleteMany({ where: { slug: "test-forfait-integration" } });
  };

  beforeAll(async () => {
    await cleanup();
    const venue = await db.venue.findUniqueOrThrow({
      where: { slug: "atelier-botanique-paris" },
      include: { staff: { where: { isActive: true } }, services: { where: { isActive: true } } },
    });
    venueId = venue.id;
    staffId = venue.staff[0].id;
    serviceId = venue.services[0].id;
  });

  afterAll(cleanup);

  it("expose les forfaits publics et les règles de commission", async () => {
    const res = await getPlansRoute();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.plans.length).toBeGreaterThan(0);
    expect(body.commission.mode).toBeDefined();
  });

  it("permet à l'admin de créer puis supprimer un forfait", async () => {
    const res = await createPlanRoute(
      new Request(`http://localhost:3000/api/admin/plans?adminEmail=${adminEmail}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "test-forfait-integration",
          name: "Forfait test",
          description: null,
          monthlyPriceCents: 1000,
          annualPriceCents: 800,
          trialDays: 7,
          maxStaff: 1,
          maxResources: null,
          maxVenues: 1,
          commissionRate: 0.1,
          includesSmsReminders: true,
          includesAnalytics: false,
          includesPriorityListing: false,
          features: ["Test"],
          isHighlighted: false,
          highlightLabel: null,
          isContactSales: false,
          isPublic: false,
          isActive: true,
          order: 99,
        }),
      })
    );
    expect(res.status).toBe(201);
    createdPlanId = (await res.json()).plan.id;

    const del = await deletePlanRoute(
      new Request(`http://localhost:3000/api/admin/plans/${createdPlanId}?adminEmail=${adminEmail}`, { method: "DELETE" }),
      { params: Promise.resolve({ id: createdPlanId! }) }
    );
    expect(del.status).toBe(200);
  });

  it("bloque l'ajout d'un collaborateur au-delà de la limite du forfait", async () => {
    const sub = await db.venueSubscription.findUniqueOrThrow({ where: { venueId } });
    const original = { planId: sub.planId };
    const tinyPlan = await db.subscriptionPlan.create({
      data: { slug: "test-forfait-integration", name: "Mini", monthlyPriceCents: 0, annualPriceCents: 0, maxStaff: 1, features: [] },
    });
    try {
      await db.venueSubscription.update({ where: { venueId }, data: { planId: tinyPlan.id } });
      await expect(assertWithinPlanLimit(venueId, "staff")).rejects.toBeInstanceOf(PlanLimitError);
    } finally {
      await db.venueSubscription.update({ where: { venueId }, data: original });
      await db.subscriptionPlan.delete({ where: { id: tinyPlan.id } });
    }
  });

  const book = async (email: string, source: "marketplace" | "direct", dayOffset: number) => {
    const start = new Date();
    start.setDate(start.getDate() + dayOffset);
    start.setUTCHours(9, 0, 0, 0);
    const res = await createBookingRoute(
      new Request("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          serviceIds: [serviceId],
          staffId,
          startTime: start.toISOString(),
          clientName: "Client Facturation",
          clientPhone: `06${Math.floor(10000000 + Math.random() * 89999999)}`,
          clientEmail: email,
          source,
        }),
      })
    );
    expect(res.status).toBe(201);
    return db.booking.findUniqueOrThrow({ where: { id: (await res.json()).booking.id } });
  };

  it("commissionne un nouveau client marketplace, pas un habitué ni le lien direct", async () => {
    const setting = await db.platformSetting.findFirstOrThrow();
    const saved = { commissionMode: setting.commissionMode };
    await db.platformSetting.update({ where: { id: setting.id }, data: { commissionMode: "NEW_CLIENTS_ONLY" } });
    try {
      const first = await book(testEmails[0], "marketplace", 40);
      expect(first.isNewClient).toBe(true);
      expect(first.channel).toBe("MARKETPLACE");
      expect(first.commissionCents).toBeGreaterThan(0);

      const repeat = await book(testEmails[0], "marketplace", 41);
      expect(repeat.isNewClient).toBe(false);
      expect(repeat.commissionCents).toBe(0);

      const direct = await book(testEmails[1], "direct", 42);
      expect(direct.channel).toBe("DIRECT_LINK");
      expect(direct.commissionCents).toBe(0);
    } finally {
      await db.platformSetting.update({ where: { id: setting.id }, data: saved });
    }
  });
});
