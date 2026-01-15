/**
 * API Route: Search Ticketmaster Events
 * GET /api/events/search
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchEvents, SearchEventsParams } from '@/lib/ticketmaster-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build search parameters from query string
    const params: SearchEventsParams = {
      keyword: searchParams.get('keyword') || undefined,
      city: searchParams.get('city') || undefined,
      stateCode: searchParams.get('stateCode') || undefined,
      countryCode: searchParams.get('countryCode') || undefined,
      startDateTime: searchParams.get('startDateTime') || undefined,
      endDateTime: searchParams.get('endDateTime') || undefined,
      classificationName: searchParams.get('classificationName') || 'Music',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 0,
      size: searchParams.get('size') ? parseInt(searchParams.get('size')!) : 20,
      sort: (searchParams.get('sort') as any) || 'date,asc',
    };

    // Search events via Ticketmaster client
    const result = await searchEvents(params);

    // Return results with cache headers
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/events/search:', error);

    return NextResponse.json(
      {
        error: 'Failed to search events',
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
