export type ActivityCategory =
  | "sports"
  | "social"
  | "education"
  | "entertainment"
  | "food"
  | "travel"
  | "other";

export interface ActivityLocation {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface ActivityFormData {
  title: string;
  description: string;
  dateTime: Date;
  location: ActivityLocation;
  category: ActivityCategory;
}

export interface Activity extends ActivityFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
