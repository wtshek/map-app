"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Initialize Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapProps {
  className?: string;
  hoveredListingId?: string | null;
}

export default function Map({
  className = "",
  hoveredListingId = null,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Animate marker when hoveredListingId changes
  useEffect(() => {
    if (!markers.current.length) return;

    markers.current.forEach((marker, index) => {
      const element = marker.getElement();
      if (hoveredListingId === `listing-${index}`) {
        element.classList.add("animate-bounce");
      } else {
        element.classList.remove("animate-bounce");
      }
    });
  }, [hoveredListingId]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          if (mapContainer.current) {
            // Initialize map with proper dimensions
            map.current = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v12",
              center: [longitude, latitude],
              zoom: 12,
              attributionControl: false,
            });

            // Wait for the map to load before adding controls and markers
            map.current.on("load", () => {
              // Add navigation controls
              map.current?.addControl(
                new mapboxgl.NavigationControl(),
                "top-right"
              );

              // Add dummy markers
              const dummyLocations = [
                {
                  name: "Central Park",
                  coordinates: [longitude + 0.01, latitude + 0.01] as [
                    number,
                    number
                  ],
                },
                {
                  name: "Downtown",
                  coordinates: [longitude - 0.01, latitude - 0.01] as [
                    number,
                    number
                  ],
                },
                {
                  name: "Waterfront",
                  coordinates: [longitude + 0.02, latitude - 0.02] as [
                    number,
                    number
                  ],
                },
              ];

              // Clear existing markers
              markers.current.forEach((marker) => marker.remove());
              markers.current = [];

              dummyLocations.forEach((location, index) => {
                const marker = new mapboxgl.Marker({ color: "#F9C74F" })
                  .setLngLat(location.coordinates)
                  .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                      `<h3>${location.name}</h3>`
                    )
                  )
                  .addTo(map.current!);

                // Store marker reference
                markers.current.push(marker);

                // Add data attribute for identification
                marker
                  .getElement()
                  .setAttribute("data-listing-id", `listing-${index}`);
              });
            });
          }
        },
        () => {
          setError("Unable to retrieve your location");
          // Fallback to default location if geolocation fails
          if (mapContainer.current) {
            map.current = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v12",
              center: [-74.5, 40], // Default center (New York)
              zoom: 9,
              attributionControl: false,
            });
            map.current.addControl(
              new mapboxgl.NavigationControl(),
              "top-right"
            );
          }
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      // Fallback to default location if geolocation is not supported
      if (mapContainer.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-74.5, 40], // Default center (New York)
          zoom: 9,
          attributionControl: false,
        });
        map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      }
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className={`w-full h-full ${className}`}
        style={{ minHeight: "400px" }}
      />
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
