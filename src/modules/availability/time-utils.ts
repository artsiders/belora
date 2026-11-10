/**
 * Utilitaires de manipulation temporelle pour le moteur de disponibilités Belora.
 * Toutes les comparaisons en base sont en UTC, et les conversions horaires tiennent compte
 * du fuseau de l'établissement (par défaut Europe/Paris).
 */

/**
 * Convertit une chaîne horaire "HH:mm" (ex: "09:30") en nombre de minutes écoulées depuis minuit.
 */
export function timeStringToMinutes(timeStr: string): number {
  const parts = timeStr.trim().split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1] || "0", 10);
  return hours * 60 + minutes;
}

/**
 * Convertit un nombre de minutes écoulées depuis minuit en chaîne horaire "HH:mm" (ex: 570 -> "09:30").
 */
export function minutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hStr = hours.toString().padStart(2, "0");
  const mStr = minutes.toString().padStart(2, "0");
  return `${hStr}:${mStr}`;
}

/**
 * Vérifie si deux plages en minutes se chevauchent strictement.
 * Plage A : [startA, endA[
 * Plage B : [startB, endB[
 */
export function minutesRangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Vérifie si deux plages de dates UTC se chevauchent strictement.
 */
export function dateRangesOverlap(
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean {
  return (
    Math.max(startA.getTime(), startB.getTime()) <
    Math.min(endA.getTime(), endB.getTime())
  );
}

/**
 * Détermine le jour de la semaine (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
 * pour une date donnée au format "YYYY-MM-DD" de manière déterministe.
 */
export function getDayOfWeekFromDateString(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Mois 0-indexé dans Date UTC
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return d.getUTCDay();
}

/**
 * Construit un objet Date UTC à partir d'une date "YYYY-MM-DD" et de minutes depuis minuit.
 * Exemple: ("2026-11-15", 570) -> Date correspondant à 09:30 heure locale (convertie en UTC)
 * En heure d'hiver (Europe/Paris = UTC+1), 09:30 locale = 08:30 UTC.
 * En heure d'été (Europe/Paris = UTC+2), 09:30 locale = 07:30 UTC.
 */
export function createUtcDateFromLocal(
  dateStr: string,
  minutesSinceMidnight: number,
  timezone: string = "Europe/Paris"
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const timeStr = minutesToTimeString(minutesSinceMidnight);

  // Utilisation d'une date ISO fictive pour extraire le décalage du fuseau
  // en exploitant Intl.DateTimeFormat
  const guessUtc = new Date(Date.UTC(year, month - 1, day, Math.floor(minutesSinceMidnight / 60), minutesSinceMidnight % 60, 0));
  
  // Calcul de l'offset exact pour le fuseau cible
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(guessUtc);
  const getPart = (type: string) => parseInt(parts.find((p) => p.type === type)?.value || "0", 10);
  
  const localYear = getPart("year");
  const localMonth = getPart("month");
  const localDay = getPart("day");
  const localHour = getPart("hour");
  const localMinute = getPart("minute");

  const localTimeInUtcMs = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMinute);
  const offsetMs = localTimeInUtcMs - guessUtc.getTime();

  // On compense le décalage pour obtenir l'instant UTC correspondant exactement à l'heure locale visée
  const targetLocalMs = Date.UTC(year, month - 1, day, Math.floor(minutesSinceMidnight / 60), minutesSinceMidnight % 60);
  return new Date(targetLocalMs - offsetMs);
}

/**
 * Décompose un instant Date UTC en date locale ("YYYY-MM-DD") et heure locale ("HH:mm")
 * selon le fuseau horaire spécifié (par défaut Europe/Paris).
 */
export function formatUtcToLocalParts(
  date: Date,
  timezone: string = "Europe/Paris"
): { date: string; time: string } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => parts.find((p) => p.type === type)?.value || "00";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`,
  };
}
