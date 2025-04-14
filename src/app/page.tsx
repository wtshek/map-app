"use client";

import { Header } from "@/components/Header";
import { ListingsContainer } from "@/components/ListingsContainer";
import Map from "@/components/Map";
import { useState } from "react";

export default function Home() {
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <ListingsContainer
          className="w-[60%] overflow-y-auto"
          onListingHover={setHoveredListingId}
        />
        <Map className="w-[40%] relative" hoveredListingId={hoveredListingId} />
      </div>
    </main>
  );
}
