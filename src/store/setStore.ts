import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExperimentSet {
    id: string;
    title: string;
    category: 'Mekanik' | 'Optik' | 'Enerji' | 'Yazılım';
    difficulty: 'Kolay' | 'Orta' | 'Zor';
    image: string;
    isLocked: boolean;
    progress: number; // 0-100
    isCompleted: boolean;
    description: string;
    grade: number;
    emoji: string;
    curriculumRef: string;
    parts: string[];
    steps: { id: number; text: string; completed: boolean }[];
}

interface SetState {
    sets: ExperimentSet[];
    unlockSet: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    completeSet: (id: string) => void;
    toggleStep: (setId: string, stepId: number) => void;
}

const INITIAL_SETS: ExperimentSet[] = [
    {
        id: 'exp-001',
        title: 'Mekanik Vinç',
        category: 'Mekanik',
        difficulty: 'Orta',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
        isLocked: false,
        progress: 0,
        isCompleted: false,
        description: 'Basit makineler prensibiyle yük kaldırma sistemi.',
        grade: 8,
        emoji: '🏗️',
        curriculumRef: 'F.8.5.1. Basit Makineler',
        parts: ['Makara', 'İp', 'Kanca', 'Vinç Gövdesi', 'Kol'],
        steps: [
            { id: 1, text: 'Vinç gövdesini tabana sabitle.', completed: false },
            { id: 2, text: 'Makara sistemini kolun ucuna tak.', completed: false },
            { id: 3, text: 'İpi makaradan geçir ve kancayı bağla.', completed: false },
            { id: 4, text: 'Kolu çevirerek sistemi test et.', completed: false },
        ],
    },
    {
        id: 'exp-002',
        title: 'Güneş Enerjili Araba',
        category: 'Enerji',
        difficulty: 'Kolay',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=400',
        isLocked: true,
        progress: 0,
        isCompleted: false,
        description: 'Güneş panelini motora bağlayarak hareket enerjisi üret.',
        grade: 7,
        emoji: '☀️',
        curriculumRef: 'F.7.6.1. Enerji Dönüşümleri',
        parts: ['Güneş Paneli', 'DC Motor', 'Tekerlekler', 'Şasi', 'Kablolar'],
        steps: [
            { id: 1, text: 'Tekerlekleri şasiye monte et.', completed: false },
            { id: 2, text: 'Motoru arka aksa yerleştir.', completed: false },
            { id: 3, text: 'Güneş panelini aracın üstüne yapıştır.', completed: false },
            { id: 4, text: 'Kabloları motora bağla ve güneşte test et.', completed: false },
        ],
    },
    {
        id: 'exp-003',
        title: 'Periskop Yapımı',
        category: 'Optik',
        difficulty: 'Kolay',
        image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&q=80&w=400',
        isLocked: true,
        progress: 0,
        isCompleted: false,
        description: 'Aynaları kullanarak köşelerin arkasını gör.',
        grade: 6,
        emoji: '🔭',
        curriculumRef: 'F.6.5.2. Işığın Yansıması',
        parts: ['Karton Tüp', '2x Ayna', 'Bant', 'Makas'],
        steps: [
            { id: 1, text: 'Tüpün uçlarına 45 derece açıyla kesikler at.', completed: false },
            { id: 2, text: 'Aynaları kesiklere yerleştir.', completed: false },
            { id: 3, text: 'Aynaları sabitle ve ışık yolunu kontrol et.', completed: false },
        ],
    },
];

export const useSetStore = create<SetState>()(
    persist(
        (set) => ({
            sets: INITIAL_SETS,
            unlockSet: (id) =>
                set((state) => ({
                    sets: state.sets.map((s) => (s.id === id ? { ...s, isLocked: false } : s)),
                })),
            updateProgress: (id, progress) =>
                set((state) => ({
                    sets: state.sets.map((s) => (s.id === id ? { ...s, progress } : s)),
                })),
            completeSet: (id) =>
                set((state) => ({
                    sets: state.sets.map((s) => (s.id === id ? { ...s, isCompleted: true, progress: 100 } : s)),
                })),
            toggleStep: (setId, stepId) =>
                set((state) => {
                    const newSets = state.sets.map((s) => {
                        if (s.id !== setId) return s;
                        const newSteps = s.steps.map((step) =>
                            step.id === stepId ? { ...step, completed: !step.completed } : step
                        );
                        const completedCount = newSteps.filter((step) => step.completed).length;
                        const progress = Math.round((completedCount / newSteps.length) * 100);
                        const isCompleted = progress === 100;
                        return { ...s, steps: newSteps, progress, isCompleted };
                    });
                    return { sets: newSets };
                }),
        }),
        {
            name: 'set-storage',
        }
    )
);
