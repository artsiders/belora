import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BookingStatus, PaymentStatus, Role } from "@prisma/client";
import { refundPaymentIntent } from "@/lib/stripe";
import { sendBookingCancellationEmail } from "@/lib/email";
import {
  CreateReviewInput,
  UpdateCustomerProfileInput,
} from "@/lib/validations/account.schema";

export interface AccountUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  createdAt: Date;
}

export type AccountUserContextResult =
  | { user: AccountUser }
  | { error: string; status: number };

/**
 * Récupère le contexte utilisateur pour l'espace compte client.
 * Priorise la session NextAuth v5, avec fallback sur les query params (pour tests / dev).
 */
export async function getAccountUserContext(
  request: Request
): Promise<AccountUserContextResult> {
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
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        },
      };
    }
  }

  // Fallback pour requêtes API avec userId ou email explicite (tests d'intégration)
  const { searchParams } = new URL(request.url);
  const paramUserId = searchParams.get("userId");
  const paramEmail = searchParams.get("email");

  if (paramUserId || paramEmail) {
    const user = await db.user.findFirst({
      where: {
        OR: [
          ...(paramUserId ? [{ id: paramUserId }] : []),
          ...(paramEmail ? [{ email: paramEmail }] : []),
        ],
      },
    });

    if (user) {
      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        },
      };
    }
  }

  return { error: "Non authentifié. Veuillez vous connecter.", status: 401 };
}

export interface FormattedAccountBooking {
  id: string;
  reference: string;
  venueName: string;
  venueSlug: string;
  venueImage: string;
  serviceName: string;
  artisanName: string;
  date: string;
  time: string;
  rawDate: string;
  price: number;
  depositAmount: number;
  totalPriceCents: number;
  depositCents: number;
  remainingCents: number;
  status: "confirmed" | "completed" | "cancelled";
  paymentStatus: PaymentStatus;
  address: string;
  cancellationDelayHours: number;
  isEligibleForRefund: boolean;
  hasReview: boolean;
  review?: {
    id: string;
    rating: number;
    comment: string;
    isVerified: boolean;
    reply?: string | null;
  } | null;
}

export interface CustomerBookingsResult {
  upcoming: FormattedAccountBooking[];
  past: FormattedAccountBooking[];
  counts: {
    upcoming: number;
    past: number;
    total: number;
  };
}

/**
 * Récupère l'ensemble des réservations d'un client (à venir et passées).
 */
export async function getCustomerBookings(
  user: AccountUser
): Promise<CustomerBookingsResult> {
  const bookings = await db.booking.findMany({
    where: {
      OR: [
        { customer: { userId: user.id } },
        { clientEmail: user.email },
        ...(user.phone ? [{ clientPhone: user.phone }] : []),
      ],
    },
    include: {
      venue: true,
      items: {
        include: {
          service: true,
          staff: true,
        },
      },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const upcoming: FormattedAccountBooking[] = [];
  const past: FormattedAccountBooking[] = [];

  for (const b of bookings) {
    const primaryItem = b.items[0];
    const startTime = primaryItem?.startTime || b.createdAt;

    // Calcul du délai restant avant la prestation pour la politique d'annulation
    const hoursBefore =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const delayAllowed = b.venue.cancellationDelayHours ?? 24;
    const isEligibleForRefund =
      b.status === BookingStatus.CONFIRMED && hoursBefore >= delayAllowed;

    const dateFormatted = startTime.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    });

    const timeFormatted = startTime
      .toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Paris",
      })
      .replace(":", "h");

    const formatted: FormattedAccountBooking = {
      id: b.id,
      reference: b.reference,
      venueName: b.venue.name,
      venueSlug: b.venue.slug,
      venueImage: "/images/venues/atelier-botanique.jpg",
      serviceName: primaryItem?.service.name || "Soin & Rituel Belora",
      artisanName: primaryItem?.staff.name || "Artisan Belora",
      date: dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1),
      time: timeFormatted,
      rawDate: startTime.toISOString(),
      price: b.totalPriceCents / 100,
      depositAmount: b.depositCents / 100,
      totalPriceCents: b.totalPriceCents,
      depositCents: b.depositCents,
      remainingCents: b.remainingCents,
      status: b.status.toLowerCase() as "confirmed" | "completed" | "cancelled",
      paymentStatus: b.paymentStatus,
      address: `${b.venue.address}, ${b.venue.postalCode} ${b.venue.city}`,
      cancellationDelayHours: delayAllowed,
      isEligibleForRefund,
      hasReview: Boolean(b.review),
      review: b.review
        ? {
            id: b.review.id,
            rating: b.review.rating,
            comment: b.review.comment,
            isVerified: b.review.isVerified,
            reply: b.review.reply,
          }
        : null,
    };

    if (
      b.status === BookingStatus.CONFIRMED &&
      startTime.getTime() >= now.getTime()
    ) {
      upcoming.push(formatted);
    } else {
      past.push(formatted);
    }
  }

  // Tri des rdv à venir : les plus proches chronologiquement en premier
  upcoming.sort(
    (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );

  // Tri de l'historique : les plus récents en premier
  past.sort(
    (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );

  return {
    upcoming,
    past,
    counts: {
      upcoming: upcoming.length,
      past: past.length,
      total: bookings.length,
    },
  };
}

export interface CancelBookingResult {
  success: boolean;
  bookingId: string;
  isRefunded: boolean;
  refundAmountEuros: number;
  message: string;
}

/**
 * Annule une réservation par le client en appliquant la politique du salon.
 */
export async function cancelBookingByCustomer(
  bookingId: string,
  user: AccountUser,
  reason?: string
): Promise<CancelBookingResult> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      venue: true,
      items: true,
      customer: true,
    },
  });

  if (!booking) {
    throw new Error("Réservation introuvable.");
  }

  // Vérification des droits du client sur cette réservation
  const isOwner =
    booking.customer?.userId === user.id ||
    booking.clientEmail === user.email ||
    (user.phone && booking.clientPhone === user.phone);

  if (!isOwner && user.role !== Role.ADMIN) {
    throw new Error("Vous n'êtes pas autorisé à annuler cette réservation.");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    throw new Error("Ce rendez-vous est déjà annulé.");
  }

  if (booking.status === BookingStatus.COMPLETED) {
    throw new Error("Un rendez-vous déjà honoré ne peut plus être annulé.");
  }

  const primaryItem = booking.items[0];
  const startTime = primaryItem?.startTime || booking.createdAt;
  const now = new Date();

  const hoursRemaining =
    (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const delayAllowed = booking.venue.cancellationDelayHours ?? 24;

  const isEligibleForRefund = hoursRemaining >= delayAllowed;
  let refundSuccess = false;

  // Remboursement Stripe si éligible et si un acompte avait été versé
  if (isEligibleForRefund && booking.depositCents > 0 && booking.stripePaymentIntentId) {
    try {
      await refundPaymentIntent(
        booking.stripePaymentIntentId,
        booking.depositCents
      );
      refundSuccess = true;
    } catch (stripeErr) {
      console.warn("Échec du remboursement Stripe automatique:", stripeErr);
    }
  }

  const updatedPaymentStatus = refundSuccess
    ? PaymentStatus.REFUNDED
    : booking.paymentStatus;

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason?.trim() || "Annulé par le client",
      cancelledAt: now,
      paymentStatus: updatedPaymentStatus,
    },
  });

  // Notification e-mail d'annulation via Resend
  await sendBookingCancellationEmail(
    booking.id,
    reason || "Annulé par le client via l'espace Belora"
  );

  const refundAmountEuros = refundSuccess ? booking.depositCents / 100 : 0;
  const message = isEligibleForRefund
    ? refundSuccess
      ? `Réservation annulée. Votre acompte de ${refundAmountEuros.toFixed(2)} € a été remboursé sur votre carte bancaire.`
      : "Réservation annulée. Remboursement de l'acompte pris en compte."
    : `Réservation annulée. Le délai d'annulation sans frais (${delayAllowed}h) étant dépassé, l'acompte est conservé par l'établissement.`;

  return {
    success: true,
    bookingId,
    isRefunded: refundSuccess,
    refundAmountEuros,
    message,
  };
}

/**
 * Crée un avis certifié sur un rendez-vous complété.
 */
export async function createReviewForBooking(
  input: CreateReviewInput,
  user: AccountUser
) {
  const booking = await db.booking.findUnique({
    where: { id: input.bookingId },
    include: {
      customer: true,
      review: true,
    },
  });

  if (!booking) {
    throw new Error("Réservation introuvable.");
  }

  const isOwner =
    booking.customer?.userId === user.id ||
    booking.clientEmail === user.email ||
    (user.phone && booking.clientPhone === user.phone);

  if (!isOwner && user.role !== Role.ADMIN) {
    throw new Error("Vous n'êtes pas autorisé à laisser un avis sur cette réservation.");
  }

  if (booking.review) {
    throw new Error("Un avis a déjà été publié pour cette réservation.");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new Error("Seul un rendez-vous honoré (terminé) peut faire l'objet d'un avis client.");
  }

  const authorName =
    `${user.firstName} ${user.lastName}`.trim() || booking.clientName;

  const review = await db.review.create({
    data: {
      venueId: booking.venueId,
      bookingId: booking.id,
      userId: user.id,
      authorName,
      rating: input.rating,
      comment: input.comment.trim(),
      isVerified: true,
    },
  });

  return review;
}

/**
 * Met à jour les informations du profil client.
 */
export async function updateCustomerProfile(
  userId: string,
  input: UpdateCustomerProfileInput
) {
  const user = await db.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
      ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
      ...(input.phone ? { phone: input.phone.trim() } : {}),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  // Mettre à jour les CRM Customer associés
  if (input.firstName || input.lastName || input.phone) {
    await db.customerCRM.updateMany({
      where: { userId },
      data: {
        ...(input.firstName ? { firstName: input.firstName.trim() } : {}),
        ...(input.lastName ? { lastName: input.lastName.trim() } : {}),
        ...(input.phone ? { phone: input.phone.trim() } : {}),
      },
    });
  }

  return user;
}
