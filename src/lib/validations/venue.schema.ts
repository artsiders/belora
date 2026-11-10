import { z } from "zod";

/**
 * Schéma de validation pour les paramètres généraux de l'établissement (Salon Pro).
 */
export const updateVenueProfileSchema = z.object({
  name: z.string().min(2, "Le nom de l'établissement doit comporter au moins 2 caractères"),
  tagline: z.string().max(200, "Le sous-titre ne peut pas dépasser 200 caractères").optional(),
  description: z.string().max(3000, "La description ne peut pas dépasser 3000 caractères").optional(),
  address: z.string().min(5, "L'adresse est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  countryCode: z.string().length(2, "Code pays ISO à 2 lettres requis (ex: FR)").default("FR"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Adresse e-mail invalide").optional().nullable(),
  timezone: z.string().default("Europe/Paris"),
});

export type UpdateVenueProfileInput = z.infer<typeof updateVenueProfileSchema>;

const timeFormatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Schéma de validation pour une journée d'horaires d'ouverture.
 */
export const openingHourDaySchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6), // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    openTime: z.string().regex(timeFormatRegex, "Format HH:mm attendu (ex: 09:30)"),
    closeTime: z.string().regex(timeFormatRegex, "Format HH:mm attendu (ex: 19:30)"),
    isOpen: z.boolean(),
  })
  .refine(
    (data) => !data.isOpen || data.openTime < data.closeTime,
    {
      message: "L'heure d'ouverture doit précéder l'heure de fermeture",
      path: ["closeTime"],
    }
  );

export const updateVenueOpeningHoursSchema = z.object({
  hours: z.array(openingHourDaySchema).length(7, "Les 7 jours de la semaine doivent être définis"),
});

export type UpdateVenueOpeningHoursInput = z.infer<typeof updateVenueOpeningHoursSchema>;
