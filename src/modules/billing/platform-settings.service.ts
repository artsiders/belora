import { db } from "@/lib/db";
import type { PlatformSetting } from "@prisma/client";
import type { PlatformBillingSettingsInput } from "@/lib/validations/billing.schema";
import type { CommissionPolicy } from "./commission";

/** Paramètres plateforme (ligne unique, créée à la première lecture). */
export async function getPlatformSettings(): Promise<PlatformSetting> {
  const existing = await db.platformSetting.findFirst({ orderBy: { updatedAt: "asc" } });
  if (existing) return existing;
  return db.platformSetting.create({ data: {} });
}

export function toCommissionPolicy(setting: PlatformSetting): CommissionPolicy {
  return {
    mode: setting.commissionMode,
    base: setting.commissionBase,
    minCents: setting.commissionMinCents,
    maxCents: setting.commissionMaxCents,
    paymentFeePercent: setting.paymentFeePercent,
    paymentFeeFixedCents: setting.paymentFeeFixedCents,
  };
}

export async function updatePlatformSettings(input: PlatformBillingSettingsInput): Promise<PlatformSetting> {
  if (input.defaultPlanId) {
    const plan = await db.subscriptionPlan.findUnique({ where: { id: input.defaultPlanId } });
    if (!plan) throw new Error("Le forfait par défaut sélectionné est introuvable.");
    if (plan.isContactSales) throw new Error("Le forfait par défaut doit être accessible en inscription directe.");
  }
  const current = await getPlatformSettings();
  return db.platformSetting.update({ where: { id: current.id }, data: input });
}

/** Résumé public des règles de commission, utilisé par la page tarifs. */
export interface PublicCommissionSummary {
  mode: PlatformSetting["commissionMode"];
  base: PlatformSetting["commissionBase"];
  defaultRate: number;
  minCents: number;
  maxCents: number | null;
  paymentFeePercent: number;
  paymentFeeFixedCents: number;
  defaultTrialDays: number;
  salesContactEmail: string | null;
}

export function toPublicCommissionSummary(setting: PlatformSetting): PublicCommissionSummary {
  return {
    mode: setting.commissionMode,
    base: setting.commissionBase,
    defaultRate: setting.defaultCommissionRate,
    minCents: setting.commissionMinCents,
    maxCents: setting.commissionMaxCents,
    paymentFeePercent: setting.paymentFeePercent,
    paymentFeeFixedCents: setting.paymentFeeFixedCents,
    defaultTrialDays: setting.defaultTrialDays,
    salesContactEmail: setting.salesContactEmail,
  };
}
