/** Contrôles d'identifiants d'entreprise français (utilisables côté client et serveur). */

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** SIRET : 14 chiffres et clé de Luhn valide (exception officielle de La Poste incluse). */
export function isValidSiret(value: string): boolean {
  const digits = normalizeDigits(value);
  if (digits.length !== 14) return false;
  if (digits.startsWith("356000000")) {
    return digits.split("").reduce((a, d) => a + Number(d), 0) % 5 === 0;
  }
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let n = Number(digits[13 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/** TVA intracommunautaire française : FR + clé (2 caractères) + SIREN (9 chiffres). */
export function isValidFrenchVat(value: string): boolean {
  return /^FR[0-9A-Z]{2}\d{9}$/.test(value.replace(/\s/g, "").toUpperCase());
}

export function formatSiret(value: string): string {
  const d = normalizeDigits(value).slice(0, 14);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9)].filter(Boolean).join(" ");
}
