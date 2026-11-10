import { z } from "zod";

/**
 * Schéma de validation pour la création / édition d'une prestation au catalogue salon.
 * Prix et acompte strictement en centimes d'euro.
 */
const serviceObjectSchema = z.object({
  name: z.string().min(2, "Le nom de la prestation doit comporter au moins 2 caractères"),
  categoryId: z.string().min(1, "Veuillez sélectionner une catégorie"),
  description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
  durationMinutes: z
    .number()
    .int("La durée doit être un entier")
    .min(5, "La durée minimale est de 5 minutes")
    .max(480, "La durée maximale est de 8 heures (480 min)"),
  processingTimeMinutes: z
    .number()
    .int("Le temps de pose doit être un entier")
    .min(0, "Le temps de pose ne peut pas être négatif")
    .max(240, "Le temps de pose maximal est de 4 heures")
    .default(0),
  priceCents: z
    .number()
    .int("Le tarif doit être exprimé en centimes entiers")
    .min(100, "Le tarif minimal est de 1,00 € (100 centimes)"),
  depositRequired: z.boolean().default(true),
  depositCents: z
    .number()
    .int("L'acompte doit être exprimé en centimes entiers")
    .min(0, "L'acompte ne peut pas être négatif")
    .default(0),
  order: z.number().int().default(0),
});

export const createServiceSchema = serviceObjectSchema.refine(
  (data) => !data.depositRequired || data.depositCents <= data.priceCents,
  {
    message: "Le montant de l'acompte ne peut pas excéder le tarif total de la prestation",
    path: ["depositCents"],
  }
);

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = serviceObjectSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
