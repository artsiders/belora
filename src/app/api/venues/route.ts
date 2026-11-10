import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { VenueStatus } from "@prisma/client";

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  hair: ["coiffure", "coiffeur", "hair", "cheveu", "balayage", "coupe"],
  facial: ["visage", "soin", "facial", "kobido", "peau", "gua sha"],
  barber: ["barbier", "barbe", "barber", "rasage"],
  massage: ["massage", "spa", "corps", "relaxant", "huiles"],
  nails: ["ongle", "manucure", "nails", "pieds", "vernis", "semi-permanent"],
  wellness: ["bien-être", "wellness", "spa", "détente"],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const location = searchParams.get("location") || searchParams.get("city");
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const minRating = searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const conditions: any[] = [{ status: VenueStatus.PUBLISHED }];

    // 1. Filtre Géographique (Ville, Adresse, Code Postal)
    if (location && location.trim() !== "") {
      const loc = location.trim();
      conditions.push({
        OR: [
          { city: { contains: loc, mode: "insensitive" } },
          { address: { contains: loc, mode: "insensitive" } },
          { postalCode: { contains: loc, mode: "insensitive" } },
        ],
      });
    }

    // 2. Filtre Catégorie
    if (category && category.trim() !== "" && category !== "all") {
      const catKey = category.toLowerCase().trim();
      const keywords = CATEGORY_KEYWORDS[catKey] || [catKey];

      conditions.push({
        OR: [
          ...keywords.map((kw) => ({
            serviceCategories: {
              some: {
                name: { contains: kw, mode: "insensitive" },
              },
            },
          })),
          ...keywords.map((kw) => ({
            tagline: { contains: kw, mode: "insensitive" },
          })),
        ],
      });
    }

    // 3. Recherche textuelle libre (q)
    if (q && q.trim() !== "") {
      const query = q.trim();
      conditions.push({
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { tagline: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          {
            serviceCategories: {
              some: {
                services: {
                  some: {
                    name: { contains: query, mode: "insensitive" },
                  },
                },
              },
            },
          },
        ],
      });
    }

    const where = conditions.length === 1 ? conditions[0] : { AND: conditions };

    const [total, venues] = await Promise.all([
      db.venue.count({ where }),
      db.venue.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          openingHours: {
            orderBy: { dayOfWeek: "asc" },
          },
          serviceCategories: {
            include: {
              services: {
                where: { isActive: true },
                orderBy: { priceCents: "asc" },
              },
            },
          },
          staff: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              role: true,
              avatarUrl: true,
              color: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
    ]);

    // Formatage des salons avec calcul de note moyenne et prix d'appel
    const formattedVenues = venues.map((v) => {
      const reviewCount = v.reviews.length;
      const averageRating =
        reviewCount > 0
          ? Number(
              (
                v.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
              ).toFixed(1)
            )
          : 5.0;

      const allServices = v.serviceCategories.flatMap((c) => c.services);
      const startingPriceCents =
        allServices.length > 0
          ? Math.min(...allServices.map((s) => s.priceCents))
          : 0;

      const firstCatName = v.serviceCategories[0]?.name || "Beauté & Bien-être";
      const catLower = firstCatName.toLowerCase();
      let categorySlug = "hair";
      if (catLower.includes("visage") || catLower.includes("facial")) categorySlug = "facial";
      else if (catLower.includes("barb")) categorySlug = "barber";
      else if (catLower.includes("mass") || catLower.includes("spa")) categorySlug = "massage";
      else if (catLower.includes("ongl") || catLower.includes("manu") || catLower.includes("nail")) categorySlug = "nails";

      const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

      return {
        id: v.id,
        slug: v.slug,
        name: v.name,
        tagline: v.tagline || "",
        description: v.description || "",
        badge: "Artisan d'Exception",
        category: categorySlug,
        categoryLabel: firstCatName,
        address: v.address,
        city: v.city,
        district: v.postalCode ? `${v.city} ${v.postalCode.slice(0, 2)}e` : v.city,
        postalCode: v.postalCode,
        countryCode: v.countryCode,
        latitude: v.latitude,
        longitude: v.longitude,
        coordinates: { lat: v.latitude, lng: v.longitude },
        phone: v.phone || "",
        email: v.email || "",
        rating: averageRating.toFixed(1),
        reviewCount,
        startingPrice:
          startingPriceCents > 0
            ? `${Math.round(startingPriceCents / 100)} €`
            : "Sur devis",
        startingPriceCents,
        staffCount: v.staff.length,
        categories: v.serviceCategories.map((c) => c.name),
        image: "/images/venues/botanique-1.jpg",
        gallery: [
          "/images/venues/botanique-1.jpg",
          "/images/venues/botanique-2.jpg",
          "/images/venues/botanique-3.jpg",
        ],
        features: ["Produits Bio", "Artisan Certifié", "Réservation Immédiate"],
        openingHours: v.openingHours.map((oh) => ({
          day: days[oh.dayOfWeek] || "",
          hours: oh.isOpen ? `${oh.openTime} - ${oh.closeTime}` : "Fermé",
        })),
        team: v.staff.map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role,
          bio: "",
          avatar: s.avatarUrl || "/images/artisans/artisan-1.jpg",
        })),
        services: allServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.categoryId,
          durationMinutes: s.durationMinutes,
          priceEuros: Math.round(s.priceCents / 100),
          description: s.description || "",
        })),
      };
    });

    const filteredVenues = minRating
      ? formattedVenues.filter((v) => parseFloat(v.rating) >= minRating)
      : formattedVenues;

    const response = NextResponse.json({
      venues: filteredVenues,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("GET /api/venues error:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer la liste des établissements." },
      { status: 500 }
    );
  }
}
