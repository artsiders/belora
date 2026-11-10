import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { authConfig } from "@/auth.config";

const credentialsSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await db.user.findUnique({
          where: { email: normalizedEmail },
          include: {
            ownedVenues: {
              select: { id: true, slug: true },
              take: 1,
            },
            staffProfiles: {
              select: { id: true, venueId: true },
              take: 1,
            },
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        // Détermination du venueId et staffId si utilisateur Pro
        let venueId: string | null = null;
        let venueSlug: string | null = null;
        let staffId: string | null = null;

        if (user.ownedVenues.length > 0) {
          venueId = user.ownedVenues[0].id;
          venueSlug = user.ownedVenues[0].slug;
        } else if (user.staffProfiles.length > 0) {
          venueId = user.staffProfiles[0].venueId;
          staffId = user.staffProfiles[0].id;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          image: user.image,
          venueId,
          venueSlug,
          staffId,
        };
      },
    }),
  ],
});
