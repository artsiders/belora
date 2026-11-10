import { NextResponse } from "next/server";
import {
  getProVenueContext,
  updateProAppointment,
  deleteProAppointment,
} from "@/modules/pro/pro-agenda.service";
import { updateProAppointmentSchema } from "@/lib/validations/pro-agenda.schema";
import { db } from "@/lib/db";
import { formatUtcToLocalParts } from "@/modules/availability/time-utils";

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

    const booking = await db.booking.findFirst({
      where: {
        venueId: venueContext.venueId,
        OR: [{ id }, { reference: id }],
      },
      include: {
        items: {
          include: {
            service: true,
            staff: true,
            resource: true,
          },
        },
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
    }

    const item = booking.items[0];
    const { date, time: startTime } = item
      ? formatUtcToLocalParts(item.startTime)
      : { date: "", time: "" };
    const { time: endTime } = item
      ? formatUtcToLocalParts(item.endTime)
      : { time: "" };

    const appointment = {
      id: booking.id,
      clientId: booking.customerId || booking.customer?.id || "",
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      clientEmail: booking.clientEmail || "",
      serviceId: item?.serviceId || "",
      serviceName: item?.service.name || "",
      staffId: item?.staffId || "",
      staffName: item?.staff.name || "",
      resourceId: item?.resourceId || undefined,
      resourceName: item?.resource?.name || undefined,
      date,
      startTime,
      endTime,
      price: (item?.priceCents || booking.totalPriceCents) / 100,
      depositPaid: booking.depositCents / 100,
      status: booking.status.toLowerCase(),
      notes: booking.notes || undefined,
    };

    return NextResponse.json({ appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la récupération du rendez-vous.";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const parseResult = updateProAppointmentSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await updateProAppointment(id, {
      ...parseResult.data,
      venueId: parseResult.data.venueId || venueContext.venueId,
    });

    return NextResponse.json({ appointment: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour du rendez-vous.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json({ error: venueContext.error }, { status: venueContext.status });
    }

    const result = await deleteProAppointment(id, venueContext.venueId);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de l'annulation du rendez-vous.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
