"use client";
import React, { useEffect, useRef } from "react";

const MapComponent = ({ items = [], onMarkerClick, center = [23.8103, 90.4125], zoom = 12 }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapContainerRef.current).setView(center, zoom);

      // Add OpenStreetMap tiles
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    const L = window.L;

    // Clear old markers
    markersRef.current.forEach((marker) => mapInstanceRef.current.removeLayer(marker));
    markersRef.current = [];

    // Add new markers
    items.forEach((item) => {
      const lat = item.latitude || center[0];
      const lng = item.longitude || center[1];

      // Custom popup content
      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; font-weight: bold; color: #1e293b;">${item.title}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">${item.location}</p>
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #3b82f6; background-color: #dbeafe; padding: 2px 6px; border-radius: 4px;">${item.category}</span>
        </div>
      `;

      const marker = L.marker([lat, lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(popupContent);

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(item));
      }

      markersRef.current.push(marker);
    });

    return () => {
      // Clean up map instance on unmount
      if (mapInstanceRef.current) {
        // mapInstanceRef.current.remove();
        // mapInstanceRef.current = null;
      }
    };
  }, [items, center, zoom]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-slate-100/50 relative z-10"
      style={{ minHeight: "400px" }}
    />
  );
};

export default MapComponent;
