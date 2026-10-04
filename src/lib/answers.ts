import type { Question, QuestionType } from '@/types';

/** IPA 归一化：去斜杠/空格，ɡ→g，统一引号 */
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

/** 根据题型判定作答是否正确 */
export function judgeAnswer(q: Question, given: string): boolean {
  const g = given.trim();
  switch (q.type) {
    case 'listenWritePhoneme': {
      const a = normIpa(q.answer);
      const b = normIpa(g);
      if (a === b) return true;
      // 宽容：忽略词重音符号与尾部 (r) 差异
      return a.replace(/[' ,]/g, '') === b.replace(/[' ,]/g, '');
    }
    case 'listenWriteWord':
      return normWord(g) === normWord(q.answer);
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

/** 逐字母比对（听写单词反馈用） */
export function letterFeedback(given: string, answer: string): { char: string; status: 'same' | 'wrong' | 'missing' }[] {
  const g = given.padEnd(answer.length, ' ').split('');
  const a = answer.split('');
  return a.map((ch, i) => ({
    char: ch,
    status: g[i] === ch ? 'same' : g[i] === ' ' ? 'missing' : 'wrong',
  }));
}

/** 该题型是否需要“写”输入（而非选择） */
export function isWriteType(t: QuestionType): boolean {
  return t === 'listenWritePhoneme' || t === 'listenWriteWord';
}

export const TYPE_LABELS: Record<QuestionType, string> = {
  listenChoosePhoneme: '听音选音标',
  wordChoosePhoneme: '看词选音标',
  phonemeChooseSpelling: '音标选拼写',
  spellingChoosePhoneme: '拼写选音标',
  listenWritePhoneme: '听写音标',
  listenWriteWord: '听写单词',
  syllableSplit: '音节划分',
  stressPosition: '重音定位',
  minimalPair: '最小对立对',
  affixAssemble: '词缀拼装',
  contextChoice: '语境选词',
};
