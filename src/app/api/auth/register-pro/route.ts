import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Role, VenueStatus } from "@prisma/client";
import { db } from "@/lib/db";

const registerProSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse e-mail professionnelle valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  venueName: z.string().min(2, "Le nom de l'établissement doit comporter au moins 2 caractères"),
  venueAddress: z.string().min(5, "L'adresse de l'établissement est requise"),
  venueCity: z.string().min(2, "La ville est requise"),
  venuePostalCode: z.string().min(4, "Le code postal est requis"),
  tagline: z.string().optional(),
});

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "etablissement";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerProSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Données d'inscription professionnelle invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      venueName,
      venueAddress,
      venueCity,
      venuePostalCode,
      tagline,
    } = result.data;

    const normalizedEmail = email.toLowerCase().trim();

    // Vérifier l'unicité du compte
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse e-mail" },
        { status: 409 }
      );
    }

    // Déterminer un slug unique pour le salon
    let baseSlug = generateSlug(venueName);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await db.venue.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Transaction atomique : création du gérant, du salon, des horaires et du collaborateur gérant
    const newPro = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          role: Role.PRO,
          emailVerified: new Date(),
        },
      });

      const venue = await tx.venue.create({
        data: {
          slug: uniqueSlug,
          name: venueName.trim(),
          tagline: tagline?.trim() || null,
          address: venueAddress.trim(),
          city: venueCity.trim(),
          postalCode: venuePostalCode.trim(),
          countryCode: "FR",
          latitude: 48.8566, // Coordonnées par défaut Paris, enrichies ultérieurement par géocodage
          longitude: 2.3622,
          phone: phone.trim(),
          email: normalizedEmail,
          currency: "EUR",
          timezone: "Europe/Paris",
          status: VenueStatus.PUBLISHED,
          commissionRate: 0.018,
          ownerId: user.id,
        },
      });

      // Horaires d'ouverture standards (Mardi au Samedi)
      const openingHours = [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isOpen: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isOpen: false },
        { dayOfWeek: 2, openTime: "09:30", closeTime: "19:30", isOpen: true },
        { dayOfWeek: 3, openTime: "09:30", closeTime: "19:30", isOpen: true },
        { dayOfWeek: 4, openTime: "09:30", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 5, openTime: "09:30", closeTime: "20:00", isOpen: true },
        { dayOfWeek: 6, openTime: "09:00", closeTime: "19:00", isOpen: true },
      ];

      for (const h of openingHours) {
        await tx.venueOpeningHour.create({
          data: {
            venueId: venue.id,
            ...h,
          },
        });
      }

      // Collaborateur principal (Gérant)
      const staff = await tx.staffMember.create({
        data: {
          venueId: venue.id,
          userId: user.id,
          name: `${firstName} ${lastName}`.trim(),
          role: "Gérant(e) & Artisan",
          color: "#82385a", // Figue
          isActive: true,
        },
      });

      // Planning du gérant (Mardi à Samedi)
      for (let day = 2; day <= 6; day++) {
        await tx.staffSchedule.create({
          data: {
            staffId: staff.id,
            dayOfWeek: day,
            plannedStart: "09:30",
            plannedEnd: "19:30",
            breakStart: "13:00",
            breakEnd: "14:00",
            isActive: true,
          },
        });
      }

      return { user, venue, staff };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Établissement et compte professionnel créés avec succès",
        user: {
          id: newPro.user.id,
          email: newPro.user.email,
          role: newPro.user.role,
          venueId: newPro.venue.id,
          venueSlug: newPro.venue.slug,
          staffId: newPro.staff.id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register Pro error:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement de l'établissement. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
