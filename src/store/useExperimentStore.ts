import { create } from 'zustand';

interface ExperimentState {
  /** UI-only state: confetti visibility */
  showConfetti: boolean;
  triggerConfetti: () => void;
}

export const useExperimentStore = create<ExperimentState>((set) => ({
  showConfetti: false,
  triggerConfetti: () => {
    set({ showConfetti: true });
    setTimeout(() => set({ showConfetti: false }), 3000);
  },
}));
