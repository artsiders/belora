import { NextResponse } from "next/server";
import { getProVenueContext } from "@/modules/pro/pro-agenda.service";
import { getVenueSubscriptionSummary } from "@/modules/billing/subscription.service";
import { errorResponse, jsonError } from "@/lib/api-route";

export async function GET(request: Request) {
  try {
    const venue = await getProVenueContext(request);
    if ("error" in venue) return jsonError(venue.error, venue.status);
    return NextResponse.json({ subscription: await getVenueSubscriptionSummary(venue.venueId) });
  } catch (err) {
    return errorResponse(err, "Impossible de charger votre abonnement.", 500);
  }
}
