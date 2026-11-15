import { NextResponse } from "next/server";
import {
  getAdminContext,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} from "@/modules/admin/admin.service";
import { updateUserSchema } from "@/lib/validations/admin.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const user = await getAdminUserById(id);
    return NextResponse.json({ user });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des détails de l'utilisateur.";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateUserSchema.parse(body);

    const updated = await updateAdminUser(id, parsed);
    return NextResponse.json({ user: updated });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la mise à jour de l'utilisateur.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { id } = await params;
    const result = await deleteAdminUser(id, adminContext.user.id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la suppression de l'utilisateur.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
