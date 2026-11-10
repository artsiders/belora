import { describe, it, expect } from "vitest";
import { GET as getVenues } from "@/app/api/venues/route";
import { GET as getVenueBySlug } from "@/app/api/venues/[slug]/route";
import { GET as getCategories } from "@/app/api/categories/route";

describe("Sprint 4 - Marketplace Venues & Categories API Integration Tests", () => {
  it("GET /api/venues returns published venues with proper formatting", async () => {
    const req = new Request("http://localhost:3000/api/venues");
    const res = await getVenues(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("venues");
    expect(data).toHaveProperty("pagination");
    expect(Array.isArray(data.venues)).toBe(true);
    expect(data.venues.length).toBeGreaterThan(0);

    const venue = data.venues[0];
    expect(venue).toHaveProperty("id");
    expect(venue).toHaveProperty("slug");
    expect(venue).toHaveProperty("name");
    expect(venue).toHaveProperty("city");
    expect(venue).toHaveProperty("coordinates");
    expect(venue.coordinates).toHaveProperty("lat");
    expect(venue.coordinates).toHaveProperty("lng");
    expect(venue).toHaveProperty("rating");
    expect(venue).toHaveProperty("reviewCount");
    expect(venue).toHaveProperty("startingPrice");
    expect(venue).toHaveProperty("team");
    expect(venue).toHaveProperty("services");
  });

  it("GET /api/venues filters venues by location/city", async () => {
    const req = new Request("http://localhost:3000/api/venues?location=Paris");
    const res = await getVenues(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.venues.length).toBeGreaterThan(0);
    expect(data.venues.every((v: any) => v.city.toLowerCase().includes("paris"))).toBe(true);
  });

  it("GET /api/venues filters venues by text search query (q)", async () => {
    const req = new Request("http://localhost:3000/api/venues?q=Botanique");
    const res = await getVenues(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.venues.length).toBeGreaterThan(0);
    expect(data.venues[0].slug).toBe("atelier-botanique-paris");
  });

  it("GET /api/venues/[slug] returns full details for an existing venue", async () => {
    const req = new Request("http://localhost:3000/api/venues/atelier-botanique-paris");
    const res = await getVenueBySlug(req, {
      params: Promise.resolve({ slug: "atelier-botanique-paris" }),
    });
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.slug).toBe("atelier-botanique-paris");
    expect(data.name).toBe("L’Atelier Botanique");
    expect(data).toHaveProperty("openingHours");
    expect(data.openingHours.length).toBe(7);
    expect(data).toHaveProperty("categories");
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data).toHaveProperty("staff");
    expect(data.staff.length).toBeGreaterThan(0);
    expect(data).toHaveProperty("reviews");
  });

  it("GET /api/venues/[slug] returns 404 for a non-existent slug", async () => {
    const req = new Request("http://localhost:3000/api/venues/salon-inconnu-xyz-404");
    const res = await getVenueBySlug(req, {
      params: Promise.resolve({ slug: "salon-inconnu-xyz-404" }),
    });
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toBe("Établissement introuvable.");
  });

  it("GET /api/categories returns standard categories with descriptions", async () => {
    const res = await getCategories();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty("categories");
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThanOrEqual(5);

    const slugs = data.categories.map((c: any) => c.slug);
    expect(slugs).toContain("hair");
    expect(slugs).toContain("facial");
    expect(slugs).toContain("barber");
  });
});
