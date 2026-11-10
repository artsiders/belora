import { Resend } from "resend";
import { db } from "@/lib/db";
import {
  renderBookingConfirmationEmail,
  renderProNewBookingEmail,
  renderBookingReminderEmail,
  renderBookingCancellationEmail,
  renderReceiptEmail,
  BookingEmailData,
} from "@/emails/templates";

const resendApiKey = process.env.RESEND_API_KEY || "re_mock_belora_dev_key";

export const resend = new Resend(resendApiKey);

export const isResendConfigured = () => {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && !key.includes("mock") && key.startsWith("re_"));
};

const DEFAULT_FROM = process.env.EMAIL_FROM || "Belora <contact@belora.fr>";

function formatDateFr(date: Date): string {
  const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTimeFr(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}h${minutes}`;
}

async function prepareBookingData(bookingId: string): Promise<BookingEmailData | null> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      venue: {
        include: { owner: true },
      },
      customer: true,
      items: {
        include: {
          service: true,
          staff: true,
        },
      },
    },
  });

  if (!booking) return null;

  const firstItem = booking.items[0];
  const staffName = firstItem?.staff?.name || null;
  const clientName = booking.customer
    ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
    : booking.clientName;

  const services = booking.items.map((item) => ({
    name: item.service.name,
    durationMinutes: item.service.durationMinutes,
    priceEuros: Math.round(item.priceCents / 100),
  }));

  const startTime = firstItem ? new Date(firstItem.startTime) : new Date();

  return {
    reference: booking.reference,
    venueName: booking.venue.name,
    venueAddress: booking.venue.address,
    venueCity: booking.venue.city,
    venuePhone: booking.venue.phone,
    staffName,
    clientName,
    clientEmail: booking.clientEmail || booking.customer?.email,
    clientPhone: booking.clientPhone,
    dateFormatted: formatDateFr(startTime),
    timeFormatted: formatTimeFr(startTime),
    services,
    totalPriceEuros: Math.round(booking.totalPriceCents / 100),
    depositPaidEuros: Math.round(booking.depositCents / 100),
    remainingToPayEuros: Math.round(booking.remainingCents / 100),
  };
}

export async function sendBookingConfirmationEmail(bookingId: string) {
  const data = await prepareBookingData(bookingId);
  if (!data || !data.clientEmail) {
    return { success: false, error: "Réservation ou e-mail client introuvable" };
  }

  const { subject, html } = renderBookingConfirmationEmail(data);

  if (!isResendConfigured()) {
    console.log(`[SIMULATION RESEND] Envoi e-mail confirmation à ${data.clientEmail} (${subject})`);
    return { success: true, id: `mock_email_${Date.now()}`, isMock: true };
  }

  const result = await resend.emails.send({
    from: DEFAULT_FROM,
    to: data.clientEmail,
    subject,
    html,
  });

  return { success: true, id: result.data?.id, isMock: false };
}

export async function sendProNewBookingNotificationEmail(bookingId: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      venue: { include: { owner: true } },
    },
  });

  if (!booking) return { success: false, error: "Réservation introuvable" };

  const data = await prepareBookingData(bookingId);
  if (!data) return { success: false, error: "Données de réservation invalides" };

  const proEmail = booking.venue.email || booking.venue.owner.email;
  if (!proEmail) return { success: false, error: "E-mail professionnel introuvable" };

  const { subject, html } = renderProNewBookingEmail(data);

  if (!isResendConfigured()) {
    console.log(`[SIMULATION RESEND] Envoi e-mail alerte pro à ${proEmail} (${subject})`);
    return { success: true, id: `mock_pro_email_${Date.now()}`, isMock: true };
  }

  const result = await resend.emails.send({
    from: DEFAULT_FROM,
    to: proEmail,
    subject,
    html,
  });

  return { success: true, id: result.data?.id, isMock: false };
}

export async function sendBookingReminderEmail(bookingId: string) {
  const data = await prepareBookingData(bookingId);
  if (!data || !data.clientEmail) {
    return { success: false, error: "Réservation ou e-mail client introuvable" };
  }

  const { subject, html } = renderBookingReminderEmail(data);

  if (!isResendConfigured()) {
    console.log(`[SIMULATION RESEND] Envoi e-mail rappel à ${data.clientEmail} (${subject})`);
    return { success: true, id: `mock_reminder_${Date.now()}`, isMock: true };
  }

  const result = await resend.emails.send({
    from: DEFAULT_FROM,
    to: data.clientEmail,
    subject,
    html,
  });

  return { success: true, id: result.data?.id, isMock: false };
}

export async function sendBookingCancellationEmail(bookingId: string, reason?: string) {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { venue: true, customer: true },
  });

  if (!booking) return { success: false, error: "Réservation introuvable" };

  const email = booking.clientEmail || booking.customer?.email;
  if (!email) return { success: false, error: "E-mail client manquant" };

  const clientName = booking.customer
    ? `${booking.customer.firstName} ${booking.customer.lastName}`.trim()
    : booking.clientName;

  const { subject, html } = renderBookingCancellationEmail(
    clientName,
    booking.venue.name,
    booking.reference,
    reason
  );

  if (!isResendConfigured()) {
    console.log(`[SIMULATION RESEND] Envoi e-mail annulation à ${email} (${subject})`);
    return { success: true, id: `mock_cancel_${Date.now()}`, isMock: true };
  }

  const result = await resend.emails.send({
    from: DEFAULT_FROM,
    to: email,
    subject,
    html,
  });

  return { success: true, id: result.data?.id, isMock: false };
}

export async function sendReceiptEmail(saleTicketId: string, clientEmail?: string) {
  const ticket = await db.saleTicket.findUnique({
    where: { id: saleTicketId },
    include: {
      venue: true,
      booking: {
        include: {
          items: {
            include: { service: true },
          },
          customer: true,
        },
      },
    },
  });

  if (!ticket) return { success: false, error: "Ticket de caisse introuvable" };

  const email = clientEmail || ticket.booking?.clientEmail || ticket.booking?.customer?.email;
  if (!email) return { success: false, error: "E-mail client manquant pour ce ticket" };

  const paymentLabels: Record<string, string> = {
    CARD_ONLINE: "Carte Bancaire en ligne",
    CARD_TERMINAL: "Carte Bancaire (Terminal TPE)",
    CASH: "Espèces",
    MIXED: "Paiement Combiné",
  };

  const lines = ticket.booking?.items.length
    ? ticket.booking.items.map((it) => ({
        description: it.service.name,
        quantity: 1,
        priceEuros: Math.round(it.priceCents / 100),
      }))
    : [
        {
          description: "Prestations & Soins Belora",
          quantity: 1,
          priceEuros: Math.round(ticket.totalTtcCents / 100),
        },
      ];

  const { subject, html } = renderReceiptEmail({
    clientName: ticket.clientName,
    venueName: ticket.venue.name,
    venueAddress: ticket.venue.address,
    venueCity: ticket.venue.city,
    ticketNumber: ticket.ticketNumber,
    date: formatDateFr(ticket.createdAt),
    lines,
    totalTtcEuros: Math.round(ticket.totalTtcCents / 100),
    vatAmountEuros: Math.round(ticket.vatAmountCents / 100),
    paymentMethodText: paymentLabels[ticket.paymentMethod] || "Carte Bancaire",
  });

  if (!isResendConfigured()) {
    console.log(`[SIMULATION RESEND] Envoi ticket caisse à ${email} (${subject})`);
    return { success: true, id: `mock_receipt_${Date.now()}`, isMock: true };
  }

  const result = await resend.emails.send({
    from: DEFAULT_FROM,
    to: email,
    subject,
    html,
  });

  return { success: true, id: result.data?.id, isMock: false };
}
