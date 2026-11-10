import axios from "axios";

export const isBrevoConfigured = () => {
  const key = process.env.BREVO_API_KEY;
  return Boolean(key && !key.includes("mock") && key.length > 20);
};

export interface SendSmsParams {
  recipientPhone: string;
  venueName: string;
  staffName?: string | null;
  dateText: string; // Ex: "demain" ou "mardi 24 nov."
  timeText: string; // Ex: "14h00"
  address: string;
}

/**
 * Normalise un numéro de mobile français au format international E.164 (+33...)
 */
export function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("33") && digits.length === 11) {
    return `+${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+33${digits.substring(1)}`;
  }
  if (phone.startsWith("+")) {
    return phone;
  }
  return `+${digits}`;
}

export async function sendBookingReminderSms(params: SendSmsParams) {
  const { recipientPhone, venueName, staffName, dateText, timeText, address } = params;

  const staffClause = staffName ? ` avec ${staffName}` : "";
  const content = `Rappel Belora : Votre rdv chez ${venueName} est ${dateText} à ${timeText}${staffClause}. Adresse : ${address}.`;

  const normalizedPhone = normalizePhoneNumber(recipientPhone);

  if (!isBrevoConfigured()) {
    console.log(`[SIMULATION BREVO SMS] Envoi à ${normalizedPhone} : "${content}"`);
    return {
      success: true,
      messageId: `mock_sms_${Date.now()}`,
      content,
      recipient: normalizedPhone,
      isMock: true,
    };
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/transactionalSMS/sms",
      {
        sender: "Belora",
        recipient: normalizedPhone,
        content,
        type: "transactional",
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    return {
      success: true,
      messageId: response.data?.messageId,
      content,
      recipient: normalizedPhone,
      isMock: false,
    };
  } catch (err: any) {
    console.error("Erreur lors de l'envoi de SMS Brevo:", err?.response?.data || err?.message);
    return {
      success: false,
      error: "Impossible d'acheminer le SMS de rappel.",
    };
  }
}
