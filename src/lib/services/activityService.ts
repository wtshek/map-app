import { adminDb } from '@/lib/firebase-admin';
import { 
  Activity, 
  CreateActivityInput, 
  UpdateActivityInput 
} from '@/lib/types/activity';

const ACTIVITIES_COLLECTION = 'activities';

export const createActivity = async (
  input: CreateActivityInput,
  userId: string
): Promise<Activity> => {
  const now = new Date();
  const activityData = {
    ...input,
    userId,
    participantIds: [],
    createdAt: now,
    lastEditAt: now
  };

  const docRef = await adminDb.collection(ACTIVITIES_COLLECTION).add(activityData);
  return {
    id: docRef.id,
    ...activityData
  } as unknown as Activity;
};

export const getActivityById = async (activityId: string): Promise<Activity | null> => {
  const docRef = adminDb.collection(ACTIVITIES_COLLECTION).doc(activityId);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Activity;
};

export const getActivitiesByUser = async (userId: string): Promise<Activity[]> => {
  const snapshot = await adminDb
    .collection(ACTIVITIES_COLLECTION)
    .where('userId', '==', userId)
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Activity[];
};

export const getActivitiesInBounds = async (
  ne: { lat: number; lng: number },
  sw: { lat: number; lng: number },
  userId: string
): Promise<Activity[]> => {
  const snapshot = await adminDb
    .collection(ACTIVITIES_COLLECTION)
    .where('coordinates.lat', '>=', sw.lat)
    .where('coordinates.lat', '<=', ne.lat)
    .where('coordinates.lng', '>=', sw.lng)
    .where('coordinates.lng', '<=', ne.lng)
    .get();

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as unknown as Activity))
    .filter(activity => 
      activity.isPublic || activity.userId === userId
    );
};

export const updateActivity = async (
  activityId: string,
  input: UpdateActivityInput
): Promise<Activity | null> => {
  const docRef = adminDb.collection(ACTIVITIES_COLLECTION).doc(activityId);
  const now = new Date().toISOString();
  
  await docRef.update({
    ...input,
    lastEditAt: now
  });

  const updatedDoc = await docRef.get();
  if (!updatedDoc.exists) {
    return null;
  }

  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  } as Activity;
};

export const deleteActivity = async (activityId: string): Promise<void> => {
  const docRef = adminDb.collection(ACTIVITIES_COLLECTION).doc(activityId);
  await docRef.delete();
}; 