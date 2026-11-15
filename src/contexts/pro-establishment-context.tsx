"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export interface Establishment {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  address: string;
  postalCode: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  siret?: string | null;
  vatNumber?: string | null;
  depositPercentage?: number;
  cancellationDelayHours?: number;
  status?: string;
}

interface EstablishmentContextType {
  currentEstablishment: Establishment | null;
  establishments: Establishment[];
  isLoading: boolean;
  isLoadingEstablishments: boolean;
  setCurrentEstablishmentId: (id: string) => void;
  switchEstablishment: (id: string) => void;
  createEstablishment: (payload: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    phone?: string;
    email?: string;
    tagline?: string;
    description?: string;
    depositPercentage?: number;
  }) => Promise<Establishment>;
  isCreating: boolean;
}

const EstablishmentContext = createContext<EstablishmentContextType | undefined>(undefined);

const STORAGE_KEY = "belora_active_establishment_id";

export function EstablishmentProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Récupération des établissements depuis l'API (100% base de données)
  const { data: establishments = [], isLoading } = useQuery<Establishment[]>({
    queryKey: ["pro", "venues"],
    queryFn: async () => {
      const res = await apiClient.get<{ venues?: Establishment[] }>("/pro/venues");
      return Array.isArray(res.data?.venues) ? res.data.venues : [];
    },
    staleTime: 60_000,
  });

  // Initialisation de l'id sélectionné depuis le stockage ou premier établissement
  useEffect(() => {
    if (typeof window !== "undefined" && establishments.length > 0) {
      const savedId = localStorage.getItem(STORAGE_KEY);
      const exists = establishments.some((e) => e.id === savedId);

      const activeId = exists && savedId ? savedId : establishments[0].id;
      setSelectedId(activeId);

      // Synchronisation cookie & headers Axios
      document.cookie = `belora_active_venue_id=${activeId}; path=/; max-age=2592000; SameSite=Lax`;
      apiClient.defaults.headers.common["x-venue-id"] = activeId;
    }
  }, [establishments]);

  // Changement d'établissement actif
  const handleSelectEstablishment = (id: string) => {
    const venue = establishments.find((e) => e.id === id);
    if (!venue) return;

    setSelectedId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, id);
      document.cookie = `belora_active_venue_id=${id}; path=/; max-age=2592000; SameSite=Lax`;
      apiClient.defaults.headers.common["x-venue-id"] = id;
    }

    // Invalidation globale pour recharger les données du nouveau salon
    queryClient.invalidateQueries({ queryKey: ["pro"] });
    toast.success(`Salon actif : ${venue.name}`);
  };

  // Mutation création d'un nouvel établissement en base
  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      address: string;
      postalCode: string;
      city: string;
      phone?: string;
      email?: string;
      tagline?: string;
      description?: string;
      depositPercentage?: number;
    }) => {
      const res = await apiClient.post<{ venue: Establishment }>("/pro/venues", payload);
      return res.data.venue;
    },
    onSuccess: (newVenue) => {
      queryClient.invalidateQueries({ queryKey: ["pro", "venues"] });
      handleSelectEstablishment(newVenue.id);
      toast.success(`L'établissement ${newVenue.name} a été créé avec succès`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Erreur lors de la création du salon.";
      toast.error(msg);
    },
  });

  const currentEstablishment = useMemo(() => {
    if (establishments.length === 0) return null;
    return establishments.find((e) => e.id === selectedId) || establishments[0];
  }, [establishments, selectedId]);

  return (
    <EstablishmentContext.Provider
      value={{
        currentEstablishment,
        establishments,
        isLoading,
        isLoadingEstablishments: isLoading,
        setCurrentEstablishmentId: handleSelectEstablishment,
        switchEstablishment: handleSelectEstablishment,
        createEstablishment: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
      }}
    >
      {children}
    </EstablishmentContext.Provider>
  );
}

export function useEstablishment() {
  const context = useContext(EstablishmentContext);
  if (!context) {
    throw new Error("useEstablishment must be used within an EstablishmentProvider");
  }
  return context;
}
