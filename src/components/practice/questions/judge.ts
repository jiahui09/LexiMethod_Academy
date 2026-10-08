import type { CourseQuestion } from '@/data/courseSchema';

/**
 * 新课程题判定（自含副本：逻辑复刻 src/lib/answers.ts 的 judgeAnswer，
 * 按 CourseQuestionType 扩展 fill/construct 等新题型；answers.ts 保持旧导出不动）。
 */

/** IPA 归一化：去斜杠/空格，ɡ→g，统一重音符号 */
export function normIpa(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\s+/g, '')
    .replace(/ɡ/g, 'g')
    .replace(/[ˈˌ]/g, (m) => (m === 'ˈ' ? "'" : ','))
    .replace(/’/g, "'");
}

/** 单词归一化：小写、去空格与连字符 */
export function normWord(s: string): string {
  return s.trim().toLowerCase().replace(/[\s\-·.]+/g, '');
}

/** 通用归一化（选择题标签 / 拼写块） */
export function normChoice(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '');
}

/** 填空归一化：小写、并空白、去句尾标点 */
export function normFill(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.。;;]+$/, '');
}

/** 逐字母比对（听写单词反馈用） */
export function letterFeedback(
  given: string,
  answer: string,
): { char: string; status: 'same' | 'wrong' | 'missing' }[] {
  const g = given.padEnd(answer.length, ' ').split('');
  const a = answer.split('');
  return a.map((ch, i) => ({
    char: ch,
    status: g[i] === ch ? 'same' : g[i] === ' ' ? 'missing' : 'wrong',
  }));
}

/**
 * 课程题判定。
 * 注意 construct / selfReveal 不在此判分，由作答者对照参考自评（开放题无标准判法）。
 */
export function judgeCourseAnswer(q: CourseQuestion, given: string): boolean {
  const g = given.trim();
  switch (q.type) {
    case 'listenWritePhoneme': {
      const a = normIpa(q.answer);
      const b = normIpa(g);
      if (a === b) return true;
      // 宽容：忽略词重音符号差异
      return a.replace(/[' ,]/g, '') === b.replace(/[' ,]/g, '');
    }
    case 'listenWriteWord':
      return normWord(g) === normWord(q.answer);
    case 'fill': {
      const a = normFill(q.answer);
      const b = normFill(g);
      if (a === b) return true;
      // 带 % 的答案接受漏写百分号
      if (a.endsWith('%') && a.slice(0, -1) === b) return true;
      // 长句补全题接受「填了缺失片段」（双向包含，且片段足够长）
      if (a.length > 30 && b.length >= 8 && (a.includes(b) || b.includes(a))) return true;
      return false;
    }
    case 'syllableSplit':
      return (
        g
          .toLowerCase()
          .replace(/[\s·]/g, '-')
          .replace(/-+/g, '-') === q.answer.toLowerCase().replace(/[\s·]/g, '-')
      );
    case 'stressPosition':
      return Number(g) === Number(q.answer);
    case 'affixAssemble':
      return normChoice(g.replace(/\+/g, '-')) === normChoice(q.answer);
    default:
      return normChoice(g) === normChoice(q.answer);
  }
}

/** 反馈区展示用的标准答案（重音题翻译成「第 N 音节 单元」人话） */
export function answerDisplay(q: CourseQuestion): string {
  if (q.type === 'stressPosition' && q.syllableUnits) {
    const n = Number(q.answer);
    const unit = q.syllableUnits[n];
    return unit != null ? `第 ${n + 1} 音节 ${unit}` : q.answer;
  }
  return q.answer;
}
