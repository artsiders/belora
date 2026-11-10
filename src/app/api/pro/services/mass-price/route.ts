import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { massUpdatePrices } from "@/modules/pro/settings.service";
import { massPriceAdjustmentSchema } from "@/lib/validations/settings.schema";

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
    const parsed = massPriceAdjustmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const result = await massUpdatePrices(venueContext.venueId, parsed.data);
    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} prestation(s) mise(s) à jour.`,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour des tarifs en masse.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
