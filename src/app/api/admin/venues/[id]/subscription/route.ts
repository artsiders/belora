import { NextResponse } from "next/server";
import { getAdminContext } from "@/modules/admin/admin.service";
import { setVenueSubscriptionByAdmin } from "@/modules/billing/subscription.service";
import { adminVenueSubscriptionSchema } from "@/lib/validations/billing.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Attribution manuelle d'un forfait à un établissement par l'équipe Belora. */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);

    const parsed = await parseBody(request, adminVenueSubscriptionSchema);
    if ("response" in parsed) return parsed.response;

    const { id } = await params;
    const subscription = await setVenueSubscriptionByAdmin(id, parsed.data);
    return NextResponse.json({ subscription });
  } catch (err) {
    return errorResponse(err, "Impossible de modifier l'abonnement de l'établissement.");
  }
}
