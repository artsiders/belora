import { NextResponse, connection } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    await connection();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
        ownedVenues: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
          },
          take: 1,
        },
        staffProfiles: {
          select: {
            id: true,
            venueId: true,
            role: true,
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    let venueId: string | null = null;
    let venueSlug: string | null = null;
    let venueName: string | null = null;
    let staffId: string | null = null;

    if (user.ownedVenues.length > 0) {
      venueId = user.ownedVenues[0].id;
      venueSlug = user.ownedVenues[0].slug;
      venueName = user.ownedVenues[0].name;
    } else if (user.staffProfiles.length > 0) {
      venueId = user.staffProfiles[0].venueId;
      venueSlug = user.staffProfiles[0].venue.slug;
      venueName = user.staffProfiles[0].venue.name;
      staffId = user.staffProfiles[0].id;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        image: user.image,
        venueId,
        venueSlug,
        venueName,
        staffId,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      (err as any).digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw err;
    }
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les informations de session" },
      { status: 500 }
    );
  }
}
