"use client";

import { useState } from "react";
import { ListingCard } from "./ListingCard";
import { Activity } from "@/lib/types/activity";

interface ListingsContainerProps {
  className?: string;
  onListingHover?: (listingId: string | null) => void;
  activities: Activity[];
}

export function ListingsContainer({
  className = "",
  onListingHover,
  activities,
}: ListingsContainerProps) {
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  const handleListingHover = (listingId: string | null) => {
    setHoveredListingId(listingId);
    onListingHover?.(listingId);
  };

  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-xl font-semibold mb-2">Activities</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {activities.length > 0
          ? `${activities.length} activities within map area`
          : "No activities found in this area"}
      </p>

      {activities.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            No activities found in the current map area.
          </p>
          <p className="text-sm mt-2">
            Try moving the map to discover more activities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity, index) => (
            <ListingCard
              key={activity.id}
              activity={activity}
              isHovered={hoveredListingId === `listing-${index}`}
              onMouseEnter={() => handleListingHover(`listing-${index}`)}
              onMouseLeave={() => handleListingHover(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
