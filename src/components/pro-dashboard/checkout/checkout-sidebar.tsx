"use client";

import React from "react";
import {
  User,
  Calendar,
  Lock,
  Clock,
  Sparkle,
  ShieldCheck,
  Check,
  UserCheck,
} from "lucide-react";
import { ProClient, ProAppointment } from "@/lib/data/pro-mock-data";
import { FormSelect } from "@/components/pro-dashboard/ui/form-controls";
import { Badge } from "@/components/pro-dashboard/ui/badge";

interface CheckoutSidebarProps {
  clients: ProClient[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  isAnonymousClient: boolean;
  onToggleAnonymous: (anonymous: boolean) => void;
  appointments: ProAppointment[];
  activeAppointmentId?: string | null;
  onSelectAppointment: (appointment: ProAppointment) => void;
  totalDayRevenue: number;
  ticketsCount: number;
  onOpenClosingModal: () => void;
}

export function CheckoutSidebar({
  clients,
  selectedClientId,
  onSelectClient,
  isAnonymousClient,
  onToggleAnonymous,
  appointments,
  activeAppointmentId,
  onSelectAppointment,
  totalDayRevenue,
  ticketsCount,
  onOpenClosingModal,
}: CheckoutSidebarProps) {
  const activeClient = clients.find((c) => c.id === selectedClientId);

  return (
    <aside className="w-64 sm:w-72 bg-white border-e border-neutral-200/90 flex flex-col shrink-0 overflow-y-auto custom-scrollbar select-none">
      {/* En-tête de la sidebar */}
      <div className="p-4 border-b border-neutral-200/80 space-y-1">
        <h2 className="text-sm font-bold text-neutral-950 uppercase tracking-wider">
          Caisse & POS &bull; Terminal
        </h2>
        <p className="text-sm text-neutral-500">
          Attribution client & flux d&apos;encaissement
        </p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Section 1 : Client au comptoir */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary-700" />
              <span>Client au comptoir</span>
            </span>

            <button
              type="button"
              onClick={() => onToggleAnonymous(!isAnonymousClient)}
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                isAnonymousClient
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {isAnonymousClient ? "Client de passage" : "Passage"}
            </button>
          </div>

          {isAnonymousClient ? (
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-sm text-neutral-700 space-y-1">
              <span className="font-bold text-neutral-900 block">
                Client de passage
              </span>
              <p className="text-sm text-neutral-500">
                Ticket non nominatif émis sans rattachement CRM.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <FormSelect
                label=""
                value={selectedClientId}
                onChange={(e) => onSelectClient(e.target.value)}
                options={clients.map((c) => ({
                  value: c.id,
                  label: `${c.firstName} ${c.lastName}${c.isVip ? " (VIP)" : ""}`,
                }))}
              />

              {activeClient && (
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/90 text-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-50 text-primary-900 font-bold text-xs flex items-center justify-center shrink-0 border border-primary-200/60">
                        {activeClient.firstName.charAt(0)}
                        {activeClient.lastName.charAt(0)}
                      </div>
                      <span className="font-bold text-neutral-950 text-sm truncate">
                        {activeClient.firstName} {activeClient.lastName}
                      </span>
                    </div>
                    {activeClient.isVip && (
                      <Badge variant="primary" size="sm">
                        VIP
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-neutral-500 space-y-0.5 pt-1 border-t border-neutral-200/60">
                    <div className="flex justify-between">
                      <span>Téléphone :</span>
                      <span className="font-medium text-neutral-800 tabular-nums">
                        {activeClient.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total visites :</span>
                      <span className="font-medium text-neutral-800 tabular-nums">
                        {activeClient.totalVisits} visite{activeClient.totalVisits > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2 : Rendez-vous du jour à encaisser */}
        <div className="space-y-2.5 pt-2 border-t border-neutral-200/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary-700" />
              <span>Rendez-vous du jour</span>
            </span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
              {appointments.length}
            </span>
          </div>

          <p className="text-xs text-neutral-500">
            Cliquez sur un RDV pour pré-remplir le panier en 1 clic.
          </p>

          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
            {appointments.map((apt) => {
              const isSelected = activeAppointmentId === apt.id;

              return (
                <button
                  key={apt.id}
                  type="button"
                  onClick={() => onSelectAppointment(apt)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? "bg-primary-50 border-primary-600 ring-1 ring-primary-600 shadow-2xs"
                      : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-900 truncate">
                      {apt.clientName}
                    </span>
                    <span className="font-bold tabular-nums text-neutral-950">
                      {apt.price} €
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="truncate">{apt.serviceName}</span>
                    <span className="tabular-nums flex items-center gap-1 shrink-0 text-neutral-600">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>{apt.startTime}</span>
                    </span>
                  </div>

                  {apt.depositPaid > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-primary-800 font-semibold pt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Acompte Stripe {apt.depositPaid} € perçu</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3 : Synthèse d'activité & Clôture Z en bas */}
      <div className="p-4 mt-auto border-t border-neutral-200/80 bg-neutral-50/60 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700 uppercase tracking-wider">
            <span>Activité du jour</span>
            <span className="text-neutral-500 font-normal">
              {ticketsCount} ticket{ticketsCount > 1 ? "s" : ""}
            </span>
          </div>
          <div className="text-xl font-extrabold text-neutral-950 tabular-nums">
            {totalDayRevenue.toFixed(2)} € <span className="text-xs font-normal text-neutral-500">TTC</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenClosingModal}
          className="btn btn-outline btn-sm w-full flex items-center justify-center gap-2 text-neutral-800"
        >
          <Lock className="w-4 h-4 text-neutral-600" />
          <span>Clôture Z de caisse</span>
        </button>
      </div>
    </aside>
  );
}
