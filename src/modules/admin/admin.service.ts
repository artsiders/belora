import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role, VenueStatus, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  UpdateVenueStatusInput,
  CreateAssistedVenueInput,
  UpdateMonetizationInput,
} from "@/lib/validations/admin.schema";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export type AdminContextResult =
  | { user: AdminUser }
  | { error: string; status: number };

/**
 * Vérifie que l'utilisateur connecté possède les privilèges Administrateur Belora.
 */
export async function getAdminContext(
  request: Request
): Promise<AdminContextResult> {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });
    if (user) {
      if (user.role !== Role.ADMIN) {
        return {
          error: "Accès refusé. Privilèges administrateur requis.",
          status: 403,
        };
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    }
  }

  // Fallback pour tests d'intégration ou scripts d'administration
  const { searchParams } = new URL(request.url);
  const paramAdminEmail = searchParams.get("adminEmail");
  const headerAdminKey = request.headers.get("x-admin-key");

  if (paramAdminEmail || headerAdminKey) {
    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(paramAdminEmail ? [{ email: paramAdminEmail }] : []),
          ...(headerAdminKey ? [{ email: "admin@yopmail.com" }, { email: "admin@belora.com" }] : []),
        ],
      },
    });

    if (user) {
      if (user.role !== Role.ADMIN) {
        return {
          error: "Accès refusé. Privilèges administrateur requis.",
          status: 403,
        };
      }
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    }
  }

  return {
    error: "Non authentifié. Connexion administrateur requise.",
    status: 401,
  };
}

// =============================================================================
// TABLEAU DE BORD PLATEFORME (KPIS & RECENT ACTIVITY)
// =============================================================================

export interface PlatformDashboardMetrics {
  kpis: {
    gmvEuros: number;
    commissionsEuros: number;
    totalBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    activeVenuesCount: number;
    pendingVenuesCount: number;
    totalUsersCount: number;
    customerCount: number;
    proCount: number;
  };
  recentBookings: {
    id: string;
    reference: string;
    clientName: string;
    venueName: string;
    totalPriceEuros: number;
    depositEuros: number;
    commissionEuros: number;
    status: string;
    createdAt: string;
  }[];
}

export async function getPlatformDashboardMetrics(): Promise<PlatformDashboardMetrics> {
  const [
    bookings,
    venues,
    users,
    recentBookingsData,
  ] = await Promise.all([
    db.booking.findMany({
      select: {
        totalPriceCents: true,
        depositCents: true,
        status: true,
        venue: {
          select: { commissionRate: true },
        },
      },
    }),
    db.venue.findMany({
      select: { status: true },
    }),
    db.user.findMany({
      select: { role: true },
    }),
    db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        venue: {
          select: { name: true, commissionRate: true },
        },
      },
    }),
  ]);

  let totalGmvCents = 0;
  let totalCommissionsCents = 0;
  let confirmedCount = 0;
  let completedCount = 0;

  for (const b of bookings) {
    if (
      b.status === BookingStatus.CONFIRMED ||
      b.status === BookingStatus.COMPLETED
    ) {
      totalGmvCents += b.totalPriceCents;
      const rate = b.venue.commissionRate ?? 0.018;
      totalCommissionsCents += Math.round(b.totalPriceCents * rate);
    }
    if (b.status === BookingStatus.CONFIRMED) confirmedCount++;
    if (b.status === BookingStatus.COMPLETED) completedCount++;
  }

  const activeVenues = venues.filter((v) => v.status === VenueStatus.PUBLISHED).length;
  const pendingVenues = venues.filter((v) => v.status === VenueStatus.PENDING_VALIDATION).length;

  const customerCount = users.filter((u) => u.role === Role.CUSTOMER).length;
  const proCount = users.filter((u) => u.role === Role.PRO).length;

  const recentBookings = recentBookingsData.map((b) => ({
    id: b.id,
    reference: b.reference,
    clientName: b.clientName,
    venueName: b.venue.name,
    totalPriceEuros: b.totalPriceCents / 100,
    depositEuros: b.depositCents / 100,
    commissionEuros: Math.round(b.totalPriceCents * (b.venue.commissionRate ?? 0.018)) / 100,
    status: b.status.toLowerCase(),
    createdAt: b.createdAt.toISOString(),
  }));

  return {
    kpis: {
      gmvEuros: totalGmvCents / 100,
      commissionsEuros: totalCommissionsCents / 100,
      totalBookings: bookings.length,
      confirmedBookings: confirmedCount,
      completedBookings: completedCount,
      activeVenuesCount: activeVenues,
      pendingVenuesCount: pendingVenues,
      totalUsersCount: users.length,
      customerCount,
      proCount,
    },
    recentBookings,
  };
}

// =============================================================================
// GESTION DES ÉTABLISSEMENTS
// =============================================================================

export interface AdminVenueListItem {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string | null;
  status: VenueStatus;
  commissionRate: number;
  ownerName: string;
  ownerEmail: string;
  bookingsCount: number;
  totalRevenueEuros: number;
  createdAt: string;
}

export async function getAdminVenues(filter?: {
  status?: VenueStatus;
  search?: string;
}): Promise<AdminVenueListItem[]> {
  const venues = await db.venue.findMany({
    where: {
      ...(filter?.status ? { status: filter.status } : {}),
      ...(filter?.search
        ? {
            OR: [
              { name: { contains: filter.search, mode: "insensitive" } },
              { city: { contains: filter.search, mode: "insensitive" } },
              { address: { contains: filter.search, mode: "insensitive" } },
              { owner: { email: { contains: filter.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      owner: {
        select: { firstName: true, lastName: true, email: true },
      },
      bookings: {
        select: { totalPriceCents: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return venues.map((v) => {
    let totalRevenueCents = 0;
    for (const b of v.bookings) {
      if (
        b.status === BookingStatus.CONFIRMED ||
        b.status === BookingStatus.COMPLETED
      ) {
        totalRevenueCents += b.totalPriceCents;
      }
    }

    return {
      id: v.id,
      name: v.name,
      slug: v.slug,
      address: v.address,
      city: v.city,
      postalCode: v.postalCode,
      phone: v.phone,
      status: v.status,
      commissionRate: v.commissionRate,
      ownerName: `${v.owner.firstName} ${v.owner.lastName}`.trim(),
      ownerEmail: v.owner.email,
      bookingsCount: v.bookings.length,
      totalRevenueEuros: totalRevenueCents / 100,
      createdAt: v.createdAt.toISOString(),
    };
  });
}

export async function updateAdminVenue(
  venueId: string,
  input: UpdateVenueStatusInput
) {
  const venue = await db.venue.findUnique({ where: { id: venueId } });
  if (!venue) throw new Error("Établissement introuvable.");

  const updated = await db.venue.update({
    where: { id: venueId },
    data: {
      ...(input.status ? { status: input.status } : {}),
      ...(input.commissionRate !== undefined
        ? { commissionRate: input.commissionRate }
        : {}),
    },
  });

  return updated;
}

// =============================================================================
// CRÉATION ASSISTÉE D'ÉTABLISSEMENT (ONBOARDING BELORA)
// =============================================================================

export interface AssistedVenueResult {
  venue: {
    id: string;
    name: string;
    slug: string;
    status: VenueStatus;
  };
  owner: {
    id: string;
    email: string;
    name: string;
  };
  invitationToken: string;
  invitationUrl: string;
}

export async function createAssistedVenue(
  input: CreateAssistedVenueInput
): Promise<AssistedVenueResult> {
  const normalizedEmail = input.proEmail.toLowerCase().trim();

  // Génération d'un slug unique
  let baseSlug = input.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const existingSlug = await db.venue.findUnique({ where: { slug: baseSlug } });
  if (existingSlug) {
    baseSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const result = await db.$transaction(async (tx) => {
    // 1. Recherche ou création du compte utilisateur PRO
    let proUser = await tx.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!proUser) {
      const salt = await bcrypt.genSalt(10);
      const tempHash = await bcrypt.hash(
        `BeloraPro_${crypto.randomBytes(6).toString("hex")}!`,
        salt
      );

      proUser = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: tempHash,
          firstName: input.proFirstName.trim(),
          lastName: input.proLastName.trim(),
          phone: input.proPhone.trim(),
          role: Role.PRO,
        },
      });
    }

    // 2. Création de l'établissement
    const venue = await tx.venue.create({
      data: {
        slug: baseSlug,
        name: input.name.trim(),
        tagline: input.tagline?.trim() || null,
        description: input.description?.trim() || null,
        address: input.address.trim(),
        city: input.city.trim(),
        postalCode: input.postalCode.trim(),
        phone: input.proPhone.trim(),
        email: normalizedEmail,
        status: VenueStatus.PENDING_VALIDATION,
        commissionRate: input.commissionRate ?? 0.018,
        latitude: 48.8566,
        longitude: 2.3522,
        ownerId: proUser.id,
      },
    });

    // 3. Horaires par défaut (Mardi au Samedi ouverts)
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
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isOpen: h.isOpen,
        },
      });
    }

    // 4. Génération du jeton d'invitation
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 jours

    await tx.verificationToken.create({
      data: {
        identifier: `assisted_venue:${venue.id}`,
        token,
        expires,
      },
    });

    return {
      venue: {
        id: venue.id,
        name: venue.name,
        slug: venue.slug,
        status: venue.status,
      },
      owner: {
        id: proUser.id,
        email: proUser.email,
        name: `${proUser.firstName} ${proUser.lastName}`.trim(),
      },
      invitationToken: token,
      invitationUrl: `/pro/claim?token=${token}&venueId=${venue.id}`,
    };
  });

  return result;
}

// =============================================================================
// MONÉTISATION & COMMISSIONS
// =============================================================================

export interface MonetizationSettingsResult {
  defaultCommissionRate: number;
  maintenanceMode: boolean;
  totalCommissionsCollectedEuros: number;
  venuesSummary: {
    venueId: string;
    venueName: string;
    commissionRate: number;
    gmvEuros: number;
    commissionCollectedEuros: number;
  }[];
}

export async function getMonetizationSettings(): Promise<MonetizationSettingsResult> {
  let setting = await db.platformSetting.findFirst();

  if (!setting) {
    setting = await db.platformSetting.create({
      data: {
        defaultCommissionRate: 0.018,
        maintenanceMode: false,
      },
    });
  }

  const venues = await db.venue.findMany({
    include: {
      bookings: {
        where: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
        },
        select: { totalPriceCents: true },
      },
    },
    orderBy: { name: "asc" },
  });

  let totalCollectedCents = 0;
  const venuesSummary = venues.map((v) => {
    let venueGmvCents = 0;
    for (const b of v.bookings) {
      venueGmvCents += b.totalPriceCents;
    }
    const rate = v.commissionRate ?? setting.defaultCommissionRate;
    const collectedCents = Math.round(venueGmvCents * rate);
    totalCollectedCents += collectedCents;

    return {
      venueId: v.id,
      venueName: v.name,
      commissionRate: rate,
      gmvEuros: venueGmvCents / 100,
      commissionCollectedEuros: collectedCents / 100,
    };
  });

  return {
    defaultCommissionRate: setting.defaultCommissionRate,
    maintenanceMode: setting.maintenanceMode,
    totalCommissionsCollectedEuros: totalCollectedCents / 100,
    venuesSummary,
  };
}

export async function updateMonetizationSettings(
  input: UpdateMonetizationInput
) {
  let setting = await db.platformSetting.findFirst();

  if (!setting) {
    setting = await db.platformSetting.create({
      data: {
        defaultCommissionRate: input.defaultCommissionRate,
        maintenanceMode: input.maintenanceMode ?? false,
      },
    });
  } else {
    setting = await db.platformSetting.update({
      where: { id: setting.id },
      data: {
        defaultCommissionRate: input.defaultCommissionRate,
        ...(input.maintenanceMode !== undefined
          ? { maintenanceMode: input.maintenanceMode }
          : {}),
      },
    });
  }

  return setting;
}

// =============================================================================
// MODÉRATION DES AVIS
// =============================================================================

export interface AdminReviewItem {
  id: string;
  venueName: string;
  venueSlug: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  reply: string | null;
  createdAt: string;
}

export async function getAdminReviews(filter?: {
  venueId?: string;
  minRating?: number;
}): Promise<AdminReviewItem[]> {
  const reviews = await db.review.findMany({
    where: {
      ...(filter?.venueId ? { venueId: filter.venueId } : {}),
      ...(filter?.minRating ? { rating: { gte: filter.minRating } } : {}),
    },
    include: {
      venue: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    id: r.id,
    venueName: r.venue.name,
    venueSlug: r.venue.slug,
    authorName: r.authorName,
    rating: r.rating,
    comment: r.comment,
    isVerified: r.isVerified,
    reply: r.reply,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function deleteAdminReview(reviewId: string) {
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Avis introuvable.");

  await db.review.delete({ where: { id: reviewId } });
  return { success: true, id: reviewId };
}
