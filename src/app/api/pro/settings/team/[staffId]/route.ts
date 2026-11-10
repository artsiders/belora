import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { updateStaffMemberSettings } from "@/modules/pro/settings.service";
import { updateStaffScheduleSchema } from "@/lib/validations/settings.schema";

interface RouteParams {
  params: Promise<{ staffId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const { staffId } = await params;
    const body = await request.json();
    const parsed = updateStaffScheduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const updated = await updateStaffMemberSettings(
      venueContext.venueId,
      staffId,
      parsed.data
    );
    return NextResponse.json({ staffMember: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour du planning collaborateur.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
