/**
 * TanStack Query hooks that wrap the mock API service.
 * When a real backend is added, only services/api.ts needs to change.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/api';
import { useUserStore } from '@/store/useUserStore';
import { useChatStore } from '@/store/useChatStore';

// ── Keys ──────────────────────────────────────────────────────────────
export const queryKeys = {
  user: ['user'] as const,
  experimentSets: ['experimentSets'] as const,
  experimentSet: (id: string) => ['experimentSet', id] as const,
  badges: ['badges'] as const,
  chatMessages: ['chatMessages'] as const,
};

// ── User ──────────────────────────────────────────────────────────────
export function useUser() {
  const setUser = useUserStore((s) => s.setUser);
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const user = await api.fetchUser();
      setUser(user);
      return user;
    },
  });
}

// ── Experiment Sets ───────────────────────────────────────────────────
export function useExperimentSets() {
  return useQuery({
    queryKey: queryKeys.experimentSets,
    queryFn: api.fetchExperimentSets,
  });
}

export function useExperimentSet(id: string) {
  return useQuery({
    queryKey: queryKeys.experimentSet(id),
    queryFn: () => api.fetchExperimentSet(id),
    enabled: !!id,
  });
}

export function useToggleStep() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ setId, stepId }: { setId: string; stepId: number }) =>
      api.toggleStepApi(setId, stepId),
    onSuccess: (_data, { setId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.experimentSet(setId) });
      qc.invalidateQueries({ queryKey: queryKeys.experimentSets });
    },
  });
}

// ── Badges ────────────────────────────────────────────────────────────
export function useBadges() {
  return useQuery({
    queryKey: queryKeys.badges,
    queryFn: api.fetchBadges,
  });
}

// ── Chat ──────────────────────────────────────────────────────────────
export function useSendMessage() {
  const addMessages = useChatStore((s) => s.addMessages);
  return useMutation({
    mutationFn: (content: string) => api.sendChatMessage(content),
    onSuccess: ({ userMsg, assistantMsg }) => {
      addMessages(userMsg, assistantMsg);
    },
  });
}
