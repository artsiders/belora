import { NextResponse } from "next/server";
import { getAdminContext } from "@/modules/admin/admin.service";
import { deletePlan, updatePlan } from "@/modules/billing/plan.service";
import { planInputSchema } from "@/lib/validations/billing.schema";
import { errorResponse, jsonError, parseBody } from "@/lib/api-route";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);

    const parsed = await parseBody(request, planInputSchema);
    if ("response" in parsed) return parsed.response;

    const { id } = await params;
    const plan = await updatePlan(id, parsed.data);
    return NextResponse.json({ plan });
  } catch (err) {
    return errorResponse(err, "Impossible de modifier le forfait.");
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const admin = await getAdminContext(request);
    if ("error" in admin) return jsonError(admin.error, admin.status);

    const { id } = await params;
    await deletePlan(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, "Impossible de supprimer le forfait.");
  }
}
