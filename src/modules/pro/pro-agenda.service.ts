import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import {
  timeStringToMinutes,
  minutesToTimeString,
  createUtcDateFromLocal,
  formatUtcToLocalParts,
  getDayOfWeekFromDateString,
} from "@/modules/availability/time-utils";
import {
  CreateProAppointmentInput,
  UpdateProAppointmentInput,
  ClockInStaffInput,
  UpdateStaffPresenceInput,
} from "@/lib/validations/pro-agenda.schema";
import { ProAppointment, ProStaffMember, ProResource, ProService, ProClient } from "@/lib/data/pro-mock-data";

/**
 * Résout le contexte de l'établissement professionnel (venueId)
 * à partir de la session NextAuth, avec fallback sécurisé pour le développement et les tests.
 */
export async function getProVenueContext(
  request?: Request
): Promise<{ venueId: string; userId?: string } | { error: string; status: number }> {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  // 1. Session NextAuth valide
  if (session?.user?.venueId) {
    return { venueId: session.user.venueId, userId: session.user.id };
  }

  // 2. Paramètre venueId ou en-tête x-venue-id (dev, tests automatisés ou administrateur)
  const url = request ? new URL(request.url) : null;
  const paramVenueId =
    url?.searchParams.get("venueId") || request?.headers.get("x-venue-id");

  if (paramVenueId) {
    const venue = await db.venue.findUnique({
      where: { id: paramVenueId },
      select: { id: true },
    });
    if (venue) {
      return { venueId: venue.id, userId: session?.user?.id };
    }
  }

  // 3. Fallback dev / test (premier salon seed : L'Atelier Botanique)
  if (process.env.NODE_ENV !== "production") {
    const fallbackVenue = await db.venue.findFirst({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    if (fallbackVenue) {
      return { venueId: fallbackVenue.id, userId: session?.user?.id };
    }
  }

  return { error: "Non autorisé. Accès réservé aux professionnels connectés.", status: 401 };
}

/**
 * Mappe un statut Prisma vers le statut attendu par l'interface Pro.
 */
function mapPrismaStatusToPro(status: BookingStatus): ProAppointment["status"] {
  switch (status) {
    case BookingStatus.COMPLETED:
      return "completed";
    case BookingStatus.CANCELLED:
      return "cancelled";
    case BookingStatus.NO_SHOW:
      return "no_show";
    case BookingStatus.PENDING_PAYMENT:
    case BookingStatus.CONFIRMED:
    default:
      return "confirmed";
  }
}

/**
 * Mappe un statut d'interface Pro vers le statut Prisma.
 */
function mapProStatusToPrisma(status: string): BookingStatus {
  const s = status.toLowerCase();
  switch (s) {
    case "completed":
      return BookingStatus.COMPLETED;
    case "cancelled":
      return BookingStatus.CANCELLED;
    case "no_show":
      return BookingStatus.NO_SHOW;
    case "confirmed":
    case "in_progress":
    default:
      return BookingStatus.CONFIRMED;
  }
}

/**
 * Récupère les rendez-vous du salon pour une plage temporelle.
 */
export async function getProAppointments(params: {
  venueId: string;
  startDate?: string;
  endDate?: string;
  staffId?: string;
  status?: string;
}): Promise<ProAppointment[]> {
  const { venueId, startDate, endDate, staffId, status } = params;

  // Calcul des bornes UTC
  let rangeStart: Date;
  let rangeEnd: Date;

  if (startDate) {
    rangeStart = createUtcDateFromLocal(startDate, 0);
  } else {
    // Par défaut : 30 jours dans le passé
    rangeStart = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  }

  if (endDate) {
    rangeEnd = createUtcDateFromLocal(endDate, 23 * 60 + 59);
  } else if (startDate) {
    // Si startDate seul est fourni : jusqu'à la fin de cette même journée
    rangeEnd = createUtcDateFromLocal(startDate, 23 * 60 + 59);
  } else {
    // Par défaut : 60 jours dans le futur
    rangeEnd = new Date(Date.now() + 60 * 24 * 3600 * 1000);
  }

  const items = await db.bookingItem.findMany({
    where: {
      booking: {
        venueId,
        ...(status ? { status: mapProStatusToPrisma(status) } : {}),
      },
      startTime: {
        gte: rangeStart,
        lte: rangeEnd,
      },
      ...(staffId ? { staffId } : {}),
    },
    include: {
      booking: {
        include: {
          customer: true,
        },
      },
      service: true,
      staff: true,
      resource: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return items.map((item) => {
    const { date, time: startTimeStr } = formatUtcToLocalParts(item.startTime);
    const { time: endTimeStr } = formatUtcToLocalParts(item.endTime);

    return {
      id: item.booking.id,
      clientId: item.booking.customerId || item.booking.customer?.id || "",
      clientName: item.booking.clientName,
      clientPhone: item.booking.clientPhone,
      clientEmail: item.booking.clientEmail || "",
      serviceId: item.serviceId,
      serviceName: item.service.name,
      staffId: item.staffId,
      staffName: item.staff.name,
      resourceId: item.resourceId || undefined,
      resourceName: item.resource?.name || undefined,
      date,
      startTime: startTimeStr,
      endTime: endTimeStr,
      price: item.priceCents / 100,
      depositPaid: item.booking.depositCents / 100,
      status: mapPrismaStatusToPro(item.booking.status),
      isRecurring: (item.booking.customer?.totalVisits ?? 0) > 1,
      notes: item.booking.notes || undefined,
    };
  });
}

/**
 * Création manuelle d'un rendez-vous pris au salon ou par téléphone.
 */
export async function createManualProAppointment(
  input: CreateProAppointmentInput & { venueId: string }
): Promise<ProAppointment> {
  const { venueId } = input;

  // 1. Récupération et vérification de la prestation
  const service = await db.service.findFirst({
    where: { id: input.serviceId, venueId, isActive: true },
  });
  if (!service) {
    throw new Error("Prestation introuvable ou inactive.");
  }

  // 2. Récupération et vérification du collaborateur
  const staff = await db.staffMember.findFirst({
    where: { id: input.staffId, venueId, isActive: true },
  });
  if (!staff) {
    throw new Error("Collaborateur introuvable ou inactif.");
  }

  // 3. Récupération de la ressource optionnelle
  let resource = null;
  if (input.resourceId) {
    resource = await db.resource.findFirst({
      where: { id: input.resourceId, venueId, isActive: true },
    });
  }

  // 4. Calcul précis des horaires UTC
  const startMinutes = timeStringToMinutes(input.startTime);
  const endMinutes = input.endTime
    ? timeStringToMinutes(input.endTime)
    : startMinutes + service.durationMinutes;

  const startUtc = createUtcDateFromLocal(input.date, startMinutes);
  const endUtc = createUtcDateFromLocal(input.date, endMinutes);

  // 5. Détection anti-collision stricte pour le collaborateur
  const collision = await db.bookingItem.findFirst({
    where: {
      staffId: staff.id,
      booking: {
        venueId,
        status: { notIn: [BookingStatus.CANCELLED] },
      },
      startTime: { lt: endUtc },
      endTime: { gt: startUtc },
    },
  });

  if (collision) {
    throw new Error("Ce collaborateur a déjà un rendez-vous sur cette plage horaire.");
  }

  // 6. Résolution ou création de la fiche client CRM
  let customer = null;
  if (input.clientId) {
    customer = await db.customerCRM.findFirst({
      where: { id: input.clientId, venueId },
    });
  }

  if (!customer && input.clientPhone) {
    customer = await db.customerCRM.findFirst({
      where: { venueId, phone: input.clientPhone },
    });
  }

  const priceCents =
    input.price !== undefined ? Math.round(input.price * 100) : service.priceCents;
  const depositCents =
    input.depositPaid !== undefined ? Math.round(input.depositPaid * 100) : 0;

  if (!customer) {
    const nameParts = input.clientName.trim().split(" ");
    const firstName = nameParts[0] || "Client";
    const lastName = nameParts.slice(1).join(" ") || "Salon";

    customer = await db.customerCRM.create({
      data: {
        venueId,
        firstName,
        lastName,
        phone: input.clientPhone,
        email: input.clientEmail || null,
        totalVisits: 1,
        totalSpentCents: priceCents,
        lastVisitAt: startUtc,
      },
    });
  } else {
    await db.customerCRM.update({
      where: { id: customer.id },
      data: {
        totalVisits: { increment: 1 },
        totalSpentCents: { increment: priceCents },
        lastVisitAt: startUtc,
      },
    });
  }

  // 7. Création de la réservation et de son BookingItem
  const reference = `#BEL-${Math.floor(10000 + Math.random() * 90000)}`;

  const booking = await db.booking.create({
    data: {
      reference,
      venueId,
      customerId: customer.id,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail || customer.email || null,
      status: BookingStatus.CONFIRMED,
      totalPriceCents: priceCents,
      depositCents,
      remainingCents: Math.max(0, priceCents - depositCents),
      paymentStatus: depositCents > 0 ? PaymentStatus.SUCCEEDED : PaymentStatus.PENDING,
      notes: input.notes,
      items: {
        create: {
          serviceId: service.id,
          staffId: staff.id,
          resourceId: resource?.id || null,
          startTime: startUtc,
          endTime: endUtc,
          priceCents,
        },
      },
    },
    include: {
      items: {
        include: {
          service: true,
          staff: true,
          resource: true,
        },
      },
      customer: true,
    },
  });

  const createdItem = booking.items[0];
  const { date, time: startTimeStr } = formatUtcToLocalParts(createdItem.startTime);
  const { time: endTimeStr } = formatUtcToLocalParts(createdItem.endTime);

  return {
    id: booking.id,
    clientId: customer.id,
    clientName: booking.clientName,
    clientPhone: booking.clientPhone,
    clientEmail: booking.clientEmail || "",
    serviceId: createdItem.serviceId,
    serviceName: createdItem.service.name,
    staffId: createdItem.staffId,
    staffName: createdItem.staff.name,
    resourceId: createdItem.resourceId || undefined,
    resourceName: createdItem.resource?.name || undefined,
    date,
    startTime: startTimeStr,
    endTime: endTimeStr,
    price: createdItem.priceCents / 100,
    depositPaid: booking.depositCents / 100,
    status: mapPrismaStatusToPro(booking.status),
    isRecurring: (customer.totalVisits ?? 0) > 1,
    notes: booking.notes || undefined,
  };
}

/**
 * Mise à jour d'un rendez-vous (déplacement horaire, changement collaborateur, statut).
 */
export async function updateProAppointment(
  appointmentId: string,
  input: UpdateProAppointmentInput & { venueId: string }
): Promise<ProAppointment> {
  const { venueId } = input;

  // Recherche par Booking.id ou Booking.reference ou BookingItem.id
  let booking = await db.booking.findFirst({
    where: {
      venueId,
      OR: [{ id: appointmentId }, { reference: appointmentId }],
    },
    include: {
      items: {
        include: {
          service: true,
          staff: true,
          resource: true,
        },
      },
      customer: true,
    },
  });

  if (!booking) {
    const item = await db.bookingItem.findUnique({
      where: { id: appointmentId },
      include: {
        booking: {
          include: {
            items: {
              include: {
                service: true,
                staff: true,
                resource: true,
              },
            },
            customer: true,
          },
        },
      },
    });

    if (item && item.booking.venueId === venueId) {
      booking = item.booking;
    }
  }

  if (!booking) {
    throw new Error("Rendez-vous introuvable.");
  }

  const primaryItem = booking.items[0];
  if (!primaryItem) {
    throw new Error("Le rendez-vous ne contient aucune prestation associée.");
  }

  // 1. Mise à jour du statut
  let updatedBookingStatus = booking.status;
  let cancelledAt = booking.cancelledAt;
  let cancellationReason = booking.cancellationReason;

  if (input.status) {
    updatedBookingStatus = mapProStatusToPrisma(input.status);
    if (updatedBookingStatus === BookingStatus.CANCELLED) {
      cancelledAt = new Date();
      cancellationReason = input.cancellationReason || "Annulé par le salon";
    }
  }

  // 2. Déplacement horaire ou changement collaborateur / ressource
  let newStartTime = primaryItem.startTime;
  let newEndTime = primaryItem.endTime;
  let newStaffId = primaryItem.staffId;
  let newResourceId = primaryItem.resourceId;

  if (input.staffId) {
    const staff = await db.staffMember.findFirst({
      where: { id: input.staffId, venueId, isActive: true },
    });
    if (!staff) throw new Error("Nouveau collaborateur introuvable.");
    newStaffId = staff.id;
  }

  if (input.resourceId !== undefined) {
    newResourceId = input.resourceId;
  }

  if (input.date || input.startTime || input.endTime) {
    const currentParts = formatUtcToLocalParts(primaryItem.startTime);
    const targetDate = input.date || currentParts.date;
    const targetStart = input.startTime || currentParts.time;

    const startMin = timeStringToMinutes(targetStart);
    let endMin: number;

    if (input.endTime) {
      endMin = timeStringToMinutes(input.endTime);
    } else {
      const currentDuration = Math.round(
        (primaryItem.endTime.getTime() - primaryItem.startTime.getTime()) / (60 * 1000)
      );
      endMin = startMin + currentDuration;
    }

    newStartTime = createUtcDateFromLocal(targetDate, startMin);
    newEndTime = createUtcDateFromLocal(targetDate, endMin);

    // Vérification de collision uniquement si le RDV n'est pas annulé
    if (updatedBookingStatus !== BookingStatus.CANCELLED) {
      const collision = await db.bookingItem.findFirst({
        where: {
          id: { not: primaryItem.id },
          staffId: newStaffId,
          booking: {
            venueId,
            status: { notIn: [BookingStatus.CANCELLED] },
          },
          startTime: { lt: newEndTime },
          endTime: { gt: newStartTime },
        },
      });

      if (collision) {
        throw new Error("Ce créneau chevauche un autre rendez-vous du collaborateur.");
      }
    }
  }

  // 3. Sauvegarde en transaction
  const updated = await db.$transaction(async (tx) => {
    await tx.bookingItem.update({
      where: { id: primaryItem.id },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
        staffId: newStaffId,
        resourceId: newResourceId,
      },
    });

    return tx.booking.update({
      where: { id: booking!.id },
      data: {
        status: updatedBookingStatus,
        cancelledAt,
        cancellationReason,
        notes: input.notes !== undefined ? input.notes : booking!.notes,
      },
      include: {
        items: {
          include: {
            service: true,
            staff: true,
            resource: true,
          },
        },
        customer: true,
      },
    });
  });

  const updatedItem = updated.items[0];
  const { date, time: startTimeStr } = formatUtcToLocalParts(updatedItem.startTime);
  const { time: endTimeStr } = formatUtcToLocalParts(updatedItem.endTime);

  return {
    id: updated.id,
    clientId: updated.customerId || updated.customer?.id || "",
    clientName: updated.clientName,
    clientPhone: updated.clientPhone,
    clientEmail: updated.clientEmail || "",
    serviceId: updatedItem.serviceId,
    serviceName: updatedItem.service.name,
    staffId: updatedItem.staffId,
    staffName: updatedItem.staff.name,
    resourceId: updatedItem.resourceId || undefined,
    resourceName: updatedItem.resource?.name || undefined,
    date,
    startTime: startTimeStr,
    endTime: endTimeStr,
    price: updatedItem.priceCents / 100,
    depositPaid: updated.depositCents / 100,
    status: mapPrismaStatusToPro(updated.status),
    isRecurring: (updated.customer?.totalVisits ?? 0) > 1,
    notes: updated.notes || undefined,
  };
}

/**
 * Annulation d'un rendez-vous avec libération du créneau.
 */
export async function deleteProAppointment(
  appointmentId: string,
  venueId: string
): Promise<{ success: boolean; message: string }> {
  return updateProAppointment(appointmentId, {
    venueId,
    status: "cancelled",
    cancellationReason: "Supprimé depuis l'Agenda Pro",
  }).then(() => ({ success: true, message: "Rendez-vous annulé avec succès." }));
}

/**
 * Enregistrement du pointage (arrivée / départ) d'un collaborateur pour la journée.
 */
export async function clockInStaffMember(
  input: ClockInStaffInput & { venueId: string }
): Promise<{
  staffId: string;
  clockedIn: boolean;
  clockInTime?: string;
  message: string;
}> {
  const { venueId, staffId, action = "toggle" } = input;

  const staff = await db.staffMember.findFirst({
    where: { id: staffId, venueId, isActive: true },
  });
  if (!staff) {
    throw new Error("Collaborateur introuvable.");
  }

  // Détermination de la date du jour (début et fin de journée)
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Recherche d'un pointage ouvert aujourd'hui
  const openClockIn = await db.staffClockIn.findFirst({
    where: {
      staffId: staff.id,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
      clockOutTime: null,
    },
    orderBy: { clockInTime: "desc" },
  });

  const timeFormatted = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (action === "clock-out" || (action === "toggle" && openClockIn)) {
    if (!openClockIn) {
      throw new Error("Aucun pointage d'arrivée ouvert aujourd'hui pour ce collaborateur.");
    }
    await db.staffClockIn.update({
      where: { id: openClockIn.id },
      data: { clockOutTime: now },
    });

    return {
      staffId: staff.id,
      clockedIn: false,
      message: `Départ de ${staff.name} enregistré à ${timeFormatted}.`,
    };
  } else {
    // Enregistrement d'une nouvelle arrivée
    const created = await db.staffClockIn.create({
      data: {
        staffId: staff.id,
        date: todayStart,
        clockInTime: now,
      },
    });

    const clockInStr = created.clockInTime.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      staffId: staff.id,
      clockedIn: true,
      clockInTime: clockInStr,
      message: `Arrivée de ${staff.name} enregistrée à ${clockInStr}.`,
    };
  }
}

/**
 * Mise à jour des plages de présence planifiées de l'équipe pour la journée.
 */
export async function updateStaffPresence(
  input: UpdateStaffPresenceInput & { venueId: string }
): Promise<{ success: boolean; count: number }> {
  const { venueId, updates, date } = input;

  const targetDateStr = date || new Date().toISOString().split("T")[0];
  const dayOfWeek = getDayOfWeekFromDateString(targetDateStr);

  let updatedCount = 0;

  for (const update of updates) {
    const staff = await db.staffMember.findFirst({
      where: { id: update.staffId, venueId },
    });
    if (!staff) continue;

    await db.staffSchedule.upsert({
      where: {
        staffId_dayOfWeek: {
          staffId: staff.id,
          dayOfWeek,
        },
      },
      create: {
        staffId: staff.id,
        dayOfWeek,
        plannedStart: update.plannedStart,
        plannedEnd: update.plannedEnd,
        isActive: true,
      },
      update: {
        plannedStart: update.plannedStart,
        plannedEnd: update.plannedEnd,
        isActive: true,
      },
    });
    updatedCount++;
  }

  return { success: true, count: updatedCount };
}

/**
 * Récupère les collaborateurs d'un salon avec leurs horaires et état de pointage du jour.
 */
export async function getProStaffMembers(venueId: string): Promise<ProStaffMember[]> {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Dimanche, 1 = Lundi, ...

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const staff = await db.staffMember.findMany({
    where: { venueId, isActive: true },
    include: {
      user: {
        select: {
          email: true,
          phone: true,
        },
      },
      schedules: {
        where: { dayOfWeek, isActive: true },
      },
      clockIns: {
        where: {
          date: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        orderBy: { clockInTime: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return staff.map((s) => {
    const todaySchedule = s.schedules[0];
    const plannedStart = todaySchedule?.plannedStart || "09:00";
    const plannedEnd = todaySchedule?.plannedEnd || "19:00";

    const latestClockIn = s.clockIns[0];
    const isClockedIn = Boolean(latestClockIn && !latestClockIn.clockOutTime);

    let clockInTimeStr: string | undefined = undefined;
    if (latestClockIn) {
      clockInTimeStr = latestClockIn.clockInTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Calcul du temps total pointé aujourd'hui
    let totalMinutesLogged = 0;
    for (const entry of s.clockIns) {
      const endTime = entry.clockOutTime || (isClockedIn ? new Date() : entry.clockInTime);
      const diffMs = endTime.getTime() - entry.clockInTime.getTime();
      totalMinutesLogged += Math.max(0, Math.floor(diffMs / (60 * 1000)));
    }
    const loggedHours = Math.floor(totalMinutesLogged / 60);
    const loggedMinutes = totalMinutesLogged % 60;
    const totalLogged = `${loggedHours}h${String(loggedMinutes).padStart(2, "0")}`;

    return {
      id: s.id,
      name: s.name,
      role: s.role,
      email: s.user?.email || "collaborateur@belora.com",
      phone: s.user?.phone || "",
      avatar: s.avatarUrl || "/images/artisans/artisan-1.jpg",
      color: s.color || "#82385a",
      active: s.isActive,
      presenceToday: {
        plannedStart,
        plannedEnd,
        clockedIn: isClockedIn,
        clockInTime: isClockedIn ? clockInTimeStr : undefined,
        totalLogged,
      },
    };
  });
}

/**
 * Récupère les ressources matérielles (fauteuils, cabines, bacs) d'un salon.
 */
export async function getProResources(venueId: string): Promise<ProResource[]> {
  const resources = await db.resource.findMany({
    where: { venueId, isActive: true },
    orderBy: { name: "asc" },
  });

  return resources.map((r) => {
    let type: "cabin" | "chair" | "room" = "chair";
    const lower = (r.type || "").toLowerCase();
    if (lower.includes("cabine")) type = "cabin";
    else if (lower.includes("pièce") || lower.includes("room")) type = "room";

    return {
      id: r.id,
      name: r.name,
      type,
      color: r.color || "#71717a",
      active: r.isActive,
    };
  });
}

/**
 * Récupère les prestations d'un salon pour les modales de rendez-vous.
 */
export async function getProServices(venueId: string): Promise<ProService[]> {
  const services = await db.service.findMany({
    where: { venueId, isActive: true },
    include: {
      category: true,
    },
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
  });

  return services.map((s) => ({
    id: s.id,
    name: s.name,
    categoryId: s.categoryId,
    durationMinutes: s.durationMinutes,
    breakDurationMinutes: s.processingTimeMinutes || 0,
    priceEuros: s.priceCents / 100,
    depositRequired: s.depositRequired,
    depositAmountEuros: s.depositCents / 100,
    assignedStaffIds: [], // Ouvert à tous les collaborateurs par défaut
    description: s.description || "",
  }));
}

/**
 * Récupère la liste des clients CRM du salon.
 */
export async function getProClients(
  venueId: string,
  search?: string
): Promise<ProClient[]> {
  const customers = await db.customerCRM.findMany({
    where: {
      venueId,
      ...(search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { lastName: "asc" },
    take: 50,
  });

  return customers.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    email: c.email || "",
    createdAt: c.createdAt.toISOString(),
    lastVisit: c.lastVisitAt
      ? c.lastVisitAt.toISOString().split("T")[0]
      : c.createdAt.toISOString().split("T")[0],
    totalVisits: c.totalVisits,
    totalSpent: c.totalSpentCents / 100,
    isVip: c.isVip,
    notes: c.notes || undefined,
  }));
}
