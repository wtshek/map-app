"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  id: number;
  title: string;
  host: string;
  hostingYears: number;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  images: string[];
  isFavorite: boolean;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ListingCard({
  title,
  host,
  hostingYears,
  description,
  price,
  currency,
  rating,
  reviews,
  images,
  isFavorite,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ListingCardProps) {
  return (
    <Card
      className={cn(
        "group relative border-0 space-y-4 transition-all duration-200",
        isHovered && "ring-2 ring-primary shadow-lg"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image carousel */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90",
              isFavorite && "text-red-600"
            )}
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </Button>
        </div>
        {/* <Image
          src={images[0]}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        /> */}
        {/* Image navigation dots would go here */}
      </div>

      {/* Listing details */}
      <div className="space-y-2 px-1">
        <div className="flex justify-between">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center gap-1">
            <span>★</span>
            <span>{rating}</span>
            <span className="text-gray-500">({reviews})</span>
          </div>
        </div>
        <p className="text-gray-500">
          Stay with {host} · Hosting for {hostingYears} years
        </p>
        <p className="text-gray-500">{description}</p>
        <p className="font-semibold">
          {currency} {price} <span className="font-normal">night</span>
        </p>
      </div>
    </Card>
  );
}
