import { describe, it, expect } from "vitest";
import {
  formatCentsToEuros,
  eurosToCents,
  calculateVat,
  calculateDeposit,
  calculatePlatformCommission,
} from "../../src/lib/utils/money";

describe("Money Utilities (Minor Units / Centimes)", () => {
  it("formats cents into localized french euros", () => {
    expect(formatCentsToEuros(5000)).toMatch(/50,00\s?€/);
    expect(formatCentsToEuros(9550)).toMatch(/95,50\s?€/);
    expect(formatCentsToEuros(0)).toMatch(/0,00\s?€/);
    expect(formatCentsToEuros(5000, false)).toMatch(/50\s?€/);
    expect(formatCentsToEuros(5050, false)).toMatch(/50,50\s?€/);
  });

  it("converts euros to integer cents correctly without precision loss", () => {
    expect(eurosToCents(50)).toBe(5000);
    expect(eurosToCents(95.5)).toBe(9550);
    expect(eurosToCents(14.99)).toBe(1499);
    expect(eurosToCents(0.01)).toBe(1);
    expect(eurosToCents(0)).toBe(0);
  });

  it("calculates exact French VAT 20% breakdown such that HT + TVA equals TTC", () => {
    // Cas 95.00 € TTC (9500 cents)
    const { subtotalHtCents, vatAmountCents } = calculateVat(9500, 0.2);
    expect(subtotalHtCents + vatAmountCents).toBe(9500);
    expect(subtotalHtCents).toBe(7917);
    expect(vatAmountCents).toBe(1583);

    // Cas 50.00 € TTC (5000 cents)
    const res50 = calculateVat(5000, 0.2);
    expect(res50.subtotalHtCents + res50.vatAmountCents).toBe(5000);
    expect(res50.subtotalHtCents).toBe(4167);
    expect(res50.vatAmountCents).toBe(833);

    // Cas 0 €
    const res0 = calculateVat(0);
    expect(res0.subtotalHtCents).toBe(0);
    expect(res0.vatAmountCents).toBe(0);
  });

  it("calculates deposit percentage (ex: 30%) rounded to the nearest cent", () => {
    // 50.00 € -> 30% = 15.00 € (1500 cents)
    expect(calculateDeposit(5000, 30)).toBe(1500);
    // 95.00 € -> 30% = 28.50 € (2850 cents)
    expect(calculateDeposit(9500, 30)).toBe(2850);
    // 140.00 € -> 30% = 42.00 € (4200 cents)
    expect(calculateDeposit(14000, 30)).toBe(4200);
    // 0 €
    expect(calculateDeposit(0, 30)).toBe(0);
  });

  it("calculates Belora platform commission (1.8%) correctly", () => {
    // Sur 100.00 € (10000 cents), commission 1.8% = 1.80 € (180 cents)
    expect(calculatePlatformCommission(10000, 0.018)).toBe(180);
    // Sur 50.00 € (5000 cents), commission 1.8% = 0.90 € (90 cents)
    expect(calculatePlatformCommission(5000, 0.018)).toBe(90);
    // Sur 95.00 € (9500 cents), commission 1.8% = 1.71 € (171 cents)
    expect(calculatePlatformCommission(9500, 0.018)).toBe(171);
  });
});
