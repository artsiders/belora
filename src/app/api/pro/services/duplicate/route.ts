import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { duplicateProService } from "@/modules/pro/settings.service";
import { duplicateServiceSchema } from "@/lib/validations/settings.schema";

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
    const parsed = duplicateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const service = await duplicateProService(
      venueContext.venueId,
      parsed.data.serviceId
    );
    return NextResponse.json({ service }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la duplication de la prestation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
