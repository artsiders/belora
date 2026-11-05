"use client";

import dynamic from "next/dynamic";
import { Venue } from "@/lib/data/venues";

interface Coordinates {
  lat: number;
  lng: number;
}

interface SearchMapProps {
  venues: Venue[];
  initialCenter: Coordinates;
  initialZoom?: number;
  selectedVenueId?: string | null;
  hoveredVenueId?: string | null;
  onSelectVenue?: (id: string) => void;
}

// Chargement dynamique de la carte Leaflet côté client sans SSR
const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => mod.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-neutral-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
          <span>Chargement de la carte interactive...</span>
        </div>
      </div>
    ),
  }
);

export function SearchMap(props: SearchMapProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden">
      <LeafletMap {...props} />
    </div>
  );
}
