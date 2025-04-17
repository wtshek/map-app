"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Activity } from "@/lib/types/activity";

// Initialize Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapProps {
  className?: string;
  activities: Activity[];
  hoveredListingId?: string | null;
  onBoundsChange: (bounds: mapboxgl.LngLatBounds) => void;
}

export default function Map({
  className = "",
  activities,
  hoveredListingId,
  onBoundsChange,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize a reusable popup that will be used for all markers
  useEffect(() => {
    // Create a popup, but don't add it to the map yet
    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      className: "marker-popup",
      anchor: "bottom",
    });
  }, []);

  // Update markers when activities change
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || !activities.length) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    activities.forEach((activity, index) => {
      // Create marker element
      const markerElement = document.createElement("div");
      markerElement.className = "marker";

      // Apply hover state if this marker corresponds to the hovered listing
      if (hoveredListingId === `listing-${index}`) {
        markerElement.classList.add("hovered");
      }

      // Add data attribute for identification
      markerElement.setAttribute("data-listing-id", `listing-${index}`);

      // Create and add the marker
      const marker = new mapboxgl.Marker({
        element: markerElement,
        anchor: "center",
      })
        .setLngLat([activity.coordinates.lng, activity.coordinates.lat])
        .addTo(currentMap);

      // Add mouse click event
      markerElement.addEventListener("click", () => {
        // Change cursor style
        currentMap.getCanvas().style.cursor = "pointer";

        // Set popup content and position it at the marker
        if (popup.current) {
          popup.current
            .setLngLat([activity.coordinates.lng, activity.coordinates.lat])
            .setHTML(
              `<div class="popup-content">
                <h3 class="font-semibold text-lg">${activity.name}</h3>
                <div class="popup-category mb-1">
                  <span class="text-xs uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">${
                    activity.category
                  }</span>
                </div>
                <div class="popup-description my-2 text-sm">
                  ${activity.description.substring(0, 80)}${
                activity.description.length > 80 ? "..." : ""
              }
                </div>
                <div class="popup-details grid grid-cols-2 gap-1 text-xs mt-2">
                  <div class="popup-location text-muted-foreground">
                    📍 ${activity.locationName || "Unknown location"}
                  </div>
                  <div class="popup-date text-muted-foreground text-right">
                    🗓️ ${new Date(activity.date).toLocaleDateString()}
                  </div>
                  <div class="popup-participants text-muted-foreground">
                    👥 ${activity.participantIds.length}/${
                activity.maxParticipants
              } participants
                  </div>
                  <div class="popup-time text-muted-foreground text-right">
                    🕒 ${new Date(activity.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div class="popup-actions mt-3">
                  <button class="view-details-btn" data-activity-id="${
                    activity.id
                  }">View Details</button>
                </div>
              </div>`
            )
            .addTo(currentMap);

          // Add active class for animation
          const popupElement = popup.current.getElement();
          if (popupElement) {
            popupElement.classList.add("active");

            // Add event listener to keep popup open when hovering over it
            popupElement.addEventListener("mouseenter", () => {
              popupElement.classList.add("popup-hovered");
            });

            popupElement.addEventListener("mouseleave", () => {
              popupElement.classList.remove("popup-hovered");
            });
          }

          // Add event listener to the view details button
          setTimeout(() => {
            const detailsButton = document.querySelector(
              `.view-details-btn[data-activity-id="${activity.id}"]`
            );
            if (detailsButton) {
              detailsButton.addEventListener("click", (e) => {
                e.stopPropagation();
                // This would typically navigate to a details page
                console.log(`View details for activity ${activity.id}`);
                // Example of how you could navigate:
                // window.location.href = `/activities/${activity.id}`;
              });
            }
          }, 100);
        }
      });

      markers.current.push(marker);
    });
  }, [activities, hoveredListingId]);

  // Effect to handle highlighting markers when listings are hovered
  useEffect(() => {
    if (!hoveredListingId) {
      // Remove highlight from all markers
      markers.current.forEach((marker) => {
        const markerElement = marker.getElement();
        markerElement.classList.remove("hovered");
      });
      return;
    }

    // Find and highlight the marker corresponding to the hovered listing
    markers.current.forEach((marker) => {
      const markerElement = marker.getElement();
      const markerListingId = markerElement.getAttribute("data-listing-id");

      if (markerListingId === hoveredListingId) {
        markerElement.classList.add("hovered");
        // Center map on hovered marker for better user experience
        const currentMap = map.current;
        if (currentMap) {
          currentMap.easeTo({
            center: marker.getLngLat(),
            duration: 500,
          });

          // Show popup for the hovered marker
          if (popup.current) {
            const coords = marker.getLngLat();
            const activity = activities.find(
              (_, index) => `listing-${index}` === hoveredListingId
            );

            if (activity) {
              popup.current
                .setLngLat(coords)
                .setHTML(
                  `<div class="popup-content">
                    <h3 class="font-semibold text-lg">${activity.name}</h3>
                    <div class="popup-category mb-1">
                      <span class="text-xs uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">${
                        activity.category
                      }</span>
                    </div>
                    <div class="popup-description my-2 text-sm">
                      ${activity.description.substring(0, 80)}${
                    activity.description.length > 80 ? "..." : ""
                  }
                    </div>
                    <div class="popup-details grid grid-cols-2 gap-1 text-xs mt-2">
                      <div class="popup-location text-muted-foreground">
                        📍 ${activity.locationName || "Unknown location"}
                      </div>
                      <div class="popup-date text-muted-foreground text-right">
                        🗓️ ${new Date(activity.date).toLocaleDateString()}
                      </div>
                      <div class="popup-participants text-muted-foreground">
                        👥 ${activity.participantIds.length}/${
                    activity.maxParticipants
                  } participants
                      </div>
                      <div class="popup-time text-muted-foreground text-right">
                        🕒 ${new Date(activity.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div class="popup-actions mt-3">
                      <button class="view-details-btn" data-activity-id="${
                        activity.id
                      }">View Details</button>
                    </div>
                  </div>`
                )
                .addTo(currentMap);

              // Add active class for animation
              const popupElement = popup.current.getElement();
              if (popupElement) {
                popupElement.classList.add("active");
              }
            }
          }
        }
      } else {
        markerElement.classList.remove("hovered");
      }
    });
  }, [hoveredListingId, activities]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          if (mapContainer.current) {
            const currentMap = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v12",
              center: [longitude, latitude],
              zoom: 12,
              attributionControl: false,
            });
            map.current = currentMap;

            currentMap.on("load", () => {
              currentMap.addControl(
                new mapboxgl.NavigationControl(),
                "top-right"
              );

              const bounds = currentMap.getBounds();
              if (bounds) {
                onBoundsChange(bounds);
              }

              currentMap.on("moveend", () => {
                const newBounds = currentMap.getBounds();
                if (newBounds) {
                  onBoundsChange(newBounds);
                }
              });
            });
          }
        },
        () => {
          setError("Unable to retrieve your location");
          if (mapContainer.current) {
            const currentMap = new mapboxgl.Map({
              container: mapContainer.current,
              style: "mapbox://styles/mapbox/streets-v12",
              center: [-74.5, 40],
              zoom: 9,
              attributionControl: false,
            });
            map.current = currentMap;
            currentMap.addControl(
              new mapboxgl.NavigationControl(),
              "top-right"
            );
            currentMap.on("load", () => {
              const bounds = currentMap.getBounds();
              if (bounds) {
                onBoundsChange(bounds);
              }
              currentMap.on("moveend", () => {
                const newBounds = currentMap.getBounds();
                if (newBounds) {
                  onBoundsChange(newBounds);
                }
              });
            });
          }
        }
      );

      return;
    }
    setError("Geolocation is not supported by your browser");
    if (mapContainer.current) {
      const currentMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-74.5, 40],
        zoom: 9,
        attributionControl: false,
      });
      map.current = currentMap;
      currentMap.addControl(new mapboxgl.NavigationControl(), "top-right");
      currentMap.on("load", () => {
        const bounds = currentMap.getBounds();
        if (bounds) {
          onBoundsChange(bounds);
        }
        currentMap.on("moveend", () => {
          const newBounds = currentMap.getBounds();
          if (newBounds) {
            onBoundsChange(newBounds);
          }
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [onBoundsChange]);

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
