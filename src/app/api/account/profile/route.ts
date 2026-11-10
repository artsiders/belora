import { NextResponse } from "next/server";
import {
  getAccountUserContext,
  updateCustomerProfile,
} from "@/modules/account/account.service";
import { updateCustomerProfileSchema } from "@/lib/validations/account.schema";

export async function GET(request: Request) {
  try {
    const userContext = await getAccountUserContext(request);
    if ("error" in userContext) {
      return NextResponse.json(
        { error: userContext.error },
        { status: userContext.status }
      );
    }

    return NextResponse.json({ user: userContext.user });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération de votre profil.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userContext = await getAccountUserContext(request);
    if ("error" in userContext) {
      return NextResponse.json(
        { error: userContext.error },
        { status: userContext.status }
      );
    }

    const body = await request.json();
    const parsed = updateCustomerProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides." },
        { status: 400 }
      );
    }

    const updated = await updateCustomerProfile(
      userContext.user.id,
      parsed.data
    );
    return NextResponse.json({ user: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour de votre profil.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
