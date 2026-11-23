"use client";

import { useSyncExternalStore } from "react";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

interface DirectBookingLinkCardProps {
  venueSlug: string;
  commissionNote: string;
}

const subscribeNoop = () => () => {};

/** Lien de réservation à partager par le salon : les réservations faites ainsi ne sont jamais commissionnées. */
export function DirectBookingLinkCard({ venueSlug, commissionNote }: DirectBookingLinkCardProps) {
  const origin = useSyncExternalStore(subscribeNoop, () => window.location.origin, () => "");
  const link = `${origin}/book/${venueSlug}?source=direct`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Lien copié");
    } catch {
      toast.error("Impossible de copier le lien. Sélectionnez-le puis copiez-le manuellement.");
    }
  };

  return (
    <section className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="w-4.5 h-4.5 text-primary-700" aria-hidden />
        <h2 className="text-base font-bold text-neutral-950">Votre lien de réservation</h2>
      </div>
      <p className="text-sm text-neutral-600">
        Partagez-le sur votre site, vos réseaux sociaux ou en QR code au comptoir. {commissionNote}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input readOnly value={link} className="input flex-1" aria-label="Lien de réservation direct" onFocus={(e) => e.target.select()} />
        <button type="button" onClick={copy} className="btn btn-outline">
          <Copy className="w-4 h-4" />
          Copier
        </button>
      </div>
    </section>
  );
}
