import { NextResponse } from "next/server";
import {
  getAdminContext,
  deleteAdminReview,
} from "@/modules/admin/admin.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const result = await deleteAdminReview(id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la suppression de l'avis.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
