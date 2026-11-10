import { NextResponse } from "next/server";
import {
  getAccountUserContext,
  createReviewForBooking,
} from "@/modules/account/account.service";
import { createReviewSchema } from "@/lib/validations/account.schema";

export async function POST(request: Request) {
  try {
    const userContext = await getAccountUserContext(request);
    if ("error" in userContext) {
      return NextResponse.json(
        { error: userContext.error },
        { status: userContext.status }
      );
    }

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données d'avis invalides." },
        { status: 400 }
      );
    }

    const review = await createReviewForBooking(
      parsed.data,
      userContext.user
    );
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la publication de votre avis.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
