import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { createSubscriptionCheckout } from "@/modules/billing/subscription.service";
import { subscriptionCheckoutSchema } from "@/lib/validations/billing.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

/** Souscription ou changement de forfait. Réservé au propriétaire de l'établissement. */
export async function POST(request: Request) {
  try {
    const venue = await getProVenueContext(request);
    if ("error" in venue) return jsonError(venue.error, venue.status);

    const session = await auth();
    const owner = await db.venue.findUnique({
      where: { id: venue.venueId },
      select: { ownerId: true, owner: { select: { email: true } } },
    });
    if (!session?.user?.id || owner?.ownerId !== session.user.id) {
      return jsonError("Seul le gérant de l'établissement peut modifier l'abonnement.", 403);
    }

    const parsed = await parseBody(request, subscriptionCheckoutSchema);
    if ("response" in parsed) return parsed.response;

    const result = await createSubscriptionCheckout({
      venueId: venue.venueId,
      planId: parsed.data.planId,
      interval: parsed.data.interval,
      customerEmail: owner.owner.email,
    });
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err, "Impossible de démarrer la souscription. Veuillez réessayer.");
  }
}
