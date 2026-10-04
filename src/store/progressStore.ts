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
  xp: number;
  /** 连续学习 */
  streakCurrent: number;
  streakLongest: number;
  lastActiveDay: string; // YYYY-MM-DD
  activeDays: string[]; // YYYY-MM-DD 去重列表
  activity: Record<string, number>; // YYYY-MM-DD -> 练习次数
  stats: Partial<Record<QuestionType, TypeStat>>;
  achievements: string[];
  /** 本次会话最大连击（用于成就） */
  bestCombo: number;
  /** 音标实验室 */
  phonemesLearned: string[];
  labDictationCount: number;
  /** 实战演练历史 */
  analyzedWords: { word: string; at: number; step: number }[];
  /** 费曼关讲解历史（最新在前，最多 30 条） */
  feynmanRecords: FeynmanRecord[];

  // actions
  recordActivity: (n?: number) => void;
  completeStep: (methodId: string, stepIndex: number, total: number) => void;
  /** 手动把某门课设为「前 stepCount 步已完成」（首页「我的进度」调节入口），XP 按节数差 ×10 增减 */
  setMethodProgress: (methodId: string, stepCount: number, total: number) => void;
  resetMethod: (methodId: string) => void;
  recordAnswer: (type: QuestionType, correct: boolean) => void;
  unlockAchievement: (id: string) => boolean;
  recordCombo: (n: number) => void;
  markPhonemeLearned: (id: string) => void;
  addAnalyzedWord: (word: string) => void;
  recordFeynman: (r: Omit<FeynmanRecord, 'at'>) => void;
  resetAll: () => void;
};

function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dayDiff(a: string, b: string): number {
  return Math.round((new Date(a + 'T00:00:00').getTime() - new Date(b + 'T00:00:00').getTime()) / 86400000);
}

const initial = {
  completedSteps: {} as Record<string, number[]>,
  completedMethods: [] as string[],
  xp: 0,
  streakCurrent: 0,
  streakLongest: 0,
  lastActiveDay: '',
  activeDays: [] as string[],
  activity: {} as Record<string, number>,
  stats: {} as Partial<Record<QuestionType, TypeStat>>,
  achievements: [] as string[],
  bestCombo: 0,
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

/**
 * 手动调节入口的真值计算：把某门课设为「前 stepCount 步已完成」，
 * XP 按完成节数差 ×10（与 completeStep 的 +10/节 同一口径）。
 */
function applyProgress(s: ProgressState, methodId: string, stepCount: number, total: number) {
  const capped = Math.max(0, Math.min(stepCount, total));
  const next = Array.from({ length: capped }, (_, i) => i);
  const prev = s.completedSteps[methodId] ?? [];
  return {
    completedSteps: { ...s.completedSteps, [methodId]: next },
    completedMethods: syncCompletedMethods(s, methodId, next.length, total),
    xp: s.xp + (next.length - prev.length) * 10,
  };
}

/**
 * 站点零数据存储：本 store 只存在于内存，**不写 localStorage / sessionStorage**。
 * 刷新即回到初始状态——用户在首页「我的进度」手动调节进度，以继续上次学到的位置。
 */
export const useProgress = create<ProgressState>()((set, get) => ({
      ...initial,

      recordActivity: (n = 1) => {
        const day = todayKey();
        set((s) => {
          const activity = { ...s.activity, [day]: (s.activity[day] ?? 0) + n };
          let streakCurrent = s.streakCurrent;
          let streakLongest = s.streakLongest;
          let lastActiveDay = s.lastActiveDay;
          const activeDays = s.activeDays.includes(day) ? s.activeDays : [...s.activeDays, day];

          if (s.lastActiveDay === '') {
            streakCurrent = 1;
            streakLongest = Math.max(1, s.streakLongest);
          } else if (s.lastActiveDay !== day) {
            const diff = dayDiff(day, s.lastActiveDay);
            streakCurrent = diff === 1 ? s.streakCurrent + 1 : 1;
            streakLongest = Math.max(streakLongest, streakCurrent);
          } else {
            streakCurrent = Math.max(1, s.streakCurrent);
          }
          lastActiveDay = day;
          return { activity, streakCurrent, streakLongest, lastActiveDay, activeDays };
        });
      },

      completeStep: (methodId, stepIndex, total) => {
        get().recordActivity(1);
        set((s) => {
          const prev = s.completedSteps[methodId] ?? [];
          const next = prev.includes(stepIndex) ? prev : [...prev, stepIndex].sort((a, b) => a - b);
          const gained = prev.includes(stepIndex) ? 0 : 10;
          return {
            completedSteps: { ...s.completedSteps, [methodId]: next },
            completedMethods: syncCompletedMethods(s, methodId, next.length, total),
            xp: s.xp + gained,
          };
        });
      },

      /** 首页「我的进度」手动调节：XP 按完成节数差 ×10（可上调也可下调） */
      setMethodProgress: (methodId, stepCount, total) => set((s) => applyProgress(s, methodId, stepCount, total)),

      resetMethod: (methodId) =>
        set((s) => applyProgress(s, methodId, 0, s.completedSteps[methodId]?.length ?? 0)),

      recordAnswer: (type, correct) => {
        get().recordActivity(1);
        set((s) => {
          const prev = s.stats[type] ?? { correct: 0, total: 0 };
          return {
            stats: {
              ...s.stats,
              [type]: { correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 },
            },
            xp: s.xp + (correct ? 5 : 1),
            labDictationCount:
              type === 'listenWriteWord' || type === 'listenWritePhoneme'
                ? s.labDictationCount + 1
                : s.labDictationCount,
          };
        });
      },

      recordCombo: (n) => set((s) => (n > s.bestCombo ? { bestCombo: n } : s)),

      unlockAchievement: (id) => {
        if (get().achievements.includes(id)) return false;
        set((s) => ({ achievements: [...s.achievements, id] }));
        return true;
      },

      markPhonemeLearned: (id) =>
        set((s) =>
          s.phonemesLearned.includes(id)
            ? s
            : { phonemesLearned: [...s.phonemesLearned, id], xp: s.xp + 5 },
        ),

      addAnalyzedWord: (word) =>
        set((s) => ({
          analyzedWords: [{ word, at: Date.now(), step: 6 }, ...s.analyzedWords].slice(0, 50),
          xp: s.xp + 15,
        })),

      /** 费曼关：通过 +15 XP，未通过 +2（讲过就有价值），并记入历史 */
      recordFeynman: (r) => {
        get().recordActivity(1);
        set((s) => ({
          feynmanRecords: [{ ...r, at: Date.now() }, ...(s.feynmanRecords ?? [])].slice(0, 30),
          xp: s.xp + (r.passed ? 15 : 2),
        }));
      },

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

export { todayKey, dayDiff };
