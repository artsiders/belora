import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import {
  getNotificationSettings,
  updateNotificationSettings,
} from "@/modules/pro/settings.service";
import { notificationSettingsSchema } from "@/lib/validations/settings.schema";

export async function GET(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const settings = await getNotificationSettings(venueContext.venueId);
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des paramètres de notification.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const body = await request.json();
    const parsed = notificationSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const settings = await updateNotificationSettings(
      venueContext.venueId,
      parsed.data
    );
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour des paramètres de notification.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
