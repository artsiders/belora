import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BookingStatus } from "@prisma/client";
import { sendBookingReminderEmail } from "@/lib/email";
import { sendBookingReminderSms } from "@/lib/sms";

const CRON_SECRET = process.env.CRON_SECRET || "belora-dev-cron-secret";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token !== CRON_SECRET) {
      return NextResponse.json(
        { error: "Accès non autorisé à la tâche cron." },
        { status: 401 }
      );
    }

    const now = new Date();
    const minNotice = new Date(now.getTime() + 20 * 60 * 60 * 1000); // dans 20 heures
    const maxNotice = new Date(now.getTime() + 48 * 60 * 60 * 1000); // dans 48 heures

    // Recherche des réservations confirmées dans la plage horaire
    const upcomingBookings = await db.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        items: {
          some: {
            startTime: {
              gte: minNotice,
              lte: maxNotice,
            },
          },
        },
      },
      include: {
        venue: true,
        items: {
          include: { staff: true },
          orderBy: { startTime: "asc" },
        },
      },
    });

    const results = [];

    for (const booking of upcomingBookings) {
      const firstItem = booking.items[0];
      const startTime = firstItem ? new Date(firstItem.startTime) : now;
      const hours = String(startTime.getHours()).padStart(2, "0");
      const minutes = String(startTime.getMinutes()).padStart(2, "0");

      // 1. Envoi e-mail de rappel
      const emailResult = await sendBookingReminderEmail(booking.id);

      // 2. Envoi SMS de rappel
      const smsResult = await sendBookingReminderSms({
        recipientPhone: booking.clientPhone,
        venueName: booking.venue.name,
        staffName: firstItem?.staff?.name || null,
        dateText: "demain",
        timeText: `${hours}h${minutes}`,
        address: `${booking.venue.address}, ${booking.venue.city}`,
      });

      results.push({
        bookingId: booking.id,
        reference: booking.reference,
        emailSent: emailResult.success,
        smsSent: smsResult.success,
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      reminders: results,
    });
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("Cron reminders error:", err);
    return NextResponse.json(
      { error: "Erreur lors du traitement des rappels automatiques." },
      { status: 500 }
    );
  }
}
