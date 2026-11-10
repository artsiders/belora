import { NextResponse } from "next/server";
import { getProVenueContext, getProClients } from "@/modules/pro/pro-agenda.service";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;

    const clients = await getProClients(venueContext.venueId, search);
    return NextResponse.json({ clients });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des clients.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
