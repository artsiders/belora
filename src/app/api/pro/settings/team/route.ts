import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import {
  getTeamSettings,
  createStaffMember,
} from "@/modules/pro/settings.service";
import { createStaffMemberSchema } from "@/lib/validations/settings.schema";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const team = await getTeamSettings(venueContext.venueId);
    return NextResponse.json({ team });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des paramètres de l'équipe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const body = await request.json();
    const parsed = createStaffMemberSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const staffMember = await createStaffMember(
      venueContext.venueId,
      parsed.data
    );
    return NextResponse.json({ staffMember }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de l'ajout du collaborateur.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
