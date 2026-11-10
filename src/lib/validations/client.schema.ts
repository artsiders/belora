import { z } from "zod";

export const formulaSchema = z.object({
  date: z.string(),
  service: z.string(),
  formula: z.string().min(1, "La formule est requise"),
  leaveInTime: z.string(),
  colorist: z.string().optional(),
});

export const techSheetSchema = z.object({
  hairType: z.string().optional(),
  naturalBase: z.string().optional(),
  sensitivities: z.string().optional(),
  lastFormulas: z.array(formulaSchema).optional(),
});

export const createClientSchema = z.object({
  venueId: z.string().optional(),
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  phone: z.string().min(8, "Numéro de téléphone requis"),
  email: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  isVip: z.boolean().default(false),
  notes: z.string().max(1000).optional(),
  techSheet: techSheetSchema.optional(),
});

export const clientCrmSchema = createClientSchema;
export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = z.object({
  venueId: z.string().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional().or(z.literal("")),
  isVip: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  techSheet: techSheetSchema.optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
