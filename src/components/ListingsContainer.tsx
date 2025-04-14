"use client";

import { useState } from "react";
import { ListingCard } from "./ListingCard";

interface ListingsContainerProps {
  className?: string;
  onListingHover?: (listingId: string | null) => void;
}

export function ListingsContainer({
  className = "",
  onListingHover,
}: ListingsContainerProps) {
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  // Mock data - in a real app this would come from an API
  const listings = [
    {
      id: 1,
      title: "Room in Mississauga",
      host: "Laura",
      hostingYears: 8,
      description: "Private room with a walk out to a nice patio",
      price: 56,
      currency: "CAD",
      rating: 4.96,
      reviews: 46,
      images: [],
      isFavorite: true,
    },
    {
      id: 2,
      title: "Room in Mississauga",
      host: "Manuel",
      hostingYears: 8,
      description: "Cozy clean room near downtown Mississauga!",
      price: 48,
      currency: "CAD",
      rating: 4.85,
      reviews: 62,
      images: [],
      isFavorite: false,
    },
    // Add more mock listings as needed
  ];

  const handleListingHover = (listingId: string | null) => {
    setHoveredListingId(listingId);
    onListingHover?.(listingId);
  };

  return (
    <div className={`p-6 ${className}`}>
      <h1 className="text-sm font-semibold mb-6">
        Over 1,000 places within map area
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            {...listing}
            isHovered={hoveredListingId === `listing-${listing.id}`}
            onMouseEnter={() => handleListingHover(`listing-${listing.id}`)}
            onMouseLeave={() => handleListingHover(null)}
          />
        ))}
      </div>
    </div>
  );
}
