import { NextResponse } from "next/server";
import { getAdminContext } from "@/modules/admin/admin.service";
import { createPlan, getAdminPlans } from "@/modules/billing/plan.service";
import { planInputSchema } from "@/lib/validations/billing.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

export async function GET(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);
    return NextResponse.json({ plans: await getAdminPlans() });
  } catch (err) {
    return errorResponse(err, "Impossible de charger les forfaits.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);

    const parsed = await parseBody(request, planInputSchema);
    if ("response" in parsed) return parsed.response;

    const plan = await createPlan(parsed.data);
    return NextResponse.json({ plan }, { status: 201 });
  } catch (err) {
    return errorResponse(err, "Impossible de créer le forfait.");
  }
}
