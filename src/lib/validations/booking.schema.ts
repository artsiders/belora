import { z } from "zod";

/**
 * Schéma de validation pour la création d'un rendez-vous (tunnel de réservation marketplace ou agenda pro).
 */
export const createBookingSchema = z.object({
  venueId: z.string().min(1, "L'identifiant de l'établissement est requis"),
  serviceIds: z
    .array(z.string().min(1))
    .min(1, "Veuillez sélectionner au moins une prestation"),
  staffId: z.string().optional().nullable(), // Optionnel ("any" ou collaborateur précis)
  startTime: z
    .string()
    .datetime({ message: "La date et l'heure du créneau doivent être au format ISO 8601 UTC valide" }),
  clientName: z
    .string()
    .min(2, "Le nom du client doit comporter au moins 2 caractères"),
  clientPhone: z
    .string()
    .min(8, "Veuillez saisir un numéro de téléphone valide"),
  clientEmail: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .optional()
    .or(z.literal("")),
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/**
 * Schéma de validation pour l'annulation d'un rendez-vous.
 */
export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "L'identifiant du rendez-vous est requis"),
  reason: z.string().max(300, "Le motif ne peut pas dépasser 300 caractères").optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
