import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Practice as PracticeData } from '@/data/courseSchema';
import { KIND_REGISTRY } from './kinds';

/**
 * 微练习渲染器（契约 §2，A 调用）。
 * 结构 = title（黑体）+ prompt（衬线正文 ≤68ch）+ 按 kind 分发的互动体 + debrief 收口行。
 * onDone 在互动体收口时触发（可多次，A 自行幂等）；首次收口后亮出 debrief 行。
 * 未识别 kind 降级为 title + prompt + debrief 的面板（带「做完了」按钮收口），绝不崩溃。
 */
export function Practice({ practice, onDone }: { practice: PracticeData; onDone?: () => void }) {
  const [done, setDone] = useState(false);
  const Kind = KIND_REGISTRY[practice.kind];

  const handleDone = () => {
    setDone(true);
    onDone?.();
  };

  return (
    <section className="leaf my-4 border-2 border-ink p-4 sm:p-5" aria-label={`练习，${practice.title}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="machine bg-ink px-1.5 py-0.5 text-[12px] text-milk" aria-hidden>
          练
        </span>
        <h3 className="font-display text-[17px] font-bold text-ink">{practice.title}</h3>
      </div>

      <p className="mb-4 max-w-[68ch] text-[16px] leading-[1.8] text-ink">{practice.prompt}</p>

      {Kind ? (
        <Kind practice={practice} onDone={handleDone} />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDone}
            className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-4 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2"
          >
            <Check size={15} strokeWidth={3} aria-hidden />
            做完了
          </button>
          <span className="text-[13px] text-ink2">这个练习按纸上流程完成即可</span>
        </div>
      )}

      {/* 收口行：首次收口后亮出 debrief（机器嗓音 + 方块 ✓） */}
      <div aria-live="polite">
        {done && practice.debrief && (
          <p className="hinge mt-4 flex items-start gap-2 border-t border-rule pt-3 text-[14px] font-bold text-ink">
            <span className="punch punch-done mt-1.5" aria-hidden />
            <span className="max-w-[68ch]">{practice.debrief}</span>
          </p>
        )}
      </div>
    </section>
  );
}

export default Practice;
