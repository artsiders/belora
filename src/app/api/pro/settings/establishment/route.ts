import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import {
  getEstablishmentSettings,
  updateEstablishmentSettings,
} from "@/modules/pro/settings.service";
import { updateEstablishmentSchema } from "@/lib/validations/settings.schema";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const establishment = await getEstablishmentSettings(venueContext.venueId);
    return NextResponse.json({ establishment });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des paramètres d'établissement.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const body = await request.json();
    const parsed = updateEstablishmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ||
            "Données d'établissement invalides.",
        },
        { status: 400 }
      );
    }

    const establishment = await updateEstablishmentSettings(
      venueContext.venueId,
      parsed.data
    );
    return NextResponse.json({ establishment });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour des paramètres d'établissement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
