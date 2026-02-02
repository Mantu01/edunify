import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

interface UpdateUserBody {
  username?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        profilePic: user.profilePic || '',
        banner: user.banner || '',
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error: any) {
    console.error('GET /api/user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateUserBody = await request.json().catch(() => ({}));
    const { username } = body;

    const updateData: any = {};

    if (username) {
      if (typeof username !== 'string' || username.trim().length === 0) {
        return NextResponse.json(
          { error: 'Username must be a non-empty string' },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({
        username: username.trim(),
        _id: { $ne: payload.userId }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }

      updateData.username = username.trim();
    }

    const user = await User.findByIdAndUpdate(
      payload.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
        profilePic: user.profilePic || '',
        banner: user.banner || '',
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error: any) {
    console.error('PUT /api/user error:', error);
    
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0] as any;
      return NextResponse.json(
        { error: firstError?.message || 'Validation error' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
