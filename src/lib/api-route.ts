import { NextResponse } from "next/server";
import type { ZodType } from "zod";

/**
 * Utilitaires communs aux routes API : réponses d'erreur homogènes
 * et validation du corps de requête.
 */

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Convertit une exception métier en réponse JSON (statut porté par l'erreur si présent). */
export function errorResponse(err: unknown, fallbackMessage: string, fallbackStatus = 400) {
  const status =
    err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : fallbackStatus;
  // Les erreurs des fournisseurs externes (paiement, etc.) ne sont jamais exposées telles quelles
  const isProviderError =
    !!err && typeof err === "object" && "type" in err && String((err as { type: unknown }).type).startsWith("Stripe");
  const message = !isProviderError && err instanceof Error && err.message ? err.message : fallbackMessage;
  if (status >= 500) console.error(fallbackMessage, err);
  return jsonError(message, status);
}

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<{ data: T } | { response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: jsonError("Données invalides.", 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { response: jsonError(parsed.error.issues[0]?.message || "Données invalides.", 400) };
  }
  return { data: parsed.data };
}
