'use client'

import { Suspense, ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { RoomProvider } from './room-context';
import { ClerkProvider } from '@clerk/nextjs';
import { components } from '@/lib/tambo';
import { TamboProvider } from '@tambo-ai/react';

export default function Provider({ children,userToken }: { children: ReactNode, userToken?: string; }) {
  return (
    <Suspense fallback={null}>
      <ClerkProvider>
        <TamboProvider components={components} userToken={userToken} apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}>
          <AuthProvider>
            <RoomProvider>
              {children}
            </RoomProvider>
          </AuthProvider>
        </TamboProvider>
      </ClerkProvider>
    </Suspense>
  );
}
