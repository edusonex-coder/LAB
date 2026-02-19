import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendMessageToGroq, ChatMessage } from '@/services/aiService';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatState {
    messages: Message[];
    isLoading: boolean;
    addMessage: (message: Message) => void;
    setLoading: (loading: boolean) => void;
    clearChat: () => void;
    simulateResponse: () => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            isLoading: false,
            addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
            setLoading: (loading) => set({ isLoading: loading }),
            clearChat: () => set({ messages: [] }),

            simulateResponse: async () => {
                set({ isLoading: true });
                const { messages, addMessage } = get();

                // Prepare message history for API (last 10 messages context)
                // Convert to format required by aiService (system | user | assistant)
                const apiMessages: ChatMessage[] = messages.slice(-10).map(m => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content
                }));

                try {
                    const reply = await sendMessageToGroq(apiMessages);

                    if (!reply) throw new Error('Empty response');

                    addMessage({
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: reply,
                        timestamp: new Date().toISOString(),
                    });
                } catch (error) {
                    console.error('AI Error:', error);
                    addMessage({
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: "Üzgünüm, şu an bağlantımda bir sorun var. Birazdan tekrar dener misin? 🔌",
                        timestamp: new Date().toISOString(),
                    });
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'chat-storage',
        }
    )
);
