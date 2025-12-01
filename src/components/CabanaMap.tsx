"use client";

import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Tooltip, useMap, Polygon } from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { motion } from "framer-motion";

const parkImageUrl = "/images/park-map.png";
const imageBounds: [[number, number], [number, number]] = [
  [0, 0],
  [1000, 1500],
];

// When map zoom is >= this value, we show cabanas instead of area markers
const CABANA_ZOOM_THRESHOLD = 2;

type LatLngPoint = [number, number];

interface Cabana {
  id: string;
  name: string;
  position: LatLngPoint;
  capacity?: number;
  price?: number;
}

interface Area {
  id: string;
  name: string;
  color: string;
  coordinates: LatLngPoint[];
  cabanas: Cabana[];
}

import areasData from '@/data/areas.json';
import CabanaDetailBox from "./CabanaDetailBox";
const areas: Area[] = areasData as unknown as Area[];

function FitBounds({ bounds }: { bounds: [[number, number], [number, number]] }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);
  return null;
}

function ZoomToBounds({ bounds, minZoom }: { bounds: LatLngPoint[]; minZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    const targetMin = minZoom ?? CABANA_ZOOM_THRESHOLD;
    try {
      const latBounds = L.latLngBounds(bounds as any);
      const center = latBounds.getCenter();
      // Fly to the center and ensure the zoom level reaches targetMin so cabanas become visible
      map.flyTo([center.lat, center.lng], targetMin, { animate: true, duration: 0.8 });
    } catch {
      // ignore
    }
  }, [map, bounds, minZoom]);
  return null;
}

// (centroid helper removed — polygons are used for area display)

// Observes map movements/zoom and toggles cabana visibility when the selected area's bounds
// are fully within the current map bounds (i.e., user has zoomed in on the area).
function MapObserver({
  selectedArea,
  onShowCabanas,
}: {
  selectedArea: Area | null;
  onShowCabanas: (v: boolean) => void;
}) {
  const map = useMap();
  // Use the shared threshold
  const threshold = CABANA_ZOOM_THRESHOLD;

  useEffect(() => {
    const check = () => {
      if (!selectedArea) {
        onShowCabanas(false);
        return;
      }
      try {
        const zoom = map.getZoom();
        onShowCabanas(zoom >= threshold);
      } catch {
        onShowCabanas(false);
      }
    };

    check();
    map.on('zoomend moveend', check);
    return () => {
      map.off('zoomend moveend', check);
    };
  }, [map, selectedArea, onShowCabanas]);
  return null;
}

export default function CabanaMap() {
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
  const [zoomToAll, setZoomToAll] = useState(false);
  const [showCabanas, setShowCabanas] = useState(false);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden shadow-lg"
      style={{ height: "600px" }}
    >
      <MapContainer
        {...({ bounds: imageBounds, crs: L.CRS.Simple } as any)}
        style={{ height: "100%", width: "100%" }}
        minZoom={-1}
      >
        <FitBounds bounds={imageBounds} />
        <MapObserver
          selectedArea={selectedArea}
          onShowCabanas={setShowCabanas}
        />
        <ImageOverlay url={parkImageUrl} bounds={imageBounds} />

        {/* When zoomed to an area */}
        {selectedArea && !zoomToAll && (
          <ZoomToBounds bounds={selectedArea.coordinates} />
        )}

        {/* Draw area markers (centered at each area's centroid) - hidden when cabanas are visible */}
        {/* {!showCabanas && areas.map((area) => {
          const centroid = getCentroid(area.coordinates);
          return (
            // Marker typing for the `icon` prop can be strict; ignore here
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <Marker
              key={area.id}
              position={centroid as unknown as LatLngExpression}
              icon={L.divIcon({
                html: `<div style="background:${
                  selectedArea?.id === area.id ? "gold" : area.color
                }; border:2px solid black; border-radius:50%; width:24px; height:24px;"></div>`,
              })}
              eventHandlers={{
                click: () => setSelectedArea(area),
              }}
            >
              <Tooltip>{area.name}</Tooltip>
            </Marker>
          );
        })} */}

        {!showCabanas &&
          areas.map((area) => {
            return (
              <Polygon
                key={area.id}
                positions={area.coordinates} // Use the coordinates array directly
                pathOptions={{
                  color: selectedArea?.id === area.id ? "gold" : area.color,
                  weight: 2,
                  fillOpacity: 0.5,
                }}
                eventHandlers={{
                  click: () => setSelectedArea(area),
                }}
              >
                <Tooltip>{area.name}</Tooltip>
              </Polygon>
            );
          })}

        {/* Show cabanas only when user is zoomed into the selected area */}
        {selectedArea &&
          showCabanas &&
          selectedArea.cabanas.map((cabana) => (
            // @ts-ignore for custom divIcon typing
            <Marker
              key={cabana.id}
              position={cabana.position as unknown as LatLngExpression}
              icon={L.divIcon({
                html: `<div style="background:${
                  selectedCabana?.id === cabana.id ? "gold" : "white"
                }; border:2px solid black; border-radius:50%; width:20px; height:20px; cursor:pointer; pointer-events:auto"></div>`,
              })}
              eventHandlers={{
                click: (e: any) => {
                  // stop map from also handling the click
                  try {
                    e?.originalEvent?.stopPropagation();
                  } catch {}
                  setSelectedCabana(cabana);
                },
              }}
            >
              <Tooltip>{cabana.name}</Tooltip>
            </Marker>
          ))}


          {/* Control Buttons */}
          {selectedArea && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="absolute top-3 left-3 bg-white px-3 py-1 rounded-md shadow text-sm font-medium"
              onClick={() => {
                setZoomToAll(true);
                setSelectedArea(null);
                setSelectedCabana(null);
                setTimeout(() => setZoomToAll(false), 500); // delay reset
              }}
            >
              ← Zoom Out
            </motion.button>
          )}
          <CabanaDetailBox
            selectedCabana={selectedCabana}
            setSelectedCabana={setSelectedCabana}
          />
      </MapContainer>

      
    </div>
  );
}
