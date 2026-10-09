import { create } from 'zustand';
import type { QuestionType } from '@/types';
import { PROGRESS_KEY, readJSON, registerSaver, writeJSON } from './persistence';
import { useSettings } from './settingsStore';

type ProgressState = {
  /** methodId -> 已完成的 step 索引列表（旧模型，随旧课程页退役） */
  completedSteps: Record<string, number[]>;
  /** methodId -> 课程是否全部完成 */
  completedMethods: string[];
  /** 音标实验室 */
  phonemesLearned: string[];
  labDictationCount: number;
  /** 实战分析历史（课程内六步向导，旧模型） */
  analyzedWords: { word: string; at: number; step: number }[];

  // actions
  completeStep: (methodId: string, stepIndex: number, total: number) => void;
  /** 只累计听写次数，不发数值奖励 */
  recordAnswer: (type: QuestionType, correct: boolean) => void;
  markPhonemeLearned: (id: string) => void;
  addAnalyzedWord: (word: string) => void;

  // ---------- 新课程体系（src/data/courses） ----------
  /** courseId -> 已完成单元 id（u1..u6） */
  completedUnits: Record<string, string[]>;
  /** 诊断已做的课程（决策点1：诊断先行） */
  diagnosticTaken: string[];
  /** 诊断成绩（分数带分流的依据；P0-5：defaultStep / 报告去向按它读 band.route） */
  diagnosticResults: Record<string, { score: number; total: number }>;
  /** 出门条成绩（决策点3：当场快测） */
  exitResults: Record<string, { score: number; total: number }>;
  /** 离场自测已勾选的课程 */
  selfChecked: string[];
  completeUnit: (courseId: string, unitId: string) => void;
  markDiagnosticTaken: (courseId: string) => void;
  recordDiagnosticResult: (courseId: string, score: number, total: number) => void;
  recordExitResult: (courseId: string, score: number, total: number) => void;
  markSelfChecked: (courseId: string) => void;

  resetAll: () => void;
};

const initial = {
  completedSteps: {} as Record<string, number[]>,
  completedMethods: [] as string[],
  phonemesLearned: [] as string[],
  labDictationCount: 0,
  analyzedWords: [] as { word: string; at: number; step: number }[],
  completedUnits: {} as Record<string, string[]>,
  diagnosticTaken: [] as string[],
  diagnosticResults: {} as Record<string, { score: number; total: number }>,
  exitResults: {} as Record<string, { score: number; total: number }>,
  selfChecked: [] as string[],
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

/** 只序列化数据字段（函数动作不落盘），键名带版本 `leximethod.progress.v1` */
function serializable(s: ProgressState): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(s)) if (typeof v !== 'function') out[k] = v;
  return out;
}

const saved = readJSON<Partial<ProgressState>>(PROGRESS_KEY) ?? {};

/**
 * 存储口径（P0-2，用户已拍板，推翻旧「零存储」条款）：
 * 开关 `settingsStore.persistProgress`（默认开）打开时，状态写本机 localStorage
 * （键 `leximethod.progress.v1`），启动时回读；开关关闭时不写、并已删除旧数据。
 * 无论开关如何，**一律不上行、不追踪、不发外部请求**——数据只在你这台机器上。
 * 角色化数值（XP / 连击 / 连续天数 / 成就徽章）仍按 DESIGN.md 去角色化原则不存。
 */
export const useProgress = create<ProgressState>()((set) => ({
      ...initial,
      ...(saved as Partial<ProgressState>),

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

      // ---------- 新课程体系（开关打开时持久化到本机，见文件头注释） ----------
      completeUnit: (courseId, unitId) =>
        set((s) => {
          const prev = s.completedUnits[courseId] ?? [];
          if (prev.includes(unitId)) return s;
          return {
            completedUnits: { ...s.completedUnits, [courseId]: [...prev, unitId] },
          };
        }),

      markDiagnosticTaken: (courseId) =>
        set((s) =>
          s.diagnosticTaken.includes(courseId)
            ? s
            : { diagnosticTaken: [...s.diagnosticTaken, courseId] },
        ),

      recordDiagnosticResult: (courseId, score, total) =>
        set((s) => ({
          diagnosticResults: { ...s.diagnosticResults, [courseId]: { score, total } },
        })),

      recordExitResult: (courseId, score, total) =>
        set((s) => ({
          exitResults: { ...s.exitResults, [courseId]: { score, total } },
        })),

      markSelfChecked: (courseId) =>
        set((s) =>
          s.selfChecked.includes(courseId) ? s : { selfChecked: [...s.selfChecked, courseId] },
        ),

      resetAll: () => set({ ...initial }),
  }),
);

// 每次状态变化后按开关落盘；开关关闭时 subscribe 直接不写。
useProgress.subscribe((state) => {
  if (!useSettings.getState().persistProgress) return;
  writeJSON(PROGRESS_KEY, serializable(state));
});
registerSaver(() => {
  if (!useSettings.getState().persistProgress) return;
  writeJSON(PROGRESS_KEY, serializable(useProgress.getState()));
});

/** 整体课程进度 0~1 */
export function useOverallProgress(methodCount: number, stepsPerMethod = 8) {
  const completedSteps = useProgress((s) => s.completedSteps);
  const total = methodCount * stepsPerMethod;
  const done = Object.values(completedSteps).reduce((acc, arr) => acc + arr.length, 0);
  return Math.min(1, done / Math.max(1, total));
}
