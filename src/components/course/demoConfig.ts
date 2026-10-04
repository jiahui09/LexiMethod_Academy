import type { Method, StepAnimation } from '@/types';

/** 每个方法的演示配置：课程渲染器按需取用 */
export type DemoConfig = {
  /** 原理讲解：错误 vs 正确 的切分对比 */
  principle?: {
    wrongLabel: string;
    wrong: string[];
    rightLabel: string;
    right: string[];
    note: string;
  };
  /** 规则演示：音节划分 + 重音 */
  rule?: {
    word: string;
    ipa: string;
    syllables: string[];
    stress: number;
    syllableIpa: string[];
    ruleTitle: string;
    ruleText: string;
  };
  /** 拼写 ↔ 发音对应 */
  mapping?: {
    pattern: string;
    sound: string;
    family: { word: string; ipa: string }[];
    exceptions: { word: string; ipa: string; note: string }[];
    ruleText: string;
  };
  /** 互动练习形态 */
  practice?: { kind: 'syllable' | 'affix' | 'quiz' | 'checklist'; word?: string };
  /** 实战分析目标生词（words 数据集 id 或任意生词） */
  applicationWord?: string;
};

export const demoByMethod: Record<string, DemoConfig> = {
  'phonetic-spelling': {
    principle: {
      wrongLabel: '错误：把音标当符号死记',
      wrong: ['/', 'θ', '/', '=', '?'],
      rightLabel: '正确：音标 = 口型 + 气流 + 声带',
      right: ['舌尖', '抵齿', '气流', '清音'],
      note: '每个音标都对应一套可观察、可模仿的发音动作；动作记住了，符号自然就活了。',
    },
    rule: {
      word: 'think',
      ipa: '/θɪŋk/',
      syllables: ['think'],
      stress: 0,
      syllableIpa: ['/θɪŋk/'],
      ruleTitle: '听音 → 判动作 → 落笔',
      ruleText: '听到一个音，先判断：气流在哪受阻？声带振不振动？口型是什么？再决定写哪个字母组合。',
    },
    mapping: {
      pattern: 'th',
      sound: '/θ/ 或 /ð/',
      family: [
        { word: 'think', ipa: '/θɪŋk/' },
        { word: 'thank', ipa: '/θæŋk/' },
        { word: 'bath', ipa: '/bɑːθ/' },
        { word: 'this', ipa: '/ðɪs/' },
        { word: 'mother', ipa: '/ˈmʌðə(r)/' },
      ],
      exceptions: [
        { word: 'thomas', ipa: '/ˈtɒməs/', note: '专有名词中 th 常读 /t/' },
        { word: 'clothes', ipa: '/kləʊðz/', note: '弱读时 the 音节几乎省略' },
      ],
      ruleText: '辅音字母组合的读音相对稳定：先判断这个音是清音还是浊音，再决定它在词中的写法。',
    },
    practice: { kind: 'quiz' },
    applicationWord: 'geography',
  },

  'phonics-syllables': {
    principle: {
      wrongLabel: '错误：逐字母死记',
      wrong: ['d', 'e', 'c', 'i', 's', 'i', 'o', 'n'],
      rightLabel: '正确：按音节切分',
      right: ['de', 'ci', 'sion'],
      note: '单词不是字母串，而是声音单位的组合。按字母记要背 8 个顺序，按音节记只需 3 块。',
    },
    rule: {
      word: 'construction',
      ipa: '/kənˈstrʌkʃn/',
      syllables: ['con', 'struc', 'tion'],
      stress: 1,
      syllableIpa: ['/kən/', '/ˈstrʌk/', '/ʃn/'],
      ruleTitle: '元音是音节的核心',
      ruleText: '每个音节必须有一个元音核心（a e i o u 或字母组合）。找齐元音就找齐了音节数；中间的辅音按“后一个音节能读出来”来分配。',
    },
    mapping: {
      pattern: '-tion',
      sound: '/ʃn/',
      family: [
        { word: 'construction', ipa: '/kənˈstrʌkʃn/' },
        { word: 'information', ipa: '/ˌɪnfəˈmeɪʃn/' },
        { word: 'education', ipa: '/ˌedʒuˈkeɪʃn/' },
        { word: 'attention', ipa: '/əˈtenʃn/' },
      ],
      exceptions: [
        { word: 'question', ipa: '/ˈkwestʃən/', note: '-tion 前是 s+元音时读 /tʃən/' },
        { word: 'suggestion', ipa: '/səˈdʒestʃən/', note: '同上，读 /tʃən/' },
      ],
      ruleText: '后缀 -tion 几乎总是读 /ʃn/，且重音落在它前面的音节（倒数第二个音节）。',
    },
    practice: { kind: 'syllable', word: 'transportation' },
    applicationWord: 'incomprehensible',
  },

  'roots-affixes': {
    principle: {
      wrongLabel: '错误：整词硬背',
      wrong: ['trans', 'for', 'ma', 'tion', '?'],
      rightLabel: '正确：拆成前缀 + 词根 + 后缀',
      right: ['trans-', 'form', '-ation'],
      note: '前缀定方向，词根定核心，后缀定词性。拆开后，一个生词变成三个已知零件。',
    },
    rule: {
      word: 'transportation',
      ipa: '/ˌtrænspɔːˈteɪʃn/',
      syllables: ['trans', 'por', 'ta', 'tion'],
      stress: 3,
      syllableIpa: ['/trænz', '/ˈpɔː', '/tə', '/ʃn/'],
      ruleTitle: '词根决定含义，后缀决定词性',
      ruleText: '-tion 说明它是名词；trans- 说明“横跨”；port 说明动作是“搬运”。三块拼起来就是“跨境搬运（的行为）”。',
    },
    mapping: {
      pattern: 'spect（看）',
      sound: '/spekt/',
      family: [
        { word: 'inspect', ipa: '/ɪnˈspekt/' },
        { word: 'respect', ipa: '/rɪˈspekt/' },
        { word: 'prospect', ipa: '/ˈprɒspekt/' },
        { word: 'spectator', ipa: '/spekˈteɪtə(r)/' },
      ],
      exceptions: [
        { word: 'speed', ipa: '/spiːd/', note: '不是所有 sp 开头都来自 spect' },
      ],
      ruleText: '同一词根在家族成员中保持同一核心含义，改变的只是方向（前缀）和身份（后缀）。',
    },
    practice: { kind: 'affix', word: 'uncomfortable' },
    applicationWord: 'transformation',
  },

  'mnemonics': {
    practice: { kind: 'quiz' },
    applicationWord: 'telephone',
  },

  'context-embedding': {
    practice: { kind: 'quiz' },
    applicationWord: 'visible',
  },

  'spaced-repetition': {
    practice: { kind: 'quiz' },
    applicationWord: 'information',
  },

  'active-output': {
    practice: { kind: 'quiz' },
    applicationWord: 'construction',
  },

  metacognition: {
    practice: { kind: 'checklist' },
    applicationWord: 'decision',
  },
};

export function getDemo(methodId: string): DemoConfig {
  return demoByMethod[methodId] ?? {};
}

export const ANIMATION_LABELS: Record<StepAnimation, string> = {
  entrance: '方法登场',
  principle: '原理讲解',
  rule: '规则演示',
  mapping: '拼写对应',
  practice: '互动练习',
  application: '实战分析',
  pitfalls: '常见误区',
  mastery: '掌握标准',
  roots: '词根拼装',
  memoryChain: '联想链',
  context: '语境高亮',
  srsTimeline: '时间轴',
  outputFunnel: '输出漏斗',
  metacog: '元认知',
  generic: '讲解',
};

export type { Method };
