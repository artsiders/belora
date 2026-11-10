import { NextResponse } from "next/server";
import {
  getAdminContext,
  getMonetizationSettings,
  updateMonetizationSettings,
} from "@/modules/admin/admin.service";
import { updateMonetizationSchema } from "@/lib/validations/admin.schema";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const settings = await getMonetizationSettings();
    return NextResponse.json({ settings });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des paramètres de monétisation.";
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
    const parsed = updateMonetizationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 }
      );
    }

    const updated = await updateMonetizationSettings(parsed.data);
    return NextResponse.json({ settings: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour des paramètres de monétisation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
