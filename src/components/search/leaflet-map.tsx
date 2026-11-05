"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Plus, Minus, LocateFixed, Star, X, MapPin, Loader2 } from "lucide-react";
import { Venue } from "@/lib/data/venues";

interface Coordinates {
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  venues: Venue[];
  initialCenter: Coordinates;
  initialZoom?: number;
  selectedVenueId?: string | null;
  hoveredVenueId?: string | null;
  onSelectVenue?: (id: string) => void;
}

export function LeafletMap({
  venues,
  initialCenter,
  initialZoom = 14,
  selectedVenueId,
  hoveredVenueId,
  onSelectVenue,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [closedVenueId, setClosedVenueId] = useState<string | null>(null);

  // Dériver l'établissement actif pour la popin sans effet secondaire
  const activeVenue = useMemo(() => {
    if (!selectedVenueId || selectedVenueId === closedVenueId) return null;
    return venues.find((item) => item.id === selectedVenueId) || null;
  }, [selectedVenueId, closedVenueId, venues]);

  // Initialisation unique de la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: false, // On utilise nos commandes sur-mesure Belora
      attributionControl: false, // Attribution discrète customisée
    });

    // Tuiles OpenStreetMap France / OSM Standard ultra-détaillées et sans clé API
    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
      maxZoom: 19,
      subdomains: ["a", "b", "c"],
      attribution:
        '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Déplacement / recentrage quand la ville recherchée change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([initialCenter.lat, initialCenter.lng], initialZoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [initialCenter.lat, initialCenter.lng, initialZoom]);

  // Création des icônes de marqueurs personnalisés Belora
  const createMarkerIcon = useCallback(
    (venue: Venue, isHighlighted: boolean) => {
      return L.divIcon({
        className: "bg-transparent border-none",
        html: `
          <div class="relative flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md rounded-full border-2 ${
            isHighlighted
              ? "bg-[#82385a] border-white text-white z-30 scale-110 shadow-lg ring-2 ring-[#82385a]/40"
              : "bg-white border-[#82385a] text-[#82385a] hover:bg-neutral-50 z-10"
          } ${isHighlighted ? "px-2.5 py-1" : "p-1.5"}">
            ${
              isHighlighted
                ? `<span class="text-xs font-bold whitespace-nowrap flex items-center gap-1">
                    <svg class="w-3 h-3 fill-white text-white shrink-0" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                    <span>${venue.startingPrice}</span>
                  </span>`
                : `<div class="w-2.5 h-2.5 rounded-full bg-[#82385a]"></div>`
            }
          </div>
        `,
        iconSize: isHighlighted ? [60, 28] : [22, 22],
        iconAnchor: isHighlighted ? [30, 14] : [11, 11],
      });
    },
    []
  );

  // Mise à jour des marqueurs selon les venues et les états
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Supprimer les anciens marqueurs non présents
    const currentVenueIds = new Set(venues.map((v) => v.id));
    for (const [id, marker] of markersRef.current.entries()) {
      if (!currentVenueIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    // Ajouter ou mettre à jour les marqueurs
    venues.forEach((venue) => {
      if (!venue.coordinates) return;

      const isSelected = selectedVenueId === venue.id;
      const isHovered = hoveredVenueId === venue.id;
      const isHighlighted = isSelected || isHovered;

      let marker = markersRef.current.get(venue.id);

      if (!marker) {
        marker = L.marker([venue.coordinates.lat, venue.coordinates.lng], {
          icon: createMarkerIcon(venue, isHighlighted),
          zIndexOffset: isHighlighted ? 1000 : 0,
        }).addTo(map);

        marker.on("click", () => {
          setClosedVenueId(null);
          onSelectVenue?.(venue.id);
        });

        markersRef.current.set(venue.id, marker);
      } else {
        marker.setIcon(createMarkerIcon(venue, isHighlighted));
        marker.setZIndexOffset(isHighlighted ? 1000 : 0);
      }
    });
  }, [venues, selectedVenueId, hoveredVenueId, createMarkerIcon, onSelectVenue]);

  // Géolocalisation réelle en direct (Navigator Geolocation API)
  const handleLocateUser = () => {
    const map = mapRef.current;
    if (!map) return;

    if (!("geolocation" in navigator)) {
      console.warn("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 14, {
          duration: 1.5,
        });

        // Marqueur de position de l'utilisateur avec halo
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          userMarkerRef.current = L.circleMarker([latitude, longitude], {
            radius: 9,
            fillColor: "#82385a",
            color: "#ffffff",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.95,
          }).addTo(map);

          // Cercle d'imprécision doux
          L.circle([latitude, longitude], {
            radius: 250,
            color: "#82385a",
            weight: 1,
            fillColor: "#82385a",
            fillOpacity: 0.12,
          }).addTo(map);
        }

        setIsLocating(false);
      },
      (err) => {
        console.warn("Erreur de géolocalisation :", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapRef.current?.flyTo([initialCenter.lat, initialCenter.lng], initialZoom, {
      duration: 1.2,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Conteneur Leaflet réel */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Popin interactive d'établissement sélectionné */}
      {activeVenue && (
        <div className="absolute bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => {
              setClosedVenueId(selectedVenueId || null);
              onSelectVenue?.("");
            }}
            className="absolute top-2.5 right-2.5 p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100">
              <Image
                src={activeVenue.image}
                alt={activeVenue.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-bold text-sm text-neutral-950 truncate">
                {activeVenue.name}
              </h4>
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                {activeVenue.address}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-bold num">{activeVenue.rating}</span>
                <span className="text-neutral-400">•</span>
                <span className="font-semibold text-neutral-900 num">
                  {activeVenue.startingPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
            <Link
              href={`/venue/${activeVenue.slug}`}
              className="text-xs font-semibold text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Voir la fiche
            </Link>

            <Link
              href={`/book/${activeVenue.slug}`}
              className="btn btn-dark text-xs px-3 py-1.5 rounded-lg font-semibold shadow-2xs"
            >
              Prendre RDV
            </Link>
          </div>
        </div>
      )}

      {/* Commandes cartographiques haut de gamme */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoomer"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Dézoomer"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleLocateUser}
          disabled={isLocating}
          aria-label="Me géolocaliser"
          title="Me géolocaliser"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer mt-1"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 text-primary-600 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 text-primary-600" />
          )}
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Recentrer la carte"
          title="Recentrer sur la ville"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5 text-neutral-600" />
        </button>
      </div>

      {/* Attribution légale discrète OpenStreetMap */}
      <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-white/85 text-[10px] text-neutral-500 z-20 pointer-events-none">
        © OpenStreetMap France
      </div>
    </div>
  );
}
