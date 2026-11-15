import { NextResponse } from "next/server";
import {
  getAdminContext,
  getMonetizationSettings,
  updateMonetizationSettings,
  getAdminSystemHealth,
} from "@/modules/admin/admin.service";
import { updatePlatformSettingsSchema } from "@/lib/validations/admin.schema";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const [settings, health] = await Promise.all([
      getMonetizationSettings(),
      getAdminSystemHealth(),
    ]);

    return NextResponse.json({
      settings: {
        defaultCommissionRate: settings.defaultCommissionRate,
        maintenanceMode: settings.maintenanceMode,
      },
      health,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des paramètres système.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const body = await request.json();
    const parsed = updatePlatformSettingsSchema.parse(body);

    const updated = await updateMonetizationSettings({
      defaultCommissionRate: parsed.defaultCommissionRate ?? 0.018,
      maintenanceMode: parsed.maintenanceMode,
    });

    return NextResponse.json({ settings: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour des paramètres système.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
