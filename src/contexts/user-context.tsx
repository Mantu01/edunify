'use client'

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserRole } from "@/lib/constants";

interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  profilePic?: string;
  banner?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  uploadProfilePic: (file: File) => Promise<void>;
  uploadBanner: (file: File) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      setUser(null);
      if (error instanceof Error) {
        console.error('Error fetching user:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>): Promise<void> => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update user' }));
        throw new Error(errorData.error || 'Failed to update user');
      }

      const result = await response.json();
      if (result.user) {
        setUser(result.user);
        toast.success('Profile updated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update profile');
      } else {
        toast.error('Failed to update profile');
      }
      throw error;
    }
  }, []);

  const uploadProfilePic = useCallback(async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await fetch('/api/user/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload' }));
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }

      const result = await response.json();
      if (result.user) {
        setUser(result.user);
        toast.success('Profile picture updated');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload profile picture');
      }
      throw error;
    }
  }, []);

  const uploadBanner = useCallback(async (file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('banner', file);

      const response = await fetch('/api/user/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload' }));
        throw new Error(errorData.error || 'Failed to upload banner');
      }

      const result = await response.json();
      if (result.user) {
        setUser(result.user);
        toast.success('Banner updated');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to upload banner');
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to logout');
      } else {
        toast.error('Failed to logout');
      }
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
    
    const handleAuthSuccess = (): void => {
      fetchUser();
    };
    
    window.addEventListener('auth-success', handleAuthSuccess);
    
    return () => {
      window.removeEventListener('auth-success', handleAuthSuccess);
    };
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{
      user,
      isLoading,
      fetchUser,
      updateUser,
      uploadProfilePic,
      uploadBanner,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
