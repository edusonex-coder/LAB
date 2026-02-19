/**
 * Mock API service layer.
 * Each function simulates an async network call with a small delay.
 * Replace the bodies with real fetch/axios calls when a backend is ready.
 */

import {
  mockUser,
  mockExperimentSets,
  mockBadges,
  type User,
  type ExperimentSet,
  type Badge,
  type ChatMessage,
} from '@/data/mockData';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// Deep-clone helper so mutations don't leak between calls
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

// ── In-memory "database" ──────────────────────────────────────────────
let _user = clone(mockUser);
let _sets = clone(mockExperimentSets);
let _badges = clone(mockBadges);
let _messages: ChatMessage[] = [];

// ── User ──────────────────────────────────────────────────────────────
export async function fetchUser(): Promise<User> {
  await delay();
  return clone(_user);
}

export async function updateUser(patch: Partial<User>): Promise<User> {
  await delay();
  _user = { ..._user, ...patch };
  return clone(_user);
}

// ── Experiment Sets ───────────────────────────────────────────────────
export async function fetchExperimentSets(): Promise<ExperimentSet[]> {
  await delay();
  return clone(_sets);
}

export async function fetchExperimentSet(id: string): Promise<ExperimentSet | undefined> {
  await delay();
  const set = _sets.find((s) => s.id === id);
  return set ? clone(set) : undefined;
}

export async function toggleStepApi(setId: string, stepId: number): Promise<ExperimentSet> {
  await delay(150);
  const set = _sets.find((s) => s.id === setId);
  if (!set) throw new Error('Set not found');
  const step = set.steps.find((s) => s.id === stepId);
  if (step) step.completed = !step.completed;
  return clone(set);
}

// ── Badges ────────────────────────────────────────────────────────────
export async function fetchBadges(): Promise<Badge[]> {
  await delay();
  return clone(_badges);
}

// ── Chat ──────────────────────────────────────────────────────────────
export async function fetchChatMessages(): Promise<ChatMessage[]> {
  await delay();
  return clone(_messages);
}

export async function sendChatMessage(
  content: string,
): Promise<{ userMsg: ChatMessage; assistantMsg: ChatMessage }> {
  await delay(1200);

  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  };

  const responses = [
    `Harika soru! 🌟\n\n1. Önce malzemelerin tam olduğundan emin ol\n2. Adımları sırayla takip et\n3. Eğer LED yanmıyorsa bağlantıları kontrol et\n\n💡 **Bunu dene:** Kabloları farklı sırayla bağlamayı dene!\n\n📚 *Müfredat: MEB F.6.4.2*`,
    `Merhaba! 🔬 Bu deneyde dikkat etmen gereken en önemli şey güvenlik.\n\n1. Koruyucu gözlük tak\n2. Yetişkin gözetiminde çalış\n3. Malzemeleri düzenli tut\n\n🧪 **Alternatif:** Sirke ve karbonat ile de deneyebilirsin!\n\n📚 *Müfredat: MEB K.7.2.3*`,
    `Süper bir gözlem! 👏\n\n1. Mıknatısı yavaşça hareket ettir\n2. Demir tozlarının şeklini çiz\n3. Kuzey ve güney kutupları işaretle\n\n🧲 **İpucu:** Farklı güçte mıknatıslarla tekrarla!\n\n📚 *Müfredat: MEB F.5.3.1*`,
  ];

  const assistantMsg: ChatMessage = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: responses[Math.floor(Math.random() * responses.length)],
    timestamp: new Date(),
  };

  _messages.push(userMsg, assistantMsg);
  return { userMsg, assistantMsg };
}
