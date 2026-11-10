import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { db } from "@/lib/db";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendBookingConfirmationEmail, sendProNewBookingNotificationEmail } from "@/lib/email";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (isStripeConfigured() && webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error("Stripe webhook signature verification failed:", err?.message);
        return NextResponse.json({ error: "Signature de webhook invalide." }, { status: 400 });
      }
    } else {
      // Mode simulation / fallback développement
      try {
        event = JSON.parse(rawBody) as Stripe.Event;
      } catch {
        return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
      }
    }

    // Traitement des événements Stripe
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          const booking = await db.booking.findUnique({
            where: { id: bookingId },
          });

          if (booking) {
            const isFullyPaid = booking.remainingCents === 0;
            await db.booking.update({
              where: { id: bookingId },
              data: {
                status: BookingStatus.CONFIRMED,
                paymentStatus: PaymentStatus.SUCCEEDED,
                stripePaymentIntentId: paymentIntent.id,
              },
            });
            console.log(`Réservation confirmée via Stripe: ${booking.reference}`);

            // Envoi des notifications automatiques client et pro
            sendBookingConfirmationEmail(bookingId).catch((err) =>
              console.error("Erreur envoi email client webhook:", err)
            );
            sendProNewBookingNotificationEmail(bookingId).catch((err) =>
              console.error("Erreur envoi email pro webhook:", err)
            );
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.bookingId;

        if (bookingId) {
          await db.booking.update({
            where: { id: bookingId },
            data: {
              status: BookingStatus.CANCELLED,
              notes: "Échec du règlement de l'acompte bancaire en ligne.",
            },
          });
          console.warn(`Paiement échoué pour la réservation ${bookingId}`);
        }
        break;
      }

      default:
        // Événement ignoré
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      String((err as any).digest).startsWith("NEXT_PRERENDER")
    ) {
      throw err;
    }
    console.error("Stripe webhook processing error:", err);
    return NextResponse.json(
      { error: "Erreur lors du traitement du webhook." },
      { status: 500 }
    );
  }
}
