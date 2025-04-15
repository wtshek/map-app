export const PATH = {
  APP_HOMEPAGE: "/",
  API: {
    ACTIVITIES: {
      BASE: () => "/api/activities",
      BY_ID: (id: string) => `/api/activities/${id}`,
      BY_USER: (userId: string) => `/api/activities/user/${userId}`,
      IN_BOUNDS: (ne: string, sw: string) => `/api/activities?ne=${ne}&sw=${sw}`,
    },
  },
};
