import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminFinancialReport,
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

    const report = await getAdminFinancialReport();
    return NextResponse.json({ report });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la génération du rapport financier.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
