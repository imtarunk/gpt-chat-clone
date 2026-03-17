import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  messages?: Message[];
}

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  setChats: (chats: Chat[]) => void;
  setCurrentChatId: (id: string | null) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  removeChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  updateMessage: (chatId: string, messageId: string, content: string) => void;
  getCurrentChat: () => Chat | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  currentChatId: null,

  setChats: (chats) => set({ chats }),

  setCurrentChatId: (currentChatId) => set({ currentChatId }),

  addChat: (chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
      currentChatId: chat.id,
    })),

  updateChat: (id, updates) =>
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c.id !== id),
      currentChatId: state.currentChatId === id ? null : state.currentChatId,
    })),

  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((c) => {
        if (c.id !== chatId) return c;
        const messages = [...(c.messages || []), message];
        return { ...c, messages };
      }),
    })),

  updateMessage: (chatId, messageId, content) =>
    set((state) => ({
      chats: state.chats.map((c) => {
        if (c.id !== chatId) return c;
        const messages = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content } : m
        );
        return { ...c, messages };
      }),
    })),

  getCurrentChat: () => {
    const { chats, currentChatId } = get();
    return currentChatId ? chats.find((c) => c.id === currentChatId) : undefined;
  },
}));
