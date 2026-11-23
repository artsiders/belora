import { NextResponse } from "next/server";
import { getAdminContext, getAdminSystemHealth } from "@/modules/admin/admin.service";
import { errorResponse, jsonError } from "@/lib/api-route";

/**
 * Santé système. Les règles de monétisation et le mode maintenance
 * sont gérés exclusivement par /api/admin/monetization.
 */
export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);
    return NextResponse.json({ health: await getAdminSystemHealth() });
  } catch (err) {
    return errorResponse(err, "Impossible de charger le diagnostic système.", 500);
  }
}
