import { NextResponse } from "next/server";
import { getProVenueContext, clockInStaffMember } from "@/modules/pro/pro-agenda.service";
import { clockInStaffSchema } from "@/lib/validations/pro-agenda.schema";

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const body = await request.json();
    const parseResult = clockInStaffSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const result = await clockInStaffMember({
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors du pointage.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
