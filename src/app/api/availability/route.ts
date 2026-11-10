import { NextResponse } from "next/server";
import { AvailabilityService } from "@/modules/availability/availability.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const venueId = searchParams.get("venueId");
    const date = searchParams.get("date");
    const serviceIdsParam = searchParams.get("serviceIds");
    const staffId = searchParams.get("staffId");

    if (!venueId) {
      return NextResponse.json(
        { error: "Le paramètre venueId est requis." },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Une date valide au format YYYY-MM-DD est requise." },
        { status: 400 }
      );
    }

    const serviceIds = serviceIdsParam
      ? serviceIdsParam.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (serviceIds.length === 0) {
      return NextResponse.json(
        { error: "Veuillez sélectionner au moins une prestation." },
        { status: 400 }
      );
    }

    const result = await AvailabilityService.getAvailableSlots({
      venueId,
      serviceIds,
      date,
      staffId: staffId || undefined,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("GET /api/availability error:", err);
    return NextResponse.json(
      { error: "Impossible de calculer les créneaux disponibles. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
