'use client'

import { createContext, ReactNode, useContext } from "react";

interface ChatContextType{

}

const ChatContext=createContext<ChatContextType|undefined>(undefined);

export const ChatProvider=({ children }: { children: ReactNode }) => {

  return (
    <ChatContext.Provider value={{

    }} >
      {children}
    </ChatContext.Provider>
  );
};

export function useChat():ChatContextType{
  const context=useContext(ChatContext);
  if(!context){
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}