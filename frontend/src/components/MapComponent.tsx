"use client";
import React, { useEffect, useRef } from "react";

interface MapItem {
  latitude?: number;
  longitude?: number;
  title?: string;
  location?: string;
  category?: string;
}

interface MapComponentProps {
  items?: MapItem[];
  onMarkerClick?: (item: MapItem) => void;
  center?: [number, number];
  zoom?: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  items = [], 
  onMarkerClick, 
  center = [23.8103, 90.4125], 
  zoom = 12 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).L || !mapContainerRef.current) return;

    const L = (window as any).L;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView(center, zoom);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    markersRef.current.forEach((marker: any) => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    items.forEach((item) => {
      const lat = item.latitude || center[0];
      const lng = item.longitude || center[1];

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; padding: 4px;">
          <h4 style="margin: 0 0 4px 0; font-weight: 500;">${item.title || 'Location'}</h4>
          <p style="margin: 0 0 6px 0; color: #666;">${item.location || ''}</p>
          <span style="font-size: 10px; border: 1px solid #eaeaea; padding: 2px 4px; border-radius: 4px;">${item.category || 'Map Marker'}</span>
        </div>
      `;

      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: "#000",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(item));
      }

      markersRef.current.push(marker);
    });

    return () => {};
  }, [items, center, zoom, onMarkerClick]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-md border border-zinc-200 dark:border-zinc-800 relative z-10"
      style={{ minHeight: "300px" }}
    />
  );
};

export default MapComponent;
