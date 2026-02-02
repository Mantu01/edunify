import { NextRequest, NextResponse } from 'next/server';
import { deleteCookieResponse } from '@/lib/cookies';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    return deleteCookieResponse(response, 'token');
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to logout' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
