import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: 'student' | 'teacher' | 'founder';
  isVerified: boolean;
  profilePic:string;
  banner:string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [6, 'Username must be at least 6 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'founder'],
      required: [true, 'Role is required']
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profilePic: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
