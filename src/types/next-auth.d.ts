import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    venueId?: string | null;
    venueSlug?: string | null;
    staffId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      venueId?: string | null;
      venueSlug?: string | null;
      staffId?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    venueId?: string | null;
    venueSlug?: string | null;
    staffId?: string | null;
  }
}
