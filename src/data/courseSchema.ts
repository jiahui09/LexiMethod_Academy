import type { Question, QuestionType } from '@/types';

/**
 * 新课程体系数据 schema（课程重构 v1）。
 * 前身 src/data/methods.ts 已随 UI 重建退役（2026-10）；新体系由 src/data/courses/ 聚合接管。
 * 题型联合在本文件内扩展，不改动 @/types 的 QuestionType，
 * 以免牵连现版 QuestionRunner / TYPE_LABELS。
 */

/** 路径分段：通路 → 拆解 → 存入 → 调用 → 收官 */
export type CourseStage = 'pathway' | 'deconstruct' | 'encode' | 'retrieve' | 'capstone';

export type LabTab = 'phonemes' | 'mapping' | 'dictation';

/** 新课程题型 = 现有题型 + 重构新增题型（见大纲 §4 编号） */
export type CourseQuestionType =
  | QuestionType
  | 'choice' // 通用选择（判别、配对、情境题）
  | 'match' // 双向配对 / 连线（翻牌、信号-动作配对）
  | 'highlight' // 句中圈块 / 圈元音核心
  | 'construct' // 开放输入（造句、联想、复盘表）
  | 'selfReveal' // 回忆→揭示→自评三拍
  | 'classify' // 拖入分类（错因归类、真假拆解）
  | 'fill'; // 填空（搭配补全、清单填写）

/** 复用现有 Question 的全部字段，仅放宽 type */
export type CourseQuestion = Omit<Question, 'type'> & { type: CourseQuestionType };

/**
 * 分数带报告：按得分从高到低排列，`until` 为该带下限，
 * 取第一个 `until <= score` 的条目（0 分兜底最后一档）。
 * 用于诊断开场的「裂缝报告」与出门条的即时诊断。
 */
export type ScoreBand = { until: number; verdict: string; route?: string };

/** 诊断开场：1 分钟做题 → 当场揭晓 → 一句人话报告 */
export type Diagnostic = {
  lead: string; // 开场引导语（一句，说清测什么）
  questions: CourseQuestion[]; // 6–10 题
  bands: ScoreBand[]; // 报告带（从高分到低分）
};

/**
 * 内容块：类型化，终结纯文本墙。
 * 每单元 = 一句 claim（≤40字）+ 若干 blocks + 可练习 + 可自检。
 */
export type Block =
  | { kind: 'example'; text: string; speak?: string; ipa?: string; note?: string }
  | { kind: 'demo'; ref: string; caption: string } // 演示引用：UI 阶段按 ref 分发渲染器
  | { kind: 'warning'; text: string }
  | { kind: 'list'; items: string[] };

/** 微练习：kind 对应大纲 §4 的题型键（含现有复用题型名） */
export type Practice = {
  kind: string;
  title: string;
  prompt: string; // 指令（一句动作）
  data?: unknown; // 题目数据，UI 阶段具体化
  debrief?: string; // 做完后的讲评一句
};

export type Unit = {
  id: string; // 'u1' … 课内唯一
  title: string;
  durationMin: number; // 5–9
  claim: string; // 一句主张，≤40 字，先给结论
  blocks: Block[];
  practice?: Practice;
  check?: string; // 收口自检一句话（单元以动手或自检收尾）
  labLink?: { tab: LabTab; label: string }; // 深链实验室
};

export type Course = {
  id: string; // 沿用旧课程 id，便于对照
  order: number; // 路径顺序 1–8（新课序）
  title: string;
  subtitle: string;
  stage: CourseStage;
  optional?: boolean; // 05 联想课 = 辅助可跳
  goal: string; // 可观察目标（一句话，见大纲 §1.2）
  durationMin: number; // 30–40
  opening: Diagnostic;
  units: Unit[]; // 5–6 个
  exitTicket: { intro: string; questions: CourseQuestion[]; bands: ScoreBand[] };
  selfCheck: string[]; // 离场自测卡，5 条，是/否可答
};

/**
 * 练习 kind 的规范键名（全站统一，不得自造）：
 * 复用现有：listenChoosePhoneme / wordChoosePhoneme / phonemeChooseSpelling /
 *   spellingChoosePhoneme / listenWritePhoneme / listenWriteWord / syllableSplit /
 *   stressPosition / minimalPair / affixAssemble / contextChoice
 * 重构新增：diagnostic（诊断）/ matchPairs（双向翻牌）/ vowelCore（圈元音核心）/
 *   algorithmRun（算法跟跑计时）/ wordFamilyTree（词族树）/ morphemeJudge（真假拆解）/
 *   loopTimer（闭环计时）/ sentenceBlocks（句中圈块）/ sentenceBuilder（造句自检）/
 *   fakeContext（假语境找茬）/ associationFault（坏联想找茬）/ recallTiming（最佳时机）/
 *   revealSelf（回忆揭示自评）/ collocationFill（搭配补全）/ retellScaffold（复述支架）/
 *   checklistFill（填清单）/ signalMatch（信号-动作配对）/ errorClassify（错因归类）/
 *   debriefForm（复盘表）/ exitTicket（出门条）
 */

/** 题 id 规则：c{课号}-{域}-{序号}，如 c01-exit-3、c04-diag-1（全站唯一） */
export const makeQid = (courseNo: number, domain: 'diag' | 'exit', n: number) =>
  `c${String(courseNo).padStart(2, '0')}-${domain}-${n}`;
