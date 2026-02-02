import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import User from '@/models/User';
import { loginSchema } from '@/lib/schema';
import jwt from 'jsonwebtoken';
import { setCookieResponse } from '@/lib/cookies';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await User.findOne({ email: validatedData.email.toLowerCase() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.role !== validatedData.role) {
      return NextResponse.json(
        { error: `Invalid role. This account is registered as ${user.role}` },
        { status: 403 }
      );
    }

    let isPasswordValid = false;
    try {
      isPasswordValid = await user.comparePassword(validatedData.password);
    } catch (error: unknown) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    let token: string;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
      }
      token = jwt.sign(
        { userId: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (error: unknown) {
      return NextResponse.json(
        { error: 'Failed to generate authentication token' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    );

    return setCookieResponse(response, 'token', token);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      const zodError = error as { errors?: Array<{ message?: string }> };
      const firstError = zodError.errors?.[0];
      return NextResponse.json(
        { error: firstError?.message || 'Validation error' },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
