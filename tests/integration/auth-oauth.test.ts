import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Role } from "@prisma/client";
import { db as prisma } from "@/lib/db";
import type { AdapterAccount, AdapterUser } from "next-auth/adapters";
import { createBeloraAuthAdapter } from "../../src/lib/auth-adapter";

interface BeloraTestUser extends AdapterUser {
  firstName?: string;
  lastName?: string;
  role?: Role;
}

describe("Sprint 1 & Auth - Intégration OAuth & Adaptateur Belora", () => {
  let adapter: ReturnType<typeof createBeloraAuthAdapter>;

  const testEmail1 = "oauth.google.test1@belora.com";
  const testEmail2 = "oauth.google.test2@belora.com";
  const testEmailSingleName = "oauth.google.singlename@belora.com";

  beforeAll(() => {
    adapter = createBeloraAuthAdapter(prisma);
  });

  afterAll(async () => {
    await prisma.account.deleteMany({
      where: {
        providerAccountId: {
          in: ["google-sub-12345", "google-sub-67890"],
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testEmail1, testEmail2, testEmailSingleName],
        },
      },
    });
  });

  describe("createBeloraAuthAdapter - Gestion transparente de Google OAuth", () => {
    it("creates a user from NextAuth OAuth payload and splits name into firstName and lastName", async () => {
      const payload: AdapterUser = {
        id: "",
        name: "Éléonore de Montmirail",
        email: testEmail1,
        image: "https://lh3.googleusercontent.com/avatar-eleonore.jpg",
        emailVerified: new Date(),
      };

      const createdUser = (await adapter.createUser!(payload)) as BeloraTestUser;

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.email).toBe(testEmail1);
      expect(createdUser.firstName).toBe("Éléonore");
      expect(createdUser.lastName).toBe("de Montmirail");
      expect(createdUser.role).toBe(Role.CUSTOMER);
      expect(createdUser.name).toBe("Éléonore de Montmirail");

      // Vérification directe dans PostgreSQL
      const inDb = await prisma.user.findUnique({ where: { email: testEmail1 } });
      expect(inDb).not.toBeNull();
      expect(inDb?.firstName).toBe("Éléonore");
      expect(inDb?.lastName).toBe("de Montmirail");
      expect(inDb?.image).toBe("https://lh3.googleusercontent.com/avatar-eleonore.jpg");
    });

    it("handles single-word name or empty name gracefully with sensible defaults", async () => {
      const payload: AdapterUser = {
        id: "",
        name: "Juliane",
        email: testEmailSingleName,
        image: null,
        emailVerified: null,
      };

      const createdSingle = (await adapter.createUser!(payload)) as BeloraTestUser;

      expect(createdSingle.firstName).toBe("Juliane");
      expect(createdSingle.lastName).toBe("Juliane");
      expect(createdSingle.email).toBe(testEmailSingleName);
    });

    it("links a Google OAuth account to the user via linkAccount", async () => {
      const user = await adapter.getUserByEmail!(testEmail1);
      expect(user).not.toBeNull();

      const accountData: AdapterAccount = {
        userId: user!.id,
        type: "oauth",
        provider: "google",
        providerAccountId: "google-sub-12345",
        access_token: "mock-google-access-token",
        id_token: "mock-google-id-token",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: "bearer",
        scope: "openid profile email",
      };

      const linked = await adapter.linkAccount!(accountData);
      expect(linked).toBeDefined();

      // Récupération de l'utilisateur par son compte Google OAuth
      const userByAccount = (await adapter.getUserByAccount!({
        provider: "google",
        providerAccountId: "google-sub-12345",
      })) as BeloraTestUser | null;

      expect(userByAccount).not.toBeNull();
      expect(userByAccount?.id).toBe(user!.id);
      expect(userByAccount?.email).toBe(testEmail1);
      expect(userByAccount?.firstName).toBe("Éléonore");
    });

    it("updates user details via updateUser without breaking firstName and lastName", async () => {
      const user = await adapter.getUserByEmail!(testEmail1);
      expect(user).not.toBeNull();

      const updatePayload: Partial<AdapterUser> & { id: string } = {
        id: user!.id,
        name: "Éléonore NouveauNom",
        image: "https://lh3.googleusercontent.com/new-avatar.jpg",
      };

      const updated = (await adapter.updateUser!(updatePayload)) as BeloraTestUser;

      expect(updated.firstName).toBe("Éléonore");
      expect(updated.lastName).toBe("NouveauNom");
      expect(updated.image).toBe("https://lh3.googleusercontent.com/new-avatar.jpg");
    });

    it("retrieves user by id and normalizes email lookup case-insensitively", async () => {
      const user = await adapter.getUserByEmail!(testEmail1.toUpperCase());
      expect(user).not.toBeNull();
      expect(user?.email).toBe(testEmail1);

      const byId = await adapter.getUser!(user!.id);
      expect(byId).not.toBeNull();
      expect(byId?.id).toBe(user!.id);
      expect(byId?.name).toBe("Éléonore NouveauNom");
    });
  });
});
