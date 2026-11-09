"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Banknote,
  Receipt,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Search,
  User,
  ShoppingBag,
  Percent,
  Printer,
} from "lucide-react";
import {
  ProService,
  ProStaffMember,
  ProClient,
  ProAppointment,
  ProSaleTicket,
} from "@/lib/data/pro-mock-data";
import { FormSelect } from "@/components/pro-dashboard/ui/form-controls";
import { CheckoutSidebar } from "@/components/pro-dashboard/checkout/checkout-sidebar";

export interface CartItem {
  id: string;
  title: string;
  type: "service" | "product";
  price: number;
  quantity: number;
  staffId: string;
}

const RETAIL_PRODUCTS = [
  {
    id: "prd-1",
    name: "Huile Botanique Nourrissante 50ml",
    price: 32,
    category: "Soin",
  },
  {
    id: "prd-2",
    name: "Masque Capillaire Pureté Argile 200ml",
    price: 28,
    category: "Soin",
  },
  {
    id: "prd-3",
    name: "Cire Végétale Texturisante 75ml",
    price: 22,
    category: "Coiffage",
  },
  {
    id: "prd-4",
    name: "Brume Rafraîchissante Lavande & Sauge",
    price: 26,
    category: "Soin",
  },
];

interface CheckoutTerminalProps {
  services: ProService[];
  staffList: ProStaffMember[];
  clients: ProClient[];
  appointments: ProAppointment[];
  initialAppointmentId?: string | null;
  onTicketCompleted: (ticket: ProSaleTicket) => void;
  tickets?: ProSaleTicket[];
  totalDayRevenue?: number;
  onOpenClosingModal?: () => void;
}

export function CheckoutTerminal({
  services,
  staffList,
  clients,
  appointments,
  initialAppointmentId,
  onTicketCompleted,
  tickets = [],
  totalDayRevenue = 0,
  onOpenClosingModal = () => {},
}: CheckoutTerminalProps) {
  // Client sélectionné
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (initialAppointmentId) {
      const apt = appointments.find((a) => a.id === initialAppointmentId);
      if (apt?.clientId) return apt.clientId;
    }
    return clients[0]?.id || "cli-1";
  });
  const [isAnonymousClient, setIsAnonymousClient] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(initialAppointmentId || null);

  const handleSelectAppointment = (apt: ProAppointment) => {
    setSelectedAppointmentId(apt.id);
    setSelectedClientId(apt.clientId);
    setIsAnonymousClient(false);
    setDepositDeducted(apt.depositPaid || 0);

    setCart([
      {
        id: `item-${Date.now()}`,
        title: apt.serviceName,
        type: "service",
        price: apt.price,
        quantity: 1,
        staffId: apt.staffId,
      },
    ]);
  };

  // Panier
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Si un RDV est passé en paramètre
    if (initialAppointmentId) {
      const apt = appointments.find((a) => a.id === initialAppointmentId);
      if (apt) {
        return [
          {
            id: `item-${Date.now()}`,
            title: apt.serviceName,
            type: "service",
            price: apt.price,
            quantity: 1,
            staffId: apt.staffId,
          },
        ];
      }
    }
    return [];
  });

  // Acompte déjà perçu sur réservation en ligne
  const [depositDeducted, setDepositDeducted] = useState<number>(() => {
    if (initialAppointmentId) {
      const apt = appointments.find((a) => a.id === initialAppointmentId);
      return apt?.depositPaid || 0;
    }
    return 0;
  });

  // Remise
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Mode de règlement
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cash" | "mixed"
  >("card");
  const [cashGiven, setCashGiven] = useState<string>("");
  const [cardMixedAmount, setCardMixedAmount] = useState<string>("");
  const [cashMixedAmount, setCashMixedAmount] = useState<string>("");

  // Onglet catalogue
  const [catalogTab, setCatalogTab] = useState<"services" | "products">(
    "services"
  );
  const [searchCatalog, setSearchCatalog] = useState("");

  // Succès encaissement
  const [completedTicket, setCompletedTicket] =
    useState<ProSaleTicket | null>(null);

  // Calculs financiers
  const rawSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const totalDue = Math.max(0, subtotalAfterDiscount - depositDeducted);

  const vatRate = 0.2; // 20%
  const subtotalHt = totalDue / (1 + vatRate);
  const vatAmount = totalDue - subtotalHt;

  // Monnaie à rendre si paiement espèces
  const cashGivenNum = parseFloat(cashGiven) || 0;
  const changeDue = Math.max(0, cashGivenNum - totalDue);

  const activeClient = useMemo(() => {
    if (isAnonymousClient) return null;
    return clients.find((c) => c.id === selectedClientId);
  }, [clients, selectedClientId, isAnonymousClient]);

  // Ajouter un élément au panier
  const handleAddItem = (
    title: string,
    type: "service" | "product",
    price: number
  ) => {
    setCart((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random()}`,
        title,
        type,
        price,
        quantity: 1,
        staffId: staffList[0].id,
      },
    ]);
  };

  // Mettre à jour quantité
  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Supprimer un élément
  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Modifier le collaborateur d'une ligne
  const handleUpdateStaff = (itemId: string, newStaffId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, staffId: newStaffId } : item
      )
    );
  };

  // Valider l'encaissement
  const handleValidateCheckout = () => {
    if (cart.length === 0) return;

    const primaryStaff = staffList.find((s) => s.id === cart[0].staffId) || staffList[0];
    const clientName = isAnonymousClient
      ? "Client de passage"
      : activeClient
      ? `${activeClient.firstName} ${activeClient.lastName}`
      : "Client";

    const newTicket: ProSaleTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clientId: activeClient?.id || "anonymous",
      clientName,
      staffId: primaryStaff.id,
      staffName: primaryStaff.name,
      items: cart.map((i) => ({
        title: i.title,
        type: i.type,
        price: i.price,
        quantity: i.quantity,
      })),
      depositDeducted,
      subtotalHt,
      vatAmount,
      totalTtc: totalDue,
      paymentMethod,
      cardAmount:
        paymentMethod === "card"
          ? totalDue
          : paymentMethod === "mixed"
          ? parseFloat(cardMixedAmount) || 0
          : undefined,
      cashAmount:
        paymentMethod === "cash"
          ? totalDue
          : paymentMethod === "mixed"
          ? parseFloat(cashMixedAmount) || 0
          : undefined,
    };

    onTicketCompleted(newTicket);
    setCompletedTicket(newTicket);
  };

  // Réinitialiser après encaissement
  const handleResetForNewSale = () => {
    setCompletedTicket(null);
    setCart([]);
    setDepositDeducted(0);
    setDiscountPercent(0);
    setCashGiven("");
    setCardMixedAmount("");
    setCashMixedAmount("");
  };

  // --------------------------------------------------------------------------
  // VUE SUCCÈS APRÈS ENCAISSEMENT
  // --------------------------------------------------------------------------
  if (completedTicket) {
    return (
      <div className="max-w-xl mx-auto p-6 sm:p-8 my-8 bg-white rounded-xl border border-neutral-200 shadow-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-950">
            Encaissement validé !
          </h2>
          <p className="text-sm sm:text-base text-neutral-600">
            Ticket #{completedTicket.id.toUpperCase()} • Règlements enregistrés
            avec succès.
          </p>
        </div>

        {/* Détails du ticket */}
        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-left space-y-3 text-sm">
          <div className="flex justify-between border-b border-neutral-200 pb-2 font-semibold text-neutral-900">
            <span>Client : {completedTicket.clientName}</span>
            <span>{completedTicket.time}</span>
          </div>

          <div className="space-y-1.5">
            {completedTicket.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-neutral-700">
                <span>
                  {it.quantity}x {it.title}
                </span>
                <span className="tabular-nums font-medium">
                  {(it.price * it.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>

          {completedTicket.depositDeducted > 0 && (
            <div className="flex justify-between text-primary-700 pt-1 font-semibold">
              <span>Acompte Stripe déduit</span>
              <span className="tabular-nums">
                - {completedTicket.depositDeducted.toFixed(2)} €
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-950 text-sm">
            <span>Total réglé en salon</span>
            <span className="tabular-nums">
              {completedTicket.totalTtc.toFixed(2)} €
            </span>
          </div>
        </div>

        {/* Actions d'impression et nouveau ticket */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline btn-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le reçu</span>
          </button>
          <button
            type="button"
            onClick={handleResetForNewSale}
            className="btn btn-primary btn-sm"
          >
            Nouveau ticket de caisse
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // TERMINAL POS ACTIF (SIDEBAR 280PX + CATALOGUE + TICKET)
  // --------------------------------------------------------------------------
  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar Caisse & POS (Attribution Client, RDV du jour, Clôture Z) */}
      <CheckoutSidebar
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={(id) => {
          setSelectedClientId(id);
          setIsAnonymousClient(false);
        }}
        isAnonymousClient={isAnonymousClient}
        onToggleAnonymous={setIsAnonymousClient}
        appointments={appointments}
        activeAppointmentId={selectedAppointmentId}
        onSelectAppointment={handleSelectAppointment}
        totalDayRevenue={totalDayRevenue}
        ticketsCount={tickets.length}
        onOpenClosingModal={onOpenClosingModal}
      />

      {/* Zone Centrale & Droite : Catalogue + Ticket POS */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 sm:p-6 overflow-hidden bg-neutral-50/40">
        {/* Colonne Centre : Catalogue de Vente (Prestations vs Produits) */}
        <div className="flex-1 flex flex-col p-4 sm:p-5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden">
          {/* Navigation Catalogue */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
            <div className="inline-flex p-1 rounded-lg bg-neutral-100 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setCatalogTab("services")}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  catalogTab === "services"
                    ? "bg-white text-neutral-950 shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Prestations ({services.length})
              </button>
              <button
                type="button"
                onClick={() => setCatalogTab("products")}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  catalogTab === "products"
                    ? "bg-white text-neutral-950 shadow-2xs font-bold"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                Produits de Revente ({RETAIL_PRODUCTS.length})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Filtrer le catalogue..."
                value={searchCatalog}
                onChange={(e) => setSearchCatalog(e.target.value)}
                className="input input-sm w-full sm:w-48 ps-8"
              />
            </div>
          </div>

          {/* Grille des articles du catalogue */}
          <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar">
            {catalogTab === "services" ? (
              services
                .filter((s) =>
                  s.name.toLowerCase().includes(searchCatalog.toLowerCase())
                )
                .map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() =>
                      handleAddItem(srv.name, "service", srv.priceEuros)
                    }
                    className="p-3.5 rounded-lg border border-neutral-200/90 hover:border-primary-600/80 bg-white hover:bg-neutral-50/50 text-left transition-all flex flex-col justify-between gap-2 shadow-2xs cursor-pointer group"
                  >
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-primary-700 transition-colors">
                        {srv.name}
                      </h4>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {srv.durationMinutes} min
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <span className="text-sm font-bold text-neutral-950 tabular-nums">
                        {srv.priceEuros.toFixed(2)} €
                      </span>
                      <span className="text-xs font-semibold text-primary-700 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </span>
                    </div>
                  </button>
                ))
            ) : (
              RETAIL_PRODUCTS.filter((p) =>
                p.name.toLowerCase().includes(searchCatalog.toLowerCase())
              ).map((prd) => (
                <button
                  key={prd.id}
                  type="button"
                  onClick={() =>
                    handleAddItem(prd.name, "product", prd.price)
                  }
                  className="p-3.5 rounded-lg border border-neutral-200/90 hover:border-primary-600/80 bg-white hover:bg-neutral-50/50 text-left transition-all flex flex-col justify-between gap-2 shadow-2xs cursor-pointer group"
                >
                  <div className="flex items-start gap-2">
                    <ShoppingBag className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-neutral-950 group-hover:text-primary-700 transition-colors">
                        {prd.name}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {prd.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span className="text-sm font-bold text-neutral-950 tabular-nums">
                      {prd.price.toFixed(2)} €
                    </span>
                    <span className="text-xs font-semibold text-primary-700 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* =====================================================================
            COLONNE DROITE : TICKET DE CAISSE EN COURS & RÈGLEMENT (POS)
            ===================================================================== */}
        <div className="w-full lg:w-96 flex flex-col p-4 sm:p-5 rounded-xl bg-white border border-neutral-200/90 shadow-2xs overflow-hidden shrink-0">
        {/* Header Ticket */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary-700" />
            <h3 className="font-bold text-sm text-neutral-950">
              Ticket en cours
            </h3>
          </div>
          <span className="text-sm text-neutral-500 tabular-nums">
            {cart.length} article{cart.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Lignes du panier */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300" />
              <p className="text-sm">Le ticket de caisse est vide.</p>
              <p className="text-sm text-neutral-400">
                Sélectionnez une prestation ou un produit à gauche.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-neutral-950 truncate">
                      {item.title}
                    </h5>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                      {item.type === "service" ? "Prestation" : "Produit boutique"}
                    </span>
                  </div>
                  <span className="font-bold text-sm tabular-nums text-neutral-950 shrink-0">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-sm">
                  {/* Attribution praticien pour commission/traçabilité */}
                  <select
                    value={item.staffId}
                    onChange={(e) =>
                      handleUpdateStaff(item.id, e.target.value)
                    }
                    className="select h-7 py-0 px-2 text-sm font-medium text-neutral-800"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>

                  {/* Contrôles Quantité */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="w-6 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center tabular-nums font-semibold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="w-6 h-6 rounded border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-700 ml-1"
                      aria-label="Supprimer la ligne"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pied du Ticket : Remise, Acompte, Total & Mode de paiement */}
        <div className="pt-3 border-t border-neutral-200 space-y-3 shrink-0">
          {/* Ligne Remise & Acompte */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-neutral-600 font-medium">
              <span>Sous-total articles</span>
              <span className="tabular-nums font-bold text-neutral-900">
                {rawSubtotal.toFixed(2)} €
              </span>
            </div>

            {/* Remise éventuelle */}
            <div className="flex items-center justify-between text-neutral-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-neutral-400" />
                <span>Remise commerciale</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[10, 20, 30].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() =>
                      setDiscountPercent(discountPercent === pct ? 0 : pct)
                    }
                    className={`px-2 py-0.5 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                      discountPercent === pct
                        ? "bg-primary-600 text-white border-primary-600 shadow-2xs font-bold"
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    -{pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Déduction Acompte Stripe Connect */}
            {depositDeducted > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary-50/70 border border-primary-200/80 text-primary-900 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary-700" />
                  <span>Acompte Stripe perçu en ligne</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="tabular-nums font-bold">
                    - {depositDeducted.toFixed(2)} €
                  </span>
                  <button
                    type="button"
                    onClick={() => setDepositDeducted(0)}
                    className="text-xs underline ml-2 cursor-pointer text-neutral-500 hover:text-rose-700"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/90 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-neutral-500 block tracking-wider">
                Reste à régler au salon
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                dont TVA (20%) : {vatAmount.toFixed(2)} €
              </span>
            </div>
            <span className="font-extrabold text-2xl sm:text-3xl tabular-nums text-neutral-950">
              {totalDue.toFixed(2)} €
            </span>
          </div>

          {/* Moyens de règlement */}
          <div className="space-y-2">
            <span className="text-sm font-bold text-neutral-700 uppercase tracking-wider block">
              Moyen de règlement
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`py-2 px-2.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                    : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Carte CB</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`py-2 px-2.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === "cash"
                    ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                    : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Espèces</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("mixed")}
                className={`py-2 px-2.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === "mixed"
                    ? "bg-primary-600 text-white border-primary-600 shadow-2xs"
                    : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span>Mixte</span>
              </button>
            </div>

            {/* Calcul de la monnaie si Espèces */}
            {paymentMethod === "cash" && (
              <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/80 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Montant reçu :</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex : 50.00"
                    value={cashGiven}
                    onChange={(e) => setCashGiven(e.target.value)}
                    className="input input-sm w-28 text-right font-semibold tabular-nums"
                  />
                </div>
                {cashGivenNum > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200 font-bold">
                    <span className="text-neutral-800">Monnaie à rendre :</span>
                    <span className="text-primary-800 text-sm tabular-nums">
                      {changeDue.toFixed(2)} €
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Détail mixte */}
            {paymentMethod === "mixed" && (
              <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/80 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Montant Carte CB :</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex : 30.00"
                    value={cardMixedAmount}
                    onChange={(e) => setCardMixedAmount(e.target.value)}
                    className="input input-sm w-28 text-right font-semibold tabular-nums"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Montant Espèces :</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex : 20.00"
                    value={cashMixedAmount}
                    onChange={(e) => setCashMixedAmount(e.target.value)}
                    className="input input-sm w-28 text-right font-semibold tabular-nums"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bouton Principal de Validation */}
          <button
            type="button"
            onClick={handleValidateCheckout}
            disabled={cart.length === 0}
            className="btn btn-primary btn-lg w-full"
          >
            <span>Valider et encaisser {totalDue.toFixed(2)} €</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
