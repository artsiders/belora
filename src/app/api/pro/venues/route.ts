import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { VenueStatus } from "@prisma/client";
import { z } from "zod";

const createVenueSchema = z.object({
  name: z.string().min(2, "Le nom de l'établissement doit contenir au moins 2 caractères"),
  address: z.string().min(3, "L'adresse est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  city: z.string().min(2, "La ville est requise"),
  phone: z.string().optional(),
  email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  tagline: z.string().optional(),
  description: z.string().optional(),
  depositPercentage: z.number().min(0).max(100).optional().default(30),
});

export async function GET() {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }

    const userId = session?.user?.id;
    let venues: any[] = [];

    if (userId) {
      // 1. Établissements possédés par l'utilisateur
      venues = await db.venue.findMany({
        where: session?.user?.role === "ADMIN" ? {} : { ownerId: userId },
        orderBy: { createdAt: "asc" },
      });

      // 2. Si aucun salon possédé, vérifier si rattaché comme collaborateur
      if (venues.length === 0) {
        const staffProfiles = await db.staffMember.findMany({
          where: { userId },
          include: { venue: true },
        });
        venues = staffProfiles.map((sp) => sp.venue).filter(Boolean);
      }
    }

    // 3. Fallback dev / tests : renvoyer tous les établissements de la base
    if (venues.length === 0 && process.env.NODE_ENV !== "production") {
      venues = await db.venue.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    const formattedVenues = venues.map((v) => ({
      id: v.id,
      name: v.name,
      slug: v.slug,
      tagline: v.tagline,
      description: v.description,
      address: v.address,
      postalCode: v.postalCode,
      city: v.city,
      phone: v.phone,
      email: v.email,
      siret: v.siret,
      vatNumber: v.vatNumber,
      depositPercentage: v.depositPercentage,
      cancellationDelayHours: v.cancellationDelayHours,
      status: v.status,
    }));

    return NextResponse.json({ venues: formattedVenues });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des établissements.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }

    const userId = session?.user?.id;
    if (!userId && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    // Utilisateur propriétaire cible
    let ownerId = userId;
    if (!ownerId) {
      const fallbackOwner = await db.user.findFirst({
        where: { role: { in: ["PRO", "ADMIN"] } },
        select: { id: true },
      });
      ownerId = fallbackOwner?.id;
    }

    if (!ownerId) {
      return NextResponse.json(
        { error: "Impossible de déterminer le propriétaire de l'établissement." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = createVenueSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 422 }
      );
    }

    const {
      name,
      address,
      postalCode,
      city,
      phone,
      email,
      tagline,
      description,
      depositPercentage,
    } = parsed.data;

    // Génération d'un slug unique
    let baseSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await db.venue.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Création transactionnelle de l'établissement avec horaires et catégorie par défaut
    const newVenue = await db.$transaction(async (tx) => {
      const venue = await tx.venue.create({
        data: {
          name: name.trim(),
          slug: uniqueSlug,
          tagline: tagline?.trim() || "Salon & Atelier de Beauté",
          description: description?.trim() || "Maison de beauté et soins experts.",
          address: address.trim(),
          postalCode: postalCode.trim(),
          city: city.trim(),
          phone: phone?.trim() || null,
          email: email?.trim() || null,
          ownerId,
          depositPercentage: depositPercentage ?? 30,
          latitude: 48.8566,
          longitude: 2.3522,
          status: VenueStatus.PUBLISHED,
          commissionRate: 0.018,
        },
      });

      // Horaires d'ouverture standards
      const defaultHours = [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isOpen: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isOpen: false },
        { dayOfWeek: 2, openTime: "09:30", closeTime: "19:30", isOpen: true },
        { dayOfWeek: 3, openTime: "09:30", closeTime: "19:30", isOpen: true },
        { dayOfWeek: 4, openTime: "09:30", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 5, openTime: "09:30", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 6, openTime: "09:00", closeTime: "19:00", isOpen: true },
      ];

      for (const h of defaultHours) {
        await tx.venueOpeningHour.create({
          data: {
            venueId: venue.id,
            ...h,
          },
        });
      }

      // Catégorie initiale
      await tx.serviceCategory.create({
        data: {
          venueId: venue.id,
          name: "Soins & Prestations",
          order: 0,
        },
      });

      return venue;
    });

    return NextResponse.json({ venue: newVenue }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création de l'établissement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
