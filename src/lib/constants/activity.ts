import { ActivityCategory } from "../types/activity";

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string }[] =
  [
    { value: "sports", label: "Sports" },
    { value: "social", label: "Social" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "food", label: "Food & Dining" },
    { value: "travel", label: "Travel" },
    { value: "other", label: "Other" },
  ];
