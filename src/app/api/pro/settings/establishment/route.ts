import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { getEstablishmentSettings, updateEstablishmentSettings } from "@/modules/pro/settings.service";
import { updateEstablishmentSchema } from "@/lib/validations/settings.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

export async function GET(request: Request) {
  try {
    const venue = await getProVenueContext(request);
    if ("error" in venue) return jsonError(venue.error, venue.status);
    return NextResponse.json({ establishment: await getEstablishmentSettings(venue.venueId) });
  } catch (err) {
    return errorResponse(err, "Impossible de charger les paramètres de l'établissement.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const venue = await getProVenueContext(request);
    if ("error" in venue) return jsonError(venue.error, venue.status);

    const parsed = await parseBody(request, updateEstablishmentSchema);
    if ("response" in parsed) return parsed.response;

    return NextResponse.json({ establishment: await updateEstablishmentSettings(venue.venueId, parsed.data) });
  } catch (err) {
    return errorResponse(err, "Impossible d'enregistrer les paramètres de l'établissement.");
  }
}
