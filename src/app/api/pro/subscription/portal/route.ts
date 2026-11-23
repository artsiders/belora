import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { createBillingPortalSession } from "@/modules/billing/subscription.service";
import { errorResponse, jsonError } from "@/lib/api-route";

/** Accès à l'espace de facturation (factures, moyen de paiement, résiliation). */
export async function POST(request: Request) {
  try {
    const venue = await getProVenueContext(request);
    if ("error" in venue) return jsonError(venue.error, venue.status);

    const session = await auth();
    const owner = await db.venue.findUnique({ where: { id: venue.venueId }, select: { ownerId: true } });
    if (!session?.user?.id || owner?.ownerId !== session.user.id) {
      return jsonError("Seul le gérant de l'établissement peut gérer la facturation.", 403);
    }

    const url = await createBillingPortalSession(venue.venueId);
    return NextResponse.json({ url });
  } catch (err) {
    return errorResponse(err, "Impossible d'ouvrir l'espace de facturation. Veuillez réessayer.");
  }
}
