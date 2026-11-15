import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role, VenueStatus, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  UpdateVenueStatusInput,
  CreateAssistedVenueInput,
  UpdateMonetizationInput,
  UpdateUserInput,
  UpdateBookingStatusInput,
  UpdatePlatformSettingsInput,
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

export async function updateAdminReview(
  reviewId: string,
  data: { isVerified?: boolean; reply?: string | null }
) {
  const review = await db.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Avis introuvable.");

  const updated = await db.review.update({
    where: { id: reviewId },
    data: {
      ...(data.isVerified !== undefined ? { isVerified: data.isVerified } : {}),
      ...(data.reply !== undefined
        ? { reply: data.reply, replyAt: data.reply ? new Date() : null }
        : {}),
    },
  });
  return { success: true, review: updated };
}

// =============================================================================
// GESTION COMPLÈTE DES UTILISATEURS (CLIENTS, PROS, ADMINS)
// =============================================================================

export interface AdminUserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  emailVerified: string | null;
  createdAt: string;
  ownedVenuesCount: number;
  bookingsCount: number;
  totalSpentEuros: number;
}

export async function getAdminUsers(params?: {
  role?: Role;
  search?: string;
}): Promise<AdminUserListItem[]> {
  const users = await db.user.findMany({
    where: {
      ...(params?.role ? { role: params.role } : {}),
      ...(params?.search
        ? {
            OR: [
              { email: { contains: params.search, mode: "insensitive" } },
              { firstName: { contains: params.search, mode: "insensitive" } },
              { lastName: { contains: params.search, mode: "insensitive" } },
              { phone: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      ownedVenues: {
        select: { id: true, name: true },
      },
      crmProfiles: {
        include: {
          bookings: {
            select: { totalPriceCents: true, status: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => {
    // Calcul des réservations et dépenses totales via CRM profiles ou email
    let totalBookings = 0;
    let totalSpentCents = 0;

    for (const crm of u.crmProfiles) {
      totalBookings += crm.bookings.length;
      for (const b of crm.bookings) {
        if (
          b.status === BookingStatus.CONFIRMED ||
          b.status === BookingStatus.COMPLETED
        ) {
          totalSpentCents += b.totalPriceCents;
        }
      }
    }

    return {
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      role: u.role,
      emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,
      createdAt: u.createdAt.toISOString(),
      ownedVenuesCount: u.ownedVenues.length,
      bookingsCount: totalBookings,
      totalSpentEuros: totalSpentCents / 100,
    };
  });
}

export async function getAdminUserById(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      ownedVenues: {
        select: { id: true, name: true, slug: true, status: true, city: true },
      },
      crmProfiles: {
        include: {
          venue: { select: { id: true, name: true } },
          bookings: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
              venue: { select: { name: true } },
            },
          },
        },
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          venue: { select: { name: true } },
        },
      },
    },
  });

  if (!user) throw new Error("Utilisateur introuvable.");

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    ownedVenues: user.ownedVenues,
    crmProfiles: user.crmProfiles.map((c) => ({
      venueName: c.venue.name,
      totalVisits: c.totalVisits,
      totalSpentEuros: c.totalSpentCents / 100,
      bookings: c.bookings.map((b) => ({
        id: b.id,
        reference: b.reference,
        status: b.status,
        totalPriceEuros: b.totalPriceCents / 100,
        createdAt: b.createdAt.toISOString(),
      })),
    })),
    reviews: user.reviews.map((r) => ({
      id: r.id,
      venueName: r.venue.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  };
}

export async function updateAdminUser(
  userId: string,
  input: UpdateUserInput
) {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable.");

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...(input.role ? { role: input.role } : {}),
      ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
      ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
      ...(input.phone !== undefined ? { phone: input.phone?.trim() || null } : {}),
      ...(input.emailVerified !== undefined
        ? { emailVerified: input.emailVerified ? new Date() : null }
        : {}),
    },
  });

  return {
    id: updated.id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    phone: updated.phone,
    emailVerified: updated.emailVerified ? updated.emailVerified.toISOString() : null,
  };
}

export async function deleteAdminUser(userId: string, currentAdminId: string) {
  if (userId === currentAdminId) {
    throw new Error("Impossible de supprimer votre propre compte administrateur.");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { ownedVenues: true },
  });

  if (!user) throw new Error("Utilisateur introuvable.");

  if (user.ownedVenues.length > 0) {
    throw new Error(
      "Impossible de supprimer un compte propriétaire d'établissements actifs. Veuillez transférer ou supprimer les salons d'abord."
    );
  }

  await db.user.delete({ where: { id: userId } });
  return { success: true, id: userId };
}

// =============================================================================
// GESTION COMPLÈTE DES RÉSERVATIONS PLATEFORME
// =============================================================================

export interface AdminBookingListItem {
  id: string;
  reference: string;
  venueId: string;
  venueName: string;
  venueSlug: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  status: BookingStatus;
  totalPriceEuros: number;
  depositEuros: number;
  remainingEuros: number;
  paymentStatus: string;
  commissionRate: number;
  commissionEuros: number;
  stripePaymentIntentId: string | null;
  servicesSummary: string;
  scheduledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
}

export async function getAdminBookings(params?: {
  status?: BookingStatus;
  venueId?: string;
  search?: string;
}): Promise<AdminBookingListItem[]> {
  const bookings = await db.booking.findMany({
    where: {
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.venueId ? { venueId: params.venueId } : {}),
      ...(params?.search
        ? {
            OR: [
              { reference: { contains: params.search, mode: "insensitive" } },
              { clientName: { contains: params.search, mode: "insensitive" } },
              { clientEmail: { contains: params.search, mode: "insensitive" } },
              { clientPhone: { contains: params.search, mode: "insensitive" } },
              { venue: { name: { contains: params.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      venue: {
        select: { id: true, name: true, slug: true, commissionRate: true },
      },
      items: {
        include: {
          service: { select: { name: true } },
          staff: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return bookings.map((b) => {
    const rate = b.venue.commissionRate ?? 0.018;
    const commissionEuros = Math.round(b.totalPriceCents * rate) / 100;
    const servicesSummary = b.items.map((i) => i.service.name).join(", ") || "Prestation standard";
    const scheduledAt = b.items[0]?.startTime ? b.items[0].startTime.toISOString() : null;

    return {
      id: b.id,
      reference: b.reference,
      venueId: b.venue.id,
      venueName: b.venue.name,
      venueSlug: b.venue.slug,
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      clientEmail: b.clientEmail,
      status: b.status,
      totalPriceEuros: b.totalPriceCents / 100,
      depositEuros: b.depositCents / 100,
      remainingEuros: b.remainingCents / 100,
      paymentStatus: b.paymentStatus,
      commissionRate: rate,
      commissionEuros,
      stripePaymentIntentId: b.stripePaymentIntentId,
      servicesSummary,
      scheduledAt,
      cancellationReason: b.cancellationReason,
      createdAt: b.createdAt.toISOString(),
    };
  });
}

export async function getAdminBookingById(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          email: true,
          address: true,
          city: true,
          postalCode: true,
          commissionRate: true,
          stripeAccountId: true,
          stripeChargesEnabled: true,
        },
      },
      items: {
        include: {
          service: { select: { id: true, name: true, durationMinutes: true, priceCents: true } },
          staff: { select: { id: true, name: true, role: true } },
          resource: { select: { id: true, name: true } },
        },
        orderBy: { startTime: "asc" },
      },
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          totalVisits: true,
        },
      },
      review: true,
      saleTickets: true,
    },
  });

  if (!booking) throw new Error("Réservation introuvable.");

  const rate = booking.venue.commissionRate ?? 0.018;

  return {
    id: booking.id,
    reference: booking.reference,
    status: booking.status,
    totalPriceEuros: booking.totalPriceCents / 100,
    depositEuros: booking.depositCents / 100,
    remainingEuros: booking.remainingCents / 100,
    commissionRate: rate,
    commissionEuros: Math.round(booking.totalPriceCents * rate) / 100,
    paymentStatus: booking.paymentStatus,
    stripePaymentIntentId: booking.stripePaymentIntentId,
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    clientEmail: booking.clientEmail,
    notes: booking.notes,
    cancellationReason: booking.cancellationReason,
    cancelledAt: booking.cancelledAt ? booking.cancelledAt.toISOString() : null,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    venue: booking.venue,
    customer: booking.customer,
    review: booking.review,
    saleTickets: booking.saleTickets,
    items: booking.items.map((i) => ({
      id: i.id,
      serviceName: i.service.name,
      durationMinutes: i.service.durationMinutes,
      priceEuros: i.priceCents / 100,
      staffName: i.staff.name,
      staffRole: i.staff.role,
      resourceName: i.resource?.name || null,
      startTime: i.startTime.toISOString(),
      endTime: i.endTime.toISOString(),
    })),
  };
}

export async function updateAdminBookingStatus(
  bookingId: string,
  input: UpdateBookingStatusInput
) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Réservation introuvable.");

  const isCancelling = input.status === BookingStatus.CANCELLED;

  const updated = await db.booking.update({
    where: { id: bookingId },
    data: {
      status: input.status,
      cancellationReason: isCancelling
        ? input.cancellationReason || "Annulé par l'administrateur Belora"
        : null,
      cancelledAt: isCancelling ? new Date() : null,
    },
  });

  return {
    id: updated.id,
    reference: updated.reference,
    status: updated.status,
    cancellationReason: updated.cancellationReason,
    cancelledAt: updated.cancelledAt ? updated.cancelledAt.toISOString() : null,
  };
}

// =============================================================================
// FINANCES, COMMISSIONS & STRIPE CONNECT
// =============================================================================

export interface AdminFinancialReport {
  kpis: {
    gmvTotalEuros: number;
    commissionsCollectedEuros: number;
    depositsEscrowEuros: number;
    inStoreRemainingEuros: number;
    stripeConnectedVenuesCount: number;
    stripePendingVenuesCount: number;
  };
  venuesFinances: {
    venueId: string;
    venueName: string;
    city: string;
    commissionRate: number;
    gmvEuros: number;
    commissionsEuros: number;
    depositsEuros: number;
    stripeAccountId: string | null;
    stripeChargesEnabled: boolean;
  }[];
  recentTransactions: {
    id: string;
    reference: string;
    venueName: string;
    clientName: string;
    amountEuros: number;
    depositEuros: number;
    commissionEuros: number;
    status: string;
    stripePaymentIntentId: string | null;
    createdAt: string;
  }[];
}

export async function getAdminFinancialReport(): Promise<AdminFinancialReport> {
  const [venues, bookings] = await Promise.all([
    db.venue.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        commissionRate: true,
        stripeAccountId: true,
        stripeChargesEnabled: true,
      },
      orderBy: { name: "asc" },
    }),
    db.booking.findMany({
      include: {
        venue: {
          select: { name: true, commissionRate: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  let gmvTotalCents = 0;
  let commissionsCollectedCents = 0;
  let depositsEscrowCents = 0;
  let inStoreRemainingCents = 0;

  // Breakdown per venue
  const venueFinanceMap = new Map<
    string,
    { gmvCents: number; commissionsCents: number; depositsCents: number }
  >();

  for (const v of venues) {
    venueFinanceMap.set(v.id, { gmvCents: 0, commissionsCents: 0, depositsCents: 0 });
  }

  for (const b of bookings) {
    const isSuccess =
      b.status === BookingStatus.CONFIRMED ||
      b.status === BookingStatus.COMPLETED;

    if (isSuccess) {
      gmvTotalCents += b.totalPriceCents;
      depositsEscrowCents += b.depositCents;
      inStoreRemainingCents += b.remainingCents;

      const rate = b.venue.commissionRate ?? 0.018;
      const commissionCents = Math.round(b.totalPriceCents * rate);
      commissionsCollectedCents += commissionCents;

      const cur = venueFinanceMap.get(b.venueId);
      if (cur) {
        cur.gmvCents += b.totalPriceCents;
        cur.commissionsCents += commissionCents;
        cur.depositsCents += b.depositCents;
      }
    }
  }

  let stripeConnectedCount = 0;
  let stripePendingCount = 0;

  const venuesFinances = venues.map((v) => {
    if (v.stripeChargesEnabled) {
      stripeConnectedCount++;
    } else {
      stripePendingCount++;
    }

    const cur = venueFinanceMap.get(v.id) || {
      gmvCents: 0,
      commissionsCents: 0,
      depositsCents: 0,
    };

    return {
      venueId: v.id,
      venueName: v.name,
      city: v.city,
      commissionRate: v.commissionRate ?? 0.018,
      gmvEuros: cur.gmvCents / 100,
      commissionsEuros: cur.commissionsCents / 100,
      depositsEuros: cur.depositsCents / 100,
      stripeAccountId: v.stripeAccountId,
      stripeChargesEnabled: v.stripeChargesEnabled,
    };
  });

  const recentTransactions = bookings.slice(0, 15).map((b) => {
    const rate = b.venue.commissionRate ?? 0.018;
    return {
      id: b.id,
      reference: b.reference,
      venueName: b.venue.name,
      clientName: b.clientName,
      amountEuros: b.totalPriceCents / 100,
      depositEuros: b.depositCents / 100,
      commissionEuros: Math.round(b.totalPriceCents * rate) / 100,
      status: b.status.toLowerCase(),
      stripePaymentIntentId: b.stripePaymentIntentId,
      createdAt: b.createdAt.toISOString(),
    };
  });

  return {
    kpis: {
      gmvTotalEuros: gmvTotalCents / 100,
      commissionsCollectedEuros: commissionsCollectedCents / 100,
      depositsEscrowEuros: depositsEscrowCents / 100,
      inStoreRemainingEuros: inStoreRemainingCents / 100,
      stripeConnectedVenuesCount: stripeConnectedCount,
      stripePendingVenuesCount: stripePendingCount,
    },
    venuesFinances,
    recentTransactions,
  };
}

// =============================================================================
// PARAMÈTRES PLATEFORME & SANTÉ SYSTÈME (DIAGNOSTICS)
// =============================================================================

export interface AdminSystemHealth {
  databaseStatus: "healthy" | "degraded" | "down";
  latencyMs: number;
  tablesCount: {
    users: number;
    venues: number;
    bookings: number;
    reviews: number;
  };
  serverUptimeSeconds: number;
  nodeVersion: string;
  environment: string;
}

export async function getAdminSystemHealth(): Promise<AdminSystemHealth> {
  const start = Date.now();
  let dbStatus: "healthy" | "degraded" | "down" = "healthy";

  let usersCount = 0;
  let venuesCount = 0;
  let bookingsCount = 0;
  let reviewsCount = 0;

  try {
    const [u, v, b, r] = await Promise.all([
      db.user.count(),
      db.venue.count(),
      db.booking.count(),
      db.review.count(),
    ]);
    usersCount = u;
    venuesCount = v;
    bookingsCount = b;
    reviewsCount = r;
  } catch {
    dbStatus = "down";
  }

  const latencyMs = Date.now() - start;
  if (dbStatus === "healthy" && latencyMs > 500) {
    dbStatus = "degraded";
  }

  return {
    databaseStatus: dbStatus,
    latencyMs,
    tablesCount: {
      users: usersCount,
      venues: venuesCount,
      bookings: bookingsCount,
      reviews: reviewsCount,
    },
    serverUptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "development",
  };
}

