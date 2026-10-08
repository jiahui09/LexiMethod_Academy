import type { Method } from '@/types';
import { Clock3 } from 'lucide-react';
import { ANIMATION_LABELS } from '../demoConfig';

/**
 * 步 1：方法登场 —— 卷首目录页。
 * 不复读页首的课名/副题（上方已有）与要点（页脚本课要点已有）；
 * 开卷即给出本课全部步目（编号 + 类型 + 步题），读者一眼知道这本书怎么读。
 * （本课的编排动作只有批注章与导轨推进，登场页保持恒静。）
 */
export default function EntranceStep({ method }: { method: Method }) {
  return (
    <div className="flex flex-col gap-5 border-y-[3px] border-double border-rule px-1 py-7">
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-colophon">
        <span className="border border-rule bg-bone2/70 px-2.5 py-1 font-medium text-cobalt">本课目录</span>
        {method.durationMin && (
          <span className="flex items-center gap-1">
            <Clock3 size={12} aria-hidden /> 约 {method.durationMin} 分钟
          </span>
        )}
      </div>

      <ol className="mx-auto w-full max-w-[64ch] divide-y divide-rule border-t border-b border-rule text-left">
        {method.steps.map((s, i) => (
          <li key={i} className="flex items-baseline gap-3 px-1 py-2.5">
            <span className="font-serif text-sm font-bold tabular-nums text-rubric">{String(i + 1).padStart(2, '0')}</span>
            <span className="w-[76px] shrink-0 text-xs text-cobalt">{ANIMATION_LABELS[s.animation]}</span>
            <span className="min-w-0 text-[14.5px] leading-[1.7] text-paperink">{s.title}</span>
          </li>
        ))}
      </ol>

      <p className="mx-auto max-w-[60ch] text-center text-[13.5px] leading-[1.8] text-colophon">
        走完这 {method.steps.length} 步：读讲解、看演示、动手练，最后用自己的话把方法讲出来。
      </p>
    </div>
  );
}
