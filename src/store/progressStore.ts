import { create } from 'zustand';
import type { QuestionType } from '@/types';

export type TypeStat = { correct: number; total: number };

/** 费曼关一次讲解记录（只存结构，不存长文本之外的内容） */
export type FeynmanRecord = {
  methodId: string;
  at: number;
  /** 命中关键词数 / 关键词总数 */
  hits: number;
  total: number;
  /** 自评总分（满分 = 4 项 × 5） */
  score: number;
  passed: boolean;
  /** 讲解原文（截断保存，便于回看“我上次是怎么讲的”） */
  text: string;
};

type ProgressState = {
  /** methodId -> 已完成的 step 索引列表 */
  completedSteps: Record<string, number[]>;
  /** methodId -> 课程是否全部完成 */
  completedMethods: string[];
  /** 各题型正确率（学习反馈，非角色化数值） */
  stats: Partial<Record<QuestionType, TypeStat>>;
  /** 音标实验室 */
  phonemesLearned: string[];
  labDictationCount: number;
  /** 实战演练历史 */
  analyzedWords: { word: string; at: number; step: number }[];
  /** 费曼关讲解历史（最新在前，最多 30 条） */
  feynmanRecords: FeynmanRecord[];

  // actions
  completeStep: (methodId: string, stepIndex: number, total: number) => void;
  /** 手动把某门课设为「前 stepCount 步已完成」（首页「我的进度」调节入口） */
  setMethodProgress: (methodId: string, stepCount: number, total: number) => void;
  resetMethod: (methodId: string) => void;
  /** 只累计正确率与听写次数，不发数值奖励 */
  recordAnswer: (type: QuestionType, correct: boolean) => void;
  markPhonemeLearned: (id: string) => void;
  addAnalyzedWord: (word: string) => void;
  recordFeynman: (r: Omit<FeynmanRecord, 'at'>) => void;
  resetAll: () => void;
};

const initial = {
  completedSteps: {} as Record<string, number[]>,
  completedMethods: [] as string[],
  stats: {} as Partial<Record<QuestionType, TypeStat>>,
  phonemesLearned: [] as string[],
  labDictationCount: 0,
  analyzedWords: [] as { word: string; at: number; step: number }[],
  feynmanRecords: [] as FeynmanRecord[],
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

/** 手动调节入口的真值计算：把某门课设为「前 stepCount 步已完成」（无 XP 口径，纯进度） */
function applyProgress(s: ProgressState, methodId: string, stepCount: number, total: number) {
  const capped = Math.max(0, Math.min(stepCount, total));
  const next = Array.from({ length: capped }, (_, i) => i);
  return {
    completedSteps: { ...s.completedSteps, [methodId]: next },
    completedMethods: syncCompletedMethods(s, methodId, next.length, total),
  };
}

/**
 * 站点零数据存储：本 store 只存在于内存，**不写 localStorage / sessionStorage**。
 * 刷新即回到初始状态——用户在首页「我的进度」手动调节进度，以继续上次学到的位置。
 * 角色化数值（XP / 连击 / 连续天数 / 成就徽章）已按 DESIGN.md 去角色化原则移除；
 * 保留的是学习反馈：课程进度、正确率、复习与讲解记录。
 */
export const useProgress = create<ProgressState>()((set, get) => ({
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

      /** 首页「我的进度」手动调节（可上调也可下调） */
      setMethodProgress: (methodId, stepCount, total) => set((s) => applyProgress(s, methodId, stepCount, total)),

      resetMethod: (methodId) =>
        set((s) => applyProgress(s, methodId, 0, s.completedSteps[methodId]?.length ?? 0)),

      recordAnswer: (type, correct) =>
        set((s) => {
          const prev = s.stats[type] ?? { correct: 0, total: 0 };
          return {
            stats: {
              ...s.stats,
              [type]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 },
            },
            labDictationCount:
              type === 'listenWriteWord' || type === 'listenWritePhoneme'
                ? s.labDictationCount + 1
                : s.labDictationCount,
          };
        }),

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

      /** 费曼关：无论通过与否都记入历史（讲过就有价值） */
      recordFeynman: (r) =>
        set((s) => ({
          feynmanRecords: [{ ...r, at: Date.now() }, ...(s.feynmanRecords ?? [])].slice(0, 30),
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
