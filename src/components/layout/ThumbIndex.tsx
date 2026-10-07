import { Link } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';

export type TabState = 'done' | 'active' | 'started' | 'todo';

/** 短标签与面包屑同口径：方法数据无短名字段，取「：」之前的段 */
export const shortTitle = (m: (typeof methods)[number]) => m.title.split('：')[0];

/**
 * 状态纹样（三重编码：底/描边 + 形状 + 文字色，从不只靠颜色）：
 * 已学 = 结构蓝描边 + ✓ 实心勾；
 * 当前（唯一，与列表「你在这里」同源 = 页面传入的 nextPos）= 批注红实底 + ▶ 实心三角；
 * 进行中（已开步但不是当前）= 批注红描边空贴 + ▷ 空心三角（与当前实底明确区分）；
 * 未到 = 发丝线空贴。
 */
export const STATE_CLASS: Record<TabState, string> = {
  done: 'border-cobalt text-cobalt hover:bg-bone2/70',
  active: 'border-rubric bg-rubric text-bone hover:border-[#9C2919] hover:bg-[#9C2919]',
  started: 'border-rubric text-rubric hover:bg-bone2/70',
  todo: 'border-rule text-colophon hover:bg-bone2/70',
};

/**
 * 切口行内贴条（窄屏降级件）：列表上方的横排贴条，一贴一课。
 * 全站书口脊（xl+ 右缘常驻 ForeEdge）已在阶段三上收；本件只保留 <xl 的行内形态，
 * variant prop 已退役（edge 形态由 ForeEdge 全站承担）。
 */
export default function ThumbIndex({ currentId }: { currentId?: string }) {
  const completedMethods = useProgress((s) => s.completedMethods);
  const completedSteps = useProgress((s) => s.completedSteps);

  return (
    <nav
      aria-label="方法课程"
      className="edu-scroll -mx-5 flex items-stretch gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8"
    >
      {methods.map((m) => {
        const done = completedMethods.includes(m.id);
        const started = (completedSteps[m.id] ?? []).length > 0;
        // 当前 = 页面 nextPos（唯一实底红贴，与列表「你在这里」同口径）；已开步但非当前 = 进行中空心贴
        const state: TabState = done ? 'done' : m.id === currentId ? 'active' : started ? 'started' : 'todo';
        return (
          <Link
            key={m.id}
            to={`/methods/${m.id}`}
            onClick={() => playSfx('click')}
            className={[
              'flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 rounded-[3px] border px-3 py-2 text-[13px] leading-tight transition-colors',
              STATE_CLASS[state],
            ].join(' ')}
          >
            {/* 状态形状：已学 ✓ / 当前 ▶（实心）/ 进行中 ▷（空心）/ 未到空位——位置留出，标签对齐 */}
            <span className="flex w-3.5 shrink-0 items-center justify-center" aria-hidden>
              {state === 'done' && <Check size={14} strokeWidth={2.5} />}
              {state === 'active' && <Play size={11} className="fill-current" />}
              {state === 'started' && <Play size={11} />}
            </span>
            <span className={state === 'active' ? 'font-medium' : undefined}>{shortTitle(m)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
