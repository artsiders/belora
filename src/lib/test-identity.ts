/**
 * Les tests d'intégration appellent les route handlers directement, sans session NextAuth,
 * et passent l'identité en paramètre (?adminEmail=, ?userId=, ?venueId=).
 * Ce raccourci n'est accepté QUE sous Vitest (NODE_ENV === "test") : jamais en dev ni en production.
 */
export function isTestIdentityFallbackAllowed(): boolean {
  return process.env.NODE_ENV === "test";
}
