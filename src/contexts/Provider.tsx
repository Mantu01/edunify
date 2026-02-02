'use client'

import { Suspense, ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { UserProvider } from './user-context';
import { ChatProvider } from './chat-context';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </UserProvider>
      </AuthProvider>
    </Suspense>
  );
}
