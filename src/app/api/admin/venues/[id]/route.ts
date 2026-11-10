import { NextResponse } from "next/server";
import {
  getAdminContext,
  updateAdminVenue,
} from "@/modules/admin/admin.service";
import { updateVenueStatusSchema } from "@/lib/validations/admin.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
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
    const parsed = updateVenueStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 }
      );
    }

    const updated = await updateAdminVenue(id, parsed.data);
    return NextResponse.json({ venue: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour de l'établissement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
