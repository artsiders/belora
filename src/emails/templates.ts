/**
 * Gabarits HTML des e-mails transactionnels Belora.
 * Conforme aux règles d'AGENTS.md :
 * - Aucune utilisation d'émojis (Règle 5).
 * - Palette sobre et luxueuse (Figue signature #82385a, Marine #0f2238, Fond Lin #fcfaf7).
 * - Typographie propre et lisible sur tous les clients mails (Apple Mail, Gmail, Outlook).
 */

export interface BookingEmailData {
  reference: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePhone?: string | null;
  staffName?: string | null;
  clientName: string;
  clientEmail?: string | null;
  clientPhone: string;
  dateFormatted: string; // Ex: "Mardi 24 novembre 2026"
  timeFormatted: string; // Ex: "14h00"
  services: { name: string; durationMinutes: number; priceEuros: number }[];
  totalPriceEuros: number;
  depositPaidEuros: number;
  remainingToPayEuros: number;
}

export function renderBookingConfirmationEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `Confirmation de votre rendez-vous chez ${data.venueName} (${data.reference})`;

  const servicesHtml = data.services
    .map(
      (s) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 14px; color: #1e293b;">
          <strong>${s.name}</strong> <span style="color: #64748b;">(${s.durationMinutes} min)</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0eae1; font-size: 14px; font-weight: 600; text-align: right; color: #0f172a;">
          ${s.priceEuros} &euro;
        </td>
      </tr>`
    )
    .join("");

  const totalHtml = `
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Total des prestations :</td>
        <td style="padding: 6px 0; font-size: 13px; font-weight: 600; text-align: right; color: #0f172a;">${data.totalPriceEuros} &euro;</td>
      </tr>`;

  const depositHtml =
    data.depositPaidEuros > 0
      ? `
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #64748b;">Acompte r&eacute;gl&eacute; en ligne :</td>
        <td style="padding: 6px 0; font-size: 13px; font-weight: 600; text-align: right; color: #0f172a;">${data.depositPaidEuros} &euro;</td>
      </tr>`
      : "";

  const remainingHtml = `
      <tr>
        <td style="padding: 8px 0; font-size: 15px; font-weight: 700; color: #0f172a;">Total &agrave; r&eacute;gler au salon :</td>
        <td style="padding: 8px 0; font-size: 15px; font-weight: 700; text-align: right; color: #82385a;">${data.remainingToPayEuros} &euro;</td>
      </tr>`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f5f2; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7dfd5; overflow: hidden;">
          <!-- En-tête Belora -->
          <tr>
            <td style="padding: 28px 32px; background-color: #0f172a; text-align: center;">
              <span style="font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #ffffff; text-transform: uppercase;">BELORA</span>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #82385a;">
                R&Eacute;SERVATION SANCTUARIS&Eacute;E
              </p>
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                Bonjour ${data.clientName}, votre rendez-vous est confirm&eacute;
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.6;">
                La maison <strong>${data.venueName}</strong> aura le plaisir de vous accueillir le <strong>${data.dateFormatted}</strong> &agrave; <strong>${data.timeFormatted}</strong>.
              </p>

              <!-- Carte récapitulative -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; border: 1px solid #ede5da; border-radius: 12px; margin-bottom: 24px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #0f172a;">${data.venueName}</p>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">${data.venueAddress}, ${data.venueCity}</p>
                    ${data.staffName ? `<p style="margin: 0 0 12px 0; font-size: 14px; color: #82385a; font-weight: 600;">Artisan d&eacute;di&eacute; : ${data.staffName}</p>` : ""}
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; font-family: monospace;">R&eacute;f&eacute;rence : ${data.reference}</p>
                  </td>
                </tr>
              </table>

              <!-- Détail des prestations -->
              <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #0f172a;">D&eacute;tail des soins</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                ${servicesHtml}
              </table>

              <!-- Bilan financier -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                ${totalHtml}
                ${depositHtml}
                ${remainingHtml}
              </table>

              <!-- Politique d'annulation -->
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Annulation ou modification sans frais possible jusqu'&agrave; 24 heures avant l'horaire pr&eacute;vu depuis votre espace personnel.
              </p>
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="padding: 20px 32px; background-color: #faf8f5; border-top: 1px solid #ede5da; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Belora &mdash; La plateforme des artisans de beaut&eacute; & de bien-&ecirc;tre d'exception.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

export function renderProNewBookingEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `Nouveau rendez-vous : ${data.clientName} le ${data.dateFormatted} (${data.reference})`;

  const servicesText = data.services.map((s) => `${s.name} (${s.durationMinutes} min)`).join(", ");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>${subject}</title></head>
<body style="margin: 0; padding: 24px; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; padding: 28px;">
    <span style="font-size: 12px; font-weight: 700; color: #82385a; text-transform: uppercase; letter-spacing: 1px;">ESPACE PRO BELORA</span>
    <h1 style="margin: 8px 0 16px 0; font-size: 20px; color: #0f172a;">Nouvelle r&eacute;servation re&ccedil;ue</h1>
    <p style="font-size: 14px; color: #475569; line-height: 1.6;">
      Un nouveau rendez-vous a &eacute;t&eacute; programm&eacute; pour votre &eacute;tablissement <strong>${data.venueName}</strong>.
    </p>

    <div style="background: #faf8f5; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <p style="margin: 0 0 8px 0;"><strong>Client :</strong> ${data.clientName}</p>
      <p style="margin: 0 0 8px 0;"><strong>T&eacute;l&eacute;phone :</strong> ${data.clientPhone}</p>
      ${data.clientEmail ? `<p style="margin: 0 0 8px 0;"><strong>E-mail :</strong> ${data.clientEmail}</p>` : ""}
      <p style="margin: 0 0 8px 0;"><strong>Date & Heure :</strong> ${data.dateFormatted} &agrave; ${data.timeFormatted}</p>
      ${data.staffName ? `<p style="margin: 0 0 8px 0;"><strong>Collaborateur :</strong> ${data.staffName}</p>` : ""}
      <p style="margin: 0 0 8px 0;"><strong>Soins :</strong> ${servicesText}</p>
      <p style="margin: 0;"><strong>Montant &agrave; encaisser au salon :</strong> ${data.remainingToPayEuros} &euro;</p>
    </div>

    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
      Ce rendez-vous est d&eacute;j&agrave; synchronis&eacute; dans votre Agenda Pro Belora.
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

export function renderBookingReminderEmail(data: BookingEmailData): { subject: string; html: string } {
  const subject = `Rappel : Votre rendez-vous demain chez ${data.venueName} à ${data.timeFormatted}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>${subject}</title></head>
<body style="margin: 0; padding: 24px; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; padding: 28px;">
    <span style="font-size: 12px; font-weight: 700; color: #82385a; text-transform: uppercase; letter-spacing: 1px;">RAPPEL DE RENDEZ-VOUS</span>
    <h1 style="margin: 8px 0 16px 0; font-size: 22px; color: #0f172a;">Bonjour ${data.clientName}, votre soin est pr&eacute;vu demain</h1>
    <p style="font-size: 14px; color: #475569; line-height: 1.6;">
      Nous vous rappelons votre rendez-vous chez <strong>${data.venueName}</strong> demain &agrave; <strong>${data.timeFormatted}</strong>.
    </p>

    <div style="background: #faf8f5; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #0f172a;">${data.venueName}</p>
      <p style="margin: 0 0 8px 0; color: #64748b;">${data.venueAddress}, ${data.venueCity}</p>
      ${data.venuePhone ? `<p style="margin: 0; color: #64748b;">T&eacute;l&eacute;phone salon : ${data.venuePhone}</p>` : ""}
    </div>

    <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
      En cas d'impr&eacute;vu, merci de pr&eacute;venir le salon au plus t&ocirc;t.
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

export function renderBookingCancellationEmail(
  clientName: string,
  venueName: string,
  reference: string,
  reason?: string
): { subject: string; html: string } {
  const subject = `Annulation de votre rendez-vous chez ${venueName} (${reference})`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>${subject}</title></head>
<body style="margin: 0; padding: 24px; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; padding: 28px;">
    <span style="font-size: 12px; font-weight: 700; color: #dc2626; text-transform: uppercase; letter-spacing: 1px;">CONFIRMATION D'ANNULATION</span>
    <h1 style="margin: 8px 0 16px 0; font-size: 20px; color: #0f172a;">Votre rendez-vous a &eacute;t&eacute; annul&eacute;</h1>
    <p style="font-size: 14px; color: #475569; line-height: 1.6;">
      Bonjour ${clientName}, votre rendez-vous r&eacute;f&eacute;renc&eacute; <strong>${reference}</strong> chez <strong>${venueName}</strong> est bien annul&eacute;.
    </p>
    ${reason ? `<p style="font-size: 13px; color: #64748b; background: #faf8f5; padding: 12px; border-radius: 8px;">Motif : ${reason}</p>` : ""}
    <p style="font-size: 13px; color: #64748b;">
      Si un acompte avait &eacute;t&eacute; pr&eacute;lev&eacute;, le remboursement est engag&eacute; conform&eacute;ment aux conditions d'annulation.
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}

export function renderReceiptEmail(data: {
  clientName: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  ticketNumber: string;
  date: string;
  lines: { description: string; quantity: number; priceEuros: number }[];
  totalTtcEuros: number;
  vatAmountEuros: number;
  paymentMethodText: string;
}): { subject: string; html: string } {
  const subject = `Votre ticket de caisse chez ${data.venueName} (${data.ticketNumber})`;

  const linesHtml = data.lines
    .map(
      (l) => `
      <tr>
        <td style="padding: 6px 0; font-size: 13px; color: #1e293b;">${l.quantity}x ${l.description}</td>
        <td style="padding: 6px 0; font-size: 13px; font-weight: 600; text-align: right; color: #0f172a;">${l.priceEuros} &euro;</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>${subject}</title></head>
<body style="margin: 0; padding: 24px; background-color: #f7f5f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; padding: 28px;">
    <div style="text-align: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 16px;">
      <h1 style="margin: 0 0 4px 0; font-size: 20px; color: #0f172a;">${data.venueName}</h1>
      <p style="margin: 0; font-size: 12px; color: #64748b;">${data.venueAddress}, ${data.venueCity}</p>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; font-family: monospace;">Ticket n&deg; ${data.ticketNumber} &bull; ${data.date}</p>
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px;">
      ${linesHtml}
    </table>

    <div style="border-top: 1px dashed #cbd5e1; padding-top: 12px; font-size: 14px;">
      <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
        <span>Total TTC :</span>
        <span>${data.totalTtcEuros} &euro;</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 4px;">
        <span>Dont TVA :</span>
        <span>${data.vatAmountEuros} &euro;</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b;">
        <span>Mode de r&egrave;glement :</span>
        <span>${data.paymentMethodText}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}
