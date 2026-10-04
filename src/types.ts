/**
 * LexiMethod Academy — 核心数据模型
 * 结构依据《数据模型》规范，额外增加可选字段用于驱动动画（geo / narration / animation）。
 */

export type MethodCategory =
  | 'phonics'
  | 'roots'
  | 'memory'
  | 'context'
  | 'review'
  | 'output'
  | 'metacognition';

/** 方法步骤的动画渲染键 —— 课程页 StepHost 按此分发渲染器 */
export type StepAnimation =
  | 'entrance'      // 方法登场：标题粒子汇聚
  | 'principle'     // 原理讲解：字母串 vs 音节块
  | 'rule'          // 规则演示：音节划分 + 重音脉冲
  | 'mapping'       // 拼写发音对应：高亮 + 连线
  | 'practice'      // 互动练习：拖拽划分 / 点击重音
  | 'application'   // 实战分析：生词六步引导（不给答案）
  | 'pitfalls'      // 常见误区
  | 'mastery'       // 掌握标准
  | 'roots'         // 词根词缀色块拼装 + 词族树
  | 'memoryChain'   // 联想链：单词 → 图像 → 故事
  | 'context'       // 语境高亮 + 搭配发光
  | 'srsTimeline'   // 间隔重复时间轴
  | 'outputFunnel'  // 主动输出漏斗
  | 'metacog'       // 元认知清单与策略日志
  | 'generic';      // 通用文本/列表讲解

export type Method = {
  id: string;
  title: string;
  subtitle: string;
  category: MethodCategory;
  principles: string[];
  steps: { title: string; content: string; animation: StepAnimation }[];
  pitfalls: string[];
  masteryCriteria: string[];
  /** 扩展：图标名（lucide）与课程配色 */
  icon?: string;
  accent?: string;
  durationMin?: number;
}

export type RuleType = 'phonics' | 'prefix' | 'suffix' | 'root' | 'stress';

export type Rule = {
  id: string;
  type: RuleType;
  pattern: string;
  explanation: string;
  examples: string[];
};

/** 口型几何参数：驱动 SVG 口腔侧面动画（0~1 归一化） */
export type Articulation = {
  /** 舌高：0=低（贴下颌） 1=高（贴近上颚） */
  tongueHigh: number;
  /** 舌位前后：0=后 1=前 */
  tongueFront: number;
  /** 唇形圆展：0=展开/自然 1=收圆 */
  lipRound: number;
  /** 开口度：0=闭合 1=大开 */
  jawOpen: number;
  /** 气流是否经鼻腔 */
  nasal?: boolean;
  /** 发音方式 */
  manner:
    | 'plosive'
    | 'fricative'
    | 'affricate'
    | 'nasal'
    | 'lateral'
    | 'approximant'
    | 'vowel'
    | 'sibilant';
  /** 发音部位（大致） */
  place: 'bilabial' | 'labiodental' | 'dental' | 'alveolar' | 'postalveolar' | 'palatal' | 'velar' | 'glottal' | 'central' | 'front' | 'back';
  /** 受阻程度：0=完全通畅 1=完全闭塞（用于气流动画） */
  closure?: number;
};

export type MinimalPair = { a: string; b: string; meaningA: string; meaningB: string };

export type Phoneme = {
  id: string;
  symbol: string; // 如 /θ/
  type: 'vowel' | 'consonant' | 'diphthong';
  exampleWords: string[]; // think, thank, bath
  mouthShape: string; // 口型描述
  tonguePosition: string; // 舌位描述
  airflow: string; // 气流描述
  voiced: boolean; // 是否浊音
  commonSpellings: string[]; // th, ...
  minimalPairs: MinimalPair[];
  commonMistakes: string[]; // 中文母语者易犯错误
  contrastWith: string[]; // 对比音标 id
  /** 扩展：驱动动画 */
  geo: Articulation;
  /** 扩展：音标名（用于 TTS 与朗读回退的示例词） */
  ttsWord?: string;
  /** 扩展：英式/美式例词音标，可选 */
  ipaExample?: string;
  /** 扩展：长短音对比对象 id（仅单元音长音有） */
  longShortPair?: string;
  /** 扩展：中文说明一句话 */
  hintCN?: string;
};

export type SpellingPattern = {
  id: string;
  pattern: string; // -tion
  phoneme: string; // /ʃn/
  examples: string[];
  exceptions: string[];
  rule: string;
};

export type WordExample = {
  id: string;
  word: string;
  phoneticUK: string;
  phoneticUS: string;
  syllables: string[];
  stressIndex: number;
  partOfSpeech: string;
  meaningCN: string;
  meaningEN: string;
  roots: { text: string; type: 'prefix' | 'root' | 'suffix'; meaning: string; color: string }[];
  wordFamily: { word: string; pos: string; meaning: string }[];
  collocations: string[];
  examples: { en: string; cn: string }[];
  tags: string[];
};

/* ------------------------------------------------------------------ */
/* 训练 / 进度                                                          */
/* ------------------------------------------------------------------ */

export type QuestionType =
  | 'listenChoosePhoneme'
  | 'wordChoosePhoneme'
  | 'phonemeChooseSpelling'
  | 'spellingChoosePhoneme'
  | 'listenWritePhoneme'
  | 'listenWriteWord'
  | 'syllableSplit'
  | 'stressPosition'
  | 'minimalPair'
  | 'affixAssemble'
  | 'contextChoice';

export type Choice = { label: string; sub?: string; correct: boolean };

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  narration: string; // 旁白：不依赖动画也能理解
  speak?: string; // 需要朗读的文本
  speakSlow?: boolean;
  choices?: Choice[];
  answer: string; // 标准答案（字符串）
  /** 音节划分题 */
  syllableUnits?: string[];
  /** 词缀拼装题 */
  affixUnits?: { text: string; type: 'prefix' | 'root' | 'suffix'; meaning: string }[];
  /** 答案解释 / 规则提示 */
  hint: string;
  explain: string;
  tags?: string[];
};

export type ExerciseResult = {
  questionId: string;
  type: QuestionType;
  correct: boolean;
  at: number;
  answer: string;
  given: string;
};

/* ------------------------------------------------------------------ */
/* 复习（间隔重复）                                                      */
/* ------------------------------------------------------------------ */

export type ReviewItemKind = 'phoneme' | 'rule' | 'word' | 'mistake' | 'method';

export type ReviewCard = {
  id: string;
  kind: ReviewItemKind;
  refId: string;
  label: string;
  /** 当前间隔档位：0=新学, 1/3/7/14/30 天 */
  stage: number;
  dueAt: number;
  lapses: number;
  createdAt: number;
};

export type MistakeEntry = {
  id: string;
  questionId: string;
  type: QuestionType;
  prompt: string;
  given: string;
  answer: string;
  explain: string;
  at: number;
  count: number;
};

export type Achievement = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

export type AnimationTier = 'full' | 'light' | 'off';
export type Accent = 'uk' | 'us';
