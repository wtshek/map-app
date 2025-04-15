import { NextRequest, NextResponse } from 'next/server';
import { 
  getActivityById, 
  updateActivity, 
  deleteActivity 
} from '@/lib/services/activityService';
import { ActivityResponse, UpdateActivityInput } from '@/lib/types/activity';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { activityId: string } }
) {
  try {
    const session = req.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    const activity = await getActivityById(params.activityId);
    
    if (!activity) {
      return NextResponse.json(
        { status: 404, message: 'Activity not found', data: null },
        { status: 404 }
      );
    }


    const response: ActivityResponse = {
      status: 200,
      message: 'Activity fetched successfully',
      data: activity
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { activityId: string } }
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
    const userId = decodedToken.uid;

    const activity = await getActivityById(params.activityId);
    
    if (!activity) {
      return NextResponse.json(
        { status: 404, message: 'Activity not found', data: null },
        { status: 404 }
      );
    }

    if (activity.userId !== userId) {
      return NextResponse.json(
        { status: 403, message: 'Forbidden', data: null },
        { status: 403 }
      );
    }

    const body = await req.json();
    const input = body as UpdateActivityInput;

    const updatedActivity = await updateActivity(params.activityId, input);
    
    if (!updatedActivity) {
      return NextResponse.json(
        { status: 404, message: 'Activity not found', data: null },
        { status: 404 }
      );
    }

    const response: ActivityResponse = {
      status: 200,
      message: 'Activity updated successfully',
      data: updatedActivity
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { activityId: string } }
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
    const userId = decodedToken.uid;

    const activity = await getActivityById(params.activityId);
    
    if (!activity) {
      return NextResponse.json(
        { status: 404, message: 'Activity not found', data: null },
        { status: 404 }
      );
    }

    if (activity.userId !== userId) {
      return NextResponse.json(
        { status: 403, message: 'Forbidden', data: null },
        { status: 403 }
      );
    }

    await deleteActivity(params.activityId);

    const response: ActivityResponse = {
      status: 200,
      message: 'Activity deleted successfully',
      data: null
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
} 