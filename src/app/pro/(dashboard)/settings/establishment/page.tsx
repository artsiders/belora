"use client";

import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Building2, CalendarClock, CalendarOff, Clock, CreditCard, ExternalLink, MapPin, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiClient, type ApiErrorResponse } from "@/lib/api-client";
import { FormInput, FormTextarea } from "@/components/pro-dashboard/ui/form-controls";
import { InlineSkeleton } from "@/components/ui/inline-skeleton";
import { formatSiret } from "@/lib/validations/fr-business";
import type { FormattedEstablishment } from "@/modules/pro/settings.service";
import type { UpdateEstablishmentInput } from "@/lib/validations/settings.schema";
import { SettingsCard } from "@/components/pro-dashboard/establishment/settings/settings-card";
import { OpeningHoursEditor } from "@/components/pro-dashboard/establishment/settings/opening-hours-editor";
import { ClosuresEditor } from "@/components/pro-dashboard/establishment/settings/closures-editor";
import { BookingRulesSection } from "@/components/pro-dashboard/establishment/settings/booking-rules-section";
import { PaymentPolicySection } from "@/components/pro-dashboard/establishment/settings/payment-policy-section";
import { SectionNav } from "@/components/pro-dashboard/establishment/settings/section-nav";
import { SaveBar } from "@/components/pro-dashboard/establishment/settings/save-bar";
import { toPayload, useEstablishmentForm } from "@/components/pro-dashboard/establishment/settings/use-establishment-form";

const QUERY_KEY = ["pro", "settings", "establishment"] as const;

const SECTIONS = [
  { id: "identity", label: "Identité et contact" },
  { id: "location", label: "Adresse" },
  { id: "hours", label: "Horaires d'ouverture" },
  { id: "closures", label: "Fermetures exceptionnelles" },
  { id: "booking", label: "Réservation en ligne" },
  { id: "payment", label: "Paiement en ligne" },
];

const DESCRIPTION_MAX = 3000;

function EstablishmentForm({ saved }: { saved: FormattedEstablishment }) {
  const queryClient = useQueryClient();
  const { form, set, isDirty, errors, errorCount, fieldError, touchAll, reset } = useEstablishmentForm(saved);

  const save = useMutation({
    mutationFn: async (payload: UpdateEstablishmentInput) =>
      (await apiClient.patch<{ establishment: FormattedEstablishment }>("/pro/settings/establishment", payload)).data
        .establishment,
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEY, updated);
      queryClient.invalidateQueries({ queryKey: ["pro", "venues"] });
      toast.success("Paramètres enregistrés.");
    },
    onError: (err: ApiErrorResponse) => toast.error(err.error),
  });

  const submit = () => {
    if (errorCount > 0) {
      touchAll();
      toast.error("Certains champs sont à corriger.");
      return;
    }
    save.mutate(toPayload(form));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-6"
      noValidate
    >
      <SettingsCard id="identity" icon={Building2} title="Identité et contact" description="Informations légales et coordonnées affichées sur votre fiche.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Nom commercial" required value={form.name} error={fieldError("name")} onChange={(e) => set("name", e.target.value)} />
          <FormInput
            label="Accroche"
            placeholder="Ex : Coiffure végétale et soins du cuir chevelu"
            helper="Une phrase courte sous le nom de votre salon"
            maxLength={120}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
          <FormInput
            label="Numéro SIRET"
            required
            inputMode="numeric"
            placeholder="123 456 789 00012"
            value={formatSiret(form.siret)}
            error={fieldError("siret")}
            onChange={(e) => set("siret", e.target.value.replace(/\D/g, "").slice(0, 14))}
          />
          <FormInput
            label="Numéro de TVA intracommunautaire"
            placeholder="FR12345678901"
            helper="Laissez vide si vous n'êtes pas assujetti à la TVA"
            value={form.vatNumber}
            error={fieldError("vatNumber")}
            onChange={(e) => set("vatNumber", e.target.value.toUpperCase())}
          />
          <FormInput label="Téléphone" type="tel" required value={form.phone} error={fieldError("phone")} onChange={(e) => set("phone", e.target.value)} />
          <FormInput label="E-mail" type="email" required value={form.email} error={fieldError("email")} onChange={(e) => set("email", e.target.value)} />
          <FormInput
            label="Site web"
            type="url"
            placeholder="https://"
            value={form.website}
            error={fieldError("website")}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
        <FormTextarea
          label="Présentation"
          rows={5}
          maxLength={DESCRIPTION_MAX}
          helper={`Affichée en tête de votre fiche publique · ${form.description.length} / ${DESCRIPTION_MAX} caractères`}
          error={fieldError("description")}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </SettingsCard>

      <SettingsCard id="location" icon={MapPin} title="Adresse" description="Utilisée pour la recherche par ville et l'itinéraire de vos clients.">
        <FormInput label="Adresse" required value={form.address} error={fieldError("address")} onChange={(e) => set("address", e.target.value)} />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <FormInput
            label="Code postal"
            required
            inputMode="numeric"
            maxLength={5}
            value={form.postalCode}
            error={fieldError("postalCode")}
            onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
          />
          <FormInput label="Ville" required value={form.city} error={fieldError("city")} onChange={(e) => set("city", e.target.value)} />
        </div>
      </SettingsCard>

      <SettingsCard id="hours" icon={Clock} title="Horaires d'ouverture" description="Ajoutez une pause pour fermer en milieu de journée.">
        <OpeningHoursEditor value={form.openingHours} onChange={(v) => set("openingHours", v)} />
      </SettingsCard>

      <SettingsCard
        id="closures"
        icon={CalendarOff}
        title="Fermetures exceptionnelles"
        description="Congés, jours fériés, travaux : aucun créneau n'est proposé en ligne sur ces dates."
      >
        <ClosuresEditor value={form.closures} onChange={(v) => set("closures", v)} />
        {errors.closures && <p className="text-sm text-rose-600">{errors.closures}</p>}
      </SettingsCard>

      <SettingsCard id="booking" icon={CalendarClock} title="Réservation en ligne" description="Quand et comment vos clients peuvent réserver.">
        <BookingRulesSection value={form} onChange={set} />
      </SettingsCard>

      <SettingsCard id="payment" icon={CreditCard} title="Paiement en ligne" description="Ce que le client règle au moment de la réservation.">
        <PaymentPolicySection value={form} onChange={set} />
      </SettingsCard>

      <SaveBar isDirty={isDirty} isSaving={save.isPending} errorCount={errorCount} onReset={reset} onSave={submit} />
    </form>
  );
}

export default function EstablishmentSettingsPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () =>
      (await apiClient.get<{ establishment: FormattedEstablishment }>("/pro/settings/establishment")).data.establishment,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    placeholderData: keepPreviousData,
  });
  const hasError = isError || Boolean((data as { error?: string } | undefined)?.error);

  return (
    <div className="p-4 sm:p-8 container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-950">Paramètres de l&apos;établissement</h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-0.5">
            {isLoading ? <InlineSkeleton width="w-56" height="h-4" /> : data?.name}
          </p>
        </div>
        {data && (
          <Link href={`/venue/${data.slug}`} target="_blank" className="btn btn-outline btn-sm self-start sm:self-auto">
            <ExternalLink className="w-4 h-4" />
            Voir ma fiche publique
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
        <aside className="hidden lg:block">
          <SectionNav sections={SECTIONS} />
        </aside>

        <div className="min-w-0 max-w-4xl">
          {hasError ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" aria-hidden />
                <span>Impossible de charger les paramètres de l&apos;établissement.</span>
              </div>
              <button type="button" onClick={() => refetch()} disabled={isFetching} className="btn btn-outline btn-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                Réessayer
              </button>
            </div>
          ) : data ? (
            <EstablishmentForm key={JSON.stringify(data)} saved={data} />
          ) : (
            <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-4">
              <InlineSkeleton width="w-48" height="h-6" />
              <InlineSkeleton width="w-full" height="h-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
