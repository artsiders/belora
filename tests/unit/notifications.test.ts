import { describe, it, expect } from "vitest";
import {
  renderBookingConfirmationEmail,
  renderProNewBookingEmail,
  renderBookingReminderEmail,
  renderBookingCancellationEmail,
  renderReceiptEmail,
} from "@/emails/templates";
import { normalizePhoneNumber, sendBookingReminderSms } from "@/lib/sms";

describe("Sprint 6 — Templates E-mails & Notifications SMS", () => {
  const sampleData = {
    reference: "#BEL-12345",
    venueName: "L’Atelier Botanique",
    venueAddress: "18 Rue de Turenne",
    venueCity: "Paris",
    venuePhone: "01 42 68 90 12",
    staffName: "Hélène de Valois",
    clientName: "Claire Dumont",
    clientEmail: "claire@example.com",
    clientPhone: "06 12 34 56 78",
    dateFormatted: "Mardi 24 novembre 2026",
    timeFormatted: "14h00",
    services: [
      { name: "Soin Végétal Profond", durationMinutes: 60, priceEuros: 85 },
      { name: "Coupe Signature", durationMinutes: 30, priceEuros: 45 },
    ],
    totalPriceEuros: 130,
    depositPaidEuros: 39,
    remainingToPayEuros: 91,
  };

  it("renderBookingConfirmationEmail creates luxury email without emojis", () => {
    const { subject, html } = renderBookingConfirmationEmail(sampleData);

    expect(subject).toContain("Confirmation de votre rendez-vous chez L’Atelier Botanique");
    expect(subject).toContain("#BEL-12345");
    expect(html).toContain("Claire Dumont");
    expect(html).toContain("18 Rue de Turenne");
    expect(html).toContain("Hélène de Valois");
    expect(html).toContain("Soin Végétal Profond");
    expect(html).toContain("130 &euro;");
    expect(html).toContain("39 &euro;");
    expect(html).toContain("91 &euro;");

    // Règle 5 AGENTS.md : Aucun emoji
    expect(html).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });

  it("renderProNewBookingEmail generates pro alert with all client details", () => {
    const { subject, html } = renderProNewBookingEmail(sampleData);

    expect(subject).toContain("Nouveau rendez-vous : Claire Dumont");
    expect(html).toContain("ESPACE PRO BELORA");
    expect(html).toContain("06 12 34 56 78");
    expect(html).toContain("claire@example.com");
    expect(html).toContain("91 &euro;");
    expect(html).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });

  it("renderBookingReminderEmail generates appointment reminder", () => {
    const { subject, html } = renderBookingReminderEmail(sampleData);

    expect(subject).toContain("Rappel : Votre rendez-vous demain chez L’Atelier Botanique");
    expect(html).toContain("votre soin est pr&eacute;vu demain");
    expect(html).toContain("18 Rue de Turenne");
  });

  it("renderBookingCancellationEmail creates cancellation receipt", () => {
    const { subject, html } = renderBookingCancellationEmail(
      "Claire Dumont",
      "L’Atelier Botanique",
      "#BEL-12345",
      "Imprévu professionnel"
    );

    expect(subject).toContain("Annulation");
    expect(html).toContain("Votre rendez-vous a &eacute;t&eacute; annul&eacute;");
    expect(html).toContain("Imprévu professionnel");
  });

  it("renderReceiptEmail generates valid POS receipt", () => {
    const { subject, html } = renderReceiptEmail({
      clientName: "Claire Dumont",
      venueName: "L’Atelier Botanique",
      venueAddress: "18 Rue de Turenne",
      venueCity: "Paris",
      ticketNumber: "T-2026-0001",
      date: "24 novembre 2026",
      lines: [
        { description: "Soin Végétal", quantity: 1, priceEuros: 85 },
      ],
      totalTtcEuros: 85,
      vatAmountEuros: 14,
      paymentMethodText: "Carte Bancaire",
    });

    expect(subject).toContain("T-2026-0001");
    expect(html).toContain("Ticket n&deg; T-2026-0001");
    expect(html).toContain("Total TTC :");
    expect(html).toContain("85 &euro;");
  });

  it("normalizePhoneNumber handles French numbers cleanly", () => {
    expect(normalizePhoneNumber("06 12 34 56 78")).toBe("+33612345678");
    expect(normalizePhoneNumber("0712345678")).toBe("+33712345678");
    expect(normalizePhoneNumber("+33612345678")).toBe("+33612345678");
    expect(normalizePhoneNumber("33612345678")).toBe("+33612345678");
  });

  it("sendBookingReminderSms formats concise and sober SMS", async () => {
    const res = await sendBookingReminderSms({
      recipientPhone: "06 12 34 56 78",
      venueName: "L'Atelier Botanique",
      staffName: "Hélène",
      dateText: "demain",
      timeText: "14h00",
      address: "18 rue de Turenne Paris",
    });

    expect(res.success).toBe(true);
    expect(res.content).toBe(
      "Rappel Belora : Votre rdv chez L'Atelier Botanique est demain à 14h00 avec Hélène. Adresse : 18 rue de Turenne Paris."
    );
    expect(res.recipient).toBe("+33612345678");
    expect(res.content).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });
});
