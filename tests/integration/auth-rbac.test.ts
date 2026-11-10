import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authConfig } from "../../src/auth.config";
import { POST as registerPost } from "../../src/app/api/auth/register/route";
import { POST as registerProPost } from "../../src/app/api/auth/register-pro/route";

describe("Sprint 1 — Authentification NextAuth v5 & Sécurité RBAC", () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    // Nettoyage des comptes de test créés pendant les tests
    await prisma.venueOpeningHour.deleteMany({
      where: { venue: { slug: { startsWith: "salon-test-rbac" } } },
    });
    await prisma.staffSchedule.deleteMany({
      where: { staff: { venue: { slug: { startsWith: "salon-test-rbac" } } } },
    });
    await prisma.staffMember.deleteMany({
      where: { venue: { slug: { startsWith: "salon-test-rbac" } } },
    });
    await prisma.venue.deleteMany({
      where: { slug: { startsWith: "salon-test-rbac" } },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            "test.client.sprint1@belora.com",
            "test.pro.sprint1@belora.com",
            "duplicate.test@belora.com",
          ],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe("API POST /api/auth/register (Client)", () => {
    it("creates a new customer account with hashed password and CUSTOMER role", async () => {
      const email = "test.client.sprint1@belora.com";

      const req = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName: "Jean",
          lastName: "Valjean",
          phone: "06 00 11 22 33",
        }),
      });

      const res = await registerPost(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.email).toBe(email);
      expect(json.user.role).toBe(Role.CUSTOMER);

      // Vérification en base de données
      const inDb = await prisma.user.findUnique({ where: { email } });
      expect(inDb).not.toBeNull();
      expect(inDb?.role).toBe(Role.CUSTOMER);
      expect(await bcrypt.compare("Password123!", inDb!.passwordHash!)).toBe(true);
    });

    it("rejects weak password without numbers or uppercase", async () => {
      const req = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "weak.pass@belora.com",
          password: "lowercaseonly",
          firstName: "Test",
          lastName: "Weak",
        }),
      });

      const res = await registerPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it("rejects duplicate email with 409 Conflict", async () => {
      // Inscription préalable
      const email = "duplicate.test@belora.com";
      await prisma.user.create({
        data: {
          email,
          passwordHash: "hash123",
          firstName: "Duplicate",
          lastName: "Test",
          role: Role.CUSTOMER,
        },
      });

      const req = new Request("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "Password123!",
          firstName: "New",
          lastName: "Person",
        }),
      });

      const res = await registerPost(req);
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error).toContain("Un compte existe déjà");
    });
  });

  describe("API POST /api/auth/register-pro (Professionnel)", () => {
    it("creates a Pro user, Venue, OpeningHours and Staff in an atomic transaction", async () => {
      const email = "test.pro.sprint1@belora.com";

      const req = new Request("http://localhost:3000/api/auth/register-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "ProPassword2026!",
          firstName: "Claire",
          lastName: "Artisane",
          phone: "06 44 33 22 11",
          venueName: "Salon Test RBAC Paris",
          venueAddress: "10 Boulevard Voltaire",
          venueCity: "Paris",
          venuePostalCode: "75011",
        }),
      });

      const res = await registerProPost(req);
      expect(res.status).toBe(201);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.user.role).toBe(Role.PRO);
      expect(json.user.venueId).toBeDefined();
      expect(json.user.venueSlug).toContain("salon-test-rbac-paris");

      // Vérification en base de données
      const venue = await prisma.venue.findUnique({
        where: { id: json.user.venueId },
        include: {
          owner: true,
          openingHours: true,
          staff: true,
        },
      });

      expect(venue).not.toBeNull();
      expect(venue?.owner.email).toBe(email);
      expect(venue?.openingHours.length).toBe(7);
      expect(venue?.staff.length).toBe(1);
      expect(venue?.staff[0].name).toBe("Claire Artisane");
    });
  });

  describe("Contrôle d'accès par rôles (RBAC) & Middleware", () => {
    const authorized = authConfig.callbacks?.authorized;

    it("requires authentication for /account/* routes", async () => {
      if (!authorized) throw new Error("authorized callback not found");

      // Non connecté
      const denied = await (authorized as any)({
        auth: null,
        request: { nextUrl: { pathname: "/account/bookings" } },
      });
      expect(denied).toBe(false);

      // Connecté
      const allowed = await (authorized as any)({
        auth: { user: { role: "CUSTOMER" } },
        request: { nextUrl: { pathname: "/account/bookings" } },
      });
      expect(allowed).toBe(true);
    });

    it("protects /pro/* routes: denies CUSTOMER, allows PRO and ADMIN", async () => {
      if (!authorized) throw new Error("authorized callback not found");

      // Non connecté sur /pro/agenda
      const unauth = await (authorized as any)({
        auth: null,
        request: { nextUrl: { pathname: "/pro/agenda" } },
      });
      expect(unauth).toBe(false);

      // Client connecté tentant d'accéder à l'agenda pro
      const customerDenied = await (authorized as any)({
        auth: { user: { role: "CUSTOMER" } },
        request: { nextUrl: { pathname: "/pro/agenda" } },
      });
      expect(customerDenied).toBe(false);

      // Pro connecté
      const proAllowed = await (authorized as any)({
        auth: { user: { role: "PRO" } },
        request: { nextUrl: { pathname: "/pro/agenda" } },
      });
      expect(proAllowed).toBe(true);

      // Admin connecté
      const adminAllowed = await (authorized as any)({
        auth: { user: { role: "ADMIN" } },
        request: { nextUrl: { pathname: "/pro/checkout" } },
      });
      expect(adminAllowed).toBe(true);
    });

    it("protects /admin/* routes: allows strictly ADMIN", async () => {
      if (!authorized) throw new Error("authorized callback not found");

      // Client sur /admin
      const client = await (authorized as any)({
        auth: { user: { role: "CUSTOMER" } },
        request: { nextUrl: { pathname: "/admin/analytics" } },
      });
      expect(client).toBe(false);

      // Pro sur /admin
      const pro = await (authorized as any)({
        auth: { user: { role: "PRO" } },
        request: { nextUrl: { pathname: "/admin/analytics" } },
      });
      expect(pro).toBe(false);

      // Admin sur /admin
      const admin = await (authorized as any)({
        auth: { user: { role: "ADMIN" } },
        request: { nextUrl: { pathname: "/admin/analytics" } },
      });
      expect(admin).toBe(true);
    });

    it("leaves public pages freely accessible to everyone", async () => {
      if (!authorized) throw new Error("authorized callback not found");

      const publicPaths = ["/", "/search", "/venue/atelier-botanique", "/login", "/pro", "/pro/join"];

      for (const pathname of publicPaths) {
        const result = await (authorized as any)({
          auth: null,
          request: { nextUrl: { pathname } },
        });
        expect(result).toBe(true);
      }
    });
  });
});
