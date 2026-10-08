import type { KindComp } from './types';
import { listenKinds } from './listen';
import { phonicsKinds } from './phonics';
import { buildKinds } from './build';
import { classifyKinds } from './classify';
import { routineKinds } from './routine';

/** practice.kind → 练习体组件（30 个规范键，见 courseSchema 注释） */
export const KIND_REGISTRY: Record<string, KindComp> = {
  ...listenKinds,
  ...phonicsKinds,
  ...buildKinds,
  ...classifyKinds,
  ...routineKinds,
};
