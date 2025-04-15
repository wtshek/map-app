import { NextRequest, NextResponse } from 'next/server';
import { getActivitiesByUser } from '@/lib/services/activityService';
import { ActivityResponse } from '@/lib/types/activity';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = req.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const currentUserId = decodedToken.uid;

    const activities = await getActivitiesByUser(params.userId);

    // Filter out private activities if the user is not the owner
    const filteredActivities = activities.filter(
      activity => activity.isPublic || activity.userId === currentUserId
    );

    const response: ActivityResponse = {
      status: 200,
      message: 'User activities fetched successfully',
      data: filteredActivities
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
} 