/** Affichage public d'une journée d'ouverture, pause comprise : « 09:00 - 12:30, 14:00 - 19:00 ». */
export function formatOpeningHours(oh: {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
}): string {
  if (!oh.isOpen) return "Fermé";
  if (oh.breakStart && oh.breakEnd) {
    return `${oh.openTime} - ${oh.breakStart}, ${oh.breakEnd} - ${oh.closeTime}`;
  }
  return `${oh.openTime} - ${oh.closeTime}`;
}
