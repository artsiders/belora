import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import type { UsageLimit, VenueSubscriptionSummary } from "@/modules/billing/types";

function Meter({ label, usage, isLoading }: { label: string; usage?: UsageLimit; isLoading: boolean }) {
  const ratio = usage && usage.limit ? Math.min(1, usage.used / usage.limit) : 0;
  const reached = usage?.limit !== null && usage !== undefined && usage.used >= (usage.limit ?? Infinity);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-neutral-600">{label}</span>
        {isLoading || !usage ? (
          <InlineSkeleton width="w-14" height="h-4" />
        ) : (
          <span className={`font-semibold num ${reached ? "text-rose-700" : "text-neutral-900"}`}>
            {usage.used} / {usage.limit ?? "illimité"}
          </span>
        )}
      </div>
      {usage?.limit !== null && (
        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={`h-full rounded-full ${reached ? "bg-rose-600" : "bg-primary-600"}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function UsageMeters({ subscription, isLoading }: { subscription?: VenueSubscriptionSummary; isLoading: boolean }) {
  return (
    <section className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-4">
      <h2 className="text-base font-bold text-neutral-950">Utilisation du forfait</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Meter label="Collaborateurs actifs" usage={subscription?.usage.staff} isLoading={isLoading} />
        <Meter label="Cabines et postes" usage={subscription?.usage.resources} isLoading={isLoading} />
        <Meter label="Établissements" usage={subscription?.usage.venues} isLoading={isLoading} />
      </div>
    </section>
  );
}
