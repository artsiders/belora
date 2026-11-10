import { db } from "@/lib/db";
import {
  getDayOfWeekFromDateString,
  timeStringToMinutes,
  minutesToTimeString,
  minutesRangesOverlap,
  createUtcDateFromLocal,
  dateRangesOverlap,
} from "./time-utils";

export interface AvailableStaffSummary {
  id: string;
  name: string;
  role: string;
  color: string;
  avatarUrl?: string | null;
}

export interface AvailableSlot {
  time: string; // "09:30" (heure locale salon)
  startTime: string; // ISO UTC (ex: "2026-11-15T08:30:00.000Z")
  endTime: string; // ISO UTC (ex: "2026-11-15T09:15:00.000Z")
  totalDurationMinutes: number;
  availableStaff: AvailableStaffSummary[];
}

export interface AvailabilityResult {
  venueId: string;
  date: string; // "YYYY-MM-DD"
  isOpen: boolean;
  totalDurationMinutes: number;
  totalPriceCents: number;
  totalDepositCents: number;
  slots: AvailableSlot[];
}

export interface GetAvailabilityParams {
  venueId: string;
  serviceIds: string[];
  date: string; // "YYYY-MM-DD"
  staffId?: string | null; // Optionnel ("any" ou ID collaborateur précis)
}

export class AvailabilityService {
  /**
   * Calcule en temps réel l'ensemble des créneaux libres pour un salon,
   * une sélection de prestations et un jour donné.
   */
  public static async getAvailableSlots(
    params: GetAvailabilityParams
  ): Promise<AvailabilityResult> {
    const { venueId, serviceIds, date, staffId } = params;

    // 1. Récupération de l'établissement
    const venue = await db.venue.findUnique({
      where: { id: venueId },
      select: { id: true, timezone: true, status: true },
    });

    if (!venue || venue.status !== "PUBLISHED") {
      return {
        venueId,
        date,
        isOpen: false,
        totalDurationMinutes: 0,
        totalPriceCents: 0,
        totalDepositCents: 0,
        slots: [],
      };
    }

    const timezone = venue.timezone || "Europe/Paris";

    // 2. Vérification des horaires d'ouverture du salon pour le jour demandé
    const dayOfWeek = getDayOfWeekFromDateString(date);
    const openingHour = await db.venueOpeningHour.findUnique({
      where: {
        venueId_dayOfWeek: {
          venueId,
          dayOfWeek,
        },
      },
    });

    if (!openingHour || !openingHour.isOpen) {
      return {
        venueId,
        date,
        isOpen: false,
        totalDurationMinutes: 0,
        totalPriceCents: 0,
        totalDepositCents: 0,
        slots: [],
      };
    }

    const venueOpenMinutes = timeStringToMinutes(openingHour.openTime);
    const venueCloseMinutes = timeStringToMinutes(openingHour.closeTime);

    // 3. Récupération et calcul des prestations sélectionnées
    const services = await db.service.findMany({
      where: {
        id: { in: serviceIds },
        venueId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        durationMinutes: true,
        processingTimeMinutes: true,
        priceCents: true,
        depositCents: true,
      },
    });

    if (services.length === 0) {
      return {
        venueId,
        date,
        isOpen: true,
        totalDurationMinutes: 0,
        totalPriceCents: 0,
        totalDepositCents: 0,
        slots: [],
      };
    }

    // Durée totale = somme des prestations
    const totalDurationMinutes = services.reduce(
      (acc, s) => acc + s.durationMinutes,
      0
    );
    const totalPriceCents = services.reduce((acc, s) => acc + s.priceCents, 0);
    const totalDepositCents = services.reduce((acc, s) => acc + s.depositCents, 0);

    // Temps de pose total (pendant lequel le collaborateur est libéré)
    const totalProcessingMinutes = services.reduce(
      (acc, s) => acc + (s.processingTimeMinutes || 0),
      0
    );

    // 4. Récupération des collaborateurs éligibles
    const staffWhere: any = {
      venueId,
      isActive: true,
    };

    if (staffId && staffId !== "any") {
      staffWhere.id = staffId;
    }

    const eligibleStaff = await db.staffMember.findMany({
      where: staffWhere,
      include: {
        schedules: {
          where: { dayOfWeek, isActive: true },
        },
        timeOffs: true,
      },
    });

    if (eligibleStaff.length === 0) {
      return {
        venueId,
        date,
        isOpen: true,
        totalDurationMinutes,
        totalPriceCents,
        totalDepositCents,
        slots: [],
      };
    }

    // 5. Récupération des réservations existantes et verrous temporaires pour la journée
    const dayStartUtc = createUtcDateFromLocal(date, venueOpenMinutes, timezone);
    const dayEndUtc = createUtcDateFromLocal(date, venueCloseMinutes, timezone);

    const existingBookingItems = await db.bookingItem.findMany({
      where: {
        staffId: { in: eligibleStaff.map((s) => s.id) },
        booking: {
          status: { notIn: ["CANCELLED"] },
        },
        startTime: { lt: dayEndUtc },
        endTime: { gt: dayStartUtc },
      },
      select: {
        staffId: true,
        startTime: true,
        endTime: true,
      },
    });

    const activeLocks = await db.holdingLock.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    // 6. Génération et vérification des créneaux par pas de 15 minutes
    // Map : heure locale "HH:mm" -> liste des collaborateurs disponibles
    const slotsMap = new Map<string, AvailableStaffSummary[]>();

    const stepMinutes = 15;
    const latestStartMinutes = venueCloseMinutes - totalDurationMinutes;

    for (const staff of eligibleStaff) {
      const schedule = staff.schedules[0];
      if (!schedule) continue; // Pas de planning pour ce jour

      // Vérification des congés / absences du collaborateur
      const isAbsent = staff.timeOffs.some((off) => {
        return dateRangesOverlap(off.startDate, off.endDate, dayStartUtc, dayEndUtc);
      });
      if (isAbsent) continue;

      const staffShiftStart = Math.max(
        venueOpenMinutes,
        timeStringToMinutes(schedule.plannedStart)
      );
      const staffShiftEnd = Math.min(
        venueCloseMinutes,
        timeStringToMinutes(schedule.plannedEnd)
      );

      // Pause déjeuner éventuelle
      const hasBreak = Boolean(schedule.breakStart && schedule.breakEnd);
      const breakStart = hasBreak ? timeStringToMinutes(schedule.breakStart!) : -1;
      const breakEnd = hasBreak ? timeStringToMinutes(schedule.breakEnd!) : -1;

      // Réservations de ce collaborateur
      const staffBookings = existingBookingItems.filter(
        (item) => item.staffId === staff.id
      );

      for (
        let startMin = staffShiftStart;
        startMin <= staffShiftEnd - totalDurationMinutes;
        startMin += stepMinutes
      ) {
        const endMin = startMin + totalDurationMinutes;

        // Collision avec pause déjeuner (le praticien ne peut pas travailler pendant sa pause)
        if (hasBreak && minutesRangesOverlap(startMin, endMin, breakStart, breakEnd)) {
          // Exception intelligente : si la prestation a un temps de pose couvrant la pause
          // Pour la simplicité et le confort du praticien, nous interdisons tout début pendant la pause
          continue;
        }

        // Conversion en dates UTC pour collision avec les RDV existants
        const slotStartUtc = createUtcDateFromLocal(date, startMin, timezone);
        const slotEndUtc = createUtcDateFromLocal(date, endMin, timezone);

        // Vérification de collision avec les réservations existantes
        let isBooked = false;
        for (const booking of staffBookings) {
          if (dateRangesOverlap(slotStartUtc, slotEndUtc, booking.startTime, booking.endTime)) {
            isBooked = true;
            break;
          }
        }

        if (isBooked) continue;

        // Vérification de collision avec les verrous temporaires en cours
        const lockKey = `lock:${venueId}:${staff.id}:${slotStartUtc.toISOString()}`;
        const isLocked = activeLocks.some(
          (l) => l.lockKey === lockKey && l.expiresAt > new Date()
        );

        if (isLocked) continue;

        // Le créneau est libre pour ce praticien !
        const timeKey = minutesToTimeString(startMin);
        const currentStaffList = slotsMap.get(timeKey) || [];

        currentStaffList.push({
          id: staff.id,
          name: staff.name,
          role: staff.role,
          color: staff.color,
          avatarUrl: staff.avatarUrl,
        });

        slotsMap.set(timeKey, currentStaffList);
      }
    }

    // 7. Mise en forme et tri chronologique des créneaux finaux
    const sortedTimes = Array.from(slotsMap.keys()).sort((a, b) => {
      return timeStringToMinutes(a) - timeStringToMinutes(b);
    });

    const slots: AvailableSlot[] = sortedTimes.map((time) => {
      const startMin = timeStringToMinutes(time);
      const endMin = startMin + totalDurationMinutes;
      const startUtc = createUtcDateFromLocal(date, startMin, timezone);
      const endUtc = createUtcDateFromLocal(date, endMin, timezone);

      return {
        time,
        startTime: startUtc.toISOString(),
        endTime: endUtc.toISOString(),
        totalDurationMinutes,
        availableStaff: slotsMap.get(time) || [],
      };
    });

    return {
      venueId,
      date,
      isOpen: true,
      totalDurationMinutes,
      totalPriceCents,
      totalDepositCents,
      slots,
    };
  }
}
