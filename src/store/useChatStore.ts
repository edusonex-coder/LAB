import { create } from 'zustand';
import type { ChatMessage } from '@/data/mockData';

interface ChatState {
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  addMessages: (...msgs: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessages: (...msgs) =>
    set((state) => ({ messages: [...state.messages, ...msgs] })),
}));
