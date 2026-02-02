import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/media';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const profilePicFile = formData.get('profilePic') as File | null;
    const bannerFile = formData.get('banner') as File | null;

    const updateData: any = {};

    if (profilePicFile) {
      const bytes = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await uploadToCloudinary(buffer,{folder:'profile',resource_type:'image'}) as any;
      if (!result || !result.secure_url) {
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
      updateData.profilePic = result.secure_url;
    }

    if (bannerFile) {
      const bytes = await bannerFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await uploadToCloudinary(buffer,{folder:'banner',resource_type:'image'}) as any;
      if (!result || !result.secure_url) {
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
      updateData.banner = result.secure_url;
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
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
