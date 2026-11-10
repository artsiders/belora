import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { createServiceCategory } from "@/modules/pro/settings.service";
import { createServiceCategorySchema } from "@/lib/validations/settings.schema";

export async function POST(request: Request) {
  try {
    const venueContext = await getProVenueContext(request);
    if ("error" in venueContext) {
      return NextResponse.json(
        { error: venueContext.error },
        { status: venueContext.status }
      );
    }

    const body = await request.json();
    const parsed = createServiceCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const category = await createServiceCategory(
      venueContext.venueId,
      parsed.data.name
    );
    return NextResponse.json({ category }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la création de la catégorie.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
