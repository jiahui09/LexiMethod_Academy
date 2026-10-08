import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import type { BodyProps } from './types';
import { normChoice } from './judge';
import { seededShuffle } from './shuffle';

/**
 * 选择类作答体：choice / contextChoice / minimalPair / listenChoosePhoneme /
 * wordChoosePhoneme / phonemeChooseSpelling / spellingChoosePhoneme 等。
 * 选项即叶面钮，点选即提交（当场揭晓）；揭晓三重编码 = 形状 ✓/✗ + 边框 + 屏读文字。
 */
export default function ChoiceBody({ q, given, revealed, onSubmit }: BodyProps) {
  const choices = q.choices ?? [];
  const order = useMemo(() => seededShuffle(choices, q.id), [choices, q.id]);

  if (!choices.length) return null;

  return (
    <div className="grid gap-2.5 sm:grid-cols-2" role="group" aria-label="选项">
      {order.map((c) => {
        const chosen = revealed && normChoice(given) === normChoice(c.label);
        const right = revealed && c.correct;
        const wrongPick = revealed && chosen && !c.correct;
        const ipaLike = c.label.startsWith('/');
        return (
          <button
            key={c.label}
            type="button"
            disabled={revealed}
            onClick={() => onSubmit(c.label, c.correct)}
            className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-4 py-3 text-left ${
              wrongPick
                ? 'border-2 border-errata bg-leaf'
                : right
                  ? 'border-2 border-ink bg-leaf'
                  : 'border-ink/25 bg-leaf hover:border-ink/60 hover:bg-under'
            }`}
          >
            {/* 所选标记：打孔实心（形状通道，不靠颜色） */}
            <span
              className={`punch ${chosen ? (wrongPick ? 'punch-done' : 'punch-done') : ''}`}
              style={wrongPick ? { background: '#E34234', borderColor: '#E34234' } : undefined}
              aria-hidden
            />
            <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className={`font-bold text-ink ${ipaLike ? 'machine text-[15px]' : 'font-serif'}`}>{c.label}</span>
              {c.sub && <span className="text-[13px] text-ink2">{c.sub}</span>}
            </span>
            {right && <Check size={17} strokeWidth={2.5} className="shrink-0 text-ink" aria-hidden />}
            {wrongPick && <X size={17} strokeWidth={2.5} className="shrink-0 text-errata" aria-hidden />}
            <span className="sr-only">
              {right ? '，正确答案' : ''}
              {wrongPick ? '，你的选择，答错了' : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
