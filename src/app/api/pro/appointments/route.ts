import { NextResponse } from "next/server";
import {
  getProVenueContext,
  getProAppointments,
  createManualProAppointment,
} from "@/modules/pro/pro-agenda.service";
import { createProAppointmentSchema } from "@/lib/validations/pro-agenda.schema";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const staffId = searchParams.get("staffId") || undefined;
    const status = searchParams.get("status") || undefined;

    const appointments = await getProAppointments({
      venueId: venueContext.venueId,
      startDate,
      endDate,
      staffId,
      status,
    });

    return NextResponse.json({ appointments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération des rendez-vous.";
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
    const parseResult = createProAppointmentSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const appointment = await createManualProAppointment({
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création du rendez-vous.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
