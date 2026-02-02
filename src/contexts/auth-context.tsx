'use client'

import { LoginSchemaType, SignupSchemaType } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Provider } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

interface AuthContextType {
  isLoading: boolean;
  verificationPending: boolean;
  showError: boolean;
  handleSubmit: (data: LoginSchemaType | SignupSchemaType, mode: 'login' | 'signup') => Promise<void>;
  loadingStates: Record<string, boolean>;
  handleSocialLogin: (provider: Provider) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationPending, setVerificationPending] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const err = searchParams?.get('err') || null;

  useEffect(() => {
    try {
      if (err === 'not-found') {
        setShowError(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error in useEffect:', error.message);
      }
    }
  }, [err]);

  const handleSocialLogin = useCallback(async (provider: Provider): Promise<void> => {
    try {
      setLoadingStates(prev => ({ ...prev, [provider]: true }));
      toast.info(`${provider} login coming soon`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Something went wrong during authentication.");
      } else {
        toast.error("Something went wrong during authentication.");
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [provider]: false }));
    }
  }, []);

  const handleSubmit = useCallback(async (data: LoginSchemaType | SignupSchemaType, mode: 'login' | 'signup'): Promise<void> => {
    setIsLoading(true);
    setShowError(false);
    
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({ error: 'Failed to parse response' }));

      if (!response.ok) {
        setShowError(true);
        toast.error(result.error || 'An error occurred');
        return;
      }

      toast.success(result.message || (mode === 'login' ? 'Login successful' : 'Account created successfully'));
      
      try {
        window.dispatchEvent(new CustomEvent('auth-success'));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error dispatching auth-success event:', error.message);
        }
      }

      router.push(`/chat`);
    } catch (error: unknown) {
      setShowError(true);
      if (error instanceof Error) {
        toast.error(error.message || 'Network error. Please try again.');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{
      handleSubmit,
      isLoading,
      verificationPending,
      showError,
      handleSocialLogin,
      loadingStates
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
