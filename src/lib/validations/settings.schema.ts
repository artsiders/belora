import { z } from "zod";

/**
 * Schéma pour l'édition des tarifs en masse.
 */
export const massPriceAdjustmentSchema = z.object({
  categoryId: z.string().min(1, "Catégorie cible requise (ou 'all')"),
  deltaPercent: z.number().default(0),
  deltaFixed: z.number().default(0),
});

export type MassPriceAdjustmentInput = z.infer<typeof massPriceAdjustmentSchema>;

/**
 * Schéma pour la duplication d'une prestation.
 */
export const duplicateServiceSchema = z.object({
  serviceId: z.string().min(1, "Identifiant de la prestation requis"),
});

export type DuplicateServiceInput = z.infer<typeof duplicateServiceSchema>;

/**
 * Schéma pour la création d'une catégorie de prestation.
 */
export const createServiceCategorySchema = z.object({
  name: z.string().min(2, "Le nom de la catégorie doit comporter au moins 2 caractères"),
});

export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;

/**
 * Schéma pour les paramètres d'établissement.
 */
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const establishmentOpeningHourSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(timeRegex, "Format HH:mm attendu"),
  closeTime: z.string().regex(timeRegex, "Format HH:mm attendu"),
  isOpen: z.boolean(),
});

export const updateEstablishmentSchema = z.object({
  name: z.string().min(2, "Nom d'établissement requis"),
  category: z.string().optional(),
  description: z.string().max(3000).optional().nullable(),
  siret: z.string().min(9, "Numéro SIRET requis"),
  vatNumber: z.string().min(6, "Numéro de TVA requis"),
  phone: z.string().min(6, "Téléphone requis"),
  email: z.string().email("E-mail valide requis"),
  address: z.string().min(5, "Adresse requise"),
  postalCode: z.string().min(4, "Code postal requis"),
  city: z.string().min(2, "Ville requise"),
  cancellationDelayHours: z.number().int().min(0).max(168).default(24),
  depositPercentage: z.number().int().min(0).max(100).default(30),
  openingHours: z.array(establishmentOpeningHourSchema).length(7).optional(),
});

export type UpdateEstablishmentInput = z.infer<typeof updateEstablishmentSchema>;

/**
 * Schéma pour le planning d'un collaborateur.
 */
export const staffScheduleItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  plannedStart: z.string().regex(timeRegex),
  plannedEnd: z.string().regex(timeRegex),
  isActive: z.boolean(),
});

export const updateStaffScheduleSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  color: z.string().optional(),
  schedules: z.array(staffScheduleItemSchema).optional(),
});

export type UpdateStaffScheduleInput = z.infer<typeof updateStaffScheduleSchema>;

export const createStaffMemberSchema = z.object({
  name: z.string().min(2, "Le nom du collaborateur doit comporter au moins 2 caractères"),
  role: z.string().min(2, "Le rôle / titre est requis"),
  color: z.string().default("#82385a"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type CreateStaffMemberInput = z.infer<typeof createStaffMemberSchema>;

/**
 * Schéma pour les paramètres de caisse.
 */
export const cashRegisterSettingsSchema = z.object({
  acceptCard: z.boolean().default(true),
  acceptCash: z.boolean().default(true),
  acceptCheck: z.boolean().default(false),
  ticketFooter: z.string().max(500).default("Merci de votre visite et de votre confiance. Prenez soin de vous !"),
});

export type CashRegisterSettingsInput = z.infer<typeof cashRegisterSettingsSchema>;

/**
 * Schéma pour les paramètres de notifications & SMS.
 */
export const notificationSettingsSchema = z.object({
  emailConfirmEnabled: z.boolean().default(true),
  sms24hEnabled: z.boolean().default(true),
  sms2hEnabled: z.boolean().default(false),
  smsTemplate: z.string().min(10, "Le modèle SMS doit comporter au moins 10 caractères"),
});

export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;
