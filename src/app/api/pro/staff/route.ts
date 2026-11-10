import { NextResponse } from "next/server";
import { getProVenueContext, getProStaffMembers } from "@/modules/pro/pro-agenda.service";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const staff = await getProStaffMembers(venueContext.venueId);
    return NextResponse.json({ staff });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des collaborateurs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
