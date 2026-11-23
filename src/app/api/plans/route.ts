import { NextResponse } from "next/server";
import { getPublicPricing } from "@/modules/billing/plan.service";
import { errorResponse } from "@/lib/api-route";

/** Tarifs publics de Belora Pro (page /pro et inscription). */
export async function GET() {
  try {
    const pricing = await getPublicPricing();
    return NextResponse.json(pricing, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    return errorResponse(err, "Impossible de charger les tarifs pour le moment.", 500);
  }
}
