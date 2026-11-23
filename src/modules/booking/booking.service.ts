import { db } from "@/lib/db";
import { BookingChannel, BookingStatus, PaymentStatus } from "@prisma/client";
import { calculateDeposit } from "@/lib/utils/money";
import { computeCommission, resolveCommissionRate } from "@/modules/billing/commission";
import { getPlatformSettings, toCommissionPolicy } from "@/modules/billing/platform-settings.service";
import { hasActiveAccess, resolveSubscriptionState } from "@/modules/billing/subscription-state";
import { createBookingPaymentIntent } from "@/lib/stripe";
import { LockService } from "@/modules/availability/lock.service";

export interface CreateBookingInput {
  venueId: string;
  serviceIds: string[];
  staffId?: string | null;
  startTime: string | Date;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  userId?: string | null;
  /** Origine de la réservation : détermine l'application de la commission. */
  channel?: BookingChannel;
}

export async function createBookingTransaction(input: CreateBookingInput) {
  const { venueId, serviceIds, staffId, notes, userId, customer: customerInput } = input;
  const channel = input.channel ?? BookingChannel.MARKETPLACE;

  if (!serviceIds || serviceIds.length === 0) {
    throw new Error("Veuillez sélectionner au moins une prestation.");
  }

  const startDate = new Date(input.startTime);
  if (isNaN(startDate.getTime())) {
    throw new Error("Date et heure de réservation invalides.");
  }

  // 1. Récupération de l'établissement
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    include: {
      staff: { where: { isActive: true } },
      openingHours: true,
      subscription: { include: { plan: true } },
    },
  });

  if (!venue) {
    throw new Error("Établissement introuvable.");
  }

  const platformSetting = await getPlatformSettings();

  // Réservations en ligne : plateforme ouverte et abonnement du salon actif
  if (channel !== BookingChannel.IN_SALON) {
    if (platformSetting.maintenanceMode) {
      throw new Error("La réservation en ligne est momentanément indisponible. Veuillez réessayer un peu plus tard.");
    }
    if (venue.subscription && !hasActiveAccess(resolveSubscriptionState(venue.subscription))) {
      throw new Error("Cet établissement ne prend pas de réservation en ligne pour le moment. Contactez-le directement.");
    }
  }

  // 2. Récupération et vérification des prestations
  const services = await db.service.findMany({
    where: {
      id: { in: serviceIds },
      venueId,
      isActive: true,
    },
  });

  if (services.length !== serviceIds.length) {
    throw new Error("Une ou plusieurs prestations sélectionnées ne sont plus disponibles.");
  }

  // 3. Calculs financiers et durées
  const totalDurationMinutes = services.reduce((acc, s) => acc + s.durationMinutes, 0);
  const endDate = new Date(startDate.getTime() + totalDurationMinutes * 60 * 1000);
  const subtotalCents = services.reduce((acc, s) => acc + s.priceCents, 0);

  // Acompte exigé : somme des acomptes individuels ou 30% si une prestation l'exige
  const requiresAnyDeposit = services.some((s) => s.depositRequired || s.depositCents > 0);
  let depositCents = 0;
  if (requiresAnyDeposit) {
    const sumCustomDeposits = services.reduce((acc, s) => acc + s.depositCents, 0);
    depositCents = sumCustomDeposits > 0 ? sumCustomDeposits : calculateDeposit(subtotalCents, 30);
  }

  const remainingCents = Math.max(0, subtotalCents - depositCents);
  const commissionPolicy = toCommissionPolicy(platformSetting);
  const commissionRate = resolveCommissionRate({
    venueRate: venue.commissionRate,
    venueRateUntil: venue.commissionRateUntil,
    planRate: venue.subscription?.plan.commissionRate ?? null,
    platformRate: platformSetting.defaultCommissionRate,
  });

  // 4. Exécution atomique sous transaction Prisma
  return await db.$transaction(async (tx) => {
    // 4.1 Résolution du collaborateur (artisan)
    let resolvedStaffId = staffId && staffId !== "any" ? staffId : null;

    if (resolvedStaffId) {
      const staffMember = venue.staff.find((s) => s.id === resolvedStaffId);
      if (!staffMember) {
        throw new Error("L'artisan sélectionné n'est pas disponible pour cet établissement.");
      }
    } else {
      // Attribution automatique du premier collaborateur disponible sans conflit
      for (const candidate of venue.staff) {
        const conflict = await tx.bookingItem.findFirst({
          where: {
            staffId: candidate.id,
            booking: {
              status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT] },
            },
            startTime: { lt: endDate },
            endTime: { gt: startDate },
          },
        });
        if (!conflict) {
          resolvedStaffId = candidate.id;
          break;
        }
      }

      if (!resolvedStaffId) {
        resolvedStaffId = venue.staff[0]?.id;
      }
    }

    if (!resolvedStaffId) {
      throw new Error("Aucun artisan n'est disponible pour réaliser ces prestations.");
    }

    // 4.2 Détection stricte d'anti-collision (race condition)
    const activeCollision = await tx.bookingItem.findFirst({
      where: {
        staffId: resolvedStaffId,
        booking: {
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING_PAYMENT] },
        },
        startTime: { lt: endDate },
        endTime: { gt: startDate },
      },
    });

    if (activeCollision) {
      throw new Error("Ce créneau vient d'être réservé par un autre client. Veuillez choisir un autre horaire.");
    }

    // 4.3 Profil Client CRM (Rapprochement par e-mail ou téléphone)
    const normalizedEmail = customerInput.email.toLowerCase().trim();
    const normalizedPhone = customerInput.phone.trim();

    let customer = await tx.customerCRM.findFirst({
      where: {
        venueId,
        OR: [
          { email: normalizedEmail },
          { phone: normalizedPhone },
        ],
      },
    });

    const nameParts = customerInput.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Un client déjà présent dans le fichier du salon est un habitué : pas de commission « nouveau client »
    const isNewClient = !customer;
    const commission = computeCommission(commissionPolicy, {
      channel,
      isNewClient,
      totalCents: subtotalCents,
      onlineCents: depositCents,
      rate: commissionRate,
    });

    if (!customer) {
      customer = await tx.customerCRM.create({
        data: {
          venueId,
          userId: userId || null,
          firstName,
          lastName,
          email: normalizedEmail,
          phone: normalizedPhone,
          totalVisits: 1,
          totalSpentCents: 0,
        },
      });
    } else {
      await tx.customerCRM.update({
        where: { id: customer.id },
        data: {
          totalVisits: { increment: 1 },
          userId: userId || customer.userId,
        },
      });
    }

    // 4.4 Génération de la référence unique (#BEL-XXXXX)
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    const reference = `#BEL-${randomCode}`;

    // 4.5 Création de la réservation
    const initialStatus = depositCents > 0 ? BookingStatus.PENDING_PAYMENT : BookingStatus.CONFIRMED;
    const initialPaymentStatus = PaymentStatus.PENDING;

    // Découpage séquentiel des items
    let cumulativeOffsetMs = 0;
    const itemsData = services.map((s) => {
      const itemStart = new Date(startDate.getTime() + cumulativeOffsetMs);
      const itemDurationMs = s.durationMinutes * 60 * 1000;
      const itemEnd = new Date(itemStart.getTime() + itemDurationMs);
      cumulativeOffsetMs += itemDurationMs;

      return {
        serviceId: s.id,
        staffId: resolvedStaffId!,
        startTime: itemStart,
        endTime: itemEnd,
        priceCents: s.priceCents,
      };
    });

    const booking = await tx.booking.create({
      data: {
        reference,
        venueId,
        customerId: customer.id,
        clientName: customerInput.name.trim(),
        clientPhone: normalizedPhone,
        clientEmail: normalizedEmail,
        status: initialStatus,
        totalPriceCents: subtotalCents,
        depositCents,
        remainingCents,
        paymentStatus: initialPaymentStatus,
        channel,
        isNewClient,
        commissionRate: commission.rate,
        commissionCents: commission.commissionCents,
        commissionCollectedCents: commission.collectedCents,
        paymentFeeCents: commission.paymentFeeCents,
        notes: notes || null,
        items: {
          create: itemsData,
        },
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            city: true,
            postalCode: true,
            phone: true,
            currency: true,
            stripeAccountId: true,
          },
        },
        items: {
          include: {
            service: true,
            staff: {
              select: {
                id: true,
                name: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        },
        customer: true,
      },
    });

    // 4.6 Création de l'intention de paiement Stripe si acompte requis
    let stripeClientSecret: string | null = null;
    let stripePaymentIntentId: string | null = null;

    if (depositCents > 0) {
      const intent = await createBookingPaymentIntent({
        amountCents: depositCents,
        currency: venue.currency,
        destinationAccountId: venue.stripeAccountId,
        applicationFeeAmountCents: commission.collectedCents + commission.paymentFeeCents,
        bookingId: booking.id,
        venueId: venue.id,
        customerEmail: normalizedEmail,
        description: `Acompte Belora ${reference} - ${venue.name}`,
      });

      stripeClientSecret = intent.clientSecret;
      stripePaymentIntentId = intent.id;

      await tx.booking.update({
        where: { id: booking.id },
        data: { stripePaymentIntentId },
      });
    }

    // 4.7 Libération d'éventuels verrous temporaires
    const lockKey = LockService.generateLockKey(venueId, resolvedStaffId, startDate);
    await LockService.releaseLock(lockKey);

    return {
      booking: {
        ...booking,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        staffId: resolvedStaffId,
        staff: booking.items[0]?.staff,
      },
      clientSecret: stripeClientSecret,
      stripePaymentIntentId,
      depositCents,
      remainingCents,
      isConfirmed: initialStatus === BookingStatus.CONFIRMED,
    };
  });
}

export async function getBookingById(bookingId: string) {
  return await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      venue: true,
      customer: true,
      items: {
        include: {
          service: true,
          staff: true,
        },
      },
    },
  });
}

export async function getBookingByReference(reference: string) {
  return await db.booking.findUnique({
    where: { reference },
    include: {
      venue: true,
      customer: true,
      items: {
        include: {
          service: true,
          staff: true,
        },
      },
    },
  });
}

export async function cancelBooking(bookingId: string, reason?: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Réservation introuvable.");
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return booking;
  }

  return await db.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancellationReason: reason || null,
      cancelledAt: new Date(),
    },
  });
}
