import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function getCookie(name: string): string | undefined {
  if (typeof window !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
  }
  return undefined;
}

export async function getCookieServer(name: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof window !== 'undefined') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${process.env.NODE_ENV === 'production' ? ';Secure' : ''}`;
  }
}

export function deleteCookie(name: string): void {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

export function setCookieResponse(
  response: NextResponse,
  name: string,
  value: string,
  options?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
  }
): NextResponse {
  response.cookies.set(name, value, {
    httpOnly: options?.httpOnly ?? true,
    secure: options?.secure ?? process.env.NODE_ENV === 'production',
    sameSite: options?.sameSite ?? 'lax',
    maxAge: options?.maxAge ?? 60 * 60 * 24 * 7,
  });
  return response;
}

export function deleteCookieResponse(response: NextResponse, name: string): NextResponse {
  response.cookies.delete(name);
  return response;
}

export function getCookieFromRequest(request: NextRequest, name: string): string | undefined {
  return request.cookies.get(name)?.value;
}
