import { z } from "zod";

/**
 * Schéma de validation pour une fiche client CRM salon.
 */
export const clientCrmSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit comporter au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  phone: z.string().min(8, "Veuillez renseigner un numéro de téléphone valide"),
  email: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .optional()
    .or(z.literal("")),
  isVip: z.boolean().default(false),
  notes: z.string().max(2000, "Les notes ne peuvent pas excéder 2000 caractères").optional(),
  techFormulas: z
    .object({
      hairType: z.string().optional(),
      naturalBase: z.string().optional(),
      sensitivities: z.string().optional(),
      lastFormulas: z
        .array(
          z.object({
            date: z.string(),
            service: z.string(),
            formula: z.string(),
            leaveInTime: z.string().optional(),
            colorist: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

export type ClientCrmInput = z.infer<typeof clientCrmSchema>;

export const updateClientCrmSchema = clientCrmSchema.partial();

export type UpdateClientCrmInput = z.infer<typeof updateClientCrmSchema>;
