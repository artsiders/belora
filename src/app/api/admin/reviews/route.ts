import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminReviews,
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

    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get("venueId") || undefined;
    const minRatingParam = searchParams.get("minRating");
    const minRating = minRatingParam ? parseInt(minRatingParam, 10) : undefined;

    const reviews = await getAdminReviews({ venueId, minRating });
    return NextResponse.json({ reviews });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des avis.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
