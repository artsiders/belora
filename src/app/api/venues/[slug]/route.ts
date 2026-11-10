import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { VenueStatus } from "@prisma/client";

interface RouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Identifiant du salon manquant." },
        { status: 400 }
      );
    }

    const venue = await db.venue.findUnique({
      where: {
        slug: slug.toLowerCase().trim(),
        status: VenueStatus.PUBLISHED,
      },
      include: {
        openingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
        serviceCategories: {
          orderBy: { order: "asc" },
          include: {
            services: {
              where: { isActive: true },
              orderBy: { order: "asc" },
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
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            authorName: true,
            rating: true,
            comment: true,
            isVerified: true,
            reply: true,
            replyAt: true,
            createdAt: true,
          },
        },
        resources: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          },
        },
      },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Établissement introuvable." },
        { status: 404 }
      );
    }

    // Calcul de la note globale et distribution
    const reviewCount = venue.reviews.length;
    const averageRating =
      reviewCount > 0
        ? Number(
            (
              venue.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
            ).toFixed(1)
          )
        : 5.0;

    const allServices = venue.serviceCategories.flatMap((c) => c.services);
    const startingPriceCents =
      allServices.length > 0
        ? Math.min(...allServices.map((s) => s.priceCents))
        : 0;

    const formattedVenue = {
      id: venue.id,
      slug: venue.slug,
      name: venue.name,
      tagline: venue.tagline,
      description: venue.description,
      address: venue.address,
      city: venue.city,
      postalCode: venue.postalCode,
      countryCode: venue.countryCode,
      latitude: venue.latitude,
      longitude: venue.longitude,
      phone: venue.phone,
      email: venue.email,
      timezone: venue.timezone,
      rating: averageRating,
      reviewCount,
      startingPriceCents,
      categories: venue.serviceCategories,
      staff: venue.staff,
      resources: venue.resources,
      openingHours: venue.openingHours,
      reviews: venue.reviews,
      images: [
        "/images/venues/botanique-1.jpg",
        "/images/venues/botanique-2.jpg",
        "/images/venues/botanique-3.jpg",
      ],
    };

    const response = NextResponse.json(formattedVenue);
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
    console.error("GET /api/venues/[slug] error:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les détails de l'établissement." },
      { status: 500 }
    );
  }
}
