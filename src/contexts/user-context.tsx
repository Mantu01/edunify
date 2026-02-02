'use client'

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";


interface UserContextType {
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider value={{}}>
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
