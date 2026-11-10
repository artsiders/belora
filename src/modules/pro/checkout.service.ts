import { db } from "@/lib/db";
import { BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import {
  createUtcDateFromLocal,
  formatUtcToLocalParts,
} from "@/modules/availability/time-utils";
import {
  CreateSaleTicketInput,
  DailyClosingInput,
} from "@/lib/validations/checkout.schema";
import { ProSaleTicket, ProAppointment } from "@/lib/data/pro-mock-data";

/**
 * Mappe le mode de règlement de l'interface vers l'enum Prisma.
 */
function mapPaymentMethodToPrisma(method: "card" | "cash" | "mixed"): PaymentMethod {
  switch (method) {
    case "card":
      return PaymentMethod.CARD_TERMINAL;
    case "cash":
      return PaymentMethod.CASH;
    case "mixed":
      return PaymentMethod.MIXED;
  }
}

/**
 * Mappe l'enum Prisma vers la chaîne de l'interface.
 */
function mapPaymentMethodToPro(method: PaymentMethod): "card" | "cash" | "mixed" {
  switch (method) {
    case PaymentMethod.CARD_TERMINAL:
    case PaymentMethod.CARD_ONLINE:
      return "card";
    case PaymentMethod.CASH:
      return "cash";
    case PaymentMethod.MIXED:
      return "mixed";
  }
}

/**
 * Récupère les rendez-vous du jour en attente d'encaissement ou déjà encaissés.
 */
export async function getPendingAppointments(
  venueId: string,
  dateStr?: string
): Promise<{
  pendingAppointments: ProAppointment[];
  allTodayAppointments: ProAppointment[];
}> {
  const targetDate = dateStr || new Date().toISOString().split("T")[0];
  const rangeStart = createUtcDateFromLocal(targetDate, 0);
  const rangeEnd = createUtcDateFromLocal(targetDate, 23 * 60 + 59);

  const items = await db.bookingItem.findMany({
    where: {
      booking: {
        venueId,
        status: { notIn: [BookingStatus.CANCELLED] },
      },
      startTime: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    },
    include: {
      booking: {
        include: {
          customer: true,
          saleTickets: true,
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

  const allTodayAppointments: ProAppointment[] = items.map((item) => {
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
      status: item.booking.status.toLowerCase() as ProAppointment["status"],
      isRecurring: (item.booking.customer?.totalVisits ?? 0) > 1,
      notes: item.booking.notes || undefined,
    };
  });

  // Rendez-vous en attente de caisse (non encore associés à un ticket de caisse)
  const pendingAppointments = allTodayAppointments.filter((apt) => {
    const item = items.find((i) => i.booking.id === apt.id);
    return !item?.booking.saleTickets || item.booking.saleTickets.length === 0;
  });

  return { pendingAppointments, allTodayAppointments };
}

/**
 * Crée un ticket de vente certifié avec calcul TVA, déduction d'acompte et mise à jour du statut du RDV.
 */
export async function createSaleTicketTransaction(
  input: CreateSaleTicketInput & { venueId: string }
): Promise<ProSaleTicket> {
  const { venueId, items, paymentMethod } = input;

  if (!items || items.length === 0) {
    throw new Error("Le panier de caisse ne peut pas être vide.");
  }

  // 1. Calculs financiers en centimes
  const rawSubtotalCents = items.reduce(
    (acc, item) => acc + Math.round(item.price * 100) * item.quantity,
    0
  );

  const discountPercent = Math.min(100, Math.max(0, input.discountPercent || 0));
  const discountAmountCents = Math.round((rawSubtotalCents * discountPercent) / 100);
  const subtotalAfterDiscountCents = Math.max(0, rawSubtotalCents - discountAmountCents);

  const depositDeductedCents = Math.round((input.depositDeducted || 0) * 100);
  const totalTtcCents = Math.max(0, subtotalAfterDiscountCents - depositDeductedCents);

  // TVA 20%
  const vatRate = 0.2;
  const subtotalHtCents = Math.round(totalTtcCents / (1 + vatRate));
  const vatAmountCents = totalTtcCents - subtotalHtCents;

  // Ventilation des montants réglés
  let cardAmountCents = 0;
  let cashAmountCents = 0;

  if (paymentMethod === "card") {
    cardAmountCents = totalTtcCents;
  } else if (paymentMethod === "cash") {
    cashAmountCents = totalTtcCents;
  } else if (paymentMethod === "mixed") {
    cardAmountCents = Math.round((input.cardAmount || 0) * 100);
    cashAmountCents = Math.round((input.cashAmount || 0) * 100);

    const totalMixedCents = cardAmountCents + cashAmountCents;
    if (Math.abs(totalMixedCents - totalTtcCents) > 10) {
      // Tolérance minime de 10 centimes pour arrondi
      throw new Error(
        `Le total des règlements mixte (${(totalMixedCents / 100).toFixed(
          2
        )} €) ne correspond pas au montant dû (${(totalTtcCents / 100).toFixed(2)} €).`
      );
    }
  }

  // 2. Numérotation séquentielle certifiée
  const currentYear = new Date().getFullYear();
  const ticketCount = await db.saleTicket.count({ where: { venueId } });
  const ticketNumber = `#TC-${currentYear}-${String(ticketCount + 1).padStart(4, "0")}`;

  const prismaPaymentMethod = mapPaymentMethodToPrisma(paymentMethod);

  // 3. Exécution transactionnelle
  const ticket = await db.$transaction(async (tx) => {
    // A. Création du ticket de vente
    const createdTicket = await tx.saleTicket.create({
      data: {
        ticketNumber,
        venueId,
        bookingId: input.bookingId || null,
        clientName: input.clientName,
        totalTtcCents,
        subtotalHtCents,
        vatAmountCents,
        paymentMethod: prismaPaymentMethod,
        cardAmountCents,
        cashAmountCents,
        depositDeductedCents,
      },
    });

    // B. Si lié à un RDV existant : passer son statut à COMPLETED
    if (input.bookingId) {
      await tx.booking.update({
        where: { id: input.bookingId },
        data: {
          status: BookingStatus.COMPLETED,
          paymentStatus: PaymentStatus.SUCCEEDED,
          remainingCents: 0,
        },
      });
    }

    // C. Si client CRM identifié : mettre à jour son CA cumulé et sa dernière visite
    const targetClientId = input.clientId;
    if (targetClientId) {
      const existingClient = await tx.customerCRM.findFirst({
        where: { id: targetClientId, venueId },
      });
      if (existingClient) {
        await tx.customerCRM.update({
          where: { id: existingClient.id },
          data: {
            totalSpentCents: { increment: totalTtcCents + depositDeductedCents },
            lastVisitAt: new Date(),
          },
        });
      }
    }

    return createdTicket;
  });

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    id: ticket.ticketNumber,
    date: dateStr,
    time: timeStr,
    clientId: input.clientId || "anonymous",
    clientName: ticket.clientName,
    staffId: items[0]?.staffId || "",
    staffName: "Artisan Belora",
    items: items.map((i) => ({
      title: i.title,
      type: i.type,
      price: i.price,
      quantity: i.quantity,
    })),
    depositDeducted: ticket.depositDeductedCents / 100,
    subtotalHt: ticket.subtotalHtCents / 100,
    vatAmount: ticket.vatAmountCents / 100,
    totalTtc: ticket.totalTtcCents / 100,
    paymentMethod,
    cardAmount: ticket.cardAmountCents / 100,
    cashAmount: ticket.cashAmountCents / 100,
  };
}

/**
 * Récupère le résumé journalier des encaissements et l'état de clôture Z.
 */
export async function getDailySummary(venueId: string, dateStr?: string) {
  const targetDate = dateStr || new Date().toISOString().split("T")[0];
  const rangeStart = createUtcDateFromLocal(targetDate, 0);
  const rangeEnd = createUtcDateFromLocal(targetDate, 23 * 60 + 59);

  // Recherche des tickets émis aujourd'hui
  const tickets = await db.saleTicket.findMany({
    where: {
      venueId,
      createdAt: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Recherche d'une clôture journalière Z existante
  const closingDate = new Date(targetDate);
  closingDate.setHours(0, 0, 0, 0);

  const existingClosing = await db.dailyClosing.findFirst({
    where: {
      venueId,
      date: closingDate,
    },
  });

  // Calculs totaux
  const totalTtcCents = tickets.reduce((acc, t) => acc + t.totalTtcCents, 0);
  const totalHtCents = tickets.reduce((acc, t) => acc + t.subtotalHtCents, 0);
  const vatAmountCents = tickets.reduce((acc, t) => acc + t.vatAmountCents, 0);
  const totalDepositsCents = tickets.reduce((acc, t) => acc + t.depositDeductedCents, 0);
  const totalCardCents = tickets.reduce((acc, t) => acc + t.cardAmountCents, 0);
  const totalCashCents = tickets.reduce((acc, t) => acc + t.cashAmountCents, 0);

  const mappedTickets: ProSaleTicket[] = tickets.map((t) => {
    const { date, time } = formatUtcToLocalParts(t.createdAt);
    return {
      id: t.ticketNumber,
      date,
      time,
      clientId: "client",
      clientName: t.clientName,
      staffId: "",
      staffName: "Artisan Belora",
      items: [],
      depositDeducted: t.depositDeductedCents / 100,
      subtotalHt: t.subtotalHtCents / 100,
      vatAmount: t.vatAmountCents / 100,
      totalTtc: t.totalTtcCents / 100,
      paymentMethod: mapPaymentMethodToPro(t.paymentMethod),
      cardAmount: t.cardAmountCents / 100,
      cashAmount: t.cashAmountCents / 100,
    };
  });

  return {
    date: targetDate,
    isClosed: Boolean(existingClosing),
    closingDetails: existingClosing
      ? {
          id: existingClosing.id,
          totalTtc: existingClosing.totalTtcCents / 100,
          totalHt: existingClosing.totalHtCents / 100,
          totalVat: existingClosing.vatAmountCents / 100,
          totalCard: existingClosing.totalCardCents / 100,
          totalCash: existingClosing.totalCashCents / 100,
          cashCounted: existingClosing.cashCountedCents / 100,
          discrepancy: existingClosing.discrepancyCents / 100,
          closedAt: existingClosing.closedAt.toISOString(),
        }
      : null,
    totals: {
      totalTtc: totalTtcCents / 100,
      totalHt: totalHtCents / 100,
      vatAmount: vatAmountCents / 100,
      totalDeposits: totalDepositsCents / 100,
      totalCard: totalCardCents / 100,
      totalCash: totalCashCents / 100,
      ticketsCount: tickets.length,
    },
    tickets: mappedTickets,
  };
}

/**
 * Exécute la clôture journalière Z certifiée avec calcul de l'écart de caisse.
 */
export async function performDailyClosing(
  input: DailyClosingInput & { venueId: string }
) {
  const { venueId, cashCounted, startingFloat = 150 } = input;
  const targetDateStr = input.date || new Date().toISOString().split("T")[0];

  const rangeStart = createUtcDateFromLocal(targetDateStr, 0);
  const rangeEnd = createUtcDateFromLocal(targetDateStr, 23 * 60 + 59);

  // Tous les tickets de la journée
  const tickets = await db.saleTicket.findMany({
    where: {
      venueId,
      createdAt: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    },
  });

  const totalTtcCents = tickets.reduce((acc, t) => acc + t.totalTtcCents, 0);
  const totalHtCents = tickets.reduce((acc, t) => acc + t.subtotalHtCents, 0);
  const vatAmountCents = tickets.reduce((acc, t) => acc + t.vatAmountCents, 0);
  const totalDepositsCents = tickets.reduce((acc, t) => acc + t.depositDeductedCents, 0);
  const totalCardCents = tickets.reduce((acc, t) => acc + t.cardAmountCents, 0);
  const totalCashCents = tickets.reduce((acc, t) => acc + t.cashAmountCents, 0);

  const startingFloatCents = Math.round(startingFloat * 100);
  const cashCountedCents = Math.round(cashCounted * 100);
  const expectedCashInDrawerCents = startingFloatCents + totalCashCents;
  const discrepancyCents = cashCountedCents - expectedCashInDrawerCents;

  const closingDate = new Date(targetDateStr);
  closingDate.setHours(0, 0, 0, 0);

  const closing = await db.dailyClosing.upsert({
    where: {
      venueId_date: {
        venueId,
        date: closingDate,
      },
    },
    create: {
      venueId,
      date: closingDate,
      totalTtcCents,
      totalHtCents,
      vatAmountCents,
      totalCardCents,
      totalCashCents,
      totalDepositsCents,
      cashCountedCents,
      discrepancyCents,
      closedAt: new Date(),
    },
    update: {
      totalTtcCents,
      totalHtCents,
      vatAmountCents,
      totalCardCents,
      totalCashCents,
      totalDepositsCents,
      cashCountedCents,
      discrepancyCents,
      closedAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Clôture Z journalière enregistrée avec succès.",
    closing: {
      id: closing.id,
      date: targetDateStr,
      totalTtc: closing.totalTtcCents / 100,
      totalHt: closing.totalHtCents / 100,
      vatAmount: closing.vatAmountCents / 100,
      totalCard: closing.totalCardCents / 100,
      totalCash: closing.totalCashCents / 100,
      totalDeposits: closing.totalDepositsCents / 100,
      cashCounted: closing.cashCountedCents / 100,
      expectedCash: expectedCashInDrawerCents / 100,
      discrepancy: closing.discrepancyCents / 100,
      ticketsCount: tickets.length,
      closedAt: closing.closedAt.toISOString(),
    },
  };
}
