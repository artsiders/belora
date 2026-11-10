import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { createSaleTicketTransaction } from "@/modules/pro/checkout.service";
import { createSaleTicketSchema } from "@/lib/validations/checkout.schema";

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const body = await request.json();
    const parseResult = createSaleTicketSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données de caisse invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const ticket = await createSaleTicketTransaction({
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'encaissement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
