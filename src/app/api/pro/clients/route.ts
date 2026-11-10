import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { getClientsCRM, createClientCRM } from "@/modules/pro/clients.service";
import { createClientSchema } from "@/lib/validations/client.schema";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const segment = (searchParams.get("segment") as any) || "all";

    const data = await getClientsCRM(venueContext.venueId, {
      segment,
      search,
    });

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des clients.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const body = await request.json();
    const parseResult = createClientSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données client invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const client = await createClientCRM({
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création de la fiche client.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
