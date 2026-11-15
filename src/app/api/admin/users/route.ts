import { NextResponse } from "next/server";
import { getAdminContext, getAdminUsers } from "@/modules/admin/admin.service";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const adminContext = await getAdminContext(request);
    if ("error" in adminContext) {
      return NextResponse.json(
        { error: adminContext.error },
        { status: adminContext.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role");
    const search = searchParams.get("search") || undefined;

    let role: Role | undefined;
    if (roleParam && Object.values(Role).includes(roleParam as Role)) {
      role = roleParam as Role;
    }

    const users = await getAdminUsers({ role, search });
    return NextResponse.json({ users });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Erreur lors de la récupération des utilisateurs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
