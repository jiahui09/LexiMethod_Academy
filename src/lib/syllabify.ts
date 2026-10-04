/**
 * 音节划分启发式算法（教学用）：
 * 1. 找出元音核心（a e i o u y 的连续串）
 * 2. 相邻元音核心之间的辅音串，取“合法英文起音(onset)”的最长后缀归下个音节
 * 3. 归不出去的留在上个音节（闭音节）
 * 例外词（如 psychology）仍需人工判断 —— 页面上会明确标注这一点。
 */

const CLUSTER2 = new Set([
  'bl', 'br', 'ch', 'cl', 'cr', 'dr', 'dw', 'fl', 'fr', 'gl', 'gr', 'kl', 'pl', 'pr',
  'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st', 'sw', 'th', 'tr', 'tw', 'wh', 'qu', 'ph', 'sh', 'gh',
]);
const CLUSTER3 = new Set(['str', 'spr', 'scr', 'spl', 'thr', 'shr', 'sch', 'chr', 'squ']);

function isOnset(s: string): boolean {
  if (s.length === 1) return true;
  if (s.length === 2) return CLUSTER2.has(s);
  if (s.length === 3) return CLUSTER3.has(s);
  return false;
}

const isVowelChar = (c: string) => 'aeiouy'.includes(c);

/** 返回音节切分数组，如 construction → ["con","struc","tion"] */
export function syllabify(word: string): string[] {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return [];

  // 元音核心跨度
  const spans: Array<[number, number]> = [];
  let i = 0;
  while (i < w.length) {
    if (isVowelChar(w[i])) {
      let j = i;
      while (j < w.length && isVowelChar(w[j])) j++;
      spans.push([i, j - 1]);
      i = j;
    } else i++;
  }
  if (spans.length === 0) return [w];

  const cuts: number[] = [0];
  for (let s = 1; s < spans.length; s++) {
    const prevEnd = spans[s - 1][1];
    const nextStart = spans[s][0];
    const cluster = w.slice(prevEnd + 1, nextStart);

    if (cluster.length === 0) {
      cuts.push(nextStart); // V-V：元音间直接断（radio → ra-di-o）
      continue;
    }
    // 找辅音串中作为下个音节起音的最长后缀
    let cut = -1;
    for (let len = Math.min(cluster.length, 3); len >= 1; len--) {
      const suffix = cluster.slice(cluster.length - len);
      if (isOnset(suffix)) {
        cut = nextStart - len;
        break;
      }
    }
    if (cut <= cuts[cuts.length - 1] || cut >= w.length) cut = nextStart - 1;
    cuts.push(cut);
  }

  cuts.push(w.length);
  const parts: string[] = [];
  for (let k = 0; k < cuts.length - 1; k++) {
    const seg = w.slice(cuts[k], cuts[k + 1]);
    if (seg) parts.push(seg);
  }
  return parts.length ? parts : [w];
}

/** 标注重音音节（返回带 · 和 ˈ 的形式） */
export function stressMarked(syllables: string[], stressIndex: number): string {
  return syllables.map((s, i) => (i === stressIndex ? `ˈ${s}` : s)).join('-');
}
