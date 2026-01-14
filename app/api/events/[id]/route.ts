/**
 * API Route: Get Event by ID
 * GET /api/events/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/lib/ticketmaster-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Get event from Ticketmaster
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Return event with cache headers
    return NextResponse.json(event, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error: any) {
    console.error(`Error in /api/events/:`, error);

    return NextResponse.json(
      {
        error: 'Failed to fetch event',
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
