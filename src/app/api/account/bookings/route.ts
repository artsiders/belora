import { NextResponse } from "next/server";
import {
  getAccountUserContext,
  getCustomerBookings,
} from "@/modules/account/account.service";

export async function GET(request: Request) {
  try {
    const userContext = await getAccountUserContext(request);
    if ("error" in userContext) {
      return NextResponse.json(
        { error: userContext.error },
        { status: userContext.status }
      );
    }

    const result = await getCustomerBookings(userContext.user);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération de vos réservations.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
