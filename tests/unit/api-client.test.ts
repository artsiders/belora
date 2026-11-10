import { describe, it, expect } from "vitest";
import { apiClient } from "../../src/lib/api-client";

describe("Sprint 2 — Client Axios apiClient", () => {
  it("is configured with baseURL /api and json headers", () => {
    expect(apiClient.defaults.baseURL).toBe("/api");
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });

  it("masks internal technical database and provider keywords (Règle 14 .agents/AGENTS.md)", async () => {
    // Simuler un intercepteur sur une réponse d'erreur contenant des fuites techniques
    const testErrorInterceptors = (apiClient.interceptors.response as any).handlers[0].rejected;

    // Test avec fuite Prisma / Postgres
    const prismaError = {
      response: {
        status: 500,
        data: { error: "PrismaClientKnownRequestError: Unique constraint failed on postgres table" },
      },
    };

    try {
      await testErrorInterceptors(prismaError);
    } catch (err: any) {
      expect(err.statusCode).toBe(500);
      expect(err.error).not.toContain("Prisma");
      expect(err.error).not.toContain("postgres");
      expect(err.error).toBe("Une erreur inattendue est survenue. Veuillez réessayer dans quelques instants.");
    }

    // Test avec fuite Cloudinary
    const cloudinaryError = {
      response: {
        status: 502,
        data: { error: "Cloudinary upload stream ECONNREFUSED" },
      },
    };

    try {
      await testErrorInterceptors(cloudinaryError);
    } catch (err: any) {
      expect(err.statusCode).toBe(502);
      expect(err.error).not.toContain("Cloudinary");
      expect(err.error).not.toContain("ECONNREFUSED");
    }
  });

  it("translates HTTP status codes into clear user messages", async () => {
    const testErrorInterceptors = (apiClient.interceptors.response as any).handlers[0].rejected;

    // 401 Unauthorized
    try {
      await testErrorInterceptors({ response: { status: 401, data: {} } });
    } catch (err: any) {
      expect(err.statusCode).toBe(401);
      expect(err.error).toContain("Veuillez vous connecter");
    }

    // 404 Not Found
    try {
      await testErrorInterceptors({ response: { status: 404, data: {} } });
    } catch (err: any) {
      expect(err.statusCode).toBe(404);
      expect(err.error).toContain("introuvable");
    }

    // Network error (no response)
    try {
      await testErrorInterceptors({ message: "Network Error" });
    } catch (err: any) {
      expect(err.statusCode).toBe(500);
      expect(err.error).toContain("Impossible de contacter le serveur");
    }
  });
});
