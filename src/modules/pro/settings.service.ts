import { db } from "@/lib/db";
import {
  MassPriceAdjustmentInput,
  UpdateEstablishmentInput,
  CashRegisterSettingsInput,
  NotificationSettingsInput,
  UpdateStaffScheduleInput,
  CreateStaffMemberInput,
} from "@/lib/validations/settings.schema";
import { ProService, ProServiceCategory, ProStaffMember } from "@/lib/data/pro-mock-data";

const DAY_NAMES = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

// =============================================================================
// CATALOGUE DE PRESTATIONS & CATÉGORIES
// =============================================================================

export async function getProServicesCatalog(venueId: string): Promise<{
  categories: ProServiceCategory[];
  services: ProService[];
}> {
  const [dbCategories, dbServices] = await Promise.all([
    db.serviceCategory.findMany({
      where: { venueId },
      orderBy: { order: "asc" },
    }),
    db.service.findMany({
      where: { venueId, isActive: true },
      include: { category: true },
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    }),
  ]);

  const categories: ProServiceCategory[] = dbCategories.map((c, idx) => ({
    id: c.id,
    name: c.name,
    order: c.order ?? idx,
    colorIndicator: "border-l-primary-600",
  }));

  const services: ProService[] = dbServices.map((s) => ({
    id: s.id,
    name: s.name,
    categoryId: s.categoryId,
    durationMinutes: s.durationMinutes,
    breakDurationMinutes: s.processingTimeMinutes || 0,
    priceEuros: s.priceCents / 100,
    depositRequired: s.depositRequired,
    depositAmountEuros: s.depositCents / 100,
    assignedStaffIds: [],
    description: s.description || "",
  }));

  return { categories, services };
}

export interface UpsertServicePayload {
  name: string;
  categoryId: string;
  durationMinutes: number;
  breakDurationMinutes?: number;
  priceEuros?: number;
  priceCents?: number;
  depositRequired?: boolean;
  depositAmountEuros?: number;
  depositCents?: number;
  description?: string;
  assignedStaffIds?: string[];
  requiredResourceId?: string;
}

export async function createProService(
  venueId: string,
  data: UpsertServicePayload
): Promise<ProService> {
  const category = await db.serviceCategory.findFirst({
    where: { id: data.categoryId, venueId },
  });
  if (!category) {
    throw new Error("Catégorie de prestation introuvable.");
  }

  const priceCents =
    data.priceCents ?? Math.round((data.priceEuros ?? 0) * 100);
  if (priceCents < 100) {
    throw new Error("Le tarif minimal est de 1,00 €.");
  }

  const depositCents = data.depositRequired
    ? data.depositCents ?? Math.round((data.depositAmountEuros ?? 0) * 100)
    : 0;

  if (depositCents > priceCents) {
    throw new Error("L'acompte ne peut excéder le prix total de la prestation.");
  }

  const maxOrder = await db.service.findFirst({
    where: { venueId, categoryId: data.categoryId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const created = await db.service.create({
    data: {
      venueId,
      categoryId: data.categoryId,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      durationMinutes: data.durationMinutes,
      processingTimeMinutes: data.breakDurationMinutes || 0,
      priceCents,
      depositRequired: Boolean(data.depositRequired),
      depositCents,
      order: (maxOrder?.order ?? 0) + 1,
      isActive: true,
    },
  });

  return {
    id: created.id,
    name: created.name,
    categoryId: created.categoryId,
    durationMinutes: created.durationMinutes,
    breakDurationMinutes: created.processingTimeMinutes || 0,
    priceEuros: created.priceCents / 100,
    depositRequired: created.depositRequired,
    depositAmountEuros: created.depositCents / 100,
    assignedStaffIds: data.assignedStaffIds || [],
    requiredResourceId: data.requiredResourceId,
    description: created.description || "",
  };
}

export async function updateProService(
  venueId: string,
  serviceId: string,
  data: Partial<UpsertServicePayload>
): Promise<ProService> {
  const existing = await db.service.findFirst({
    where: { id: serviceId, venueId },
  });
  if (!existing) {
    throw new Error("Prestation introuvable.");
  }

  if (data.categoryId && data.categoryId !== existing.categoryId) {
    const cat = await db.serviceCategory.findFirst({
      where: { id: data.categoryId, venueId },
    });
    if (!cat) throw new Error("Catégorie de destination introuvable.");
  }

  let priceCents = existing.priceCents;
  if (data.priceCents !== undefined) {
    priceCents = data.priceCents;
  } else if (data.priceEuros !== undefined) {
    priceCents = Math.round(data.priceEuros * 100);
  }

  let depositRequired = existing.depositRequired;
  if (data.depositRequired !== undefined) {
    depositRequired = data.depositRequired;
  }

  let depositCents = existing.depositCents;
  if (depositRequired) {
    if (data.depositCents !== undefined) {
      depositCents = data.depositCents;
    } else if (data.depositAmountEuros !== undefined) {
      depositCents = Math.round(data.depositAmountEuros * 100);
    }
  } else {
    depositCents = 0;
  }

  if (depositCents > priceCents) {
    throw new Error("L'acompte ne peut excéder le prix total de la prestation.");
  }

  const updated = await db.service.update({
    where: { id: serviceId },
    data: {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
      ...(data.durationMinutes !== undefined ? { durationMinutes: data.durationMinutes } : {}),
      ...(data.breakDurationMinutes !== undefined ? { processingTimeMinutes: data.breakDurationMinutes } : {}),
      priceCents,
      depositRequired,
      depositCents,
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    categoryId: updated.categoryId,
    durationMinutes: updated.durationMinutes,
    breakDurationMinutes: updated.processingTimeMinutes || 0,
    priceEuros: updated.priceCents / 100,
    depositRequired: updated.depositRequired,
    depositAmountEuros: updated.depositCents / 100,
    assignedStaffIds: data.assignedStaffIds || [],
    requiredResourceId: data.requiredResourceId,
    description: updated.description || "",
  };
}

export async function deleteProService(
  venueId: string,
  serviceId: string
): Promise<{ success: boolean; id: string }> {
  const service = await db.service.findFirst({
    where: { id: serviceId, venueId },
    include: { bookingItems: { select: { id: true }, take: 1 } },
  });

  if (!service) {
    throw new Error("Prestation introuvable.");
  }

  if (service.bookingItems.length > 0) {
    // Si la prestation a déjà été réservée, soft delete pour préserver l'historique comptable
    await db.service.update({
      where: { id: serviceId },
      data: { isActive: false },
    });
  } else {
    // Sinon suppression directe
    await db.service.delete({
      where: { id: serviceId },
    });
  }

  return { success: true, id: serviceId };
}

export async function duplicateProService(
  venueId: string,
  serviceId: string
): Promise<ProService> {
  const original = await db.service.findFirst({
    where: { id: serviceId, venueId },
  });
  if (!original) {
    throw new Error("Prestation source introuvable.");
  }

  const duplicated = await db.service.create({
    data: {
      venueId,
      categoryId: original.categoryId,
      name: `${original.name} (Copie)`,
      description: original.description,
      durationMinutes: original.durationMinutes,
      processingTimeMinutes: original.processingTimeMinutes,
      priceCents: original.priceCents,
      depositRequired: original.depositRequired,
      depositCents: original.depositCents,
      order: original.order + 1,
      isActive: true,
    },
  });

  return {
    id: duplicated.id,
    name: duplicated.name,
    categoryId: duplicated.categoryId,
    durationMinutes: duplicated.durationMinutes,
    breakDurationMinutes: duplicated.processingTimeMinutes || 0,
    priceEuros: duplicated.priceCents / 100,
    depositRequired: duplicated.depositRequired,
    depositAmountEuros: duplicated.depositCents / 100,
    assignedStaffIds: [],
    description: duplicated.description || "",
  };
}

export async function massUpdatePrices(
  venueId: string,
  data: MassPriceAdjustmentInput
): Promise<{ count: number }> {
  const { categoryId, deltaPercent, deltaFixed } = data;

  const targetServices = await db.service.findMany({
    where: {
      venueId,
      isActive: true,
      ...(categoryId !== "all" ? { categoryId } : {}),
    },
  });

  if (targetServices.length === 0) {
    return { count: 0 };
  }

  await db.$transaction(
    targetServices.map((srv) => {
      let newPriceCents = srv.priceCents;
      if (deltaPercent !== 0) {
        newPriceCents = Math.round(srv.priceCents * (1 + deltaPercent / 100));
      } else if (deltaFixed !== 0) {
        newPriceCents = srv.priceCents + Math.round(deltaFixed * 100);
      }
      newPriceCents = Math.max(100, newPriceCents); // Minimum 1€

      // Mise à jour proportionnelle de l'acompte si nécessaire
      let newDepositCents = srv.depositCents;
      if (srv.depositRequired && srv.priceCents > 0) {
        const depositRatio = srv.depositCents / srv.priceCents;
        newDepositCents = Math.min(newPriceCents, Math.round(newPriceCents * depositRatio));
      }

      return db.service.update({
        where: { id: srv.id },
        data: {
          priceCents: newPriceCents,
          depositCents: newDepositCents,
        },
      });
    })
  );

  return { count: targetServices.length };
}

export async function createServiceCategory(
  venueId: string,
  name: string
): Promise<ProServiceCategory> {
  const maxOrder = await db.serviceCategory.findFirst({
    where: { venueId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const created = await db.serviceCategory.create({
    data: {
      venueId,
      name: name.trim(),
      order: (maxOrder?.order ?? 0) + 1,
    },
  });

  return {
    id: created.id,
    name: created.name,
    order: created.order,
    colorIndicator: "border-l-primary-600",
  };
}

export async function deleteServiceCategory(
  venueId: string,
  categoryId: string
): Promise<{ success: boolean; id: string }> {
  const category = await db.serviceCategory.findFirst({
    where: { id: categoryId, venueId },
    include: { services: { select: { id: true } } },
  });

  if (!category) {
    throw new Error("Catégorie introuvable.");
  }

  // Deactivate or check associated services
  if (category.services.length > 0) {
    await db.service.updateMany({
      where: { categoryId: category.id },
      data: { isActive: false },
    });
  }

  await db.serviceCategory.delete({
    where: { id: categoryId },
  });

  return { success: true, id: categoryId };
}

// =============================================================================
// PARAMÈTRES ÉTABLISSEMENT & HORAIRES
// =============================================================================

export interface FormattedOpeningHour {
  day: string;
  dayIndex: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface FormattedEstablishment {
  id: string;
  name: string;
  category: string;
  description: string;
  siret: string;
  vatNumber: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  cancellationDelayHours: number;
  depositPercentage: number;
  openingHours: FormattedOpeningHour[];
}

export async function getEstablishmentSettings(
  venueId: string
): Promise<FormattedEstablishment> {
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    include: {
      openingHours: {
        orderBy: { dayOfWeek: "asc" },
      },
    },
  });

  if (!venue) {
    throw new Error("Établissement introuvable.");
  }

  // Mapper les 7 jours de la semaine (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
  const existingHoursMap = new Map(
    venue.openingHours.map((oh) => [oh.dayOfWeek, oh])
  );

  const openingHours: FormattedOpeningHour[] = [];
  // Standard French calendar starts on Monday (1) to Sunday (0)
  const orderedIndices = [1, 2, 3, 4, 5, 6, 0];

  for (const dayIndex of orderedIndices) {
    const existing = existingHoursMap.get(dayIndex);
    openingHours.push({
      day: DAY_NAMES[dayIndex],
      dayIndex,
      isOpen: existing?.isOpen ?? (dayIndex >= 2 && dayIndex <= 6),
      openTime: existing?.openTime || "09:30",
      closeTime: existing?.closeTime || "19:30",
    });
  }

  return {
    id: venue.id,
    name: venue.name,
    category: venue.tagline || "Maison d'Artisan Coiffeur",
    description: venue.description || "",
    siret: venue.siret || "",
    vatNumber: venue.vatNumber || "",
    phone: venue.phone || "",
    email: venue.email || "",
    address: venue.address,
    postalCode: venue.postalCode,
    city: venue.city,
    cancellationDelayHours: venue.cancellationDelayHours ?? 24,
    depositPercentage: venue.depositPercentage ?? 30,
    openingHours,
  };
}

export async function updateEstablishmentSettings(
  venueId: string,
  input: UpdateEstablishmentInput
): Promise<FormattedEstablishment> {
  const venue = await db.venue.findUnique({ where: { id: venueId } });
  if (!venue) throw new Error("Établissement introuvable.");

  await db.$transaction(async (tx) => {
    await tx.venue.update({
      where: { id: venueId },
      data: {
        name: input.name.trim(),
        tagline: input.category?.trim() || null,
        description: input.description?.trim() || null,
        siret: input.siret.trim(),
        vatNumber: input.vatNumber.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        address: input.address.trim(),
        postalCode: input.postalCode.trim(),
        city: input.city.trim(),
        cancellationDelayHours: input.cancellationDelayHours,
        depositPercentage: input.depositPercentage,
      },
    });

    if (input.openingHours && input.openingHours.length > 0) {
      for (const oh of input.openingHours) {
        await tx.venueOpeningHour.upsert({
          where: {
            venueId_dayOfWeek: {
              venueId,
              dayOfWeek: oh.dayOfWeek,
            },
          },
          create: {
            venueId,
            dayOfWeek: oh.dayOfWeek,
            isOpen: oh.isOpen,
            openTime: oh.openTime,
            closeTime: oh.closeTime,
          },
          update: {
            isOpen: oh.isOpen,
            openTime: oh.openTime,
            closeTime: oh.closeTime,
          },
        });
      }
    }
  });

  return getEstablishmentSettings(venueId);
}

// =============================================================================
// GESTION DE L'ÉQUIPE & PLANNINGS HEBDOMADAIRES
// =============================================================================

export interface FormattedStaffWithSchedules extends ProStaffMember {
  schedules: {
    dayOfWeek: number;
    dayName: string;
    plannedStart: string;
    plannedEnd: string;
    isActive: boolean;
  }[];
}

export async function getTeamSettings(
  venueId: string
): Promise<FormattedStaffWithSchedules[]> {
  const staff = await db.staffMember.findMany({
    where: { venueId, isActive: true },
    include: {
      user: { select: { email: true, phone: true } },
      schedules: { orderBy: { dayOfWeek: "asc" } },
      clockIns: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        orderBy: { clockInTime: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const todayIndex = new Date().getDay();

  return staff.map((s) => {
    const todaySchedule = s.schedules.find((sch) => sch.dayOfWeek === todayIndex);
    const latestClockIn = s.clockIns[0];
    const isClockedIn = Boolean(latestClockIn && !latestClockIn.clockOutTime);

    const orderedIndices = [1, 2, 3, 4, 5, 6, 0];
    const schedulesMap = new Map(s.schedules.map((sch) => [sch.dayOfWeek, sch]));

    const schedules = orderedIndices.map((dayOfWeek) => {
      const sch = schedulesMap.get(dayOfWeek);
      return {
        dayOfWeek,
        dayName: DAY_NAMES[dayOfWeek],
        plannedStart: sch?.plannedStart || "09:30",
        plannedEnd: sch?.plannedEnd || "19:30",
        isActive: sch?.isActive ?? (dayOfWeek >= 2 && dayOfWeek <= 6),
      };
    });

    return {
      id: s.id,
      name: s.name,
      role: s.role,
      avatar: s.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      email: s.user?.email || "collaborateur@atelierbotanique.fr",
      phone: s.user?.phone || "06 00 00 00 00",
      color: s.color,
      presenceToday: {
        plannedStart: todaySchedule?.plannedStart || "09:30",
        plannedEnd: todaySchedule?.plannedEnd || "19:30",
        clockedIn: isClockedIn,
        clockInTime: latestClockIn?.clockInTime
          ? latestClockIn.clockInTime.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined,
        totalLogged: "0h00",
      },
      active: s.isActive,
      schedules,
    };
  });
}

export async function updateStaffMemberSettings(
  venueId: string,
  staffId: string,
  input: UpdateStaffScheduleInput
): Promise<FormattedStaffWithSchedules> {
  const staff = await db.staffMember.findFirst({
    where: { id: staffId, venueId },
  });
  if (!staff) throw new Error("Collaborateur introuvable.");

  await db.$transaction(async (tx) => {
    if (input.name || input.role || input.color) {
      await tx.staffMember.update({
        where: { id: staffId },
        data: {
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.role ? { role: input.role.trim() } : {}),
          ...(input.color ? { color: input.color.trim() } : {}),
        },
      });
    }

    if (input.schedules && input.schedules.length > 0) {
      for (const sch of input.schedules) {
        await tx.staffSchedule.upsert({
          where: {
            staffId_dayOfWeek: {
              staffId,
              dayOfWeek: sch.dayOfWeek,
            },
          },
          create: {
            staffId,
            dayOfWeek: sch.dayOfWeek,
            plannedStart: sch.plannedStart,
            plannedEnd: sch.plannedEnd,
            isActive: sch.isActive,
          },
          update: {
            plannedStart: sch.plannedStart,
            plannedEnd: sch.plannedEnd,
            isActive: sch.isActive,
          },
        });
      }
    }
  });

  const all = await getTeamSettings(venueId);
  const found = all.find((s) => s.id === staffId);
  if (!found) throw new Error("Erreur lors de la mise à jour de l'équipe.");
  return found;
}

export async function createStaffMember(
  venueId: string,
  input: CreateStaffMemberInput
): Promise<FormattedStaffWithSchedules> {
  const created = await db.$transaction(async (tx) => {
    const staff = await tx.staffMember.create({
      data: {
        venueId,
        name: input.name.trim(),
        role: input.role.trim(),
        color: input.color || "#82385a",
        isActive: true,
      },
    });

    // Initialiser 7 plannings standard
    const defaultDays = [
      { dayOfWeek: 0, plannedStart: "10:00", plannedEnd: "18:00", isActive: false },
      { dayOfWeek: 1, plannedStart: "09:00", plannedEnd: "19:00", isActive: false },
      { dayOfWeek: 2, plannedStart: "09:30", plannedEnd: "19:30", isActive: true },
      { dayOfWeek: 3, plannedStart: "09:30", plannedEnd: "19:30", isActive: true },
      { dayOfWeek: 4, plannedStart: "09:30", plannedEnd: "20:00", isActive: true },
      { dayOfWeek: 5, plannedStart: "09:30", plannedEnd: "20:00", isActive: true },
      { dayOfWeek: 6, plannedStart: "09:00", plannedEnd: "19:00", isActive: true },
    ];

    for (const d of defaultDays) {
      await tx.staffSchedule.create({
        data: {
          staffId: staff.id,
          dayOfWeek: d.dayOfWeek,
          plannedStart: d.plannedStart,
          plannedEnd: d.plannedEnd,
          isActive: d.isActive,
        },
      });
    }

    return staff;
  });

  const all = await getTeamSettings(venueId);
  const found = all.find((s) => s.id === created.id);
  if (!found) throw new Error("Collaborateur non retrouvé après création.");
  return found;
}

// =============================================================================
// PARAMÈTRES CAISSE & NOTIFICATIONS
// =============================================================================

export interface FormattedCashSettings {
  acceptCard: boolean;
  acceptCash: boolean;
  acceptCheck: boolean;
  ticketFooter: string;
}

export async function getCashRegisterSettings(
  venueId: string
): Promise<FormattedCashSettings> {
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    select: { cashSettings: true },
  });

  const raw = venue?.cashSettings as Partial<FormattedCashSettings> | null;
  return {
    acceptCard: raw?.acceptCard ?? true,
    acceptCash: raw?.acceptCash ?? true,
    acceptCheck: raw?.acceptCheck ?? false,
    ticketFooter:
      raw?.ticketFooter ??
      "Merci de votre visite et de votre confiance. Prenez soin de vous !",
  };
}

export async function updateCashRegisterSettings(
  venueId: string,
  input: CashRegisterSettingsInput
): Promise<FormattedCashSettings> {
  const updated = await db.venue.update({
    where: { id: venueId },
    data: { cashSettings: input },
    select: { cashSettings: true },
  });

  const raw = updated.cashSettings as unknown as FormattedCashSettings;
  return raw;
}

export interface FormattedNotificationSettings {
  emailConfirmEnabled: boolean;
  sms24hEnabled: boolean;
  sms2hEnabled: boolean;
  smsTemplate: string;
}

export async function getNotificationSettings(
  venueId: string
): Promise<FormattedNotificationSettings> {
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    select: { notificationSettings: true },
  });

  const raw = venue?.notificationSettings as unknown as Partial<FormattedNotificationSettings> | null;
  return {
    emailConfirmEnabled: raw?.emailConfirmEnabled ?? true,
    sms24hEnabled: raw?.sms24hEnabled ?? true,
    sms2hEnabled: raw?.sms2hEnabled ?? false,
    smsTemplate:
      raw?.smsTemplate ??
      "Bonjour {client_name}, votre rendez-vous chez {venue_name} pour {service_name} est confirmé le {date} à {time}. En cas d'empêchement, vous pouvez modifier votre créneau ici : {link}",
  };
}

export async function updateNotificationSettings(
  venueId: string,
  input: NotificationSettingsInput
): Promise<FormattedNotificationSettings> {
  const updated = await db.venue.update({
    where: { id: venueId },
    data: { notificationSettings: input },
    select: { notificationSettings: true },
  });

  return updated.notificationSettings as unknown as FormattedNotificationSettings;
}
