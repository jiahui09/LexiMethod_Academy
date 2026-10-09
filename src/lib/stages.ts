/**
 * 四段路径卡板色轮（瑞士世界世界共享元数据）。
 * 一章一色满强度；文本配色按对比度底线解算：
 * 铬黄带用 ink，群青/青/草绿/紫罗兰带用 milk（均 ≥4.5:1 @13px）。
 * 朱红只给错误：errata 做描边标记，errata-deep 做承载文字的勘误条底。
 */
export type StageId = 'pathway' | 'deconstruct' | 'encode' | 'retrieve' | 'capstone';

export const STAGE_ORDER: StageId[] = ['pathway', 'deconstruct', 'encode', 'retrieve', 'capstone'];

export const STAGE_META: Record<
  StageId,
  { label: string; hue: string; bg: string; onBand: string; bandText: string }
> = {
  pathway: {
    label: '通路',
    hue: '#F2B700',
    bg: 'bg-board-pathway',
    onBand: 'text-ink', // 黄带上墨字 9.3:1
    bandText: 'text-ink',
  },
  deconstruct: {
    label: '拆解',
    hue: '#2A4BD7',
    bg: 'bg-board-deconstruct',
    onBand: 'text-milk',
    bandText: 'text-milk',
  },
  encode: {
    label: '存入',
    hue: '#137574',
    bg: 'bg-board-encode',
    onBand: 'text-milk',
    bandText: 'text-milk',
  },
  retrieve: {
    label: '调用',
    hue: '#357A1E',
    bg: 'bg-board-retrieve',
    onBand: 'text-milk',
    bandText: 'text-milk',
  },
  capstone: {
    label: '收官',
    hue: '#6B3FA0',
    bg: 'bg-board-capstone',
    onBand: 'text-milk',
    bandText: 'text-milk',
  },
};

/** 卡板带下缘 3px 深一档（世界受批 3px 例外之一） */
export function deepen(hex: string, amount = 0.28): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `rgb(${r} ${g} ${b})`;
}
