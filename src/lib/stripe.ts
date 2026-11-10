import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_belora_development_key";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.acacia" as any,
  typescript: true,
});

export const isStripeConfigured = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && !key.includes("mock") && key.startsWith("sk_"));
};

export interface CreatePaymentIntentParams {
  amountCents: number;
  currency?: string;
  destinationAccountId?: string | null;
  applicationFeeAmountCents?: number;
  bookingId: string;
  venueId: string;
  customerEmail: string;
  description?: string;
}

export async function createBookingPaymentIntent({
  amountCents,
  currency = "eur",
  destinationAccountId,
  applicationFeeAmountCents,
  bookingId,
  venueId,
  customerEmail,
  description,
}: CreatePaymentIntentParams) {
  if (!isStripeConfigured()) {
    // Mode développement / test unitaire sans compte Stripe actif
    return {
      id: `pi_mock_${bookingId}_${Date.now()}`,
      clientSecret: `pi_mock_${bookingId}_secret_${Date.now()}`,
      amount: amountCents,
      currency,
      status: "requires_payment_method",
      isMock: true,
    };
  }

  const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
    amount: amountCents,
    currency: currency.toLowerCase(),
    receipt_email: customerEmail,
    description: description || `Acompte réservation Belora #${bookingId}`,
    metadata: {
      bookingId,
      venueId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  };

  // Si l'artisan a un compte Stripe Connect Express validé
  if (destinationAccountId) {
    paymentIntentParams.transfer_data = {
      destination: destinationAccountId,
    };
    if (applicationFeeAmountCents && applicationFeeAmountCents > 0) {
      paymentIntentParams.application_fee_amount = applicationFeeAmountCents;
    }
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    isMock: false,
  };
}

export async function createConnectedAccount(venueId: string, email: string, businessName: string) {
  if (!isStripeConfigured()) {
    return {
      id: `acct_mock_${venueId}`,
      isMock: true,
    };
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: "FR",
    email,
    business_type: "individual",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    metadata: {
      venueId,
    },
    business_profile: {
      name: businessName,
      mcc: "7230", // Barber and Beauty Shops
    },
  });

  return account;
}

export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  if (!isStripeConfigured() || accountId.startsWith("acct_mock_")) {
    return {
      url: returnUrl,
      isMock: true,
    };
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return accountLink;
}

export async function refundPaymentIntent(
  paymentIntentId: string,
  amountCents?: number
) {
  if (!isStripeConfigured() || paymentIntentId.startsWith("pi_mock_")) {
    return {
      id: `re_mock_${Date.now()}`,
      status: "succeeded",
      amount: amountCents,
      isMock: true,
    };
  }

  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amountCents ? { amount: amountCents } : {}),
  });

  return refund;
}
