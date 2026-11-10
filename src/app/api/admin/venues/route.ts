import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminVenues,
} from "@/modules/admin/admin.service";
import { VenueStatus } from "@prisma/client";

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
    const statusParam = searchParams.get("status");
    const searchParam = searchParams.get("search") || undefined;

    let status: VenueStatus | undefined = undefined;
    if (
      statusParam &&
      Object.values(VenueStatus).includes(statusParam as VenueStatus)
    ) {
      status = statusParam as VenueStatus;
    }

    const venues = await getAdminVenues({
      status,
      search: searchParam,
    });

    return NextResponse.json({ venues });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des établissements.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
