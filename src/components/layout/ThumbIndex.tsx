import { Link } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';

type TabState = 'done' | 'active' | 'started' | 'todo';

/** 短标签与面包屑同口径：方法数据无短名字段，取「：」之前的段 */
const shortTitle = (m: (typeof methods)[number]) => m.title.split('：')[0];

/**
 * 状态纹样（三重编码：底/描边 + 形状 + 文字色，从不只靠颜色）：
 * 已学 = 结构蓝描边 + ✓ 实心勾；
 * 当前（唯一，与列表「你在这里」同源 = 页面传入的 nextPos）= 批注红实底 + ▶ 实心三角；
 * 进行中（已开步但不是当前）= 批注红描边空贴 + ▷ 空心三角（与当前实底明确区分）；
 * 未到 = 发丝线空贴。
 */
const STATE_CLASS: Record<TabState, string> = {
  done: 'border-cobalt text-cobalt hover:bg-bone2/70',
  active: 'border-rubric bg-rubric text-bone hover:border-[#9C2919] hover:bg-[#9C2919]',
  started: 'border-rubric text-rubric hover:bg-bone2/70',
  todo: 'border-rule text-colophon hover:bg-bone2/70',
};

/**
 * 切口拇指索引（辞书版式签名件）：书口上的 8 枚索引贴，一贴一课。
 * 点贴直接翻到该方法页——拇指沿书口一捋，整本书翻到那一课。
 *
 * variant="edge"    —— xl 以上：贴着纸页右缘的竖排贴条（sticky，齐书口，左侧圆角像切口）。
 * variant="inline"  —— 窄屏降级：列表上方的行内横排贴条（可横向滚动，纸面发丝线滚动条）。
 */
export default function ThumbIndex({
  variant = 'edge',
  currentId,
}: {
  variant?: 'edge' | 'inline';
  /** 当前续学方法（唯一红实底贴）：与列表「你在这里」同源，由页面的 nextPos 传入，组件不自造口径 */
  currentId?: string;
}) {
  const completedMethods = useProgress((s) => s.completedMethods);
  const completedSteps = useProgress((s) => s.completedSteps);

  const edge = variant === 'edge';

  return (
    <nav
      aria-label="方法课程"
      className={
        edge
          ? 'sticky top-24 flex flex-col items-end gap-1.5'
          : 'edu-scroll -mx-5 flex items-stretch gap-2 overflow-x-auto px-5 md:-mx-8 md:px-8'
      }
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
              'flex min-h-[44px] min-w-[44px] items-center gap-2 py-2 text-[13px] leading-tight transition-colors',
              edge ? 'rounded-l-[3px] border-y border-l pl-3 pr-3.5' : 'shrink-0 rounded-[3px] border px-3',
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
