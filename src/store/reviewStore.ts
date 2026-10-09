import { create } from 'zustand';
import type { MistakeEntry, Question, QuestionType, ReviewCard, ReviewItemKind } from '@/types';
import { REVIEW_KEY, readJSON, registerSaver, writeJSON } from './persistence';
import { useSettings } from './settingsStore';

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30]; // 天

type SelfNote = {
  id: string;
  /** 自评条目原文（离场自测题干 / 交表自评标签 / 音标录音自评） */
  label: string;
  /** 自评结果：false = 「否 / 没想起来 / 还差一步」 */
  ok: boolean;
  at: number;
};

type ReviewState = {
  cards: ReviewCard[];
  mistakes: MistakeEntry[];
  /** 离场自测与交表自评的去向（P1-4）：只记录，不调度 */
  selfNotes: SelfNote[];
  /** 复习正确次数 */
  reviewed: number;

  ensureCard: (kind: ReviewItemKind, refId: string, label: string) => void;
  /** 答题后调度：correct 升一档，wrong 降回第 0 档 */
  schedule: (kind: ReviewItemKind, refId: string, label: string, correct: boolean) => void;
  /**
   * 取到期卡片。
   * ⚠️ 本仓库暂不调度消费：全站没有复习路由/到期列表页面，`dueCards()` 只是
   * 记录型 API 的一部分（供记录与导出），不会自动弹出、也不会提醒。
   * 站内不安排复习——想按 1/3/7/14/30 天重现，请把错题抄进自己的日历或 Anki。
   */
  dueCards: (now?: number) => ReviewCard[];
  addMistake: (q: Question, given: string) => void;
  /** 记录一次自评（离场自测「否」、交表自评「没想起来」、音标录音自评「记不牢」等），只入记录不进排期 */
  recordSelfReview: (label: string, ok: boolean) => void;
  /**
   * ⚠️ 本仓库暂不调度消费：错题标记为「已解决」的 API，
   * 站内没有会调用它的入口（供记录与导出，未来接复习页时再用）。
   */
  resolveMistake: (id: string) => void;
  clearMistakes: () => void;
  reset: () => void;
};

function dueFor(stage: number, from = Date.now()): number {
  const days = REVIEW_INTERVALS[Math.min(stage, REVIEW_INTERVALS.length - 1)];
  return from + days * 86400000;
}

type Persisted = { cards: ReviewCard[]; mistakes: MistakeEntry[]; selfNotes: SelfNote[]; reviewed: number };
const saved = readJSON<Partial<Persisted>>(REVIEW_KEY) ?? {};

function serializable(s: ReviewState): Persisted {
  return { cards: s.cards, mistakes: s.mistakes, selfNotes: s.selfNotes, reviewed: s.reviewed };
}

/**
 * 存储口径（P0-2 + P0-1）：
 * - 开关打开时写本机 `leximethod.review.v1`，启动回读；开关关闭时不写并已清空；
 * - 卡片的 `stage/dueAt` 只是**记录**（本站教间隔重复，但站内不调度消费、不弹复习）；
 *   空承诺文案已改为「抄进自己的日历/Anki」，见 DictationTrainer / QuestionRunner。
 */
export const useReview = create<ReviewState>()((set, get) => ({
      cards: saved.cards ?? [],
      mistakes: saved.mistakes ?? [],
      selfNotes: saved.selfNotes ?? [],
      reviewed: saved.reviewed ?? 0,

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

      // 记录型 API：见类型注释——本仓库暂不调度消费，仅供记录/导出
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

      recordSelfReview: (label, ok) =>
        set((s) => ({
          selfNotes: [
            { id: `s:${label}:${Date.now()}`, label, ok, at: Date.now() },
            ...s.selfNotes,
          ].slice(0, 200),
        })),

      resolveMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),
      clearMistakes: () => set({ mistakes: [] }),
      reset: () => set({ cards: [], mistakes: [], selfNotes: [], reviewed: 0 }),
  }),
);

useReview.subscribe((state) => {
  if (!useSettings.getState().persistProgress) return;
  writeJSON(REVIEW_KEY, serializable(state));
});
registerSaver(() => {
  if (!useSettings.getState().persistProgress) return;
  writeJSON(REVIEW_KEY, serializable(useReview.getState()));
});

/** 按类型分组的错题统计 */
export function mistakeStats(mistakes: MistakeEntry[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of mistakes) out[m.type] = (out[m.type] ?? 0) + 1;
  return out;
}

export type { QuestionType };
