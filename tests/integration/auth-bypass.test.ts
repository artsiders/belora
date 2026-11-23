import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { db } from "@/lib/db";
import { getAdminContext } from "@/modules/admin/admin.service";
import { getAccountUserContext } from "@/modules/account/account.service";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";

// Hors Vitest (dev / production), aucune identité ne doit être acceptée depuis l'URL ou les en-têtes.
describe("Sécurité - pas d'identité usurpable sans session", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuse ?adminEmail= et x-admin-key sur les API admin", async () => {
    const res = await getAdminContext(
      new Request("http://localhost:3000/api/admin/users?adminEmail=admin@yopmail.com", {
        headers: { "x-admin-key": "anything" },
      })
    );
    expect("error" in res && res.status).toBe(401);
  });

  it("refuse ?email= / ?userId= sur les API compte client", async () => {
    const res = await getAccountUserContext(
      new Request("http://localhost:3000/api/account/bookings?email=client@yopmail.com&userId=x")
    );
    expect("error" in res && res.status).toBe(401);
  });

  it("refuse ?venueId= / x-venue-id / cookie sur les API pro", async () => {
    const venue = await db.venue.findFirst({ select: { id: true } });
    const res = await getProVenueContext(
      new Request(`http://localhost:3000/api/pro/clients?venueId=${venue!.id}`, {
        headers: { "x-venue-id": venue!.id, cookie: `belora_active_venue_id=${venue!.id}` },
      })
    );
    expect("error" in res && res.status).toBe(401);
  });
});
