import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminBookings,
} from "@/modules/admin/admin.service";
import { BookingStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const venueId = searchParams.get("venueId") || undefined;
    const search = searchParams.get("search") || undefined;

    let status: BookingStatus | undefined;
    if (statusParam && Object.values(BookingStatus).includes(statusParam as BookingStatus)) {
      status = statusParam as BookingStatus;
    }

    const bookings = await getAdminBookings({ status, venueId, search });
    return NextResponse.json({ bookings });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des réservations.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
