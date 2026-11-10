import { z } from "zod";

export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;

export const createReviewSchema = z.object({
  bookingId: z.string().min(1, "Identifiant de réservation requis"),
  rating: z
    .number()
    .int("La note doit être un entier")
    .min(1, "La note minimale est de 1 étoile")
    .max(5, "La note maximale est de 5 étoiles"),
  comment: z
    .string()
    .min(5, "Votre avis doit comporter au moins 5 caractères")
    .max(2000, "Votre avis ne peut excéder 2000 caractères"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateCustomerProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères").optional(),
  phone: z.string().min(6, "Numéro de téléphone invalide").optional(),
});

export type UpdateCustomerProfileInput = z.infer<typeof updateCustomerProfileSchema>;
