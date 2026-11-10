import { NextResponse } from "next/server";
import {
  getAccountUserContext,
  cancelBookingByCustomer,
} from "@/modules/account/account.service";
import { cancelBookingSchema } from "@/lib/validations/account.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const userContext = await getAccountUserContext(request);
    if ("error" in userContext) {
      return NextResponse.json(
        { error: userContext.error },
        { status: userContext.status }
      );
    }

    const { id } = await params;
    let reason: string | undefined = undefined;

    try {
      const body = await request.json();
      const parsed = cancelBookingSchema.safeParse(body);
      if (parsed.success) {
        reason = parsed.data.reason;
      }
    } catch {
      // Body optionnel
    }

    const result = await cancelBookingByCustomer(
      id,
      userContext.user,
      reason
    );
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de l'annulation de la réservation.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
