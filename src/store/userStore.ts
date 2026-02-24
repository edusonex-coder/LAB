import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
    user: any | null; // Profile from API
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
    setUser: (user: any) => void;
    updateName: (name: string) => void;
    addPoints: (amount: number) => void;
    toggleDarkMode: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
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
            setUser: (user) => set({ user }),
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
