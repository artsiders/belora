import { z } from "zod";

export const checkoutItemSchema = z.object({
  title: z.string().min(1, "Le libellé de l'article est requis"),
  type: z.enum(["service", "product"]).default("service"),
  price: z.number().nonnegative("Le prix doit être positif ou nul"),
  quantity: z.number().int().positive("La quantité doit être supérieure à 0").default(1),
  staffId: z.string().optional(),
});

export const createSaleTicketSchema = z.object({
  venueId: z.string().optional(),
  bookingId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  clientName: z.string().min(2, "Le nom du client est requis"),
  items: z.array(checkoutItemSchema).min(1, "Le panier doit contenir au moins un article"),
  depositDeducted: z.number().nonnegative().default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  paymentMethod: z.enum(["card", "cash", "mixed"]),
  cardAmount: z.number().nonnegative().optional(),
  cashAmount: z.number().nonnegative().optional(),
});

export type CreateSaleTicketInput = z.infer<typeof createSaleTicketSchema>;

export const dailyClosingSchema = z.object({
  venueId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)").optional(),
  cashCounted: z.number().nonnegative("Le montant d'espèces comptées doit être positif ou nul"),
  startingFloat: z.number().nonnegative().default(150),
});

export type DailyClosingInput = z.infer<typeof dailyClosingSchema>;
