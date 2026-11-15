import type { Prisma, PrismaClient, User as PrismaUser } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter, AdapterUser } from "next-auth/adapters";

/**
 * Adaptateur Prisma sur-mesure pour NextAuth v5 dans Belora.
 * 
 * Cet adaptateur assure la compatibilité transparente entre le schéma NextAuth
 * (qui attend un champ `name`) et le schéma PostgreSQL Belora (qui stocke `firstName`
 * et `lastName` obligatoires, sans champ `name` brut).
 */
export function createBeloraAuthAdapter(prisma: PrismaClient): Adapter {
  const baseAdapter = PrismaAdapter(prisma);

  const toAdapterUser = (user: PrismaUser): AdapterUser => {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      name: `${user.firstName} ${user.lastName}`.trim() || user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    } as unknown as AdapterUser;
  };

  return {
    ...baseAdapter,

    async createUser(data: AdapterUser): Promise<AdapterUser> {
      const rawName = (data.name || "").trim();
      let firstName = "Client";
      let lastName = "Belora";

      if (rawName) {
        const parts = rawName.split(/\s+/);
        firstName = parts[0] || "Client";
        lastName = parts.slice(1).join(" ") || parts[0] || "Belora";
      }

      const email = (data.email || "").toLowerCase().trim();

      const created = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          image: data.image ?? null,
          emailVerified: data.emailVerified ?? null,
          role: "CUSTOMER",
        },
      });

      return toAdapterUser(created);
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return null;
      return toAdapterUser(user);
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const normalizedEmail = email?.toLowerCase().trim();
      if (!normalizedEmail) return null;
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) return null;
      return toAdapterUser(user);
    },

    async getUserByAccount(providerAccountId): Promise<AdapterUser | null> {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: providerAccountId },
        include: { user: true },
      });
      if (!account?.user) return null;
      return toAdapterUser(account.user);
    },

    async updateUser(data: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const { id, name, ...rest } = data;
      const dataToUpdate: Prisma.UserUpdateInput = {};

      if (rest.email !== undefined) dataToUpdate.email = rest.email?.toLowerCase().trim();
      if (rest.emailVerified !== undefined) dataToUpdate.emailVerified = rest.emailVerified;
      if (rest.image !== undefined) dataToUpdate.image = rest.image;

      if (name) {
        const parts = name.trim().split(/\s+/);
        dataToUpdate.firstName = parts[0];
        if (parts.length > 1) {
          dataToUpdate.lastName = parts.slice(1).join(" ");
        }
      }

      const updated = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      return toAdapterUser(updated);
    },
  };
}
