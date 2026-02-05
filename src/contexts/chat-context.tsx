import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

type Sender = "user" | "ai";

export interface ChatMessage {
  id: string;
  text: string;
  sender: Sender;
  timestamp: string;
}

interface RecentChat {
  id: string;
  header: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatFormData {
  topic: string;
  knowledgeLevel: string;
  category: string;
  details: string;
}

interface ChatContextValue {
  isChatStarted: boolean;
  messages: ChatMessage[];
  inputMessage: string;
  formData: ChatFormData;
  recentChats: RecentChat[];
  activeChatId: string | null;
  isSending: boolean;
  setInputMessage: (value: string) => void;
  updateFormData: (data: Partial<ChatFormData>) => void;
  startChat: () => Promise<void>;
  sendMessage: () => Promise<void>;
  selectChat: (id: string) => Promise<void>;
  newChat: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createTimestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [formData, setFormData] = useState<ChatFormData>({
    topic: "",
    knowledgeLevel: "",
    category: "",
    details: "",
  });
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const updateFormData = useCallback((data: Partial<ChatFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const newChat = useCallback(() => {
    setIsChatStarted(false);
    setMessages([]);
    setInputMessage("");
    setFormData({
      topic: "",
      knowledgeLevel: "",
      category: "",
      details: "",
    });
    setActiveChatId(null);
  }, []);

  const fetchRecentChats = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", { method: "GET" });
      if (!res.ok) return;
      const data = await res.json();
      const items: RecentChat[] = Array.isArray(data.chats)
        ? data.chats.map((c: any) => ({
            id: String(c.id),
            header: String(c.header ?? "Untitled"),
            createdAt: c.createdAt ?? "",
            updatedAt: c.updatedAt ?? "",
          }))
        : [];
      setRecentChats(items);
    } catch {
    }
  }, []);

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  const loadChat = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/chat?chat=${id}`, { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        const chat = data.chat;
        if (!chat) return;
        const mapped: ChatMessage[] = Array.isArray(chat.messages)
          ? chat.messages
              .filter((m: any) => m.role !== "SYSTEM")
              .map((m: any) => {
                const sender: Sender = m.role === "USER" ? "user" : "ai";
                return {
                  id: createId(),
                  text: String(m.content ?? ""),
                  sender,
                  timestamp: createTimestamp(),
                };
              })
          : [];
        setMessages(mapped);
        setIsChatStarted(true);
        setActiveChatId(String(chat._id));
      } catch {
      }
    },
    []
  );

  const appendUserMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: createId(),
      text,
      sender: "user",
      timestamp: createTimestamp(),
    };
    setMessages((prev) => [...prev, message]);
    return message.id;
  }, []);

  const appendStreamingMessage = useCallback(() => {
    const message: ChatMessage = {
      id: createId(),
      text: "",
      sender: "ai",
      timestamp: createTimestamp(),
    };
    setMessages((prev) => [...prev, message]);
    return message.id;
  }, []);

  const updateStreamingMessage = useCallback((id: string, chunk: string, done?: boolean) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              text: m.text + chunk,
              timestamp: done ? createTimestamp() : m.timestamp,
            }
          : m
      )
    );
  }, []);

  const sendToApi = useCallback(
    async (content: string, isNewChat: boolean, isInitialization: boolean = false) => {
      const url = isNewChat || !activeChatId ? "/api/chat" : `/api/chat?chat=${activeChatId}`;

      const body: any = { content };
      if (isInitialization) {
        body.topic = formData.topic;
        body.knowledgeLevel = formData.knowledgeLevel;
        body.category = formData.category;
        body.details = formData.details;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok || !res.body) {
        return;
      }

      const newId = res.headers.get("X-Chat-Id");
      if (newId) {
        setActiveChatId(newId);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const streamingId = appendStreamingMessage();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            updateStreamingMessage(streamingId, "", true);
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            updateStreamingMessage(streamingId, chunk);
          }
        }
      } finally {
        reader.releaseLock();
      }

      fetchRecentChats();
    },
    [activeChatId, appendStreamingMessage, fetchRecentChats, formData, updateStreamingMessage]
  );

  const startChat = useCallback(async () => {
    if (!formData.topic || !formData.knowledgeLevel) {
      return;
    }
    if (isSending) {
      return;
    }
    setIsSending(true);
    try {
      newChat();
      setIsChatStarted(true);
      await sendToApi("", true, true);
    } finally {
      setIsSending(false);
    }
  }, [formData, isSending, newChat, sendToApi]);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) {
      return;
    }
    if (isSending) {
      return;
    }
    const content = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);
    try {
      appendUserMessage(content);
      setIsChatStarted(true);
      await sendToApi(content, false);
    } finally {
      setIsSending(false);
    }
  }, [appendUserMessage, inputMessage, isSending, sendToApi]);

  const selectChat = useCallback(
    async (id: string) => {
      if (!id) return;
      await loadChat(id);
    },
    [loadChat]
  );

  const value: ChatContextValue = {
    isChatStarted,
    messages,
    inputMessage,
    formData,
    recentChats,
    activeChatId,
    isSending,
    setInputMessage,
    updateFormData,
    startChat,
    sendMessage,
    selectChat,
    newChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
}