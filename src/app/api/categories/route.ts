import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.serviceCategory.findMany({
      distinct: ["name"],
      select: {
        id: true,
        name: true,
        _count: {
          select: { services: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const standardCategories = [
      {
        slug: "hair",
        name: "Coiffure & Coloration",
        description: "Coupes à sec, balayages minéraux et colorations végétales",
        icon: "Scissors",
      },
      {
        slug: "facial",
        name: "Soins Visage & Institut",
        description: "Rituels éclat, kobido et massages faciaux holistiques",
        icon: "Flower",
      },
      {
        slug: "massage",
        name: "Massages & Rituels Corps",
        description: "Massages shirodhara, ayurvédiques et bains détox",
        icon: "Heart",
      },
      {
        slug: "barber",
        name: "Barbiers & Soins Homme",
        description: "Tailles de barbe au coupe-chou et serviettes chaudes",
        icon: "User",
      },
      {
        slug: "nails",
        name: "Onglerie & Manucure",
        description: "Soins des ongles naturels, vernis green et poses soignées",
        icon: "Hand",
      },
    ];

    const response = NextResponse.json({
      categories: standardCategories,
      venueCategories: categories,
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories." },
      { status: 500 }
    );
  }
}
