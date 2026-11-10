import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { getPendingAppointments } from "@/modules/pro/checkout.service";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;

    const data = await getPendingAppointments(venueContext.venueId, date);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des rendez-vous à encaisser.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
