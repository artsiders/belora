import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import {
  getProServicesCatalog,
  createProService,
} from "@/modules/pro/settings.service";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const { services, categories } = await getProServicesCatalog(
      venueContext.venueId
    );
    return NextResponse.json({ services, categories });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des prestations.";
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
    const service = await createProService(venueContext.venueId, body);
    return NextResponse.json({ service }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la création de la prestation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
