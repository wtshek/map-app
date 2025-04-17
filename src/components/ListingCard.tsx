"use client";

import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Activity, ActivityCategory } from "@/lib/types/activity";

interface ListingCardProps {
  activity: Activity;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Helper function to get category icon or color
const getCategoryInfo = (category: ActivityCategory) => {
  return (
    {
      sports: {
        emoji: "🏃‍♂️",
        label: "Sports",
      },
      social: {
        emoji: "👥",
        label: "Social",
      },
      education: {
        emoji: "📚",
        label: "Education",
      },
      entertainment: {
        emoji: "🎭",
        label: "Entertainment",
      },
      food: {
        emoji: "🍽️",
        label: "Food",
      },
      travel: {
        emoji: "✈️",
        label: "Travel",
      },
      other: {
        emoji: "📌",
        label: "Other",
      },
    }[category] || { emoji: "📌", label: "Activity" }
  );
};

export function ListingCard({
  activity,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ListingCardProps) {
  const { emoji, label } = getCategoryInfo(activity.category);

  // Format date
  const date = new Date(activity.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card
      className={cn(
        "group relative border-0 space-y-4 transition-all duration-300 p-4",
        isHovered && "hovered"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{activity.name}</h3>
          <span className="text-2xl" title={label}>
            {emoji}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{activity.locationName}</p>
        <p className="text-sm">{activity.description}</p>

        <div className="flex justify-between items-center text-sm pt-2">
          <div>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div>
            <span className="bg-muted px-2 py-1 rounded-full text-xs">
              {activity.maxParticipants} participants max
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
