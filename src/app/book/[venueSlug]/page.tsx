import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MainNav } from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { getVenueBySlug, VENUES, Venue } from "@/lib/data/venues";
import { BookClient } from "./book-client";
import { db } from "@/lib/db";
import { VenueStatus } from "@prisma/client";

interface BookPageProps {
  params: Promise<{
    venueSlug: string;
  }>;
}

export async function generateStaticParams() {
  return VENUES.map((venue) => ({
    venueSlug: venue.slug,
  }));
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-neutral-900 selection:bg-primary-100 selection:text-primary-900">
      <MainNav />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="container-belora py-16 text-center text-sm text-neutral-500">
              Chargement du tunnel de réservation...
            </div>
          }
        >
          <BookContent params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

async function BookContent({ params }: BookPageProps) {
  const { venueSlug } = await params;

  let venue: Venue | null = null;

  try {
    const dbVenue = await db.venue.findUnique({
      where: {
        slug: venueSlug,
        status: VenueStatus.PUBLISHED,
      },
      include: {
        openingHours: { orderBy: { dayOfWeek: "asc" } },
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
      },
    });

    if (dbVenue) {
      const allServices = dbVenue.serviceCategories.flatMap((c) => c.services);
      const startingPriceCents =
        allServices.length > 0 ? Math.min(...allServices.map((s) => s.priceCents)) : 0;
      const firstCatName = dbVenue.serviceCategories[0]?.name || "Beauté";

      const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

      venue = {
        id: dbVenue.id,
        slug: dbVenue.slug,
        name: dbVenue.name,
        tagline: dbVenue.tagline || "",
        description: dbVenue.description || "",
        badge: "Artisan d'Exception",
        category: "hair",
        categoryLabel: firstCatName,
        address: dbVenue.address,
        city: dbVenue.city,
        district: dbVenue.postalCode ? `${dbVenue.city} ${dbVenue.postalCode.slice(0, 2)}e` : dbVenue.city,
        rating: "5.0",
        reviewCount: 1,
        startingPrice:
          startingPriceCents > 0 ? `${Math.round(startingPriceCents / 100)} €` : "Sur devis",
        image: "/images/venues/botanique-1.jpg",
        gallery: ["/images/venues/botanique-1.jpg"],
        features: ["Produits Bio", "Artisan Certifié", "Réservation Immédiate"],
        openingHours: dbVenue.openingHours.map((oh) => ({
          day: days[oh.dayOfWeek] || "",
          hours: oh.isOpen ? `${oh.openTime} - ${oh.closeTime}` : "Fermé",
        })),
        team: dbVenue.staff.map((s) => ({
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
        reviews: [],
      };
    }
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("Error fetching venue in book page:", err);
  }

  // Fallback si salon statique
  if (!venue) {
    venue = getVenueBySlug(venueSlug) || null;
  }

  if (!venue) {
    notFound();
  }

  return <BookClient venue={venue} />;
}
