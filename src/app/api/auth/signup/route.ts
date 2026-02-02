import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import User from '@/models/User';
import { signupSchema } from '@/lib/schema';
import jwt from 'jsonwebtoken';
import { setCookieResponse } from '@/lib/cookies';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = signupSchema.parse(body);

    let existingUser;
    try {
      existingUser = await User.findOne({
        $or: [
          { email: validatedData.email.toLowerCase() },
          { username: validatedData.username }
        ]
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { error: 'Failed to check user existence' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    let user;
    try {
      user = new User({
        email: validatedData.email.toLowerCase(),
        username: validatedData.username,
        password: validatedData.password,
        role: validatedData.role
      });

      await user.save();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 400 }
        );
      }
      throw error;
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
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role
        }
      },
      { status: 201 }
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

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
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
