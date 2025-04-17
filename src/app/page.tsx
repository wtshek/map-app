"use client";

import { Header } from "@/components/Header";
import { ListingsContainer } from "@/components/ListingsContainer";
import Map from "@/components/Map";
import { useState, useEffect } from "react";
import { PATH } from "@/lib/constants/path";
import { Activity } from "@/lib/types/activity";

export default function Home() {
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mapBounds, setMapBounds] = useState<mapboxgl.LngLatBounds | null>(
    null
  );

  const fetchActivities = async (bounds: mapboxgl.LngLatBounds) => {
    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const response = await fetch(
        PATH.API.ACTIVITIES.IN_BOUNDS(
          `${ne.lat},${ne.lng}`,
          `${sw.lat},${sw.lng}`
        )
      );
      const data = await response.json();
      if (data.status === 200) {
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Fetch activities when map bounds change
  useEffect(() => {
    if (mapBounds) {
      fetchActivities(mapBounds);
    }
  }, [mapBounds]);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <ListingsContainer
          className="w-[60%] overflow-y-auto"
          onListingHover={setHoveredListingId}
          activities={activities}
        />
        <Map
          className="w-[40%] relative"
          hoveredListingId={hoveredListingId}
          activities={activities}
          onBoundsChange={setMapBounds}
        />
      </div>
    </main>
  );
}
