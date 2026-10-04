import { create } from 'zustand';
import type { MistakeEntry, Question, QuestionType, ReviewCard, ReviewItemKind } from '@/types';

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]; // 天

type ReviewState = {
  cards: ReviewCard[];
  mistakes: MistakeEntry[];
  /** 复习正确次数 */
  reviewed: number;

  ensureCard: (kind: ReviewItemKind, refId: string, label: string) => void;
  /** 答题后调度：correct 升一档，wrong 降回第 0 档 */
  schedule: (kind: ReviewItemKind, refId: string, label: string, correct: boolean) => void;
  dueCards: (now?: number) => ReviewCard[];
  addMistake: (q: Question, given: string) => void;
  resolveMistake: (id: string) => void;
  clearMistakes: () => void;
  reset: () => void;
};

function dueFor(stage: number, from = Date.now()): number {
  const days = REVIEW_INTERVALS[Math.min(stage, REVIEW_INTERVALS.length - 1)];
  return from + days * 86400000;
}

/**
 * 站点零数据存储：复习卡 / 错题只存在于内存，**不写 localStorage / sessionStorage**。
 * 刷新即清空（`dueAt` 仍在会话内即时生效，间隔重复逻辑不变）。
 */
export const useReview = create<ReviewState>()((set, get) => ({
      cards: [],
      mistakes: [],
      reviewed: 0,

      ensureCard: (kind, refId, label) => {
        const id = `${kind}:${refId}`;
        if (get().cards.some((c) => c.id === id)) return;
        set((s) => ({
          cards: [
            ...s.cards,
            { id, kind, refId, label, stage: 0, dueAt: Date.now(), lapses: 0, createdAt: Date.now() },
          ],
        }));
      },

      schedule: (kind, refId, label, correct) => {
        const id = `${kind}:${refId}`;
        set((s) => {
          const idx = s.cards.findIndex((c) => c.id === id);
          if (idx === -1) {
            return {
              cards: [
                ...s.cards,
                {
                  id,
                  kind,
                  refId,
                  label,
                  stage: correct ? 1 : 0,
                  dueAt: dueFor(correct ? 1 : 0),
                  lapses: correct ? 0 : 1,
                  createdAt: Date.now(),
                },
              ],
              reviewed: s.reviewed + (correct ? 1 : 0),
            };
          }
          const cards = [...s.cards];
          const card = cards[idx];
          const stage = correct ? Math.min(card.stage + 1, REVIEW_INTERVALS.length - 1) : 0;
          cards[idx] = {
            ...card,
            label,
            stage,
            dueAt: dueFor(stage),
            lapses: correct ? card.lapses : card.lapses + 1,
          };
          return { cards, reviewed: s.reviewed + (correct ? 1 : 0) };
        });
      },

      dueCards: (now = Date.now()) => get().cards.filter((c) => c.dueAt <= now),

      addMistake: (q, given) => {
        set((s) => {
          const key = q.id;
          const idx = s.mistakes.findIndex((m) => m.questionId === key);
          if (idx >= 0) {
            const mistakes = [...s.mistakes];
            mistakes[idx] = { ...mistakes[idx], given, at: Date.now(), count: mistakes[idx].count + 1 };
            return { mistakes };
          }
          const entry: MistakeEntry = {
            id: `m:${key}:${Date.now()}`,
            questionId: q.id,
            type: q.type,
            prompt: q.prompt,
            given,
            answer: q.answer,
            explain: q.explain,
            at: Date.now(),
            count: 1,
          };
          return { mistakes: [entry, ...s.mistakes].slice(0, 300) };
        });
        get().schedule('mistake', q.id, q.prompt, false);
      },

      resolveMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),
      clearMistakes: () => set({ mistakes: [] }),
      reset: () => set({ cards: [], mistakes: [], reviewed: 0 }),
  }),
);

/** 按类型分组的错题统计 */
export function mistakeStats(mistakes: MistakeEntry[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of mistakes) out[m.type] = (out[m.type] ?? 0) + 1;
  return out;
}

export type { QuestionType };
