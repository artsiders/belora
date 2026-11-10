import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { getClientCRMDetails, updateClientCRM } from "@/modules/pro/clients.service";
import { updateClientSchema } from "@/lib/validations/client.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const data = await getClientCRMDetails(id, venueContext.venueId);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération de la fiche client.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const body = await request.json();
    const parseResult = updateClientSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const client = await updateClientCRM(id, {
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json({ client }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour de la fiche client.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
