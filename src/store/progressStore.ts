import { create } from 'zustand';
import type { QuestionType } from '@/types';

type ProgressState = {
  /** methodId -> 已完成的 step 索引列表 */
  completedSteps: Record<string, number[]>;
  /** methodId -> 课程是否全部完成 */
  completedMethods: string[];
  /** 音标实验室 */
  phonemesLearned: string[];
  labDictationCount: number;
  /** 实战分析历史（课程内六步向导） */
  analyzedWords: { word: string; at: number; step: number }[];

  // actions
  completeStep: (methodId: string, stepIndex: number, total: number) => void;
  /** 只累计听写次数，不发数值奖励 */
  recordAnswer: (type: QuestionType, correct: boolean) => void;
  markPhonemeLearned: (id: string) => void;
  addAnalyzedWord: (word: string) => void;
  resetAll: () => void;
};

const initial = {
  completedSteps: {} as Record<string, number[]>,
  completedMethods: [] as string[],
  phonemesLearned: [] as string[],
  labDictationCount: 0,
  analyzedWords: [] as { word: string; at: number; step: number }[],
};

/** completedMethods 的唯一推导规则：节次全满才进，掉回未满则移出 */
function syncCompletedMethods(s: ProgressState, methodId: string, stepCount: number, total: number) {
  const allDone = total > 0 && stepCount >= total;
  return allDone
    ? s.completedMethods.includes(methodId)
      ? s.completedMethods
      : [...s.completedMethods, methodId]
    : s.completedMethods.filter((m) => m !== methodId);
}

/**
 * 站点零数据存储：本 store 只存在于内存，**不写 localStorage / sessionStorage**。
 * 刷新即回到初始状态。
 * 角色化数值（XP / 连击 / 连续天数 / 成就徽章）已按 DESIGN.md 去角色化原则移除；
 * 保留的是学习反馈：课程进度、音标进度与听写累计。
 */
export const useProgress = create<ProgressState>()((set) => ({
      ...initial,

      completeStep: (methodId, stepIndex, total) =>
        set((s) => {
          const prev = s.completedSteps[methodId] ?? [];
          const next = prev.includes(stepIndex) ? prev : [...prev, stepIndex].sort((a, b) => a - b);
          return {
            completedSteps: { ...s.completedSteps, [methodId]: next },
            completedMethods: syncCompletedMethods(s, methodId, next.length, total),
          };
        }),

      recordAnswer: (type) =>
        set((s) => ({
          labDictationCount:
            type === 'listenWriteWord' || type === 'listenWritePhoneme'
              ? s.labDictationCount + 1
              : s.labDictationCount,
        })),

      markPhonemeLearned: (id) =>
        set((s) =>
          s.phonemesLearned.includes(id)
            ? s
            : { phonemesLearned: [...s.phonemesLearned, id] },
        ),

      addAnalyzedWord: (word) =>
        set((s) => ({
          analyzedWords: [{ word, at: Date.now(), step: 6 }, ...s.analyzedWords].slice(0, 50),
        })),

      resetAll: () => set({ ...initial }),
  }),
);

/** 整体课程进度 0~1 */
export function useOverallProgress(methodCount: number, stepsPerMethod = 8) {
  const completedSteps = useProgress((s) => s.completedSteps);
  const total = methodCount * stepsPerMethod;
  const done = Object.values(completedSteps).reduce((acc, arr) => acc + arr.length, 0);
  return Math.min(1, done / Math.max(1, total));
}
