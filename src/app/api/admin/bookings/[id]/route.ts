import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminBookingById,
  updateAdminBookingStatus,
} from "@/modules/admin/admin.service";
import { updateBookingStatusSchema } from "@/lib/validations/admin.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const booking = await getAdminBookingById(id);
    return NextResponse.json({ booking });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des détails de la réservation.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateBookingStatusSchema.parse(body);

    const updated = await updateAdminBookingStatus(id, parsed);
    return NextResponse.json({ booking: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour du statut de la réservation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
