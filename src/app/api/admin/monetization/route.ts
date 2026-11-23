import { NextResponse } from "next/server";
import { getAdminContext } from "@/modules/admin/admin.service";
import { getMonetizationOverview } from "@/modules/billing/admin-billing.service";
import { updatePlatformSettings } from "@/modules/billing/platform-settings.service";
import { platformBillingSettingsSchema } from "@/lib/validations/billing.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);
    return NextResponse.json(await getMonetizationOverview());
  } catch (err) {
    return errorResponse(err, "Impossible de charger les paramètres de monétisation.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);

    const parsed = await parseBody(request, platformBillingSettingsSchema);
    if ("response" in parsed) return parsed.response;

    await updatePlatformSettings(parsed.data);
    return NextResponse.json(await getMonetizationOverview());
  } catch (err) {
    return errorResponse(err, "Impossible d'enregistrer les paramètres de monétisation.");
  }
}
