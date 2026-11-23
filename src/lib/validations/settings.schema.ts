import { z } from "zod";
import { isValidFrenchVat, isValidSiret, normalizeDigits } from "./fr-business";

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
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const toMinutes = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const DAY_LABELS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export const establishmentOpeningHourSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z.string().regex(timeRegex, "Format HH:mm attendu"),
    closeTime: z.string().regex(timeRegex, "Format HH:mm attendu"),
    isOpen: z.boolean(),
    breakStart: z.string().regex(timeRegex, "Format HH:mm attendu").nullable().optional(),
    breakEnd: z.string().regex(timeRegex, "Format HH:mm attendu").nullable().optional(),
  })
  .superRefine((oh, ctx) => {
    if (!oh.isOpen) return;
    const day = DAY_LABELS[oh.dayOfWeek];
    if (toMinutes(oh.closeTime) <= toMinutes(oh.openTime)) {
      ctx.addIssue({ code: "custom", message: `Horaires du ${day} : la fermeture doit suivre l'ouverture.` });
    }
    if (Boolean(oh.breakStart) !== Boolean(oh.breakEnd)) {
      ctx.addIssue({ code: "custom", message: `Pause du ${day} : indiquez le début et la fin.` });
    } else if (oh.breakStart && oh.breakEnd) {
      const bs = toMinutes(oh.breakStart);
      const be = toMinutes(oh.breakEnd);
      if (be <= bs || bs <= toMinutes(oh.openTime) || be >= toMinutes(oh.closeTime)) {
        ctx.addIssue({ code: "custom", message: `Pause du ${day} : elle doit être comprise dans les horaires d'ouverture.` });
      }
    }
  });

export const establishmentClosureSchema = z
  .object({
    startDate: z.string().regex(dateRegex, "Date invalide"),
    endDate: z.string().regex(dateRegex, "Date invalide"),
    label: z.string().max(80).nullable().optional(),
  })
  .refine((c) => c.endDate >= c.startDate, { message: "Fermeture : la date de fin doit suivre la date de début." });

export const updateEstablishmentSchema = z.object({
  name: z.string().trim().min(2, "Nom d'établissement requis").max(80),
  category: z.string().max(120).optional(),
  description: z.string().max(3000, "Présentation : 3000 caractères maximum").optional().nullable(),
  siret: z
    .string()
    .refine((v) => isValidSiret(v), "Numéro SIRET invalide : 14 chiffres attendus"),
  vatNumber: z
    .string()
    .refine((v) => v.trim() === "" || isValidFrenchVat(v), "Numéro de TVA invalide (format FR + 11 caractères)"),
  phone: z.string().refine((v) => normalizeDigits(v).length >= 9, "Téléphone invalide"),
  email: z.string().email("E-mail valide requis"),
  website: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/[^\s.]+\.[^\s]+$/.test(v), "Site web : adresse complète attendue (https://...)")
    .optional(),
  address: z.string().trim().min(5, "Adresse requise"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal : 5 chiffres attendus"),
  city: z.string().trim().min(2, "Ville requise"),
  cancellationDelayHours: z.number().int().min(0).max(168).default(24),
  depositPercentage: z.number().int().min(0).max(100).default(30),
  onlinePaymentMode: z.enum(["NONE", "DEPOSIT", "FULL"]),
  depositScope: z.enum(["FLAGGED_SERVICES", "ALL_SERVICES"]),
  onlineBookingEnabled: z.boolean(),
  minBookingNoticeMinutes: z.number().int().min(0).max(7 * 1440),
  maxBookingAdvanceDays: z.number().int().min(1).max(365),
  slotStepMinutes: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20), z.literal(30), z.literal(60)]),
  bufferMinutes: z.number().int().min(0).max(120),
  allowStaffChoice: z.boolean(),
  openingHours: z.array(establishmentOpeningHourSchema).length(7).optional(),
  closures: z.array(establishmentClosureSchema).max(60, "60 fermetures maximum").optional(),
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
