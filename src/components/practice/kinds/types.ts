import type React from 'react';
import type { Practice } from '@/data/courseSchema';

/** 练习体统一入参（契约 §2）：kind 组件拿到整条 practice 与收口回调 */
export type KindProps = {
  practice: Practice;
  /** 练习收口时调用（A 自行幂等）；调用后 Practice 会亮出 debrief 收口行 */
  onDone: () => void;
};

export type KindComp = React.ComponentType<KindProps>;
