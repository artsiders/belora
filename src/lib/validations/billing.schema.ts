import { z } from "zod";

const optionalLimit = z
  .number()
  .int("La limite doit être un nombre entier")
  .min(1, "La limite doit être au moins de 1")
  .nullable();

const rate = z
  .number()
  .min(0, "Le taux ne peut pas être négatif")
  .max(0.5, "Le taux ne peut pas dépasser 50 %");

export const planInputSchema = z.object({
  slug: z
    .string()
    .min(2, "L'identifiant doit comporter au moins 2 caractères")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "L'identifiant ne peut contenir que des minuscules, chiffres et tirets"),
  name: z.string().min(2, "Le nom du forfait est requis").max(60),
  description: z.string().max(240).nullable().optional(),
  monthlyPriceCents: z.number().int().min(0, "Le prix ne peut pas être négatif"),
  annualPriceCents: z.number().int().min(0, "Le prix ne peut pas être négatif"),
  trialDays: z.number().int().min(0).max(90).nullable(),
  maxStaff: optionalLimit,
  maxResources: optionalLimit,
  maxVenues: optionalLimit,
  commissionRate: rate.nullable(),
  includesSmsReminders: z.boolean(),
  includesAnalytics: z.boolean(),
  includesPriorityListing: z.boolean(),
  features: z.array(z.string().min(1).max(120)).max(12, "12 arguments maximum"),
  isHighlighted: z.boolean(),
  highlightLabel: z.string().max(40).nullable().optional(),
  isContactSales: z.boolean(),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  order: z.number().int().min(0),
});

export type PlanInput = z.infer<typeof planInputSchema>;

export const platformBillingSettingsSchema = z
  .object({
    defaultCommissionRate: rate,
    commissionMode: z.enum(["DISABLED", "NEW_CLIENTS_ONLY", "ALL_MARKETPLACE"]),
    commissionBase: z.enum(["ONLINE_PAYMENT", "BOOKING_TOTAL"]),
    commissionMinCents: z.number().int().min(0),
    commissionMaxCents: z.number().int().min(0).nullable(),
    paymentFeePercent: z.number().min(0).max(0.1, "Les frais ne peuvent pas dépasser 10 %"),
    paymentFeeFixedCents: z.number().int().min(0).max(500),
    defaultTrialDays: z.number().int().min(0).max(90),
    defaultPlanId: z.string().nullable(),
    salesContactEmail: z.string().email("Adresse e-mail invalide").nullable().or(z.literal("").transform(() => null)),
    maintenanceMode: z.boolean(),
  })
  .refine((v) => v.commissionMaxCents === null || v.commissionMaxCents >= v.commissionMinCents, {
    message: "Le plafond doit être supérieur ou égal au minimum",
    path: ["commissionMaxCents"],
  });

export type PlatformBillingSettingsInput = z.infer<typeof platformBillingSettingsSchema>;

export const adminVenueSubscriptionSchema = z.object({
  planId: z.string().min(1, "Veuillez choisir un forfait"),
  status: z.enum(["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED"]),
  interval: z.enum(["MONTHLY", "ANNUAL"]),
  trialEndsAt: z.string().datetime().nullable(),
  isComplimentary: z.boolean(),
});

export type AdminVenueSubscriptionInput = z.infer<typeof adminVenueSubscriptionSchema>;

export const subscriptionCheckoutSchema = z.object({
  planId: z.string().min(1, "Veuillez choisir un forfait"),
  interval: z.enum(["MONTHLY", "ANNUAL"]),
});

export type SubscriptionCheckoutInput = z.infer<typeof subscriptionCheckoutSchema>;
