import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, Role, VenueStatus, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

describe("Database & Prisma Seed Integration Tests", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("has the 3 core accounts with correct roles and valid bcrypt password hashes", async () => {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@belora.com" },
    });
    expect(admin).not.toBeNull();
    expect(admin?.role).toBe(Role.ADMIN);
    expect(await bcrypt.compare("BeloraAdmin2026!", admin!.passwordHash!)).toBe(true);

    const pro = await prisma.user.findUnique({
      where: { email: "pro@atelierbotanique.fr" },
    });
    expect(pro).not.toBeNull();
    expect(pro?.role).toBe(Role.PRO);
    expect(await bcrypt.compare("AtelierPro2026!", pro!.passwordHash!)).toBe(true);

    const client = await prisma.user.findUnique({
      where: { email: "client@belora.com" },
    });
    expect(client).not.toBeNull();
    expect(client?.role).toBe(Role.CUSTOMER);
    expect(await bcrypt.compare("ClientBelora2026!", client!.passwordHash!)).toBe(true);
  });

  it("contains L'Atelier Botanique with valid geo, opening hours, and active owner", async () => {
    const venue = await prisma.venue.findUnique({
      where: { slug: "atelier-botanique-paris" },
      include: {
        owner: true,
        openingHours: true,
      },
    });

    expect(venue).not.toBeNull();
    expect(venue?.status).toBe(VenueStatus.PUBLISHED);
    expect(venue?.city).toBe("Paris");
    expect(venue?.postalCode).toBe("75003");
    expect(venue?.latitude).toBeCloseTo(48.8566, 2);
    expect(venue?.longitude).toBeCloseTo(2.3622, 2);
    expect(venue?.commissionRate).toBe(0.018);
    expect(venue?.owner.email).toBe("pro@atelierbotanique.fr");

    // Doit contenir 7 jours d'horaires
    expect(venue?.openingHours.length).toBe(7);
    const sunday = venue?.openingHours.find((h) => h.dayOfWeek === 0);
    const monday = venue?.openingHours.find((h) => h.dayOfWeek === 1);
    const saturday = venue?.openingHours.find((h) => h.dayOfWeek === 6);

    expect(sunday?.isOpen).toBe(false);
    expect(monday?.isOpen).toBe(false);
    expect(saturday?.isOpen).toBe(true);
    expect(saturday?.openTime).toBe("09:00");
    expect(saturday?.closeTime).toBe("19:00");
  });

  it("contains 4 active staff members with weekly schedules and clock-in records", async () => {
    const staff = await prisma.staffMember.findMany({
      where: { venue: { slug: "atelier-botanique-paris" } },
      include: {
        schedules: true,
        clockIns: true,
      },
    });

    expect(staff.length).toBe(4);
    const names = staff.map((s) => s.name);
    expect(names).toContain("Hélène de Valois");
    expect(names).toContain("Clément Roux");
    expect(names).toContain("Élodie Martin");
    expect(names).toContain("Thomas Mercier");

    // Vérifier les plannings
    for (const member of staff) {
      expect(member.isActive).toBe(true);
      expect(member.schedules.length).toBeGreaterThanOrEqual(5); // Mardi à Samedi
    }

    // Hélène doit avoir pointé aujourd'hui
    const helene = staff.find((s) => s.name === "Hélène de Valois");
    expect(helene?.clockIns.length).toBeGreaterThanOrEqual(1);
  });

  it("contains 3 service categories and 8 bespoke ritual services with proper cents pricing", async () => {
    const categories = await prisma.serviceCategory.findMany({
      where: { venue: { slug: "atelier-botanique-paris" } },
      include: {
        services: true,
      },
      orderBy: { order: "asc" },
    });

    expect(categories.length).toBe(3);
    const allServices = categories.flatMap((c) => c.services);
    expect(allServices.length).toBe(8);

    for (const srv of allServices) {
      expect(srv.priceCents).toBeGreaterThan(0);
      expect(srv.durationMinutes).toBeGreaterThan(0);
      expect(srv.depositRequired).toBe(true);
      expect(srv.depositCents).toBeGreaterThan(0);
      expect(srv.depositCents).toBeLessThan(srv.priceCents);
      expect(srv.isActive).toBe(true);
    }

    // Vérifier le temps de pose sur la coloration
    const coloration = allServices.find((s) => s.name.includes("Coloration Végétale"));
    expect(coloration).toBeDefined();
    expect(coloration?.processingTimeMinutes).toBe(30);
    expect(coloration?.priceCents).toBe(9500); // 95.00 €
    expect(coloration?.depositCents).toBe(3000); // 30.00 €
  });

  it("contains 10 CRM customer profiles with JSON tech sheets and VIP flags", async () => {
    const customers = await prisma.customerCRM.findMany({
      where: { venue: { slug: "atelier-botanique-paris" } },
    });

    expect(customers.length).toBe(10);

    const claire = customers.find((c) => c.firstName === "Claire" && c.lastName === "Dumont");
    expect(claire).toBeDefined();
    expect(claire?.isVip).toBe(true);
    expect(claire?.totalVisits).toBe(8);
    expect(claire?.totalSpentCents).toBe(76000);
    expect(claire?.techFormulas).toBeDefined();

    // Vérifier la structure JSON de la formule de coloration
    const formulas = claire?.techFormulas as any;
    expect(formulas.naturalBase).toContain("Châtain clair");
    expect(formulas.lastFormulas[0].formula).toContain("Henné du Rajasthan");
  });

  it("contains confirmed bookings with relational item links to staff, services and resources", async () => {
    const bookings = await prisma.booking.findMany({
      where: { venue: { slug: "atelier-botanique-paris" } },
      include: {
        items: {
          include: {
            service: true,
            staff: true,
            resource: true,
          },
        },
        saleTickets: true,
        review: true,
      },
    });

    expect(bookings.length).toBeGreaterThanOrEqual(4);

    const completedBooking = bookings.find((b) => b.reference === "#BEL-8492");
    expect(completedBooking).toBeDefined();
    expect(completedBooking?.status).toBe(BookingStatus.COMPLETED);
    expect(completedBooking?.totalPriceCents).toBe(9500);
    expect(completedBooking?.depositCents).toBe(3000);
    expect(completedBooking?.remainingCents).toBe(6500);

    expect(completedBooking?.items.length).toBe(1);
    expect(completedBooking?.items[0].staff.name).toBe("Hélène de Valois");
    expect(completedBooking?.items[0].service.name).toContain("Coloration");
    expect(completedBooking?.items[0].resource?.name).toContain("Monoï");

    // Ticket de caisse associé
    expect(completedBooking?.saleTickets.length).toBe(1);
    expect(completedBooking?.saleTickets[0].ticketNumber).toBe("TK-2026-0042");
    expect(completedBooking?.saleTickets[0].cardAmountCents).toBe(6500);
    expect(completedBooking?.saleTickets[0].depositDeductedCents).toBe(3000);

    // Avis vérifié associé
    expect(completedBooking?.review).toBeDefined();
    expect(completedBooking?.review?.rating).toBe(5);
    expect(completedBooking?.review?.isVerified).toBe(true);
    expect(completedBooking?.review?.reply).toContain("chère Claire");
  });

  it("platform settings are initialized with standard 1.8% commission", async () => {
    const settings = await prisma.platformSetting.findFirst();
    expect(settings).not.toBeNull();
    expect(settings?.defaultCommissionRate).toBe(0.018);
    expect(settings?.maintenanceMode).toBe(false);
  });
});
