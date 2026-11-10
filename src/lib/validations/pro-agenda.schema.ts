import { z } from "zod";

/**
 * Schémas de validation Zod pour le module Agenda Pro.
 */

export const createProAppointmentSchema = z.object({
  venueId: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().min(2, "Le nom du client est requis (au moins 2 caractères)"),
  clientPhone: z.string().min(8, "Numéro de téléphone requis"),
  clientEmail: z.string().email("Adresse email invalide").optional().or(z.literal("")),
  serviceId: z.string().min(1, "Prestation requise"),
  staffId: z.string().min(1, "Collaborateur requis"),
  resourceId: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure de début invalide (HH:mm)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure de fin invalide (HH:mm)").optional(),
  notes: z.string().max(500, "Notes trop longues (max 500 caractères)").optional(),
  price: z.number().nonnegative().optional(),
  depositPaid: z.number().nonnegative().optional(),
});

export type CreateProAppointmentInput = z.infer<typeof createProAppointmentSchema>;

export const updateProAppointmentSchema = z.object({
  venueId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  staffId: z.string().optional(),
  resourceId: z.string().optional().nullable(),
  status: z
    .enum([
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
      "no_show",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ])
    .optional(),
  notes: z.string().max(500).optional(),
  cancellationReason: z.string().max(300).optional(),
});

export type UpdateProAppointmentInput = z.infer<typeof updateProAppointmentSchema>;

export const clockInStaffSchema = z.object({
  venueId: z.string().optional(),
  staffId: z.string().min(1, "Identifiant collaborateur requis"),
  action: z.enum(["clock-in", "clock-out", "toggle"]).optional().default("toggle"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type ClockInStaffInput = z.infer<typeof clockInStaffSchema>;

export const updateStaffPresenceSchema = z.object({
  venueId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  updates: z
    .array(
      z.object({
        staffId: z.string().min(1, "Identifiant collaborateur requis"),
        plannedStart: z.string().regex(/^\d{2}:\d{2}$/, "Heure de début invalide (HH:mm)"),
        plannedEnd: z.string().regex(/^\d{2}:\d{2}$/, "Heure de fin invalide (HH:mm)"),
      })
    )
    .min(1, "Au moins une mise à jour d'horaire est requise"),
});

export type UpdateStaffPresenceInput = z.infer<typeof updateStaffPresenceSchema>;
