import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking.schema";
import { createBookingTransaction } from "@/modules/booking/booking.service";

export async function POST(request: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      // Contexte hors-requête (ex: tests automatisés) ou session non initialisée
      session = null;
    }

    const body = await request.json();

    const parseResult = createBookingSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données de réservation invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      venueId,
      serviceIds,
      staffId,
      startTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
    } = parseResult.data;

    const email = clientEmail && clientEmail.trim() !== "" ? clientEmail : `${clientPhone.replace(/\D/g, "")}@belora-client.fr`;

    const result = await createBookingTransaction({
      venueId,
      serviceIds,
      staffId: staffId || null,
      startTime,
      customer: {
        name: clientName,
        email,
        phone: clientPhone,
      },
      notes,
      userId: session?.user?.id || null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("POST /api/bookings error:", err);
    return NextResponse.json(
      { error: err?.message || "Impossible d'enregistrer la réservation. Veuillez réessayer." },
      { status: 400 }
    );
  }
}
