import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    name: string;
    points: number;
    level: number;
    avatar: string;
    badges: string[];
    preferences: {
        darkMode: boolean;
        notifications: boolean;
        language: 'tr' | 'en';
    };
    updateName: (name: string) => void;
    addPoints: (amount: number) => void;
    toggleDarkMode: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: 'Genç Mühendis',
            points: 0,
            level: 1,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            badges: [],
            preferences: {
                darkMode: false,
                notifications: true,
                language: 'tr',
            },
            updateName: (name) => set({ name }),
            addPoints: (amount) => set((state) => ({ points: state.points + amount })),
            toggleDarkMode: () =>
                set((state) => ({
                    preferences: { ...state.preferences, darkMode: !state.preferences.darkMode },
                })),
        }),
        {
            name: 'user-storage',
        }
    )
);
