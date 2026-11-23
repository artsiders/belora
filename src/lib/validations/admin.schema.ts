import { z } from "zod";

export const venueStatusEnum = z.enum([
  "DRAFT",
  "PENDING_VALIDATION",
  "PUBLISHED",
  "SUSPENDED",
]);

export const updateVenueStatusSchema = z.object({
  status: venueStatusEnum.optional(),
  commissionRate: z
    .number()
    .min(0, "Le taux de commission ne peut pas être négatif")
    .max(0.5, "Le taux de commission maximal est de 50%")
    .nullable()
    .optional(),
  commissionRateUntil: z.string().datetime().nullable().optional(),
});

export type UpdateVenueStatusInput = z.infer<typeof updateVenueStatusSchema>;

export const createAssistedVenueSchema = z.object({
  name: z.string().min(2, "Le nom du salon doit comporter au moins 2 caractères"),
  proEmail: z.string().email("Adresse e-mail professionnelle invalide"),
  proFirstName: z.string().min(2, "Le prénom du responsable est requis"),
  proLastName: z.string().min(2, "Le nom du responsable est requis"),
  proPhone: z.string().min(6, "Numéro de téléphone requis"),
  address: z.string().min(5, "L'adresse postale est requise"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  commissionRate: z.number().min(0).max(0.5).nullable().optional(),
});

export type CreateAssistedVenueInput = z.infer<typeof createAssistedVenueSchema>;

export const roleEnum = z.enum(["CUSTOMER", "PRO", "ADMIN"]);

export const updateUserSchema = z.object({
  role: roleEnum.optional(),
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères").optional(),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères").optional(),
  phone: z.string().optional().nullable(),
  emailVerified: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const bookingStatusEnum = z.enum([
  "PENDING_PAYMENT",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const updateBookingStatusSchema = z.object({
  status: bookingStatusEnum,
  cancellationReason: z.string().optional().nullable(),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;

export const updatePlatformSettingsSchema = z.object({
  defaultCommissionRate: z
    .number()
    .min(0, "Le taux minimal est 0%")
    .max(0.5, "Le taux maximal est 50%")
    .optional(),
  maintenanceMode: z.boolean().optional(),
});

export type UpdatePlatformSettingsInput = z.infer<typeof updatePlatformSettingsSchema>;
