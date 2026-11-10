import { describe, it, expect } from "vitest";
import { createBookingSchema, cancelBookingSchema } from "../../src/lib/validations/booking.schema";
import { createServiceSchema } from "../../src/lib/validations/service.schema";
import { clientCrmSchema } from "../../src/lib/validations/client.schema";
import { updateVenueProfileSchema, openingHourDaySchema } from "../../src/lib/validations/venue.schema";

describe("Sprint 2 — Schémas de Validation Zod Partagés", () => {
  describe("Booking Validation (createBookingSchema)", () => {
    it("validates a compliant booking payload with ISO 8601 UTC date", () => {
      const validPayload = {
        venueId: "venue-123",
        serviceIds: ["srv-1", "srv-2"],
        staffId: "staff-456",
        startTime: "2026-11-15T14:30:00.000Z",
        clientName: "Camille Dupont",
        clientPhone: "06 12 34 56 78",
        clientEmail: "camille@exemple.com",
        notes: "Rituel cheveux bouclés",
      };

      const result = createBookingSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects an empty service list", () => {
      const invalidPayload = {
        venueId: "venue-123",
        serviceIds: [],
        startTime: "2026-11-15T14:30:00.000Z",
        clientName: "Camille Dupont",
        clientPhone: "06 12 34 56 78",
      };

      const result = createBookingSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("au moins une prestation");
      }
    });

    it("rejects invalid non-ISO date string", () => {
      const invalidPayload = {
        venueId: "venue-123",
        serviceIds: ["srv-1"],
        startTime: "15/11/2026 14:30",
        clientName: "Camille Dupont",
        clientPhone: "06 12 34 56 78",
      };

      const result = createBookingSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates cancelBookingSchema with optional reason", () => {
      expect(cancelBookingSchema.safeParse({ bookingId: "b-1" }).success).toBe(true);
      expect(cancelBookingSchema.safeParse({ bookingId: "b-1", reason: "Imprévu familial" }).success).toBe(true);
      expect(cancelBookingSchema.safeParse({ bookingId: "" }).success).toBe(false);
    });
  });

  describe("Service Validation (createServiceSchema)", () => {
    it("validates ritual service with valid prices in minor cents", () => {
      const validService = {
        name: "Soin Shirodhara 60min",
        categoryId: "cat-1",
        description: "Rituel ayurvédique",
        durationMinutes: 60,
        processingTimeMinutes: 15,
        priceCents: 8500, // 85.00 €
        depositRequired: true,
        depositCents: 2500, // 25.00 €
      };

      const result = createServiceSchema.safeParse(validService);
      expect(result.success).toBe(true);
    });

    it("rejects a deposit higher than the service total price", () => {
      const invalidService = {
        name: "Coupe Express",
        categoryId: "cat-1",
        durationMinutes: 30,
        priceCents: 3500, // 35.00 €
        depositRequired: true,
        depositCents: 5000, // 50.00 € > 35.00 € -> INVALID
      };

      const result = createServiceSchema.safeParse(invalidService);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("ne peut pas excéder le tarif total");
      }
    });

    it("rejects negative durations or durations under 5 minutes", () => {
      const invalidService = {
        name: "Test",
        categoryId: "cat-1",
        durationMinutes: 2,
        priceCents: 2000,
      };

      const result = createServiceSchema.safeParse(invalidService);
      expect(result.success).toBe(false);
    });
  });

  describe("CRM Client Validation (clientCrmSchema)", () => {
    it("validates a complete client profile with techSheet formulas", () => {
      const validClient = {
        firstName: "Claire",
        lastName: "Dumont",
        phone: "06 20 40 60 80",
        email: "claire@gmail.com",
        isVip: true,
        notes: "Thé vert sans sucre",
        techFormulas: {
          hairType: "Ondulé",
          naturalBase: "Base 5",
          sensitivities: "Sulfates",
          lastFormulas: [
            {
              date: "2026-10-14",
              service: "Coloration Végétale",
              formula: "Henné Rajasthan 60g + Garance 20g",
              leaveInTime: "40 min",
            },
          ],
        },
      };

      const result = clientCrmSchema.safeParse(validClient);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email format", () => {
      const invalidClient = {
        firstName: "Claire",
        lastName: "Dumont",
        phone: "06 20 40 60 80",
        email: "not-an-email",
      };

      const result = clientCrmSchema.safeParse(invalidClient);
      expect(result.success).toBe(false);
    });
  });

  describe("Venue Validation (openingHourDaySchema & updateVenueProfileSchema)", () => {
    it("validates valid opening hours (openTime < closeTime)", () => {
      const validDay = {
        dayOfWeek: 2, // Mardi
        openTime: "09:30",
        closeTime: "19:30",
        isOpen: true,
      };

      expect(openingHourDaySchema.safeParse(validDay).success).toBe(true);
    });

    it("rejects when closeTime is earlier than openTime", () => {
      const invalidDay = {
        dayOfWeek: 2,
        openTime: "19:30",
        closeTime: "09:30",
        isOpen: true,
      };

      const result = openingHourDaySchema.safeParse(invalidDay);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("doit précéder l'heure de fermeture");
      }
    });

    it("validates venue profile update schema", () => {
      const validProfile = {
        name: "L'Atelier Botanique",
        address: "18 Rue de Turenne",
        city: "Paris",
        postalCode: "75003",
        countryCode: "FR",
      };

      expect(updateVenueProfileSchema.safeParse(validProfile).success).toBe(true);
    });
  });
});
