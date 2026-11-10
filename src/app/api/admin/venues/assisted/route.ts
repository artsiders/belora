import { NextResponse } from "next/server";
import {
  getAdminContext,
  createAssistedVenue,
} from "@/modules/admin/admin.service";
import { createAssistedVenueSchema } from "@/lib/validations/admin.schema";

export async function POST(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const body = await request.json();
    const parsed = createAssistedVenueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données d'onboarding invalides." },
        { status: 400 }
      );
    }

    const result = await createAssistedVenue(parsed.data);
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la création assistée de l'établissement.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
