import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { performDailyClosing } from "@/modules/pro/checkout.service";
import { dailyClosingSchema } from "@/lib/validations/checkout.schema";

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const body = await request.json();
    const parseResult = dailyClosingSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données de clôture invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const result = await performDailyClosing({
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la clôture de caisse.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
