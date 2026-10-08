import { course01 } from './01-phonetic-spelling';
import { course02 } from './02-phonics-syllables';
import { course03 } from './03-roots-affixes';
import { course04 } from './04-context-embedding';
import { course05 } from './05-mnemonics';
import { course06 } from './06-spaced-repetition';
import { course07 } from './07-active-output';
import { course08 } from './08-metacognition';
import type { Course } from '../courseSchema';

/**
 * 新课程体系（课程重构 v1）：四段学习路径
 * 通路 01 音形对应 → 02 自然拼读 | 拆解 03 词根词缀 |
 * 存入 04 语境 → 05 联想（辅助）→ 06 间隔重复 | 调用 07 主动输出 | 收官 08 元认知
 * 按 order 排序；UI 重建后由本聚合接管（前身 methods.ts 已退役）。
 */
export const courses: Course[] = [
  course01,
  course02,
  course03,
  course04,
  course05,
  course06,
  course07,
  course08,
].sort((a, b) => a.order - b.order);

export const courseById: Record<string, Course> = Object.fromEntries(
  courses.map((c) => [c.id, c]),
);

export function getCourse(id?: string): Course | undefined {
  return id ? courseById[id] : undefined;
}

export type { Course };
