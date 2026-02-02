import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getCookieFromRequest } from './cookies';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'teacher' | 'founder';
}

export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = getCookieFromRequest(request, 'token');
    
    if (!token) {
      return null;
    }

    if (!process.env.JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: unknown) {
    return null;
  }
}
