import { NextResponse } from "next/server";
import { getBookingById, getBookingByReference } from "@/modules/booking/booking.service";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Identifiant de réservation manquant." },
        { status: 400 }
      );
    }

    // Recherche par ID ou par Référence (#BEL-XXXXX)
    let booking = null;
    if (id.startsWith("%23") || id.startsWith("#") || id.startsWith("BEL-")) {
      const decodedRef = decodeURIComponent(id);
      const cleanRef = decodedRef.startsWith("#") ? decodedRef : `#${decodedRef}`;
      booking = await getBookingByReference(cleanRef);
    } else {
      booking = await getBookingById(id);
    }

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("GET /api/bookings/[id] error:", err);
    return NextResponse.json(
      { error: "Impossible de récupérer les détails de la réservation." },
      { status: 500 }
    );
  }
}
