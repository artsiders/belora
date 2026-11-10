import { NextResponse } from "next/server";
import {
  getAdminContext,
  getPlatformDashboardMetrics,
} from "@/modules/admin/admin.service";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const metrics = await getPlatformDashboardMetrics();
    return NextResponse.json({ metrics });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des métriques du tableau de bord.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
