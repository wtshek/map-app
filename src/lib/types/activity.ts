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

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  category: ActivityCategory;
  date: string;
  maxParticipants: number;
  isPublic: boolean;
  userId: string;
  participantIds: string[];
  createdAt: Date;
  lastEditAt: string;
}

export interface CreateActivityInput {
  name: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  category: ActivityCategory;
  date: string;
  maxParticipants: number;
  isPublic: boolean;
}

export interface UpdateActivityInput {
  name?: string;
  description?: string;
  locationName?: string;
  coordinates?: Coordinates;
  category?: ActivityCategory;
  date?: string;
  maxParticipants?: number;
  isPublic?: boolean;
}

export interface ActivityResponse {
  status: number;
  message: string;
  data: Activity | Activity[] | null;
}
