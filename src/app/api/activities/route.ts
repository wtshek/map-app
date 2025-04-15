import { NextRequest, NextResponse } from 'next/server';
import { createActivity, getActivitiesInBounds } from '@/lib/services/activityService';
import { CreateActivityInput, ActivityResponse } from '@/lib/types/activity';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const input = body as CreateActivityInput;

    const activity = await createActivity(input, userId);

    const response: ActivityResponse = {
      status: 201,
      message: 'Activity created successfully',
      data: activity
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const ne = searchParams.get('ne');
    const sw = searchParams.get('sw');

    if (!ne || !sw) {
      return NextResponse.json(
        { status: 400, message: 'Missing required parameters', data: null },
        { status: 400 }
      );
    }

    const [neLat, neLng] = ne.split(',').map(Number);
    const [swLat, swLng] = sw.split(',').map(Number);

    const activities = await getActivitiesInBounds(
      { lat: neLat, lng: neLng },
      { lat: swLat, lng: swLng },
      userId
    );

    const response: ActivityResponse = {
      status: 200,
      message: 'Activities fetched successfully',
      data: activities
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { status: 500, message: 'Internal server error', data: null },
      { status: 500 }
    );
  }
} 