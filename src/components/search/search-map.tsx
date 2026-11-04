"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, LocateFixed, Star, X, MapPin } from "lucide-react";
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

function project(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const sinLat = Math.sin((lat * Math.PI) / 180);
  const clampedSin = Math.min(Math.max(sinLat, -0.9999), 0.9999);
  const scale = 256 * Math.pow(2, zoom);
  const x = scale * ((lng + 180) / 360);
  const y = scale * (0.5 - Math.log((1 + clampedSin) / (1 - clampedSin)) / (4 * Math.PI));
  return { x, y };
}

function unproject(x: number, y: number, zoom: number): Coordinates {
  const scale = 256 * Math.pow(2, zoom);
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

export function SearchMap({
  venues,
  initialCenter,
  initialZoom = 14,
  selectedVenueId,
  hoveredVenueId,
  onSelectVenue,
}: SearchMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 700 });
  const [center, setCenter] = useState<Coordinates>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; centerPx: { x: number; y: number } }>({
    mouseX: 0,
    mouseY: 0,
    centerPx: { x: 0, y: 0 },
  });

  // Mettre à jour le centre si la ville ou initialCenter change
  const [prevCenter, setPrevCenter] = useState(initialCenter);
  const [prevZoom, setPrevZoom] = useState(initialZoom);

  if (
    prevCenter.lat !== initialCenter.lat ||
    prevCenter.lng !== initialCenter.lng ||
    prevZoom !== initialZoom
  ) {
    setPrevCenter(initialCenter);
    setPrevZoom(initialZoom);
    setCenter(initialCenter);
    setZoom(initialZoom);
  }

  // Observer la taille réelle du conteneur
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: Math.max(entry.contentRect.width, 280),
          height: Math.max(entry.contentRect.height, 350),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Coordonnées du centre en pixels mondiaux
  const centerPx = useMemo(() => project(center.lat, center.lng, zoom), [center, zoom]);

  // Bornes de l'écran en pixels mondiaux
  const bounds = useMemo(() => {
    const minX = centerPx.x - dimensions.width / 2;
    const maxX = centerPx.x + dimensions.width / 2;
    const minY = centerPx.y - dimensions.height / 2;
    const maxY = centerPx.y + dimensions.height / 2;
    return { minX, maxX, minY, maxY };
  }, [centerPx, dimensions]);

  // Tuiles visibles
  const tiles = useMemo(() => {
    const maxCoord = Math.pow(2, zoom);
    const tileMinX = Math.floor(bounds.minX / 256);
    const tileMaxX = Math.floor(bounds.maxX / 256);
    const tileMinY = Math.floor(bounds.minY / 256);
    const tileMaxY = Math.floor(bounds.maxY / 256);

    const list: {
      key: string;
      url: string;
      left: number;
      top: number;
    }[] = [];

    const subdomains = ["a", "b", "c", "d"];

    for (let tx = tileMinX; tx <= tileMaxX; tx++) {
      for (let ty = tileMinY; ty <= tileMaxY; ty++) {
        if (ty >= 0 && ty < maxCoord) {
          const wrappedX = ((tx % maxCoord) + maxCoord) % maxCoord;
          const sub = subdomains[(tx + ty + zoom) % subdomains.length];
          const url = `https://${sub}.basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${wrappedX}/${ty}.png`;
          const left = tx * 256 - bounds.minX;
          const top = ty * 256 - bounds.minY;
          list.push({
            key: `${zoom}-${tx}-${ty}`,
            url,
            left,
            top,
          });
        }
      }
    }
    return list;
  }, [bounds, zoom]);

  // Marqueurs avec positions sur l'écran
  const markers = useMemo(() => {
    return venues
      .filter((v) => v.coordinates)
      .map((venue) => {
        const coords = venue.coordinates!;
        const p = project(coords.lat, coords.lng, zoom);
        const screenX = p.x - bounds.minX;
        const screenY = p.y - bounds.minY;
        const isVisible =
          screenX >= -40 &&
          screenX <= dimensions.width + 40 &&
          screenY >= -40 &&
          screenY <= dimensions.height + 40;
        return {
          venue,
          screenX,
          screenY,
          isVisible,
        };
      });
  }, [venues, bounds, dimensions, zoom]);

  // Établissement sélectionné actif pour la popin sur carte
  const activeVenue = useMemo(() => {
    if (!selectedVenueId) return null;
    return venues.find((v) => v.id === selectedVenueId) || null;
  }, [venues, selectedVenueId]);

  // Gestion du glisser / déposer de la carte
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      centerPx: { ...centerPx },
    };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;
      const newX = dragStartRef.current.centerPx.x - dx;
      const newY = dragStartRef.current.centerPx.y - dy;
      const newCoords = unproject(newX, newY, zoom);
      setCenter(newCoords);
    },
    [isDragging, zoom]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0 && zoom < 17) {
      setZoom((z) => Math.min(z + 1, 17));
    } else if (e.deltaY > 0 && zoom > 11) {
      setZoom((z) => Math.max(z - 1, 11));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none bg-neutral-100 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* 1. Couche de tuiles OpenStreetMap / CARTO Voyager */}
      <div className="absolute inset-0 pointer-events-none">
        {tiles.map((tile) => (
          <div
            key={tile.key}
            style={{
              position: "absolute",
              left: `${tile.left}px`,
              top: `${tile.top}px`,
              width: "256px",
              height: "256px",
            }}
          >
            <Image
              src={tile.url}
              alt=""
              width={256}
              height={256}
              unoptimized
              loading="lazy"
              className="w-full h-full block object-cover"
            />
          </div>
        ))}
      </div>

      {/* 2. Couche des épingles / marqueurs */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map(({ venue, screenX, screenY, isVisible }) => {
          if (!isVisible) return null;
          const isSelected = selectedVenueId === venue.id;
          const isHovered = hoveredVenueId === venue.id;
          const isHighlighted = isSelected || isHovered;

          return (
            <div
              key={venue.id}
              style={{
                position: "absolute",
                left: `${screenX}px`,
                top: `${screenY}px`,
                transform: "translate(-50%, -100%)",
              }}
              className="pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => onSelectVenue?.(venue.id)}
                className={`relative flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md rounded-full border-2 ${
                  isHighlighted
                    ? "bg-primary-600 border-white text-white z-30 scale-110 shadow-lg ring-2 ring-primary-600/40"
                    : "bg-white border-primary-600 text-primary-600 hover:bg-primary-50 z-10"
                } ${isHighlighted ? "px-2.5 py-1" : "p-1.5"}`}
              >
                {isHighlighted ? (
                  <span className="text-xs font-bold whitespace-nowrap flex items-center gap-1">
                    <MapPin className="w-3 h-3 fill-white text-white shrink-0" />
                    <span>{venue.startingPrice}</span>
                  </span>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                )}
              </button>

              {/* Petite bulle indicative au survol si non sélectionné */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-neutral-950 text-white rounded-lg shadow-lg text-xs whitespace-nowrap z-40 pointer-events-none">
                  <span className="font-semibold">{venue.name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Carte flottante de prévisualisation (style Planity / Airbnb) si un salon est cliqué */}
      {activeVenue && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl shadow-xl border border-neutral-200/90 p-3 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            type="button"
            onClick={() => onSelectVenue?.("")}
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

      {/* 4. Commandes de zoom et recentrage */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-30">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 1, 17))}
          aria-label="Zoomer"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 1, 11))}
          aria-label="Dézoomer"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter(initialCenter);
            setZoom(initialZoom);
          }}
          aria-label="Recentrer la carte"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-xs text-neutral-800 hover:text-neutral-950 shadow-md border border-neutral-200/80 flex items-center justify-center transition-colors cursor-pointer mt-1"
        >
          <LocateFixed className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5. Attribution légale discrète OpenStreetMap / CARTO */}
      <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-white/80 text-[10px] text-neutral-500 z-10 pointer-events-none">
        © OpenStreetMap © CARTO
      </div>
    </div>
  );
}
