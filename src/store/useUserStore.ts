import { create } from 'zustand';
import type { User } from '@/data/mockData';

interface UserState {
  /** Locally cached user – populated by TanStack Query, kept here for non-query consumers. */
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
